export const employeeOnly=(req,res,next)=>{
    if(req.role !== "employee"){
        return res.status(403).json({
            success:false,
            message:"employee access only"
        })
    }
    next();
}

export const employerOnly=(req,res,next)=>{
if(req.role !== "employer"){
    return res.status(403).json({
        success:false,
        message:"employer access only"
    })
}
next();
}