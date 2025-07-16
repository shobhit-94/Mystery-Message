//folder ka naam api as it is hona hai kyuki next js isi se routes eta hai
import dbConnect from "@/app/lib/dbConnect";
import UserModel from "../../../model/User";
import bcrypt from "bcryptjs" //ye npm i bcryptjs naki ki sirf bcrypt
import { success } from "zod";
import { sendVerfication } from "@/Helper_Email_verifcation/sendVerificationEmail";

// NExtjs me api/sign-up me post request
export async function POST(request: Request) {//right wala Datatype hai or left wala variable hai 
    await dbConnect()
    try {
        //frontend pe email,username,password hai joki lena hai
        const { username, email, password } = await request.json()
        const existingUSerVerifiedByUSer = await UserModel.findOne({//usernma emodel me ho and or vo verify bhi ho
            username,
            isVerified: true
        })
        //  measn user already in databse to dubara thodi verfication hoga isliye
        //success:false  likha
        if (existingUSerVerifiedByUSer) {
            return Response.json({
                success: false,//
                message: "User name is already present or already taken "
            })
        }
        const existingUserByEmail = await UserModel.findOne({
            email
        })
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        /*
        MAth.random genrate 0-1 exclusive for exapmple 0.54321
        (mul) by *900000 gives 0-899999.99999
        +100000 gives 100000-999999.99....
        Minimum: 100000 + 0 = 100000
        Maximum: 100000 + 899999.999 ≈ 999999.999
        then MAth.floor removes the decimal part and give 543210

        */
        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {//user exited hai or evrfied bhi hai to khuch ni kerna return ker do
                return Response.json({
                    success: false,//
                    message: "User already exists with this email"
                }, { status: 500 })
            }
            else {//user exited hai or verfied nhi hai to wo ab verify hona chhtha hai apne creditias ke sath
                const hashedpassword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hashedpassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 360000)
                await existingUserByEmail.save()
                //iske baad sidhe emials end hoga niche yaha likhen ki zarrurat nhi thi
                //phir yaha likhte or else me bhi likhte to do baar same chiz aa zati 
            }

        } else {//measn user pehli baar aaya hai vo verified nhi hai
            const hashedpassword = await bcrypt.hash(password, 10)//10 rounds tak hasing ho zaegi
            const expiryDate = new Date()
            //javaScipt ke lectures me dekha tha new object det ha jo internally
            //change hote hai isleuye yaha const expiryDate ki value change ho sakti hai
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newuser = new UserModel({
                username,
                email,
                password: hashedpassword,
                verifyCode: verifyCode,//Database me jo password save hai vo hai ye enterd password se match kerne ke iye hai  
                isVerified: false, //waise User model me false likha hai per koi ni 
                verifyCodeExpiry: expiryDate,//password j databse me save hai vo kab expire hoga ye data ki help se kernge hu
                isAcceptingMessage: true,//waise User model me false likha hai per koi ni  user accept kerrah hai meesagge ki nhi 
                messages: []
            })
            await newuser.save()
            //iske baad sidhe emials end hoga niche yaha likhen ki zarrurat nhi thi
            //phir yaha likhte or uper if  me bhi likhte to do baar same chiz aa zati      
        }

        //send verification email
        const emailResponse = await sendVerfication(//ye method bana rakha hai humne jo 3 parameter s leta hai
            email,
            username,
            verifyCode

        )
        if (!emailResponse.success) {//Agar khuch error aa gai email send hone me
            return Response.json({
                success: false,//
                message: emailResponse.message//
            }, { status: 500 })
        }
        return Response.json({//Agar error nhi aai email send none me to 
            success: true,//
            message: "User regstered successfully,Please verify your email"//
        }, { status: 201 })
    } catch (error) {
        console.error("Error in Registering user", error)//ye terminal pe dikhega
        return Response.json({//ye frontend ya postman pe zata hai
            success: false,
            message: "Error in regisering user"
        },
            {
                status: 500
            }
        )
    }
}