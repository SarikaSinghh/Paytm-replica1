const express = require('express');

const rootRouter = express.Router();
const { userRouter } = require("./user");
const { accountRouter } = require("./account");

// Anything that comes to /api/v1
rootRouter.route('/', (req, res, next) => {

    console.log("Inside api/v1/ route");
    next();

})


// Anything that comes to /api/v1/user
rootRouter.use("/user", userRouter)


// Anything that comes to /api/v1/account
rootRouter.use("/account", accountRouter);


module.exports = {
    rootRouter
}