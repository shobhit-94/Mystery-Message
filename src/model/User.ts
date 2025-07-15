import mongoose, { Schema, Document } from "mongoose";



/*
You're importing 
mongoose and some specific types: Schema and Document.
Schema is used to define the structure of your MongoDB documents.
Document is a TypeScript type that represents a MongoDB document.
*/

/*
You're creating a TypeScript interface and schema for a MongoDB document using Mongoose in a Next.js project.

*/

export interface Message extends Document {
    content: string;//TypeScript me string ka 's' small me hota hai
    createdAt: Date
}//ye ek custome schema ya custom datatype hai




//ab hum mongooseSchema or Model bana re hai
//humne MessageSchema banaya hai joki 'Message' Schema ko jo use ker rah hai  
const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,//Next js  me string ka 'S' Capital me hota hai
        required: true
    },
    createdAt: {
        type: Date,
        // type: Numberagar humne galti se Number likkha diya createAt ka type tab ye kahega ki aapne jo uper craeteAt bataya tha uska type to Date hai to iski sahi kero
        required: true,
        default: Date.now
    }

})


export interface User extends Document {
    username: string;//TypeScript me string ka 'S' CApital me hota hai
    email: String;
    password: String;
    verifyCode: String;//Database me jo password save hai vo hai ye enterd password se match kerne ke iye hai  
    isVerified: Boolean,
    verifyCodeExpiry: Date;//password j databse me save hai vo kab expire hoga ye data ki help se kernge hu
    isAcceptingMessage: boolean;//user accept kerrah hai meesagge ki nhi 
    messages: Message[]
    createdAt: Date
}//ye ek custome schema ya custom datatype hai



const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        match: [/^[\w.-]+@[\w.-]+\.\w{2,}$/, 'Please use a valid email address'],
        // $ shows The email pattern must end here
        /*  forward slash in front-back is use in javascript and other languages to write reqular expression  */
        password: [true, "password is required"],

    },
    verifyCode: {
        type: String,
        required: [true, "Verfiy code is required"]
    },
    isVerified: {
        type: Boolean,
        default: false

    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "verifyCodeExpiry is required"]
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true
    },
    messages: {
        type: [MessageSchema]
    }

})

//exporting
const UserModel = (mongoose.models.User as mongoose.Model<User>)//agar usermodel bana hua hai
    || mongoose.model<User>("User", UserSchema)//backend series jasie agar User model nhi bana hua hai
                                               // <USer> ye TypeScript hai j bata rah ahai ki Model User Type ka hai
export default UserModel