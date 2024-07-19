import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import Index from './routes/index.js';

dotenv.config(); // Load environment variables

const app = express();
app.use(cors()); // Enable CORS
app.use(bodyParser.json());

// Serve static files from the "public" directory


const username = process.env.USERNAME1; // Ensure the environment variable names are correct
const password = encodeURIComponent(process.env.PASSWORD);

// console.log(username,password) 

const url = `mongodb+srv://${username}:${password}@mydata.bkwkloc.mongodb.net/?retryWrites=true&w=majority&appName=MyData`;

app.use('/api/users', Index);
// Connect to MongoDB Atlas
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch(err => {
    console.error('Error connecting to MongoDB Atlas', err);
});


app.listen(5000, () => {
    console.log('Server is running on port 5000');
});