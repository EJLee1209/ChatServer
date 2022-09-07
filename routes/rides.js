const mysql = require('mysql2');
const dbconfig = require('../config/database');
const connection = mysql.createConnection(dbconfig);
var express = require('express');
var router = express.Router();

router.post('/register', (req,res)=>{
    const body = req.body;
    const id = body.id;
    const pw = body.pw;
    const name = body.name;

    connection.query('select * from user where id=?',[id],(err,data)=>{
        if(data.length==0){
            console.log("register successed");
            connection.query('insert into user(id, pw, name) values(?,?,?)',[id,pw,name]);
            res.status(200).json(
                {
                    "message" : true
                }
            )
        }else{
            console.log('register failed');
            res.status(200).json({
                "message" : false
            })
        }
    })
})

router.post('/login', (req,res)=>{
    const body = req.body;
    const id = body.id;
    const pw = body.pw;

    connection.query('select uid from user where id=? and pw=?',[id, pw], (err,data)=>{
        if(data.length == 0){
            console.log('login failed');
            res.status(200).json({
                "uid" : -1
            })
        }else{
            console.log('login successed');
            res.status(200).send(data[0]);
        }
    })
})

router.post('/createRoom',(req,res)=>{
    const body = req.body;
    const sender = body.sender;
    const receiver = body.receiver;

    connection.query('select number from room where (sender=? and receiver=?) or (sender=? and receiver=?)',
    [sender,receiver,receiver,sender], (err,data)=>{
        if(data.length==0){
            // 채팅방이 존재하지 않음. 채팅방 생성
            connection.query('insert into room(sender,receiver) values(?,?)',[sender,receiver], (err,rows)=>{
                if(err) throw err;
                
                connection.query('select number from room where sender=? and receiver=?',[sender,receiver], (err, rows)=>{
                    if(err) throw err;
                    console.log('new room created');
                    res.status(200).send(rows[0]);
                })
                 
                
            });
        }else{
            // 채팅방이 존재함.
            console.log('exist room');
            res.status(200).send(data[0]);
        }

        // 클라이언트에게 전송되는 json 형식
        // { "number" : 숫자 }
    })
})

router.post('/message', (req,res)=>{
    const body = req.body;
    const sender = body.sender;
    const receiver = body.receiver;
    const content = body.content;
    const is_confirm = body.is_confirm;
    const time = body.time;
    const sender_flag = body.sender_flag;
    const receiver_flag = body.receiver_flag;

    connection.query('insert into message(sender,receiver,content,is_confirm,time,sender_flag,receiver_flag) values(?,?,?,?,?,?,?)',
        [sender,receiver,content,is_confirm,time,sender_flag,receiver_flag], (err,rows)=>{
            if(err) throw err;
            console.log('message pushed');
            res.status(200).send(content); // 클라이언트에게 메시지 그대로 전달
        })
})

router.post('/getMyRooms', (req,res)=>{
    const body = req.body;
    const id = body.id;
    
})


module.exports = router;