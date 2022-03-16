const DBURI = require("./index")
const mongoose = require("mongoose");

const connectDb = ()=>{
mongoose.connect(process.env.DBURI).then(()=>{console.log("db connected... ")})
.catch((err)=>console.log("not connected :- ",err))
}
module.exports = connectDb
