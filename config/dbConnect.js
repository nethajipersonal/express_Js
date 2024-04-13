const {default:mongoose} = require('mongoose');


const dbConnect =()=>{
   try {
    const conn=mongoose.connect(process.env.MONGODB_URL);
    console.log('Db Connected Successfully')
   } catch (error) {
    console.log('DB not connected')
   }

}
module.exports = dbConnect