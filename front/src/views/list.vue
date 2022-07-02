<template>
<div>
<div v-if="postData.length==0">
<div class="text-center">
  <b-badge variant="info" class="p-2 m-4">You Made Zero Post . . .</b-badge>
</div>
</div>
<div v-else class="row mt-2 mb-2 pt-3 pb-3 box" v-for="n in postData" :key="n.userId">
    <div class="col">
    <div class="badge badge-pill badge-info p-1 m-1"> <span class="mr-1 ml-1">{{getTime(n.time)}}</span> </div>
     <img :src="getImageUrl(n.img)"
         :id="n.postId" :alt="n.postId" @click="modalView(n.postId,getImageUrl(n.img),n.postId)"
          width="300" height="300" sizes="max-width:100px" style=" margin-left: auto;display: block;margin-right: auto;" class="img-fluid">
    </div>
    <div class="col float-right m-1">
    <div class="card p-1 m-1">
    <details>
  <p class="text-wrap">{{n.message}}</p>
</details>
    </div>
    <div>
    <b-button variant="success" block disabled><i class="fa fa-bar-chart m-1" aria-hidden="true"></i>promote</b-button>
    <b-button variant="danger" block @click="overlay(n.postId,n.img)"> <i class="fa fa-trash-o m-1" aria-hidden="true"></i> remove</b-button>
    <small class="text-danger">Double click to delete</small>
       </div>
    </div>     
</div>
<!-- The Modal -->
<div ref="myModalList" class="modal">
    <span class="close btn btn-danger" @click="closeModal">&times;</span>
  <img class="modal-content" ref="imgList">
  <div ref="captionList"></div>
</div>
</div>
</template>

<script>
import axios from 'axios'
import pageLoader from '@/components/pageLoader.vue';
export default {
  data() {
    return {
      postData:[],
    loaded:false,
    }
  },
  mounted(){
    this.loadPage();
  },
  computed:{
userId(){
      return this.$store.getters.userdetails.ID;
    },
    userToken(){
  return this.$store.getters.userdetails.token
}
  },
methods:{
  modalView(id,src,alt){
    console.clear();
    console.warn(id);
    var modal = this.$refs.myModalList;
    var modalImg = this.$refs.imgList;
    var captionText = this.$refs.captionList;
    modal.style.display = "block";
    modalImg.src = src;
    modalImg.id = id;
    captionText.innerHTML = alt;
  },
  closeModal(val){
    var modal = this.$refs.myModalList;
    modal.style.display = "none";
  },
  deleted(){

  },
  loadPage(){
    axios.post('https://festalfactory.com:3000/dashboard',{userId:this.userId,token:this.userToken})
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
overlay(id,imgUrl){
  console.log('id',id);
axios.post('https://festalfactory.com:3000/dashboard/delete',{postId:id,token:this.userToken,imgUrl:imgUrl})
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
getTime(ms){
    var d = new Date(parseInt(ms));
    return d.toLocaleString() 
}
},
components:{
  pageLoader
}
}
</script>

<style scoped>
@import url(https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css);
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