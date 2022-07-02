const express = require('express');
const session = require('express-session')
const app = express();
const compression = require('compression')
app.use(compression())
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const uploadData = require('./routes/uploadData')
const saltRounds = 8;
const jwt = require('jsonwebtoken');
const morgan = require('morgan');
const port = 3000;
var _ = require('lodash');
const fs = require('fs');
const https = require('https')
const options = {
  key: fs.readFileSync("/etc/letsencrypt/live/festalfactory.com/privkey.pem"),
  cert: fs.readFileSync("/etc/letsencrypt/live/festalfactory.com/fullchain.pem")
};

const server = require('https').createServer(options,app);
var bodyParser = require('body-parser');
const { result, functions } = require('lodash');
const e = require('express');
const dotenv = require('dotenv').config();
app.use(bodyParser({extended:true}))
app.use(express.static('./'))
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Content-Type",'application/json');
    // Pass to next layer of middleware
    next();
  });



app.use(morgan('combined'));
const io = require('socket.io')(server,{cors:{origin:'*'}});
server.listen(port,()=>{
    console.log(`server is listening on the port ${port}`)
})



app.use(session({
  
  // It holds the secret key for session
  secret: process.env.secret,

  // Forces the session to be saved
  // back to the session store
  resave: true,

  // Forces a session that is "uninitialized"
  // to be saved to the store
  saveUninitialized: true
}))
 

//db section
var con = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database:process.env.database
  });

  const checkSignIn = (req,res,next) => {
    let token = req.body.token;
   // console.log({token:token})
    if (!token || token === '') {
      console.log('No Token provided');
      res.send({msg:'505 Internal Error',variant:'danger'});
    }else{
    jwt.verify(token,process.env.secret,(e,r)=> {
      if(e){
       console.log('Not matched')
      }else{
        next()
      }
    })
  }
  }


  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to deda db at auth!");
  });
  
//end db section

app.get('/',(req,res,next)=>{
    res.send('Welcome to deda')
})
app.use('/upload',uploadData)
// auth section
app.get('/auth',(req,res,next)=>{
    res.send('This is auth section')
    })
    
    app.post('/auth/login', function(req, res, next) {
      if(!req.body){res.json({msg:'Internal Error occurred',variant:'danger'})};
      con.query(`SELECT * from deda_198003.auth LEFT JOIN deda_198003.admin ON auth.id=admin.UserId  WHERE mobile = ${req.body.mobile}`,(err,resu)=>{
        if(err){
          console.log('err at auth db',err)
        } else{
          if(!!(resu.length==0)){
            res.json({msg:'No Login found',variant:'primary'})
            console.log('no data found');
          }else{
          resu.forEach(element => {
            bcrypt.compare(req.body.password,element.password, function(err,val) {
              if(err)res.json({msg:'password or email error',variant:'danger'})
              if(val==true){
    
                const token = jwt.sign({ id:element.id},process.env.secret, {
                  expiresIn: 86400 // expires in 24 hours
                });
                res.json({msg:'Successful login',variant:'success',data:{ID:element.id,Name:element.name,mobile:element.mobile,image:element.image,token:token,verified:element.verified,city:element.ucity,address:element.address,about:element.about,admin_id:element.admin_id,roll_as:element.roll_as,zxcvbnmlkjhgfdsapoiuytrewq:element.zxcvbnmlkjhgfdsapoiuytrewq}})
                var d = new Date();
                var n = d.toLocaleString();
                con.query(`UPDATE auth SET last_log = '${n}'  WHERE auth.id = ${element.id}`,(e,r)=>{
                 if(e) console.log('err in login time change',e);
                 if(r) console.log('Successfully time chnage ',r);
                })
                console.log('successful login')
              }else{
                res.json({msg:'Unsuccessful Login',variant:'danger'});
              }
            });
          });
          
          }
        }
      })  
    });
    
    app.post('/auth/register', function(req, res, next) {
      if(req.body.length==0){
        res.send('Null data send')
      }else{
          bcrypt.genSalt(saltRounds, (err, salt) => {
            bcrypt.hash(req.body.password, salt, (err, hash) => {
                // Now we can store the password hash in db.
                if(err)console.log('error at hashing pass',err);
                if(hash)console.log('hash password',hash);
                con.query(`CREATE TABLE IF NOT EXISTS deda_198003.auth (id int(20) PRIMARY KEY AUTO_INCREMENT,name varchar(50),mobile varchar(15),password varchar(130),verified varchar(2))`,(err,result)=>{
                  if(err)console.log('ERROR AT CREATING AUTH Table');
                  if(result){
                    console.log('SUCCESSFULLY CREATED AUTH Table')
                con.query(`SELECT * FROM deda_198003.auth WHERE mobile = ${req.body.mobile}`,(err,result)=>{
                  //console.log('results at Auth',result);
                  if(err){
                    console.log('error at Auth',err);
                  }
                  if(!!result.length > 0 ){
                    res.json({msg:'Already created account Please logIn',variant:'info'});
                  }else{
                      var d = new Date();
                      var n = d.getTime();
                    con.query(`INSERT INTO deda_198003.auth (name,mobile,password,last_log,verified) VALUES ('${req.body.name}','${req.body.mobile}','${hash}','${n}',0)`,(err,result)=>{
                      if(err){
                        res.json({msg:'Unsuccessfull please try again',variant:'danger'});
                        console.log("err at register auth",err);
                      }else{
                        res.json({msg:'successfully created account Please logIn',variant:'success'});
                        console.log({'successfully created account':result});
                        
                      }
                    })
                  }
                })
              }
            })
            });
        });
      }
    });
app.post('/dashboard',checkSignIn,(req,res,next)=>{
  //console.log({res:req.body})
if(req.body.userId){
      con.query(`select * from postmade where userId=${req.body.userId}`,(e1,r1)=>{
        if(e1) throw e1;
        if(r1){
          var data = Object.values(JSON.parse(JSON.stringify(r1)));
          res.send({postData:data})
        }
      })
        }else{
         res.send({msg:'500 Internal Error',variant:'danger'})
        }
})
app.post('/dashboard/delete',checkSignIn,(req,res,next)=>{
 // console.log({res:!!req.body.postId})
 if(!!req.body.imgUrl){ fs.unlink(req.body.imgUrl,((err)=>{
  if(err) console.log('deleting file error',err)
  else{
    console.log('successfully deleted image');
  }
})) }
if(!!req.body.postId){
      con.query(`DELETE FROM postmade WHERE postId=${req.body.postId}`,(e1,r1)=>{
        if(e1) throw e1;
        if(r1){
          res.send({msg:'Successfully Deleted',variant:'success'})
        }
      })
        }else{
         res.send({msg:'500 Internal Error',variant:'danger'})
        }
})
app.post('/profile',(req,res,next)=>{
//console.log({res:req.body})
if(req.body.profileId !== undefined){
      con.query(`SELECT postId,userId,city,message,img,time,name,mobile,verified from postmade JOIN auth ON postmade.userId=auth.Id where userId=${req.body.profileId}`,(e1,r1)=>{
        if(e1) throw e1;
        if(r1){
          var data = Object.values(JSON.parse(JSON.stringify(r1)));
          res.send({postData:data})
        }
      })
        }else{
         res.send({msg:'500 Internal Error',variant:'danger'})
        }
})
app.post('/getProfileData',(req,res,next)=>{
  console.log('sending profile data...',req.body)
con.query(`SELECT id,name,address,about,verified from auth where id=${req.body.profileId}`,(err,result)=>{
  if(err) throw err;
  if(result){
    res.send(Object.values(JSON.parse(JSON.stringify(result))))
    console.log(Object.values(JSON.parse(JSON.stringify(result))))
  }
})
})


//middlewares ---
io.use((socket, next) => {
  const username = socket.handshake.auth.userId;
  if(!!username){
    console.log('userName',username);
    socket.username = username;
    //con.query(``)
  }
  if (!username) {
    return next(new Error("invalid userId"));
  }
  next();
});
//end middleware --


//Whenever someone connects this gets executed
io.on('connection', function(socket) {
    console.log('A user connected',socket.id);
    var AllUsers = [];
    for (let [id, socket] of io.of("/").sockets) {
      AllUsers.push({
        socketID: id,
        userId: socket.username,
      });
    }
    socket.on("getUsersIdAndCoonectToRooms",(data)=>{
console.log({getUsersIdAndCoonectToRooms:data});
getRoomId(data.to_id,data.from_id);
    })
    socket.on("sendMsgRoom",(data)=>{
      getRoomId(data.msg_to,data.msg_from,data)
    })
// function starts---#######################################################
function removeDuplicates(myArr, prop) {
  return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
  })
}


//--chat save in db---
function chatSave(data) {
  con.query(`INSERT INTO chat (msg_from,msg_to,msgIn,time) VALUES ('${data.msg_from}','${data.msg_to}','${data.msgIn}','${data.time}')`,(err,result)=>{
    if (err) throw err;
    if(result){
      console.log('successfully save chat')
    }
  })
  
}
//-end-

 function sendSpecific(msg_to,data) {
  io.to(msg_to).emit('listenPrivate',data);
}
    function getSocketByUserid(params) {
      return _.find(users, function(o) { return o.userId = params; });
    }
    
  function getRoomId(user1,user2,msgData) {
      console.log({user1:user1,user2:user2});
      con.query('CREATE TABLE IF NOT EXISTS roomid (roomId int(10) PRIMARY KEY AUTO_INCREMENT,userId_1 varchar(10),userId_2 varchar(10))',(e,r)=>{
        if(e) throw e;
        if(r){
      con.query(`SELECT roomId from roomid where  (userId_1,userId_2)=(${user1},${user2
      }) OR  (userId_1,userId_2)=(${user2},${user1})`,(err1,result1)=>{
        if(err1){
          throw err1;
        }
        if(!!result1 && result1.length>0){
          roomId = Object.values(JSON.parse(JSON.stringify(result1)))
          socket.join(roomId[0].roomId);
          console.log('result1 room id',roomId[0].roomId);
          console.log(`${roomId[0].roomId} connected from ${user1} and ${user2}`)
          if(!!msgData){
            chatSave(msgData);
            con.query(`SELECT * from chat Where msg_from ='${msgData.msg_from}' AND msg_to='${msgData.msg_to}'AND time='${msgData.time}'`,(errx,resx)=>{
              if(errx){
                console.log({msg:'error occureed',reason:errx})
              }
              if(resx){
                io.in(roomId[0].roomId).emit('roomConnectMsg',Object.values(JSON.parse(JSON.stringify(resx))));
                console.log(Object.values(JSON.parse(JSON.stringify(resx))));
               return ;
              }
            })
          }
          
          
        }
        else{
          con.query(`INSERT INTO roomid (userId_1,userId_2) VALUES (${user1},${user2})`,(err2,result2)=>{
            if(err2){throw err2}
            if(result2){
        console.log('creating room id');
       con.query(`SELECT roomId from roomid where  (userId_1,userId_2)=(${user1},${user2
       }) OR  (userId_1,userId_2)=(${user2},${user1})`,(err3,result3)=>{
         if(err3){
           throw err3;
         }
         if(!!result3 && result3.length>0){
          // console.log('result3 room id',result3);
           roomId = Object.values(JSON.parse(JSON.stringify(result3)));
           socket.join(roomId[0].roomId);
           console.log(`${roomId[0].roomId} connected from ${user1} and ${user2}`)
           if(!!msgData){
            io.in(roomId[0].roomId).emit('roomConnectMsg',msgData);
            chatSave(msgData);
          }
         }
        }) 
          } 
          })
        }
      })
    }
  })
    }
    
 // functions end###########################################################
 const vdata = removeDuplicates(AllUsers,"userId");
    
console.log('rooms available',Object.keys(io.sockets.adapter.rooms));
function myContact(params) {
    console.log('mycontact params',params)
    con.query(`SELECT DISTINCT msg_from as userId,msg_to as userId from chat where msg_from = ${params} OR msg_to=${params}`,(err5,result5)=>{
      if(err5)console.log({err5:err5});
      if(result5){
        var available = [];
        const d = Object.values(JSON.parse(JSON.stringify(result5)))
        const HistoryId = removeDuplicates(d,"userId");
        HistoryId.forEach((v)=>{
          available.push(v.userId)
        })
        console.log('chatListHistory',HistoryId);
        console.log('available',available.toString());
        userSend(available.toString());
      }
    })
}
    function userSend(params) {
      con.query(`SELECT id as userId,name,mobile,verified,image from auth where id IN (${params})`,(err4,res4)=>{
        if(err4) throw err4;
        if(res4){
          const data = Object.values(JSON.parse(JSON.stringify(res4)));
         // console.log({data:data,vdata:vdata})
          var merge = _.merge(vdata,data);
          console.log('merge',merge);
          socket.emit("users",merge);
        }
      })
    }
    socket.on("reSendUser",(data)=>{
      myContact(data);
     // myContact(data);
    })
 //start chat hhistory
 socket.on("chatHistory",(params)=>{
   console.log({params:params})
   con.query(`SELECT DISTINCT msg_from,msg_to,msgIn,time from chat where (msg_from,msg_to) =('${params.msg_from}','${params.msg_to}') OR (msg_to,msg_from) =('${params.msg_from}','${params.msg_to}')`,(err,data)=>{
     if(err) throw err;
     if(!!data){
       const val = Object.values(JSON.parse(JSON.stringify(data)));
       socket.emit("chatHistory",val);
     }
   })
  })
  socket.on("getNameById",(data)=>{
    console.log('getNameById',data)
    con.query(`SELECT id,name,image from auth where id=${data}`,(e,r)=>{
      if(e) throw e;
      console.log({e:e});
      if(r){
        socket.emit("getNameById",Object.values(JSON.parse(JSON.stringify(r))))
      console.log({r:r})
      }
    })
  })
//end chat history
 //Whenever someone disconnects this piece of code executed
    socket.on('disconnect', function () {
      socket.emit("closeSocket")
      socket.disconnect(true);
       console.log('A user disconnected');
     
    });
    
 });
 