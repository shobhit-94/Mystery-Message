import { resend } from "@/app/lib/resend";
import VerificationEmail from "../../emailVerification_template/verificationEmail";
import { ApiResponse } from "../Types/ApiResponse"//taki humara apiresponse 
import { success } from "zod";
//kaise hoga ye type yaha se pata chal jaega isse bhi dekho

export async function sendVerfication(
    email: string,
    username: string,
    verifyCode: string// ye OTP hi hai
): Promise<ApiResponse> {//hum ke re hia ki ye function ek Promise return kerga joki ApiResponse type ka hoga yani usem ApiResponse wali chize to hongi
    //phir hum try-catch ko bhi handle ekr re hai erro ko 
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'user@gmail.com',
            subject: 'Mystery message | Verification Code',
            react: VerificationEmail({username:username,otp:verifyCode}),
            //ye humne jo VerificationEmail ka templeate bana tha vahi hai  
            //jo usename or otp leta hai yaha pe maine otp ko verifycod elikha hai
        });
        return { success: true, message: "Verfication email send successfully" }
    } catch (error) {
        console.log("Error in sending Verification Email", error)
        return { success: false, message: "failed in sending verfication emial" }
    }
}