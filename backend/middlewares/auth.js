
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');


const authMiddleWare = (req, res, next) => {

    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({
            success: false,
            message: "User not Authenticated!"
        });
    }

    const headerToken = authHeader.split(" ")[1];

    jwt.verify(headerToken, JWT_SECRET, function (err, decoded) {
        if (err) {
            console.log("Token is not verified by middleware");
            res.status(400).json({
                success: false,
                message: "Token is not verified"

            });

        } else {

            // if token is verified then we will pass the user_id to the next middleware
            console.log("Token is verified by middleware");
            req.User_id = decoded.User_id;

            next();

        }
    }
    )
}





module.exports = {
    authMiddleWare
}