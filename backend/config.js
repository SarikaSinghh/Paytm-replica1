const jwt = require('jsonwebtoken');

// const Something = 'Some ID';
// var token = jwt.sign({ data: { id: Something } }, 'secret', { expiresIn: 60 * 60 }, { algorithm: 'RS256' }, function (err, token) {
//     console.log(token);
// });

// jwt.verify(token, 'secret', function(err, decoded) {
// var decoded = jwt.verify(token, 'shhhhh')

// console.log(token);




module.exports = {
    JWT_SECRET: "your-jwt-secret"
}