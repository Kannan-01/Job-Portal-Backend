const errorMiddleware = (err, req, res, next) => {
  console.log(err);
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID",
    });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: err.message,
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: "Duplicate value already exists",
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

export default errorMiddleware;
