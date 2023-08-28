const mongoose= require('mongoose');

module.exports=mongoose.model('User',{
    username: {type:String},
    email:{type:String},
    password:{type:String}
},'user') 