import {z} from 'zod'


//hum signuppage ka schea me usernamevalidation ka alag se bana liya
//taki kahi or bhi use kerna ho to ker sakte hai 
export const usernamevalidation=
z.string().min(2,'username must be atleast 2 characters');
z.string().max(20,'uername must be atmost 2 characters');
z.string().regex(/^[a-zA-Z9-9_]+$/,'please write only alphabets ,not alphabets in username');
//ato z or A-Z or 0-9 or _ insab se milker hi bana hona chahye username


export const signUpSchema=z.object({
    username:usernamevalidation,//usernamevalidation ko reuse ker liya yaha per
    email:z.string().email({message:'Invalid email address'}),
    password:z.string().min(6,'Password must be atleast 6 characters')
})