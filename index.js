require('dotenv').config()
const express = require('express')
// const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');

// console.log('env', process.env.PUBLIC_DIR)

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_URL );
  console.log("Database connected")
} 

const userSchema  = new mongoose.Schema({
    username: { 
        type: String, 
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
              return /([A-Z])\w+/.test(v);
            },
            message: props => `${props.value} is not a valid username!`
        }
    },
    password: {
        type: String,
        unique: true,
        minLength: 8,
    },
    token: String
});

const User = mongoose.model('User', userSchema);

const server = express()

server.use(bodyParser.json())
// server.use(cors())
server.use(express.static(process.env.PUBLIC_DIR))

server.post('/test', async(req, res)=>{
    let user = new User()
    user.username = req.body.username
    user.password = req.body.password
    const doc = await user.save()

    console.log(doc)
    res.json(doc)
})

server.get('/test', async(req, res)=>{
    const docs = await User.find({})
    res.json(docs)
})

server.listen(process.env.PORT, ()=>{
    console.log("server running")
})