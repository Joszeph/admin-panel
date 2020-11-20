const {Router}=require('express');
const { validationResult } = require('express-validator');
const {verifyUser,getUserStatus}=require('../controllers/admin');


const router = Router();

router.get('/admin', getUserStatus,(req,res) => {
    res.render('login', {
    layout:'main-admin.hbs',
    title: 'Login Admin Page',
    isLoggedIn: req.isLoggetIn
})
});

router.post('/admin',  async (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.render('admin',{
            message: errors.array()[0].msg
        })
    }

    const status = await verifyUser(req, res);
    if(status){
        return res.redirect('/admin-panel')
    }else{
        res.render('login', {
            layout:'main-admin.hbs',
            message:'Wrong username or password!'
        })
    }
});

router.get('/logout', (req, res)=>{
    res.clearCookie('aid');
    res.redirect('/admin')
})


module.exports= router;