import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4


// Define To-Do Schema and Model
const spendingSchema = new mongoose.Schema({
    userid: {
        type: String,
        default: uuidv4 // Assign a UUID by default
    },
    categories: String,
    amount: String,
    date: String,
    description: String,
    user:String
});

const Spending = mongoose.model('Spendings', spendingSchema);

export default Spending;