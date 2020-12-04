const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

//Generating Token
const generateToken = data => {
    const token = jwt.sign(data, config.privateKey);
    return token;
}

//Veryfing users data with the Database
const verifyUser = async (req, res) => {
    const { username, password } = req.body;
    const user = await Admin.findOne( { username }); 
    if ( !user ) { return false }
    
    const status = await bcrypt.compare(password, user.password);  
    if (status) {  
        const token = generateToken({
            userID: user._id,
            username: user.username
        });  
        res.cookie('aid', token);
    } 
    return status; 
};

// const getUserStatus =  (req, res, next) => {
//     const token = req.cookies['aid'];
//     if(!token) {
//         req.isLoggedIn = false;
//     }

//     try { 
//         jwt.verify(token, config.privateKey); 
//         req.isLoggedIn = true;
//     } catch(e) {
//         req.isLoggedIn = false;
//     }
//     next();

// };

//Checking if the user is logget and have a token
const checkAccess = (req, res, next)=> {
    const token = req.cookies['aid']; 
    if(token) {
        return res.redirect('/admin-panel');
    }
    next();
};

//Finding and checking user Authentication
const checkAuthentication = async (req, res, next) => {
    const token = req.cookies['aid'];
    if(!token) {
        return res.redirect('/admin');
    }
    try {
        decodedObject = jwt.verify(token, config.privateKey);
        const user = await Admin.findById(decodedObject.userID);
        req.user = user;
        next();
    } catch(err) {
        console.error(err);
        return res.redirect('/admin');
    }

};

//Registering an Admin

const saveUser = async (req, res)=>{
    const{username, password}=req.body;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = new Admin({
        username,
        password:hash,
    });

    try{
        const userObject = await user.save();
        const token = generateToken({
            userID: userObject._id,
            username:userObject.username
        })
        res.cookie('aid', token);
        return true;
    }catch(err){
        console.error(err);
        return res.redirect('/register');
    }
}


module.exports = {
    verifyUser,
    checkAccess,
    checkAuthentication,
    saveUser
   //getUserStatus
};