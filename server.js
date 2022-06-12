const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3000
const User=require('./models/userModel')
const app = express()
const path = require('path')
const bcrypt=require('bcrypt')
//const { nextTick } = require('process')
app.use(express.static(path.join(__dirname, "public")))
app.use(bodyParser.urlencoded({extended:true}))

mongoose.connect("mongodb://localhost:27017/Users",{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then((   )=>{
    
    console.log("Connected to DB");
    app.get('/',(req,res,next)=>{
        res.sendFile(__dirname+'/public/login.html')
    })
    app.post('/',async(req,res)=>{
        const user= req.body.name
        const mobile=req.body.mobile
        const email=req.body.email
        const password=req.body.password
        if(!(email && password)){
            return res.status(400).send({error:'File not properly formatted'})
        }
        const users=new User({user,mobile,email,password})
        const salt=await bcrypt.genSalt(10);
        users.password=await bcrypt.hash(users.password,salt)
        users.save()
        .then(()=>{
            console.log("saved")
            res.sendFile(__dirname+"/public/dashboard.html")

        })
        .catch((err)=>{
            console.log(err);
        })
       
    })
    app.get('/signin',(req,res)=>{
        res.sendFile(__dirname+"/public/loggedin.html")
    })
    app.post("/signin",async(req,res)=>{
        const email=req.body.email
        const password=req.body.password
        const login=await User.findOne({emails:req.body.email && req,passwords:req.body.passwords})
        if(login){
            const validPass=await bcrypt.compare(req.body.password ,login.passwords).then((status)=>{

                if(validPass){
                    res.status(200)
                    res.sendFile(__dirname+"./public/loggedin.html")}
                    else{
                        res.status(200)
                        res.send("invalid password")
                    }
                })
        }
        else{
            res.status(200)
            res.send("User doesn't exist")
        }
    })
})
.catch((err)=>console.log(err))

app.listen(PORT, () => {
    console.log(`Server started on ` + PORT);
})

