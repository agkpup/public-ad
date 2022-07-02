<template>
  <div>
    <div class="fixed-top d-flex justify-content-start" style="margin-top:55px;">
  </div>
  <div v-if="!loaded" class="d-flex flex-row justify-content-center align-items-center" style="height: 50vh;">
  <div class="text-center">
 <loader/>
</div>
  </div>
<div v-else style="position:relative; margin-top:115px;">
 <div class="border border-info col blogSection" v-for="n in postData" :key="n.postId">
        <div class="badge badge-pill badge-light card p-1 m-1 text-wrap"> <router-link :to="{ path: '/profile?profileId='+n.userId }">{{n.name}} @{{n.city}} <small class="ml-1 mr-1">{{getTime(n.time)}}</small></router-link>  </div>
        <div class="row12">
        <a :href="'https://api.whatsapp.com/send?text='+getCurrentRoute+n.postId"  style="z-index:9999; width:30px; height:30px; margin-left:65vw;"  data-action="share/whatsapp/share"  
        target="_blank"><button class="btn btn-info"><i class="fa fa-whatsapp" aria-hidden="true"></i></button></a>
        <img :src="getImageUrl(n.img)"
         :id="n.id" :alt="n.postId" @click="modalView(n.postId,getImageUrl(n.img),n.message)"
          width="300" height="300" sizes="max-width:100px" style=" margin-left: auto;display: block;margin-right: auto;" class="img-fluid">
        </div>
      <div class="p-1" style="box-shadow: 0 4px 10px 0 rgba(0,0,0,0.2); margin-top:4px; background-color:white;"  v-if="n.message">
    <details>
  <summary class="text-wrap">message</summary>
  <p>{{n.message}}</p>
</details>
    </div>
     <div class="row-12 mt-2 pt-2 mb-3 pb-3 d-flex justify-content-around">
  <b-button variant="success" @click="callNum(n.mobile)"><i class="fa fa-phone mr-2" aria-hidden="true"></i>कॉल करे</b-button>
  <b-button variant="primary" @click="msgRoute(n.userId)"><i class="fa fa-commenting mr-2" aria-hidden="true"></i>संदेश करे</b-button>
        </div>
    </div>
<small class="text-info d-flex flex-row justify-content-center align-items-center card">
खोज परिणाम अंत
</small>
</div>

<!-- The Modal -->
<div ref="myModal" class="modal">
    <span class="close btn btn-danger" @click="closeModal">&times;</span>
  <img class="modal-content" ref="img01">
  <div ref="caption"></div>
</div>

  </div>
</template>

<script>
import loader from '@/components/pageLoader.vue'
import axios from 'axios'
export default {
mounted(){
this.loadPostMade();
},

computed:{
getCurrentRoute(){
  return window.location.href;
},
userId(){
      return this.$store.getters.userdetails.ID;
    },
},
data() {
  return {
    postData:[],
    loaded:false,
  }
},
methods:{
  modalView(id,src,alt){
    console.clear();
    //console.warn({id:id,src:src,alt:alt,modal:modalImg});
    var modal = this.$refs.myModal;
    var modalImg = this.$refs.img01;
    //console.log(modalImg)
    var captionText = this.$refs.caption;
    modal.style.display = "block";
     modalImg.id = id;
    modalImg.src = src;
    captionText.innerHTML = alt;
    //console.warn({id:id,src:src,alt:alt,modal:modalImg});
  },
  closeModal(val){
    var modal = this.$refs.myModal;
    modal.style.display = "none";
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
  loadPostMade(){
    axios.post('https://festalfactory.com:3000/upload/get',{city:localStorage.getItem('myCity')})
    .then((t)=>{
       this.postData=t.data.postData;
       this.loaded=true;
       console.log(t.data.postData)
    })
    .catch((e)=>{
       this.$store.dispatch('postNotification',{msg:'500 Something Error ',variant:'danger'});
       this.loaded=false;
    })
  },
  getImageUrl(src){
    return 'https://festalfactory.com:3000/'+src
},
  getTime(ms){
    var d = new Date(parseInt(ms));
    return d.toLocaleString() 
}
},
components:{
  loader
}
}
</script>

<style scoped>

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