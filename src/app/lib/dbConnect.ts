import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({
    path:"./.env"
})

type ConnectionObject = {
    isConnected?: number//ye value ho bhi sakti hai optional hai lekinnagar aaigi to
    //number format me hi hogi
}

const connection: ConnectionObject = {}

// 'TypeScript' definition of void kis tarah ka data aa raha hai muzhe farak nhi padta
//kisi bhi tarah ka aa sakta hai 
async function dbConnect(): Promise<void>{
    if (!connection.isConnected) {
        console.log("Already connected to database");
        return;;
        /*
        If you're already connected, don’t connect again.
        Saves memory and avoids duplicate connections.
        */
    }
    try {
        const db=await mongoose.connect(process.env.MONGODB_URI||
            '',{})
            console.log("DB = ",db)
            console.log("DB Connected = ",db.connections)

          connection.isConnected=db.connections[0].readyState
          console.log("DB Connected successfully")
        
    } catch (error) {
        console.log("DB Connection Failed",error)
        process.exit(1)
    }
}

export default dbConnect;
