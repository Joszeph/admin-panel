const mongoose = require('mongoose');
const AdminSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        minLength:3
    },
    password:{
        type:String,
        required:true,
        minLength:5
    }
})

module.exports = mongoose.model('Admin', AdminSchema);