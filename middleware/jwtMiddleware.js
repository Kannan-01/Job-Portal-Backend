import jwt from "jsonwebtoken";

const jwtMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }
    const token = authHeader.split(" ")[1];
    const jwtResponse = jwt.verify(token, process.env.JWT_SECRET);
    if (!jwtResponse.userId || !jwtResponse.role) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
    }
    
    req.userId = jwtResponse.userId;
    req.role = jwtResponse.role;

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please login again.",
    });
  }
};

export default jwtMiddleware;
