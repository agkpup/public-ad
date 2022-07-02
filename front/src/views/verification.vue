<template>
  <div>
    <b-table :items="items" :fields="fields" striped responsive="sm" head-variant="dark" table-variant="info" borderless>
      <template #cell(show_details)="row">
        <b-button size="sm" variant="primary" @click="row.toggleDetails" class="mr-2">
          {{ row.detailsShowing ? 'Hide' : 'Show'}} Details
        </b-button>
      </template>

      <template #row-details="row">
        <b-card>
            <b-button size="sm" class="float-right float-top" variant="warning" @click="row.toggleDetails">Hide Details</b-button>
          <b-row class="mb-2">
            <b-col sm="5" class="text-sm-right">
                <small class="bg-info float-left">27 march 2020</small>
                <img :src="getImageUrl(row.item.img)"
                :id="row.item.postId" :alt="row.item.postId" @click="modalView(row.item.postId,getImageUrl(row.item.img),row.item.message)"
                 width="300" height="300" sizes="max-width:100px" style=" margin-left: auto;display: block;margin-right: auto;" class="img-fluid">
            </b-col>
            <b-col sm="5">
                <b-row>
                    <details class="card p-2">
                        <summary>message</summary>
                        <p>{{row.item.message}}.</p>
                    </details>
                </b-row>
                <b-row><p class="p-1 m-1 bg-secondary"><i class="fa fa-location-arrow m-1" aria-hidden="true"></i>{{row.item.adAdress}}</p></b-row>
            </b-col>
            <b-col sm="2" class="mt-4">
            <b-row><b-button variant="info" class="m-2 btn btn-block" @click="msgRoute(row.item.id)"><i class="fa fa-comments m-1" aria-hidden="true"></i>Message</b-button></b-row>
            <b-row><b-button variant="success" class="m-2  btn btn-block" @click="accepting(row.item.postId)"><i class="fa fa-check-circle-o m-1" aria-hidden="true"></i>Accept</b-button></b-row>
            <b-row><b-button variant="danger" class="m-2  btn btn-block" @click="rejecting(row.item.postId,row.item.img)"><i class="fa fa-ban m-1" aria-hidden="true"></i>Reject</b-button></b-row>
            </b-col>
          </b-row>
          
        </b-card>
      </template>
    </b-table>
    <div v-if="items.length==0 || !items" class="card p-2 m-3 bg-danger h6 text-white"> <center>Sorry Nothing to Accept</center> </div>
    <div ref="myModalv" class="modal">
    <span class="close btn btn-danger" @click="closeModal">&times;</span>
  <img class="modal-content" ref="imgv">
  <div ref="captionv"></div>
</div>
  </div>
</template>

<script>
import axios from 'axios'
  export default {
    mounted(){
    this.loadPage();
    },
    data() {
      return {
        fields: ['postId', 'name','native_city','address','show_details'],
        items: []
        /*  { postId: 40, name: 'Dickerson',native_city: 'Macdonald',address:'My address 1',img:'contact.gif',message:'hey whats up',adAdress:'varanasi'},
          { postId: 21, name: 'Larsen', native_city: 'Shaw',address:'mu address 2',img:'contact.gif',message:'hey whats up',adAdress:'varanasi'}, */
      }
    },
    computed:{
        userToken(){
                    return this.$store.getters.userdetails.token
                    }
    },
    methods:{
        msgRoute(id){
   this.$router.push({
     path:'/message',
     query: { msg_to:id}
   })
  },
        modalView(id,src,alt){
    console.clear();
    //console.warn({id:id,src:src,alt:alt,modal:modalImg});
    var modal = this.$refs.myModalv;
    var modalImg = this.$refs.imgv;
    //console.log(modalImg)
    var captionText = this.$refs.captionv;
    modal.style.display = "block";
     modalImg.id = id;
    modalImg.src = src;
    captionText.innerHTML = alt;
  },
  closeModal(val){
    var modal = this.$refs.myModalv;
    modal.style.display = "none";
  },
   getImageUrl(src){
    return 'https://festalfactory.com:3000/'+src
},
loadPage(){
    axios.post('https://festalfactory.com:3000/upload/verification',{token:this.userToken})
    .then((r)=>{
         this.items=r.data.postData;
        console.log({verification:r.data.postData})
    })
    .catch((e)=>{
        console.log(e)
    })
},
makeToast(variant,title,content) {
        this.$bvToast.toast(content, {
          title: title,
          variant: variant,
          solid: true
        })
      },
accepting(postId){
    console.log(postId)
    axios.post('https://festalfactory.com:3000/upload/verification/accept',{token:this.userToken,postId})
    .then((r)=>{
        console.log({'verification Accept':r.data})
        this.makeToast(r.data.variant,'Accept Request',r.data.msg)
        window.location.reload();
    })
    .catch((e)=>{
        console.log({'verification Accept Error':e.data})
        this.makeToast(e.data.variant,'Accept request',e.data.msg)
    })
},
rejecting(postId,imgUrl){
     console.log(postId)
    axios.post('https://festalfactory.com:3000/upload/verification/reject',{token:this.userToken,postId,imgUrl:imgUrl})
    .then((r)=>{
        console.log({'verification Accept':r.data})
        this.makeToast(r.data.variant,'Delete Request',r.data.msg)
       setTimeout(()=>{
            window.location.reload();
       },2000)
    })
    .catch((e)=>{
        console.log({'verification Accept Error':e.data})
        this.makeToast(e.data.variant,'Delete Request',e.data.msg)
    })
}
    }
  }
</script>
<style scoped>
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