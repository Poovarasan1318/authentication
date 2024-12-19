const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const bcrypt = require ('bcryptjs');
const cors = require('cors')

const app = express();
const port = 4000;

app.use(bodyParser.json());
app.use(cors());

const users = [];
const secretKey = 'your-secret-key';

app.post('/register', async (req,res)=>{
    const {username,password}=req.body;   
    const hashedPassword=await bcrypt.hash(password,10);
    users.push({username,password:hashedPassword});
    console.log('user registered:',username);
    res.sendStatus(201);
});

app.post('/login',async(req,res)=>{
    const {username,password}=req.body;
    const user = users.find(u =>u.username === username);
    if(user){
        const isPasswordValid=await bcrypt.compare(password,user.password);
        if (isPasswordValid){
            const token = jwt.sign({username}, secretKey, {expiresIn:'1h'});
            res.json({token});
        } else{
            console.log('Invalid password:',username);
            res.status(401).json({message:'Invalid credential'});
        }

    }else{
        console.log('User not found:',username);
        res.status(401).json({message:'Invalid credentials'});
    }
});

app.listen(port,()=>{
    console.log(`Server running on ${port}`);
});






