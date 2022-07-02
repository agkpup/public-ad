<template>
<div>
<div v-if="!!profileId">
    <b-card class="text-center">
    <div class="bg-primary text-light fluid p-4 m-2 text-wrap" v-for="n in about" :key="n.id">
     <center>
        <b-row> <small>[{{n.id}}]</small><h4 class="text-white" v-if="n.name">{{n.name}}</h4><i v-if="n.verified" class="fa fa-check-circle-o p-1 m-1 btn btn-success" aria-hidden="true"></i></b-row>
         <b-row  v-if="n.address">{{n.address}}</b-row>
         <b-row  v-if="n.about">{{n.about}}</b-row>
     </center>
    </div>
  </b-card>
<div v-if="postData.length==0">
<div class="text-center">
  <b-badge variant="info" class="p-2 m-4"> Made Zero Post . . .</b-badge>
</div>
</div>
<div v-else class="row mt-2 mb-2 pt-3 pb-3 box" v-for="n in postData" :key="n.userId">
    <div class="col">
    <div class="badge badge-pill badge-info p-1 m-1"> <span class="mr-1 ml-1">{{n.time}}</span> </div>
     <img :src="getImageUrl(n.img)"
         :id="n.postId" :alt="n.postId" @click="modalView(n.postId,getImageUrl(n.img),n.postId)"
          width="300" height="300" sizes="max-width:100px" style=" margin-left: auto;display: block;margin-right: auto;">
    </div>
    <div class="col float-right m-1">
    <div class="card p-1 m-1">
    <details>
  <p>{{n.message}}</p>
</details>
    </div>
    <div class="row-12 mt-2 pt-2 mb-3 pb-3 d-flex justify-content-around">
     <b-button variant="success" @click="callNum(n.mobile)"><i class="fa fa-phone mr-2" aria-hidden="true"></i>कॉल करे</b-button>
  <b-button variant="primary" @click="msgRoute(n.userId)"><i class="fa fa-commenting mr-2" aria-hidden="true"></i>संदेश करे</b-button>
       </div>
    </div>     
</div>
<!-- The Modal -->
<div ref="myModalProfile" class="modal">
    <span class="close btn btn-danger" @click="closeModal">&times;</span>
  <img class="modal-content" ref="imgProfile">
  <div ref="captionProfile"></div>
</div>
</div>
<div v-else class="container-fluid">
<errorsec/>
</div>
</div>
</template>

<script>
import errorsec from './error.vue'
import axios from 'axios'
export default {
  metaInfo: {
        vmid: 'description',
        name: 'description',
        content: 'आपकी सेवा हमारा धर्म '
  },
  data() {
    return {
      postData:[],
    loaded:false,
    about:[]
    }
  },
  updated(){
this.$refs.alertBoz.focus();
  },
  mounted(){
    if(this.profileId){
      this.loadPage();
    this.loadAbout();
    }
  },
  computed:{
      profileId(){
          return this.$route.query.profileId
      },
    userToken(){
  return this.$store.getters.userdetails.token
}
  },
methods:{
  modalView(id,src,alt){
    console.clear();
    console.warn(id);
    var modal = this.$refs.myModalProfile;
    var modalImg = this.$refs.imgProfile;
    var captionText = this.$refs.captionProfile;
    modal.style.display = "block";
    modalImg.src = src;
    modalImg.id = id;
    captionText.innerHTML = alt;
  },
    callNum(num){
  window.open(`tel:${num}`);
  },
  msgRoute(id){
   this.$router.push({
     path:'/message',
     query: { msg_to:id}
   })
  },
  closeModal(val){
    var modal = this.$refs.myModalProfile;
    modal.style.display = "none";
  },
  deleted(){

  },
  loadPage(){
      console.log({profileId:this.profileId})
    axios.post('https://festalfactory.com:3000/profile',{profileId:this.profileId})
    .then((r1)=>{
      console.log({r1:r1});
      this.postData=r1.data.postData;

    })
    .catch((e1)=>{
      console.log({e1:e1})
      this.$store.dispatch('postNotification',{msg:'500 Something Error ',variant:'danger'});
    })
  },
  getImageUrl(src){
  return 'https://festalfactory.com:3000/'+src
},
overlay(id){
  console.log('id',id);
axios.post('https://festalfactory.com:3000/dashboard/delete',{postId:id,token:this.userToken})
    .then((r1)=>{
      console.log({'dlt r1':r1});
      this.$store.dispatch('postNotification',{msg:r1.data.msg,variant:r1.data.variant});
      window.location.reload();
    })
    .catch((e1)=>{
      console.log({'dlt e1':e1})
      this.$store.dispatch('postNotification',{msg:e1.data.msg,variant:e1.data.variant});
    })

},
loadAbout(){
    axios.post('https://festalfactory.com:3000/getProfileData',{profileId:this.profileId})
    .then((r1)=>{
        this.about=r1.data
        console.log({'pageLoad':this.about})
    })
    .catch((e)=>{
        console.log({'/profile.vue in view':e})
    })
}
},
components:{
  errorsec
}
}
</script>

<style scoped>
.textlist{
    object-fit: fill;
    text-align: end;
    margin:8px;
    padding:4px;
}
.box{
      box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  transition: 0.3s;
  background-color: whitesmoke;
}
.box:hover{
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
}
.avat {
  border-radius: 50%;
  float: left;
  top:-2px;
  position: relative;
  width: 70px;
  height: 70px;
  border: 4px solid #9ea0a1;
}
.ava{
   border-radius: 100%;
  left: 1px;
  top: 1px;
  width: 58px;
  height: 58px;
}
div.blogSection{
      box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
        transition: 0.3s;
        margin:1px;
        margin-bottom: 2px;
}
div.img {
    display: block;
    width: 85vw;
    height: auto;
    border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
}
div.img:hover {opacity:1;}

/* The Modal (background) */
.modal {
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  padding-top: 100px; /* Location of the box */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.9); /* Black w/ opacity */
}

/* Modal Content (image) */
.modal-content {
  margin: auto;
  display: block;
  width: 80%;
  max-width: 700px;
}

/* Caption of Modal Image */
#caption {
  margin: auto;
  display: block;
  width: 80%;
  max-width: 700px;
  text-align: center;
  color: #ccc;
  padding: 10px 0;
  height: 150px;
}

/* Add Animation */
.modal-content, #caption {  
  -webkit-animation-name: zoom;
  -webkit-animation-duration: 0.6s;
  animation-name: zoom;
  animation-duration: 0.6s;
}

@-webkit-keyframes zoom {
  from {-webkit-transform:scale(0)} 
  to {-webkit-transform:scale(1)}
}

@keyframes zoom {
  from {transform:scale(0)} 
  to {transform:scale(1)}
}

/* The Close Button */
.close {
  position: absolute;
  top: 100px;
  right: 15px;
  color: #f1f1f1;
  font-size: 40px;
  font-weight: bold;
  transition: 0.3s;
  z-index: 9999;
}

.close:hover,
.close:focus {
  color: #bbb;
  text-decoration: none;
  cursor: pointer;
}

/* 100% Image Width on Smaller Screens */
@media only screen and (max-width: 700px){
  .modal-content {
    width: 100%;
  }
}
</style>