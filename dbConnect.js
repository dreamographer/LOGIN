const mongoose=require('mongoose');
const url="mongodb+srv://admin:1234@first.miygtds.mongodb.net/UserDB?retryWrites=true&w=majority"
// Connect to the MongoDB database

module.exports=()=>{
   return mongoose.connect(url);
}

