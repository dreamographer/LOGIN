const express = require('express');
const router = express.Router();
const User = require('../models/user.models');
const crypto = require('crypto');
router.use(express.json());


const algorithm = 'aes-256-cbc';
const key = process.env.KEY; 
const iv =process.env.IV; 
//encription function
function encrypt(text, key) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

//decrypting function
function decrypt(encryptedText, key) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

//User sign IN
router.post('/login', async (req, res) => {
    const { username, password } = req.body;//data given by the user
    try {
      const user = await User.findOne({ username }); //data awailable in the DB
      
        
        if (user && decrypt(user.password, key) === password) {
          req.session.user = user;
          console.log(username + ' logged in');
          return res.redirect('/');
      } else {
          req.session.err = true;
          return res.redirect('/login');
      }
    } catch (err) {
        console.log(err);
        return res.status(500).send('Error fetching user data');
    }

});


//user signUP
router.post('/signup', async (req, res) => {
    const data = req.body;//data given by the user
    data.password=encrypt(data.password,key);
    try {
        await User.create(data) //inserting the data
        console.log('user created');

        if (req.session.admin) {
            return res.redirect('/admin');
        }
        else {

            req.session.user = data; //setting value to the session
            console.log(data.username + ' logged in');
            return res.redirect('/');
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send('Error creating USER');
    }

});

function adminauth(req, res, next) {
    if (req.session.admin) {
        next(); // User is authenticated, continue to the next middleware or route
    } else {
        res.render('adminlog', { errorMessage: '' });
    }
}

router.get('/admin', adminauth, async (req, res) => {
    try {
        const users = await User.find({}, { _id: 1, username: 1, email: 1 }); // Fetch fdata

        res.render('admin', { users }); // Render the admin EJS template with users data
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching user data');
    }
});

router.get('/search', adminauth, async (req, res) => {
    const searchTerm = req.query.key; // Get the search term from the query parameter
    try {
        const users = await User.find({ username: { $regex: searchTerm, $options: 'i' } }, { _id: 1, username: 1, email: 1 }); // Fetch data
        res.render('admin', { users }); // Render the admin EJS template with users data
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching user data');
    }
});

// Delete user by ID
router.delete('/delete/:userId', async (req, res) => {
  const userId = req.params.userId;
  console.log(userId);
  try {
    // Use Mongoose to find and remove the user by 

    const deletedUser = await User.deleteOne({ _id: userId });
    if (deletedUser) {
        console.log('user deleted');
      res.status(200).send('user deleted')
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting user');
  }
});

//Edit data

router.put('/edit/:userId', async (req, res) => {
    const userId = req.params.userId;
    console.log(req.body);
    const updatedData = req.body; 
    // Updated data from the request body
    console.log(userId);
    
    try {
      // Find the user by ID and update their data
      const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });
  
      if (updatedUser) {
        res.json(updatedUser); // Return the updated user
      } else {
        res.status(404).send('User not found');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error updating user');
    }
  });
  

module.exports = router;
