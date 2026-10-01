import dotenv from "dotenv";
import app from "./app.js";
import dbConnect from "./config/connection.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await dbConnect();

    app.listen(PORT, () => {
      console.log(`server runnig on port ${PORT}`);
    });
  } catch (err) {
    console.error(`server failed to start:`, err.message);
  }
};

startServer();