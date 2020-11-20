module.exports={
    development:{
        port: process.env.PORT || 3000,
        privateKey:'Super-secret-private-key',
        databaseUrl:'mongodb+srv://Joseph:123456789abc@cluster0.chzf6.mongodb.net/admin-database?retryWrites=true&w=majority'
    },
    production:{}
};