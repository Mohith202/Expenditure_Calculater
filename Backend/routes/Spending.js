import Spending from "../Schema/spendingSchema.js "
import mongoose from 'mongoose';

// const ObjectId=mongoose.ObjectId;

export const createSpending = async (req, res) => {
    const user=req.params.id
    const { categories, amount, date, description } = req.body;
    const newSpending = new Spending({categories, amount, date, description,user });
    console.log(newSpending)
    try {
        const spend=await newSpending.save();
        res.status(200).json({spend,message:"Spending created successfully"});
    } catch (error) {
        res.status(500).send(error);
    }
};

export const getAllSpending = async (req, res) => {
    const user=req.params.id
    try{
        const spending = await Spending.find({user});
        res.status(200).json({spend:spending,message:"Spending created successfully"});
    }catch(error){
        res.status(500).send(error);
    }
};

export const updateSpending = async (req, res) => {
    const user=req.params.id
    const { userid, categories, amount, date, description } = req.body;
    // let userid=ObjectId(`${id}`)
    console.log(String(userid))
    try{
        const spending = await Spending.findByIdAndUpdate({_id:user},{ categories, amount, date, description});
        res.status(200).json({spend: spending, message: "ok"});
    } catch(error){
        res.status(500).json({error, message: "error"});
    }
};
export const deleteSpending = async (req, res) => {
    // const user=req.user.id
    const  userid  = req.params.id;
    // console.log(req.params.id)
    // console.log(userid)
    try{
        const deletedid= await Spending.deleteOne({ _id:userid });
        if (deletedid.deletedCount > 0) {
            res.status(200).json({spent:deletedid,message:"Spending deleted successfully"});
        } else {
            res.status(404).json({message: "Spending not found"});
        }
    }catch(error){
        res.status(500).send(error);
    }
};


export const spendingbyDay=async(req,res)=>{
    const user=req.params.id
    const {fromdate, todate}=req.body
    try{
        // Ensure dates are parsed correctly
        const spending=await Spending.find({
            date: {
                $gte: new Date(fromdate + "T00:00:00Z"), // Start of the day in UTC
                $lt: new Date(todate + "T00:00:00Z") // Start of the next day in UTC
            },
            user
        });
        console.log(spending)
        res.status(200).json({spending, message:"Spending fetched successfully"});
    }catch(error){
        console.log(error)
        res.status(500).send(error);
    }
}