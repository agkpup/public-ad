var express = require('express');
var router = express.Router();
router.use(express.json({limit: '50mb'}));
router.use(express.urlencoded({limit: '50mb'}));
var fs = require('fs');
const jwt = require('jsonwebtoken');
path = require('path');
const mysql = require('mysql');
var compression = require('compression');
router.use(compression())
const {promisify} = require('util');
const { Console } = require('console');
//db section
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Abhay@ue198003",
  database:'deda_198003'
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to deda db at auth!");
});

const checkSignIn = (req,res,next) => {
  let token = req.body.token;
  console.log({token:token})
  if (!token || token === '') {
    console.log('No Token provided');
    res.send({msg:'505 token Internal Error',variant:'danger'});
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

const imgUploadPath = [];
// define the home page route
router.get('/',checkSignIn,function (req, res) {
  res.json('hey all will be uploaded here')
})
router.use(function (req, res, next) {
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
// define the about route
router.post('/',checkSignIn,(req,res,next)=>{
  console.log(req.body);
  const image = req.body.image[0];
  const city = req.body.city;
  const message = req.body.message;
  const user = req.body.userId;
  const time=Date.now();
  if(!!image&&!!city&&!!user&&time){
var dir = `./public/databases/post_${user}`;
  console.log('image',image.image)
  if(!!image.image&&!!image.image_name){
    try {
      fs.mkdirSync(dir,{recursive: true},(err)=>{console.log(err)
      });
      console.log(`successfully created ${dir} directory`);
    } catch(e) {
      if (e.code != 'EEXIST') 
      console.log(e)
      ;
    }
      var base64Data = image.image.replace(/^data:image\/\w+;base64,/, '')
      var ext = path.extname(image.image_name);
      var d = new Date();
      var x = d.getTime();
      filePath = path.join(dir, `ITEM_${x}.${ext}`);
      fs.writeFile(filePath, base64Data,{encoding: 'base64'}, function(err, data) {
      if (err) {
                console.log('error at writing file',err)
              }
                })
                console.log(`successful upload ${filePath}`);
                imgUploadPath.push(filePath);
                console.log('imgUploadPath',imgUploadPath);
                con.query(`CREATE TABLE IF NOT EXISTS postmade (postId int(10) PRIMARY KEY AUTO_INCREMENT,userId varchar(20),city varchar(50),message text(800),img varchar(200),time varchar(40))`,(err,result)=>{
                  if(err){console.log('ERROR IN CREATING TABLE postmade',err)
                  }
                  if(result){console.log(`SUCCESSFULLY CREATED postmade TABLE`)
                  con.query(`INSERT INTO postmade (userId,city,message,img,time,veriefied) VALUES (?,?,?,?,?,?)`,[user,city,message,filePath,time,0],(err,result)=>{
                    if(err)console.log(err);
                     res.send({msg:'Successfully uploaded !',variant:'success'});
                    console.log(result);
                  })
                
                }
                })
      
  

  }
  else{
    console.log({msg:'no image found to save'});
  }
}else{
res.status(500).send({msg:'Some Error Occurred',variant:'danger'});
}
  
  })
router.post('/get',(req,res,next)=>{
  const city = req.body.city;
  console.log({city:city});
    if(city==''|| !city){
    con.query(`SELECT postId,userId,city,message,img,time,veriefied,name,mobile from postmade JOIN auth ON postmade.userId=auth.Id WHERE veriefied = 1 ORDER BY postId DESC`,(errn,resn)=>{
      if(errn) throw errn;
      if(resn){
        res.status(200).send({postData: Object.values(JSON.parse(JSON.stringify(resn)))})
      }
    })
  }
  else{
    con.query(`SELECT postId,userId,city,message,img,time,veriefied,name,mobile from postmade JOIN auth ON postmade.userId=auth.Id  WHERE city='${city}' AND veriefied = 1 ORDER BY postId DESC`,(errn,resn)=>{
      if(errn) throw errn;
      if(resn){
        res.status(200).send({postData: Object.values(JSON.parse(JSON.stringify(resn)))})
      }

    })
  }
})
router.post('/saveUserProfile',checkSignIn,(req,res,next)=>{
    var dir = `./public/profile/profile_${req.body.id}`;
      console.log('req.body',req.body)
      if(!!req.body.image&&!!req.body.imageName&&!!req.body.id){
        try {
          fs.mkdirSync(dir,{recursive: true},(err)=>{console.log(err)
          });
          console.log(`successfully created ${dir} directory`);
        } catch(e) {
          if (e.code != 'EEXIST')
          console.log(e)
          ;
        }
          var base64Data = req.body.image.replace(/^data:image\/\w+;base64,/, '')
          var ext = path.extname(req.body.imageName);
               var x = req.body.id;
               if(x != undefined){
                filePath = path.join(dir, `ITEM_${x}.${ext}`);
                try {
                  if (fs.existsSync(path)) {
                   fs.unlink(filePath)
                  }
                } catch(err) {
                  console.error(err)
                }
               }else{
                filePath = path.join(dir, `ITEM_${1}.${ext}`);
                try {
                  if (fs.existsSync(path)) {
                   fs.unlink(filePath)
                  }
                } catch(err) {
                  console.error(err)
                }
               }
          fs.writeFile(filePath, base64Data,{encoding: 'base64'}, function(err, data) {
          if (err) {
                    console.log('error at writing file',err)
                  }
                    })
                    console.log(`successful upload ${filePath}`);
                    con.query('CREATE TABLE IF NOT EXISTS deda_198003.auth (id int(20) PRIMARY KEY AUTO_INCREMENT,name varchar(50),mobile varchar(15),password varchar(130),verified varchar(2))',(err,result)=>{
                      if(err){console.log('ERROR IN CREATING TABLE auth',err)
                      }
                      if(result){console.log(`SUCCESSFULLY CREATED auth  TABLE for profile upload`)
                      console.error(filePath)
                      con.query(`UPDATE auth SET image= ? WHERE id= ? `,[filePath,req.body.id],(err,result)=>{
                        if(err)console.log(err);
                        console.log({filePath:filePath})
                         res.send({msg:'Successfully uploaded Profile pic Login Again to see result !',variant:'success'});
                        console.log(result);
                      })
                    }
                    })
        
    }else{
    res.status(500).send({msg:'Some Error Occurred',variant:'danger'});
    }
})
router.post('/saveUserMoreData',checkSignIn,(req,res,next)=>{
  const city = req.body.city;
  const id =req.body.id;
  const about = req.body.about;
  const mohalla = req.body.mohalla;
  if(!city||!about||!mohalla){
    res.json({msg:'please fill All field correctly',variant:'danger'})
  }else{
    con.query(`UPDATE auth SET ucity= ?,address=?,about=? WHERE id= ? `,[city,mohalla,about,id],(err,result)=>{
       if(err){
         console.log({error:err})
        res.json({msg:'Internal Error Occurred !',variant:'danger'})
       }
       if(result){
        res.json({msg:'Sucessfully Updated ',variant:'success'})
       }
    })
  }
})
router.post('/verification',checkSignIn,(req,res,next)=>{
    con.query(`SELECT postId,ucity as adAdress,message,img,time,veriefied,id,name,city as native_city,address from postmade JOIN auth ON postmade.userId=auth.Id WHERE veriefied = 0 ORDER BY postId DESC`,(errn,resn)=>{
      if(errn) throw errn;
      if(resn){
        res.status(200).send({postData: Object.values(JSON.parse(JSON.stringify(resn)))})
      }
    })
  })
router.post('/verification/accept',checkSignIn,(req,res,next)=>{
if(req.body.postId){
  con.query('UPDATE postmade SET veriefied = 1 WHERE postmade.postId=?',[req.body.postId],(err,data)=>{
    if(err){
      res.status(500).send({msg:'Internal Error Occurred !',variant:'danger'})
    }
    if(data){
      res.status(200).send({msg:'SuccessFully Accepted Your Request',variant:'success'})
    }
  })
}else{
  res.status(500).send({msg:'Internal Error Occurred *!',variant:'danger'})
}

})
router.post('/verification/reject',checkSignIn,(req,res,next)=>{
  if(!!req.body.imgUrl){ fs.unlink(req.body.imgUrl,((err)=>{
    if(err) console.log('deleting file error',err)
    else{
      console.log('successfully deleted image');
    }
  })) }
  if(req.body.postId){
    con.query('DELETE FROM postmade WHERE postmade.postId = ?',[req.body.postId],(err,data)=>{
      if(err){
        res.status(500).send({msg:'Internal Error Occurred !',variant:'danger'})
      }
      if(data){
        res.status(200).send({msg:'SuccessFully Delted Post',variant:'success'})
      }
    })
  }else{
    res.status(500).send({msg:'Internal Error Occurred *!',variant:'danger'})
  }
  
  })
module.exports = router
