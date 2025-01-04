const mongoose = require('mongoose');

// Connect to the Database
mongoose.connect("mongodb://localhost:27017/PayTm-Clone", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    const startTime = new Date().getTime();
    const endTime = new Date().getTime();
    console.log("Connected to MongoDB locally");
    console.log("It took " + (endTime - startTime) + " ms to connect to the Database.");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
