const mongoose= require('mongoose');

module.exports=mongoose.model('Admin',{
    username: {type:String},
    email:{type:String},
    password:{type:String}
},'admin') 