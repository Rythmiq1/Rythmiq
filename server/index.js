const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const cors=require('cors');
const AuthRouter=require('./Routes/AuthRouter');

require('dotenv').config();
require('./Models/db')
const PORT=process.env.PORT || 8080;

const session=require("express-session");
const passport= require("passport")
//will return object
const OAuth2Strategy = require("passport-google-oauth2").Strategy;

const Userdb=require("./Models/User")


app.get('/ping',(req,res)=>{
  res.send('pong');
})

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

app.use('/auth',AuthRouter)

app.use(session({
  //create unique encrypted id called session id
  secret: process.env.CLIENT_SECRET,
  resave:false,
  saveUninitialized:true
}))

//initialise passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new OAuth2Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:"/auth/google/callback",
    scope: ["profile", "email"],
  },
   async(accessToken,refreshToken,Profile,done)=>{
    console.log("profile",Profile)
    try{
      let user=await Userdb.findOne({googleId:Profile.id})

      if(!user){
        user=await Userdb.create({
          
          name:Profile.displayName,
          email:Profile.emails[0].value,
          googleId:Profile.id,
          image:Profile.photos[0].value
          
      });
      await user.save();
    }
    return done(null,user)
    }
    catch(error)
    {
      return done(error,null)
    }
   }
  )
)


passport.serializeUser((user,done)=>{
  done(null,user);
})

passport.deserializeUser((user,done)=>{
  done(null,user);
});

//initialise google auth login
app.get('/auth/google',passport.authenticate('google',
  {scope: ['profile', 'email']}));

app.get("/auth/google/callback",passport.authenticate("google",
 { 
  successRedirect:"http://localhost:5173/home",
  failureRedirect:"http://localhost:5173/login"
}
))


app.get("/login/success",async(req,res)=>{
    //console.log("reqqqq",req.user)

    if(req.user)
    {
      res.status(200).json(
        {
          message:"Uer Login",
          user:req.user
        }
      )
    }
    else{
      res.status(400).json({
        message:"User Not Login"

      })
    }

})

app.listen(PORT,()=>{
  console.log(`Server is running on port ${PORT}`)
})

app.get("/",(req,res)=>{
  res.status(200).json("Server Started")
});