<template>
<div>
<div class="center" v-if="!this.$store.getters.userLoggedIns" >
  <div class="card  m-3 mr-1 p-3"><i class="fa fa-lock mr-2" aria-hidden="true"></i><span class="badge badge-pill badge-success">Please LogIn to continue</span></div>
  
</div>
  <div class="absol" v-else ref="chatsec">
    <b-alert variant="info" show class="profilebar fixed-top" >
    <b-button v-b-toggle.sidebar-chatMenu variant="primary" class="float-left" @click="loadUser()"><i class="fa fa-address-book-o" aria-hidden="true"></i></b-button>
    <img class="avata mr-2 img-fluid" :src="'https://festalfactory.com:3000/'+reciverImage" v-if="!!this.recivername||!!this.msg_to">
   <strong class="text-wrap"  v-if="!!this.recivername||!!this.msg_to">{{recivername}}<i v-if="verified" class="fa fa-check-circle-o p-1 ml-1 btn btn-success" aria-hidden="true"></i></strong>
  </b-alert>
  <b-sidebar
      id="sidebar-chatMenu"
      width="80vw"
      shadow
      :visible="visible"
    >
      <div class="px-3 py-2">
       <div class="col">
       <div class="row">
    <input type="text" class="form-control mb-1 text-wrap" placeholder="Search here..." v-model="filterResult">
       </div>
    <div class="row mt-1" v-for="n in filterUsers" :key="n.userId">
  <div :class="[n.userId==userId?'alert alert-success':'alert alert-primary']" role="alert" style="width:75vw" @click="send_msg_to(n.userId,n.name,n.image,n.verified)">
   <div class=""><img class="avata mr-1 ml-1 float-left" :src="[!!n.image?'https://festalfactory.com:3000/'+n.image:'user.png']"/></div> <!--[n.userId==userId?'User_Circle.png':'user.png'] -->
   <div class="">
   <div class="text-inline text-wrap">{{n.name}}<i v-if="n.verified" class="fa fa-check-circle-o p-1 ml-1 btn btn-success" aria-hidden="true"></i></div> 
  </div>
  </div>
    </div>

</div>
      </div>
    </b-sidebar>
    <div v-if="!this.recivername||!this.msg_to" class="card mt-1 mb-1 ml-2 mr-1">
      <div class="container-fluid">
    <img src="contact.gif" alt="contact list select" class="align-middle img-fluid">
    <p class="card h4"><i class="fa fa-address-book-o mr-2" aria-hidden="true"></i>please select contacts to connect</p>
  </div>
    </div>
    <div class="chat-container" v-else>
      <ul class="chat">
        <li v-for="n in msgLists" :key="n.id" :class="[n.msg_from==userId?'message right':'message left']">
          <img
            class="avatar" :src="[n.msg_from==userId?'https://festalfactory.com:3000/'+userImage:'https://festalfactory.com:3000/'+reciverImage]"
            />
          <p class="text-wrap text-break">{{n.msgIn}}</p>
          <small class="text-info float-right"><sub>{{n.time}}</sub></small> 
        </li>
      </ul>
   <footer class="fixed-bottom card" style="margin-bottom:9vh;">
     <form class="form-inline d-flex justify-content-center" onsubmit="retun false">
    <div class="form-group"><input class="form-control rounded ml-2 pl-4 pr-4" autofocus="true" autocomplete="off" type="text"  placeholder="यहां संदेश भेजें" style="width:60vw;" v-model="msgIn" ref="msgbox"/></div>
    <div class="form-group"><button class="btn btn-primary mr-4"   @click.stop.prevent="sendMsgs()"> <i class="fa fa-paper-plane mr-3" aria-hidden="true"></i>भेजें</button></div>
</form>
   </footer>
      
    </div>
  </div>

  </div>
</template>
<script>
import axios from 'axios'
import pageLoader from '@/components/pageLoader.vue';
import io from 'socket.io-client';
 const socket = io('https://festalfactory.com:3000',{autoConnect:false});
export default {
  data() {
    return {
      msgIn:'',
      recivername:'',
      reciverImage:'',
      msg_to:'',
      users:[],
      filterUsers:[],
      msgLists:[],
      visible:false,
      filterResult:'',
      verified:0
    }
  },
  watch:{
    filterResult(e){
      this.filterUsers = this.users.filter((el,index)=>{
     const regex = new RegExp(`^${e}`,'gi');
     return el.name.match(regex);
      })
    }
  },
  computed:{
    userId(){
      return this.$store.getters.userdetails.ID;
    },
    userImage(){
      return this.$store.getters.userdetails.image;
    },
    routeParams(){
      return this.$route.query.msg_to;
    },
    userToken(){
  return this.$store.getters.userdetails.token
}
  },
  updated(){
    if(!this.recivername||!this.msg_to){
      this.visible=true;
    }
    
  },
  mounted(){
    if(!!this.routeParams){
      socket.emit('getNameById',this.routeParams);
    socket.on('getNameById',(data)=>{
       this.send_msg_to(data[0].id,data[0].name,data[0].image,data[0].verified)
   console.log({getNameById:data})
   })
    };
    this.$bvModal.show('sidebar-chatMenu')
  },
  created(){
    console.log({routeParams:this.routeParams})
    socket.on("roomConnectMsg",(data)=>{
      console.log("roomConnectMsg",data[0]);
      this.msgLists.push(data[0]);
      this.msgLists = [ ...new Set(this.msgLists) ]
      console.log('msgLists',this.msgLists)
      if(!!this.$refs.chatsec){
        this.$nextTick(() => {
            this.$refs.chatsec.scrollTop = this.$refs.chatsec.scrollHeight;
        }); 
      }
      
    })

socket.on("chatHistory",(data)=>{
  console.log({chatHistory:data})
  this.msgLists=data;
})
socket.auth = {userId:this.userId,token:this.userToken}
    socket.connect();
    socket.on('users',(data)=>{
      console.log('users',data)
      this.users=data;
      this.filterUsers=data;
    })
    
  },
  methods:{
    send_msg_to(to_id,to_name,to_image,verified){
      this.recivername=to_name;
      this.msg_to=to_id;
      this.reciverImage=to_image;
      this.verified=verified;
socket.emit("getUsersIdAndCoonectToRooms",{to_id:to_id,from_id:this.userId})
    var modal = document.getElementById("sidebar-chatMenu");
    modal.style.display = "none";
    socket.emit("chatHistory",{msg_from:this.userId,msg_to:this.msg_to})
    },
    sendMsgs(){
   if(!!this.msgIn && this.msgIn !==''){
        const data = {
      msgIn:this.msgIn,
      msg_from:this.userId,
      msg_to:this.msg_to,
       time:new Date().getTime()
      }
      socket.emit("sendMsgRoom",data);
      this.$refs.msgbox.focus();
      this.$nextTick(() => {
          console.log({'this.$refs.chatsec':this.$refs.chatsec.scrollTop})
        this.$refs.chatsec.scrollTop = this.$refs.chatsec.scrollHeight;
        });
        this.msgIn='';
   }
    },
    loadUser(){
      console.log({user:this.users,length:this.users.length})
      socket.emit("reSendUser",this.userId);
    }
  },
  components:{
    pageLoader
  }
}
</script>

<style>
div.absol{
overflow-y: auto;
overflow-x:hidden;
height:72vh;
max-width:100%;
  /*border: 1px solid #4CAF50; */
  box-shadow: 0 2px 12px 0 rgba(56, 54, 56, 0.2);
}
* {
  box-sizing: border-box;
}

body {
  font-family: "Lato", sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 40rem;
  text-align: center;
  word-wrap: break-word;
}

h2 {
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 1);
  color: #fff;
  letter-spacing: 1px;
  text-transform: uppercase;
  text-align: center;
}

.chat-container {
  background: #ece9e6;
  background: linear-gradient(to right, #ece9e6, #ffffff);
  max-width: 100%;
  border-radius: 25px;
  box-shadow: 0 2px 8px rgba(240, 236, 236, 0.26);
  overflow: hidden;
  padding: 15px;
  position: relative;
  
}

.chat {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  list-style-type: none;
  padding: 0;
  margin: 0;
  word-wrap: break-word;
}

.message {
  border-radius: 50px;
  position: relative;
  margin-bottom: 30px;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.message.left {
  padding: 15px 20px 15px 70px;
  background-color: #fff;
  border: 2px solid #cccccc;
  text-align: left;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.message.right {
  align-self: flex-end;
  padding: 15px 70px 15px 20px;
  background-color:#d7eef5;
  text-align: left;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.avatar {
  border-radius: 50%;
  object-fit: cover;
  position: absolute;
  left: 10px;
  top: -10px;
  width: 50px;
  height: 50px;
  border: 2px solid #b8c4cc;
}

.message.right .avatar {
  left: auto;
  right: 10px;
  border-color: #5C8049;
}

.message p {
  margin: 0;
}

.text_input {
  font-size: 1rem;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px 15px;
  width: 100%;
}
.ava{
   border-radius: 100%;
  left: 1px;
  top: 1px;
  width: 58px;
  height: 58px;
}
.avata{
   border-radius: 100%;
  width: 40px;
  height: 40px;
}
p.profilebar{
  top:7.5vh;
}
.center { 
  height:auto;
  width:60vh;
  position: relative; 
}

.center p {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
</style>