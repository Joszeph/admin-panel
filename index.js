const env = process.env.NODE_ENV || 'development';

const config = require('./config/config')[env];
const app = require('express')();
const mongoose = require('mongoose');



const indexRoute = require('./routes');
const authRoute = require('./routes/auth');
const adminRoute = require('./routes/admin');

//Database connection
mongoose.connect(config.databaseUrl,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,  
},(err)=>{
    if(err){
        console.error(err, 'Something went wrong with the Database!');
        throw err;
    }else{
        console.log('Connected with Database, successful!')
    }
});

require('./config/express')(app);

app.use('/', indexRoute);
app.use('/', authRoute);
app.use('/', adminRoute);


app.listen(config.port,
console.log(`Listening on port ${config.port}! Now it's up to you...`)
);



