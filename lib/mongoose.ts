import mongoose from 'mongoose'

let isConnected = false;

export const connectToDB = async () => {
    mongoose.set('strictQuery', true)

    if (!process.env.MONGOBD_URL) return console.log('MONGOBD_URL not found');
    if (isConnected) return console.log('Already connected to MongoDB');

    try {
        await mongoose.connect(process.env.MONGOBD_URL)
        isConnected = true
        console.log("Connected to MongoDB");

    } catch (e) {
        console.log(e);

    }
}