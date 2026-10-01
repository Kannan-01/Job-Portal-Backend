import mongoose from "mongoose";

const dbConnect=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected succesfully`);
    }
    catch(err){
        console.log(`MongoDB connection failed , ${err.message}`);
    }

};

export default dbConnect;