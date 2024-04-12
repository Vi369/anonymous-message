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
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {})
        console.log('mongoose connection data', db)

        connection.isConnected = db.connections[0].readyState

        console.log("Db connected successfully")

        // TODO: or bhi connection hote hai mongoose me use study karna hai 
    } catch (error) {
        console.log("Database connection failed", error)
        process.exit(1)
    }
}

export default connentDb;