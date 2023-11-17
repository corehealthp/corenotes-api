import mongoose, { connect } from 'mongoose';
<<<<<<< HEAD
import dotenv from 'dotenv';
dotenv.config();
=======
>>>>>>> 4c0bf23a89c42992065c41b867232e976ab40894


mongoose.set('strictQuery', false)

export default connect(process.env.MONGO_URI!)
.then((connection)=> {
    console.log('##### CONNECTION TO DATABSE ESTABLISHED ##### \n')
})
.catch((error:any)=> console.log('#### THERE WAS AN ERROR CONNECTING TO DATABSE \n', error));
