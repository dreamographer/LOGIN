const express = require('express');
const router = express.Router();
const User = require('../models/user.models'); 
//User sign IN
router.post('/login', async (req, res) => {
    const { username, password } = req.body;//data given by the user
    try {
        let users= await User.find() //data awailable in the DB
        const user = users.find(user => user.username === username && user.password === password);
        if (user) {
            req.session.user = user; //setting value to the session
            console.log(username + ' logged in');
            return res.redirect('/');
        } else {
            req.session.err = true;//for sending error message
            return res.redirect('/login');
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send('Error fetching user data');
    }

});


//user signUP
router.post('/signup',async (req, res) => {
    const data=req.body;//data given by the user
    try { 
       await User.create(data) //inserting the data
       console.log('user created');
       req.session.user = data; //setting value to the session
        console.log(data.username + ' logged in');
        return res.redirect('/');
    } catch (err) {
        console.log(err); 
        return res.status(500).send('Error creating USER');
    }

});
module.exports = router;
