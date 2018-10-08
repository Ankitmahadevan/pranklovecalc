var express               = require("express"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    User                  = require("./models/user"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    nodeMailer            =require("nodemailer")
    
mongoose.connect("mongodb://ankit:pranklovecalc1@ds125673.mlab.com:25673/pranklovecalc");
var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    next();
})
app.use(require("express-session")({
    secret: "Rusty is the best and cutest dog in the world",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//============
// ROUTES
//============

app.get("/", function(req, res){
    res.render("home",{currentUser:req.user});
});

app.get("/secret",isLoggedIn, function(req, res){
    console.log(req.user);
   res.render("secret",{currentUser:req.user}); 
});

// Auth Routes

//show sign up form
app.get("/register", function(req, res){
    console.log(req.user);
   res.render("register"); 
});
//handling user sign up
app.post("/register", function(req, res){
    app.set("data",req.body.username);
    
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/secret");
        });
    });
});

// LOGIN ROUTES
//render login form
app.get("/login", function(req, res){
   res.render("login"); 
});
//login logic
//middleware
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}) ,function(req, res){
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});
app.get("/:username",function(req, res) {
    User.findByUsername(req.params.username,function(err,userid){
      if(err)
         console.log("error!!!!");
         else
         {
            
            res.render("idpage");
         }
    });  
});
app.post('/fool', function (req, res) {
    User.findByUsername(req.params.username,function(err,userid){
      if(err)
         console.log("error!!!!");
         else
         {
          let transporter = nodeMailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
              user: 'marryshellnew@gmail.com',
              pass: 'ankit9876'
          }
      });
      let mailOptions = {
          from: '"marry shell" <marryshellnew@gmail.com>', // sender address
          to: req.user.username, // list of receivers
          subject: req.body.name, // Subject line
          text: req.body.crush, // plain text body
         // html: '<b>NodeJS Email Tutorial</b>' // html body
      };

      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
          console.log('Message %s sent: %s', info.messageId, info.response);
              res.render('lol');
          });
         }
    });
      
      }); 
    



function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server started.......");
})