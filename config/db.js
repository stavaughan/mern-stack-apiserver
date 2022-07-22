import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose';

const { MONGO_USER, MONGO_PW, MONGO_CLUSTER, MONGO_DB_NAME } = process.env;

const CONNECTION_URL = `mongodb+srv://${MONGO_USER}:${MONGO_PW}@${MONGO_CLUSTER}.mongodb.net/${MONGO_DB_NAME}?retryWrites=true&w=majority`;

const connectDB = async () => {
  try {
    mongoose.connect(CONNECTION_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log(`MongoDB Connected`)
  } catch (error) {
    console.log(`${error} did not connect`)
    process.exit(1)
  }
}

export default connectDB