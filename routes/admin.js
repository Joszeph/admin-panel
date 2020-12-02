const {Router}=require('express');
const{checkAuthentication}= require('../controllers/admin');
const route = Router();

route.get('/admin-panel', checkAuthentication, (req, res)=>{
    res.render('admin-panel',{
        layout: 'main-admin.hbs',
        title:'Admin Panel'
    })
});

module.exports = route;