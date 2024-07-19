import express from "express";

const router = express.Router();

import {Userlogin} from './Userlogin.js';
import {Usersignup} from './Usersignup.js';
import {createSpending, getAllSpending, updateSpending, deleteSpending, spendingbyDay} from './Spending.js';

router.post('/login/', Userlogin);
router.post('/Signup', Usersignup);
router.post('/spending/create/:id', createSpending);
router.get('/Spending/get/:id', getAllSpending);
router.get('/Spending/get/bydate/:id', spendingbyDay);
router.put('/Spending/update/:id', updateSpending);
router.delete('/Spending/delete/:id', deleteSpending);



export default router;