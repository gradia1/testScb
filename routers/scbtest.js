
const express = require('express');
const router = express.Router();
const mysql = require('mysql');

//create connections
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "scb_test"
});

//welcome rounter
router.get('/',(req,res)=>{
    res.send('welcome to scb test!!')
});


//scb login
router.post('/login',(req,res)=>{
    let login = {
        login: req.body.username,
        pass: req.body.password
    }
    let sql = 'select count(*) from user u where u.username = ? and u.password=?'
    db.query(sql,[login.username,login.password],(err,result=>{
        if (err) {
            res.send({status_code:'500',error:'can \'t login'});
        }
        else
        {
            res.send({status_code:'200',error:''});
        }

        }))
})

//get user
router.get('/users/:username',(req,res)=>{
    let username = req.params.username
    let sql = 'select * from user u inner join order o on (u.username = o.username)'+
    ' inner join books b on (o.bookid = b.bookid) where o.username = ?'

    db.query(sql,[username],(err,result)=>{
        if (err){
            res.send({status_code:'500',error:''})

        }
        else{
            let value = JSON.stringify(result)
            let json = JSON.parse(value)
            let books = []
            json.map(item=>{
                books.push(item.bookid)
            })

            let retval = {
                name : json[0].name,
                surname : json[0].surname,
                date_of_birth : json[0].birthdate,
                books : books

            }
            res.send({status_code:'200',error:'',values:retval})
        }
    })
})

router.delete('/delete/:username/:deluser',(req,res)=>{
    if (req.params.username === ''){

        res.send({status_code:'500',error:'must login'})
    }
    let sql = 'delete from user where username = ?'
    let deluser = req.params.deluser

    db.query(sql,[deluser],(err,result)=>{
        if (err){
            res.send({status_code:'500',error:'can\'t delete'})

        }
        else{
            res.send({status_code:'200',error:''})

        }
    })
})

//add user
router.post('/users',(req,res)=>{
let user = {
    username : req.body.username,
    password : req.body.password,
    date_of_birth : req.body.date_of_birth

}
let sql = 'Insert into user(username,password,birthdate) values(?,?,?)'

db.query(sql,[username,password,date_of_birth],(err,result)=>{
    if (err){
        res.send({status_code:'500',error:'can\'t add user'})
    }
    else{
        res.send({status_code:'200',error:''})
    }
})
})

//post user/order
router.post('/user/order',(req,res)=>{

    let username = req.body.username
    let sql = 'select o.bookid,b.price from order o inner join books b on (o.bookid = b.bookid)'
    + 'where o.username = ?'

    db.query(sql,[username],(err,result)=>{
        if (err){
            res.send({status_code:'500',error:'can\'t get order'})
        }
        else {

            let value = JSON.stringify(result)
            let json = JSON.parse(value)

            let order = []
            json.map(item=>{
                order.push(item.bookid)
            })
            let amount = 0.00
            json.map(item=>{
                amount += parseFloat(item.price)
            })

            let retval = {
                orders : order,
                price : amount

            }
            res.send({status_code:'200',error:'',values:retval})
        }
    })
})

//get books
router.get('/books',(req,res)=>{
    let sql = 'select * from books'

    db.query(sql,[],(err,result)=>{
        if (err){
            res.send({status_code:'500',error:'can\'t get books data'})
        }

       res.send ({status_code:'200',error:'',values:result})

    })

})


module.exports = router;