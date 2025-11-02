import mongoose from "mongoose";

const mongoURL = process.env.MONGODB_URL || 'mongodb://localhost:27017/myDBTest';
 
const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURL);
        console.log('Connected to MongoDB');
    } catch (e) {
        console.error('Error connecting to MongoDB:', e.message);
    }
};
export default connectToMongo;