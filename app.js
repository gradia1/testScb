const express = require('express');
const router = express.Router();
const cors = require('cors')
const scbRouter = require('./routers/scbtest');
const { response } = require('express');

//create connections
const app = express();
app.use(express.json())
app.use(cors());
app.use('/scbtest',scbRouter)

/*let myLogger = function (req, res, next){
    console.log('LOGGED')
    next()
}
app.use(myLogger);*/

app.get('/',(req,res) =>{
    res.send('first rounster...');
})


app.listen(3001,console.log('server port 3001'))