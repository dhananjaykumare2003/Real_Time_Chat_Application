import mongoose from "mongoose";

const dbConnect = async() => {
    try {
        mongoose.connection.on('connection', ()=> console.log("Database Connected"));

        await mongoose.connect(process.env.MONGO_URL);
        console.log("DB is connected successfully");
    } catch (error) {
        console.log("error occured", error);
    }
    
}

export default dbConnect;