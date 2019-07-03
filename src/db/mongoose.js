const mongoose = require('mongoose');

const connectDb = async () => {
    try{
        const connection = await mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });
        console.log('Successfully connected to MongoDB instance!');
    }catch(e){
        console.error(e);
    }
};

module.exports = {
    connectDb
};