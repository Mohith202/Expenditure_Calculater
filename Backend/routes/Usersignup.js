import express from "express";
import Login from "../Schema/login.js";
import bcrypt from 'bcrypt';

export const Usersignup = async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await Login.findOne({ username });
        if (existingUser) {
            return res.status(400).send('User already exists');
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new Login({ username, password: hashedPassword });
        await user.save();
        res.send('User signed up successfully');
    } catch (error) {
        res.status(500).send(error);
    }
};