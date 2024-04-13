const User =require("../models/userModel")
const Product = require('../models/productModel')
const jwt =require('jsonwebtoken')
const asyncHandler = require("express-async-handler")

const authMiddleware =asyncHandler(async(req, res, next)=>{
let token;
if(req?.headers?.authorization?.startsWith("Bearer")){
token=req.headers.authorization.split(" ")[1];
try {
    if(token){
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        const user =await User.findById(decode?.id)
        req.user= user;
        next();
    }
    
} catch (error) {
    throw new Error("Not Authorization token expired, Please Login again")
}
}else{
    throw new Error("There is no token attached to header")
}
})

const isAdmin =asyncHandler(async(req, res, next)=>{
   const { email } = req.user
   const adminUser =await User.findOne({ email });
   if(adminUser.role !=="admin"){
    throw new Error("Your not an Admin")
   }else{
    next();
   }
})
const productMiddleware =asyncHandler(async(req, res, next)=>{
    let token;
    if(req?.headers?.authorization?.startsWith("Bearer")){
    token=req.headers.authorization.split(" ")[1];
    try {
        if(token){
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            const product =await Product.findById(decode?.id)
            req.product= product;
            next();
        }
        
    } catch (error) {
        throw new Error("Not Authorization token expired, Please Login again")
    }
    }else{
        throw new Error("There is no token attached to header")
    }
    })
module.exports={authMiddleware,isAdmin,productMiddleware}