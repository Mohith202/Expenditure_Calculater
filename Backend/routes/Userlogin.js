import express from "express";
import Login from "../Schema/login.js";
import bcrypt from 'bcrypt';


import Spending from "../Schema/spendingSchema.js "

export const Userlogin = async (req, res) => {
    const { username, password } = req.body;
    try{
    const existingUser = await Login.findOne({ username });
    if (!existingUser) {
        return res.status(400).send('User does not exist');
    }
    
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
        return res.status(400).send('Invalid password');
    }
    let user=username
        const spending = await Spending.find({user});
        // res.status(200).json({spending,message:"Spending created successfully"});
        res.status(200).json({spend:spending,message:"User login successfull"});
    

    // const spending=await getAllSpending(req,res)
}catch(error){
    res.status(500).send(error.message);
}
};