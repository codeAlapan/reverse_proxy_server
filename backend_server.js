const express = require('express');
const app = express();

app.get("/",(req,res)=>{
    res.send('Hello from Backend Server!');
})

app.listen(5000, ()=>{
    console.log("backend server is running on http://localhost:5000");
})