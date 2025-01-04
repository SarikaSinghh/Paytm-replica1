const express = require('express');
const { default: mongoose } = require('mongoose');
const zod = require('zod');
const jwt = require('jsonwebtoken');
const userRouter = express.Router();

const { User, Account } = require('../db.js');
const { JWT_SECRET } = require('../config');
const { authMiddleWare } = require('../middlewares/auth');


const signUpBody = zod.object({
    username: zod.string({ message: "Must be between 5 or 40 characters" }).min(5).max(40),
    password: zod.string({ message: "Must be atleast 6 characters long" }).min(6),
    firstName: zod.string({ message: "Must be less than 50 characters" }).max(50),
    lastName: zod.string({ message: "Must be less than 50 characters" }).max(50)
});

userRouter.post('/signup', async (req, res) => {
    try {

        // Get the user details from front-end
        const { username, password, firstName, lastName } = req.body;

        // Validate inputs

        const parsedResponse = signUpBody.safeParse({ username, password, firstName, lastName });
        if (!parsedResponse.success) {
            console.log('Error has occured!!');
            res.status(411).json({
                success: false,
                message: "Incorrect user details"
            })

        } else {
            console.log('Data validation successful');

            // Check the database if username already exists

            // If username exists, return an error
            // else create a new entry and push it into the db

            const userExists = await User.findOne({ username: username });
            if (userExists) {
                res.status(411).json({
                    success: false,
                    message: "Username already exists"
                })
                console.log("Username already exists");
            } else {
                const newUser = new User({
                    username: username,
                    password: password,
                    firstName: firstName,
                    lastName: lastName
                })
                newUser.save();

                console.log("User created successfully");

                // Used for jwt and account creation
                const User_id = newUser._id;

                const randomBalance = 1 + Math.random() * 1000;

                // Initialize the user with a random amount to start with
                await Account.create({
                    userId: User_id,
                    balance: randomBalance
                })

                console.log("Balance added to username: " + username + "is " + randomBalance.toString() + " !!");

                // Create a jwt which has their generated Id
                // Send the jwt to the front-end

                const generatedToken = jwt.sign({ User_id }, JWT_SECRET, { expiresIn: 60 * 60 }, { algorithm: 'RS256' }, function (err, token) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("The token has been created successfully!");
                    }

                });


                res.status(200).json({
                    success: true,
                    message: "User created successfully",
                    token: generatedToken
                })
            }


        }



    } catch (err) {
        console.log("ERROR CAUGHT!");
        console.log(err);

    }





})


const signInBody = zod.object({
    username: zod.string({ message: "Must be between 5 or 40 characters" }).min(5).max(40),
    password: zod.string({ message: "Must be atleast 6 characters long" }).min(6)
});


userRouter.post('/signin', async (req, res) => {

    const { username, password } = req.body;



    const parsedResponse = signInBody.safeParse({ username, password });

    if (!parsedResponse.success) {
        console.log('Data validation failed');
        console.log(parsedResponse.error);

        res.status(400).json({
            success: false,
            message: "Data validation failed"
        })
    }

    const foundUser = await User.findOne({ username: username, password: password });
    if (foundUser) {

        console.log(foundUser);
        const User_id = foundUser._id;
        console.log(User_id);
        var generatedToken = jwt.sign({ User_id }, JWT_SECRET, { expiresIn: 60 * 60 }, { algorithm: 'RS256' }, function (err, token) {
            if (err) {
                console.log(err);
            }
        });

        console.log("The token has been created successfully!");
        res.status(200).json({
            success: true,
            message: "User signed in successfully",
            token: generatedToken
        });

    } else {

        res.status(400).json({
            success: false,
            message: "User not found / Error while logging in."
        })
    }





})


updateSchema = zod.object({
    firstName: zod.string({ message: "Must be less than 50 characters" }).max(50).optional(),
    lastName: zod.string({ message: "Must be less than 50 characters" }).max(50).optional(),
    password: zod.string({ message: "Must be atleast 6 characters long" }).min(6).optional()
})

userRouter.put('/', authMiddleWare, async (req, res) => {

    const parsedResponse = updateSchema.safeParse(req.body);
    if (!parsedResponse.success) {

        res.status(411).json({
            success: false,
            msg: "Error while updating information"
        })

    } else {

        console.log("Data validation successful");

        const user_id = req.User_id;

        const updatedUser = await User.findOneAndUpdate({ _id: user_id }, req.body, { new: true });

        console.log(updatedUser);

        if (!updatedUser) {
            console.log("Error while updating user information");
            res.status(411).json({
                success: false,
                msg: "Error while updating information"
            })
        } else {

            updatedUser.save();
            console.log("User information updated successfully");
            res.status(200).json({
                success: true,
                msg: "User information updated successfully"
            })
        }




    }










})



userRouter.get('/bulk', async (req, res) => {

    const filter = req.query.filter || "";


    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.status(200).json({
        user: users.map(user => {
            return {
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                _id: user._id
            }
        })
    })


})




module.exports = { userRouter };