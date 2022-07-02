<template>
  <div class="pattern">
  <div class="fixed-top mt-1">
    <div v-if="this.$store.getters.notificationMsgs">
      <b-alert :variant="notificationMsg.variant" :show="!!notificationMsg" style="z-index:9999; position:absolute; display:block; width:100%;" block>
    {{notificationMsg.msg}}
  </b-alert>
    </div>
    <div class=" d-flex justify-content-around">
       <b-button v-b-modal.modalPopover class="rounded-circle" variant="outline-info">
  <img src="android-chrome-192x192.png" class="d-inline-block align-top " alt="brandImg" style="max-height:40px; max-width:40px;">
 </b-button>
    <div class="form-group"><b-button v-b-modal.locationModal class="rounded-circle d-flex justify-content-start ml-1 mr-1" variant="info" size="lg"> <i class="fa fa-map-marker" aria-hidden="true"></i></b-button></div>
    </div>
  </div>
  <b-modal id="modalPopover" title="" ok-only>
    <p class="fluid">
      <center><blockquote><span class="badge badge-pill badge-info">catch excellence</span></blockquote></center>
      देश विदेश में नौकरी पाना हुआ और आसान <br>
      <sub><small>Festalfactory private Limited</small> <br> <small>आजमगढ़ उत्तर प्रदेश</small></sub>
    </p>
  </b-modal>
  <b-modal id="locationModal" title="कृपया स्थान चुनें" ok-only>
     <form class="form-inline d-flex justify-content-end" onsubmit="return false">
    <b-col class="fluid"><input class="form-control form-control-sm" v-model.trim="city" :placeholder="!!myCity?myCity:'यहां स्थान तलाश करो'" /></b-col>
    <b-container class="fluid">
      <b-col v-for="n in options" :key="n.id" class="suggestions card p-1" @click="changePlaceData(n.name)">
          {{n.name}}  ({{n.state}})
      </b-col>
    </b-container>
   </form>
  </b-modal>
  <div class="container" style="margin-top:60px; margin-bottom:75px;">
  <router-view>
  </router-view>
  </div>
<div class="fixed-bottom">
<b-navbar  type="dark" variant="info" class="d-flex justify-content-around"> 
<b-navbar-brand class="d-flex justify-content-start" @click="goMessage()"><i class="fa fa-comments-o" aria-hidden="true"></i></b-navbar-brand> 
<b-navbar-brand class="d-flex justify-content-start" @click="goRecent()"><i class="fa fa-newspaper-o" aria-hidden="true"></i></b-navbar-brand> 
<b-navbar-brand class="d-flex justify-content-start" @click="goPost()"><i class="fa fa-plus" aria-hidden="true"></i></b-navbar-brand> 
<b-navbar-brand class="d-flex justify-content-start" @click="goList()"><i class="fa fa-list" aria-hidden="true"></i></b-navbar-brand> 
<b-navbar-brand class="d-flex justify-content-start" @click="goUser()"><i class="fa fa-user" aria-hidden="true"></i></b-navbar-brand> 

 </b-navbar>
</div>
<loader/>
  </div>
</template>

<script>
import loader from '@/components/pageLoader.vue'
export default {
data() {
  return {
    city:''
  }
},
mounted(){
console.log('LocalStorage AuthUser',this.$store.getters.userdetails);
console.log('user logged in',this.$store.getters.userLoggedIns);
console.log('Getting response from localstorage',localStorage.getItem('userToken'));
console.log('Getting response from localstorage about log in true false',localStorage.getItem('PanjabUniversity'));
},
watch:{
city(e){
    if(e.length>1){
       this.$store.dispatch('searchCities',`${e}`)
    }else{
      this.$store.dispatch('selectedCity');
        this.options=[]
    }
     console.log({data:e})
}
},
computed:{
  notificationMsg(){
    return this.$store.getters.notificationMsgs;
  },
  options(){
  return this.$store.getters.getCity;
  },
  myCity(){
    return localStorage.getItem('myCity')
  }
},
methods:{
  goMessage(){
this.$router.push({
  path:'/message'
})
  },
  goRecent(){
this.$router.push({
  path:'/'
})
  },
  goPost(){
this.$router.push({
  path:'/post'
})
  },
  goList(){
this.$router.push({
  path:'/dashboard'
})
  },
  goUser(){
this.$router.push({
  path:'/signin'
})
  },
  changePlaceData(data){
    this.city=data;
    localStorage.removeItem('myCity')
        localStorage.setItem('myCity',this.city)
        this.options=''
        setTimeout(() => {
          window.location.reload();
        }, 800);
      },
},
components:{
  loader
}
}
</script>

<style>
@import url(https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css);
body{
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='12' viewBox='0 0 20 12'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='charlie-brown' fill='%23434343' fill-opacity='0.4'%3E%3Cpath d='M9.8 12L0 2.2V.8l10 10 10-10v1.4L10.2 12h-.4zm-4 0L0 6.2V4.8L7.2 12H5.8zm8.4 0L20 6.2V4.8L12.8 12h1.4zM9.8 0l.2.2.2-.2h-.4zm-4 0L10 4.2 14.2 0h-1.4L10 2.8 7.2 0H5.8z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
background-attachment: fixed;
background-position:center;
object-fit:cover;
}
.pattern{
      background-image: repeating-linear-gradient(-45deg, rgba(255,255,255, 0.25), rgba(255,255,255, 0.25) 1px, transparent 1px, transparent 6px);
    background-size: 4px 4px;
}
body{
overflow-x: hidden;
}
.navbar-brand{
   border: 4px solid rgb(245, 238, 238);
  border-radius: 50%;
  padding: 8px;
   box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  transition: 0.2s;

}
.navbar-brand:active{
    box-shadow: 2 8px 16px 3 rgba(0,0,0,0.2);
  transform: translateY(-10px);
}
button{
  box-shadow: 0 16px 20px 0 rgba(238, 9, 9, 0.2);
}
button:hover{
  display: inline-block;
  position: relative;
  transition: 0.3s;
  padding-right: -20px;
}
button:after {
  content: '\00bb';
  position: absolute;
  opacity: 0;
  top: 0;
  right: -10px;
  transition: 0.5s;
}
button:active {
  box-shadow: 0 5px #666;
  transform: translateY(8px);
}
div.absol{
overflow-y: auto;
overflow-x:hidden;
/*height:80vh; */
  width:90vw;
  /*border: 1px solid #4CAF50; */
  box-shadow: 0 2px 12px 0 rgba(56, 54, 56, 0.2);
}
input{
   box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
}
.suggestions:hover {
cursor: pointer;
  background-color: #5bc0de;
}
</style>