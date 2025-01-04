const express = require('express');
const { authMiddleWare } = require('../middlewares/auth');
const { Account, User } = require('../db');
const accountRouter = express.Router();


accountRouter.get('/balance', authMiddleWare, async (req, res) => {

    const User_id = req.User_id
    const User_account = await Account.findOne({ userId: User_id });

    const balance = User_account.balance;

    res.status(200).json({
        balance: balance
    });

})


accountRouter.post('/transfer', authMiddleWare, async (req, res) => {

    console.log("Inside Transfer", req.User_id)
    const sender_id = req.User_id;
    const recipient = req.body.to;
    const amount = req.body.amount;

    if (!recipient || !amount) {
        res.status(400).json({
            message: "Send correct inputs!"
        })
    }

    // Transfer logic
    const recipient_id = await User.findOne({ username: recipient });
    if (!recipient_id) {
        res.status(400).json({
            message: "Recipient not found!"
        })
    }

    const recipient_account = await Account.findOne({ userId: recipient_id });

    const sender_account = await Account.findOne({ userId: sender_id });


    if (sender_account.balance < amount) {
        res.status(400).json({
            message: "Insufficient balance!"
        })
    }

    console.log("Sender Balance before :" + sender_account.balance);
    const senderUpdate = await Account.findOneAndUpdate({ userId: recipient_id }, { $inc: { balance: -amount } });

    console.log("Recipient Balance before :" + recipient_account.balance);

    const recipientUpdate = await Account.findOneAndUpdate({ userId: recipient_id }, { $inc: { balance: +amount } });

    console.log("The amount has been sent by " + sender_id + " to " + recipient + " !!");
    console.log(recipientUpdate.balance);

    res.status(200).json({
        message: "The amount has been transfered successfully!"
    })


})




module.exports = { accountRouter };