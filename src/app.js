const express = require("express");
const morgan = require("morgan");
const cors = require("cors")
const {PORT,connectDb,errorHandler}=require("./config/index")
const {userRouter,sellerRouter,adminRouter,hbsRoute} = require("./routes")
const {logger} = require("./shared/")
const path  = require("path")
const app = express();
const port = PORT || 8000

app.use(cors());
app.use(express())
app.set("view engine","hbs")
app.use(express.urlencoded({extended:false}));
app.use(express.json())
app.use(morgan("dev"))
app.use(errorHandler)

app.use("/api/v1/users",userRouter)
app.use("/api/v1/seller",sellerRouter)
app.use("/api/v1/admin",adminRouter)
app.use("/hbs",hbsRoute)

app.listen(port,()=>{
    logger.info(`server is running :-http://127.0.0.1:${port}`)
    connectDb()
})
