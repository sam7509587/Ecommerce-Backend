const redis = require("redis");
const client = redis.createClient(6379, 'redis'
);
// client.connect().then(()=>{console.log("connected redis")}).catch((err)=>console.log(">>>>>>>>>>",err))

exports.client
