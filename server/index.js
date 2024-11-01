const express=require('express');

const bodyParser=require('body-parser');
const cors=require('cors');
const AuthRouter=require('./Routes/AuthRouter');
const songRoutes = require("./Routes/songRoute.js");

require('dotenv').config();
require('./Models/db')
const PORT=process.env.PORT || 8080;

const session=require("express-session");
const passport= require("passport")
//will return object
const OAuth2Strategy = require("passport-google-oauth2").Strategy;

const Userdb=require("./Models/User")

const jwt = require('jsonwebtoken');
const app = express();
app.get('/ping',(req,res)=>{
  res.send('pong');
})




// // Connect to Cloudinary
// connectCloudinary().then(() => {
//     console.log("Connected to Cloudinary");

//     // Start the server after Cloudinary is connected
//     app.listen(PORT, () => {
//         console.log(`Server is running on port ${PORT}`);
//     });
// }).catch(error => {
//     console.error("Error connecting to Cloudinary:", error);
// });

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

app.use('/auth',AuthRouter)

app.use(session({
    secret: process.env.CLIENT_SECRET,
    resave: false,
    saveUninitialized: true
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Passport strategy
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

passport.deserializeUser((user, done) => {
    done(null, user);
});

//initialise google auth login
app.get('/auth/google',passport.authenticate('google',
  {scope: ['profile', 'email']}));

<<<<<<< Updated upstream
  app.get("/auth/google/callback", 
=======
app.get("/auth/google/callback", 
>>>>>>> Stashed changes
    passport.authenticate("google", { failureRedirect: "http://localhost:5173/login" }),
    async (req, res) => {
        if (req.user) {
            const token = jwt.sign({
                userId: req.user._id,
                name: req.user.name
            }, process.env.JWT_SECRET, { expiresIn: '1h' });

            // Redirecting to the home page with the token and name
            return res.redirect(`http://localhost:5173/home?token=${token}&name=${encodeURIComponent(req.user.name)}`);
        } else {
            res.redirect("http://localhost:5173/login");
        }
    }
);

<<<<<<< Updated upstream

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
=======
app.get("/login/success", async (req, res) => {
    if (req.user) {
        res.status(200).json({
            message: "User Login",
            user: req.user
        });
    } else {
        res.status(400).json({
            message: "User Not Login"
        });
>>>>>>> Stashed changes
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
