import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    // check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "please provide all required fields",
      });
    }

    // check user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // creating hashed password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create a new MongoDB document and save it.
    await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      success: true,
      message: "user registered succesfully ",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "server error",
      error: err.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check fields
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "email and password required",
      });
    }

    // find user
    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({
        success: false,
        message: "no user found",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(401).json({
        success: false,
        message: "password does not match",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
    );

    //  json web token
    res.status(200).json({
      success: true,
      message: "login succesful",
      token,
      user:{
        id:user._id,
        name:user.name,
        role:user.role
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "server error",
      error: err.message,
    });
  }
};
