import express from "express";
import cors from "cors";
import router from "./routes/routes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

// creating express application
const app=express();

// middleware usage
app.use(cors());
app.use(express.json());
app.use(router);
app.use(errorMiddleware);
app.get("/",(req,res)=>{
  res.status(200).json({
    "success":"true",
    "message":"Job Portal API is running"
  })
})

export default app;