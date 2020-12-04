const {Router}=require('express');
const { validationResult } = require('express-validator');
const {verifyUser,checkAccess,saveUser}=require('../controllers/admin');



const router = Router();

router.get('/admin', checkAccess, (req,res) => {
    res.render('login', {
    layout:'main-admin.hbs',
    title: 'Login Admin Page',   
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
});

//***Routes For Register Admin***
router.get('/register', (req, res)=>{
    res.render('register',{
        layout: 'main-admin-register.hbs',
        title: 'Register a Admin'
    })
});

router.post('/register', async(req, res)=>{
    try{
        await saveUser(req, res)
        res.redirect('/admin')
    }catch(err){
        console.error(err)
        res.redirect('/register')
    }
})

module.exports= router;