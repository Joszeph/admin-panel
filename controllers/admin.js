const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const generateToken = data => {
    const token = jwt.sign(data, config.privateKey);
    return token;
}

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

const getUserStatus =  (req, res, next) => {
    const token = req.cookies['aid'];
    if(!token) {
        req.isLoggedIn = false;
    }

    try { 
        jwt.verify(token, config.privateKey); 
        req.isLoggedIn = true;
    } catch(e) {
        req.isLoggedIn = false;
    }
    next();

};

// const checkAccess = (req, res, next)=> {
//     const token = req.cookies['aid']; 
//     if(token) {
//         return res.redirect('/admin-panel');
//     }
//     next();
// };

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

module.exports = {
    verifyUser,
    // checkAccess,
    checkAuthentication,
    getUserStatus
};