const express = require('express');
const router = express.Router();
const Admin = require('../models/admin.models'); 

//Admin sign IN
router.post('/login', async (req, res) => {
    const {email, password } = req.body;//data given by the user
    try {
        let admins= await Admin.find() 
        const admin = admins.find(admin => admin.email === email && admin.password === password);
        if (admin) {
            req.session.admin = admin; //setting value to the session
            console.log(admin.username + ' logged in');
            return res.redirect('/admin');
        } else {
            req.session.aderr = true;//for sending error message
            return res.redirect('/adminLogin');
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send('Error fetching user data');
    }

});
module.exports = router;
