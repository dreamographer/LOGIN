require('dotenv').config();
const express = require('express');
const connectDB=require('./dbConnect')  
const crypto = require('crypto'); 
const session = require('express-session');
const path=require('path');
const nocache = require('nocache');
const app = express();
const port = 3000;
//routes  
const userRoutes=require('./controllers/user.controller')
const adminRoutes=require('./controllers/admin.controller')
const skey=process.env.session; 
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
//setting the static pages path
app.use(express.static(path.join(__dirname,'/public')));
// Initialize session
app.use(session({ 
    secret:skey, // Generate a random secret 
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 60 * 60 * 1000 // Set the cookie to expire in 1 hour
    }
}));

//database connection
connectDB().then(()=>{
    console.log("DatBAse connected");
}).catch((err)=>{
    console.log(`Error in connection :${err}`);
})




function adminauth(req,res,next){
    if (req.session.admin) {
        next(); // User is authenticated, continue to the next middleware or route
    } else {
        res.render('adminlog', { errorMessage: '' });
    }
}

function authenticate(req, res, next) {
    if (req.session.user) {
        next(); // User is authenticated, continue to the next middleware or route
    } else {
        res.render('login', { errorMessage: '' });
    }
}

//Disable caching
app.use(nocache()); 
//user
app.use('/',userRoutes)  

//admin
app.use('/admin',adminRoutes)


//redirecting with error message if any
app.get('/login',(req,res)=>{
    if (req.session.user||req.session.admin) {
        res.redirect('/'); 
    } else if (req.session.err) {
        req.session.err=false;
        // Pass an error message to the login view
        res.render('login', { errorMessage: 'Incorrect username or password' });
        
    }else{
        res.render('login', { errorMessage: '' });
    }
}) 


//admin SIDE

app.get('/adminLogin',(req,res)=>{
    if (req.session.admin) {
        res.redirect('/admin'); 
    } else if (req.session.aderr) {
        req.session.aderr=false;
        // Pass an error message to the login view
        res.render('adminlog', { errorMessage: 'Incorrect username or password' });
        
    }else{
        res.render('adminlog', { errorMessage: '' });
    }
});

app.get('/admin',adminauth,(req,res)=>{
    res.render('admin')
})

//path to the home
app.get('/',authenticate,(req, res) => {
    res.render('home');
});


//destroying the session for logout
app.get('/logout', (req, res) => {
    if (req.session.user) {
        console.log(`${req.session.user.username} logged out`);
    }
    else if (req.session.admin) {
        console.log(`${req.session.admin.username} logged out`);
    }{

    }
    req.session.destroy(); // Destroy session on logout
    res.redirect('/');
});

// 404 error page
app.get('*', (req, res) => {
    res.status(404).send('404');
});
app.listen(port, () => {
    
    console.log(`Server started on http://localhost:${port}`);
});

