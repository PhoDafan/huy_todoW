import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect(
            process.env.MONGODB_CONNECTIONSTRING
        );

        console.log('Connection sucessfully');

    } catch (error) {
        console.error('Connection failed:', error);
        process.exit(1); // exit with error
    }
}