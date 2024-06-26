import mongoose from 'mongoose'

type connectionObject = {
    isConnected?: number
}

const connection: connectionObject = {}

async function connentDb():Promise<void> {
    if(connection.isConnected){
        console.log("Database Already connected")
        return
    }

    try {
        const db = await mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_URI || '', {})
        connection.isConnected = db.connections[0].readyState
        
        console.log("Db connected successfully")

    } catch (error) {
        console.log("Database connection failed", error)
        process.exit(1)
    }
}

export default connentDb;