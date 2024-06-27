import mongoose from 'mongoose'

let isConnected = false

export const connectToDB = async()=>{
    if(isConnected){
        console.log("Connected")
        return
    }
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'share_prompt',
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("DB is now connected")
    } catch (error) {
        console.log(error)
    }
}