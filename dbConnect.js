const mongoose=require('mongoose');
// const url="mongodb+srv://admin:1234@first.miygtds.mongodb.net/Login?retryWrites=true&w=majority"
// Connect to the MongoDB database
const url="mongodb://0.0.0.0/login" 
module.exports=()=>{
   return mongoose.connect(url); 
}

