const JWT = require("jsonwebtoken")
const { comparePass } = require("../helper/authHelper")
const User = require("../models/User")

const loginController = async (req,res) =>{
    try {
        const {email,password} = req.body
        //check email
        if (!email || !password) {
            return res.status(404).json({message:'Invalid Email or Password'}) 
        }
        //check user
        const user = await User.findOne({email})
        if (!user) {
            return res.status(404).json({message:'User Not Found'}) 
        }
        const match = comparePass(password,user.password)
        if(!match){
            return res.status(200).send({success:false,message:"invalid password"})
        }
        //generate token
        const token = await JWT.sign({_id:user.id},process.env.JWT_SECRET,{expiresIn:"7d"})
        res.status(200).send({
            success:true,
            user:{
                first_name:user.first_name,
                last_name:user.last_name,
                username:user.username,
                email:user.email,
                address:user.address,
                phone:user.phone
            },
            token
        })
    } catch (error) {
        res.status(500).send({message:error})
    }
}

module.exports = loginController