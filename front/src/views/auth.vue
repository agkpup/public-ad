<template>
<div>
  <div class="container-fluid" v-if="!this.$store.getters.userLoggedIns"
  >
    <center class="card m-3 p-3 jumbotron d-flex align-items-center">
      PLEASE LOGIN TO CONTINUE >...
    </center>
  </div>
  <div class="container-fluid" v-else> <!-- !!this.$store.getters.userLoggedIns-->
  <center>
  <div class="text-center card">
  <div class="mt-4 mb-4">
                  <div class="image-upload">  
                  <label for="file-input">
                    <b-overlay :show="showProfileLoader" class="d-inline-block" rounded="circle">
                    <img class="rounded-circle" id="imageFile" alt="140x140" style="width: 180px; height: 180px;"  @mouseover="changeprofileMessage()" :src="profileImage"/>
                  </b-overlay>
                  </label>
                <input id="file-input"  type="file" @change="fileFunction"/>
                </div>
                <div v-if="!!admin_id && !!secretkey">
                <b-badge variant="info" class="p-1 m-1 ml-4 mr-4">{{this.$store.getters.userdetails.roll_as}}</b-badge> <br>
                <b-button variant="primary" @click="routeToAdmin" class="m-1 p-1 btn btn-sm">Admin Section</b-button>
                </div>
            <h5 class="mt-4 pb-1 pt-1 mb-4  card" style="font-weight:bold;text-decoration: underline; margin:+10%;">{{this.$store.getters.userdetails.Name}}</h5> <!--{{this.$store.getters.userdetails.Name}} -->
            <small class="card ml-4 mr-4">ID:{{this.$store.getters.userdetails.ID}} </small> <!-- {{this.$store.getters.userdetails.ID}} -->
           <div class="form-group m-3"><input  class="form-control" name="nameAdress" :placeholder="[!!mohalla?mohalla:'मेरा पता...मोहल्ला']" v-model="moha" autocomplete="off"/><small class="text-danger blink_me" v-if="!moha">'मेरा पता...मोहल्ला दर्ज करें'</small></div>
             <div class="form-group m-3">
    <b-form-input list="input-list"  v-model="city" id="input-with-list" :placeholder="[!!cit?cit:'जिला क्षेत्र का चयन करें']" autocomplete="off"></b-form-input>
    <small class="text-danger blink_me" v-if="!city">कृपया जिला क्षेत्र चुनें</small>
    <div v-for="n in options" :key="n.id" class="suggestions card p-1" @click="changePlaceData(n.name)">{{n.name}}  ({{n.state}})</div>
  </div>
           <div class="form-group m-3"><input type="textbox"  class="form-control" name="name" :placeholder="[!!about?about:'मेरे बारे में...']" v-model="abou" autocomplete="off"/><small class="text-danger blink_me" v-if="!abou">'मेरे बारे में... दर्ज करें'</small></div>
           
           <b-overlay :show="nextUpdateProgress" class="d-inline-block">
           <b-button variant="outline-info" @click="updateDetails()"><i class="fa fa-refresh p-1 m-1" aria-hidden="true">Update...</i></b-button>
           </b-overlay> <br> <hr>
            <b-button variant="outline-danger" fill @click="logOut()"><i class="fa fa-sign-out" aria-hidden="true"></i>Sign Out</b-button>
          </div>
          </div>
          </center>
  </div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
data() {
    return {
        nextUpdateProgress:false,
        showProfileLoader:false,
        showProfileChangeMessage:false,
        loggedIn:false,
        profileName:'',
        city:'',
        moha:'',
        abou:''
    }
},
watch:{
    city(e){
    if(!!this.city){
      if(e.length>1){
       this.$store.dispatch('searchCities',`${e}`)
    }else{
      this.$store.dispatch('selectedCity');
        this.options=[]
    }
    }
     console.log({data:e})
    } 
  },
  mounted(){
    this.city=this.cit;
    this.moha=this.mohalla;
    this.abou=this.about;
  },
  computed:{
          profileImage(){
                  return 'https://festalfactory.com:3000/'+this.$store.getters.userdetails.image
                },
          options:{
                get(){ return this.$store.getters.getCity; },
                set(e){ console.log(e) }
            },
          userId(){
                  return this.$store.getters.userdetails.ID;
                },
                userToken(){
              return this.$store.getters.userdetails.token
            },
          mohalla(){
                 return this.$store.getters.userdetails.address;
                },
          cit(){  
                 return this.$store.getters.userdetails.city;
              },
          about(){
                 return this.$store.getters.userdetails.about;
                },
          admin_id(){
            return this.$store.getters.userdetails.admin_id
          },
          secretkey(){
            return this.$store.getters.userdetails.zxcvbnmlkjhgfdsapoiuytrewq;
          }      
  },
methods:{
  fileFunction(v){
     var reader = new FileReader();
    reader.onload = function(){
      var output = document.getElementById('imageFile');
      output.src = reader.result;
      this.profileImage=reader.result;
      this.profileName=v.target.files[0].name;
      console.log({'profileImage':this.profileImage,profileName:this.profileName})
    };
    reader.readAsDataURL(v.target.files[0]);
    this.showProfileLoader=true;
    setTimeout(()=>{
      axios.post('https://festalfactory.com:3000/upload/saveUserProfile',{token:this.userToken,image:reader.profileImage,imageName:reader.profileName,id:this.userId,})
      .then((r)=>{
        this.$store.dispatch('postNotification',{msg:r.data.msg,variant:r.data.variant})
         this.showProfileLoader=false;
      })
      .catch((r)=>{
        this.$store.dispatch('postNotification',{msg:r.data.msg,variant:r.data.variant})
        this.showProfileLoader=false;
      })
    },1000)
  },
    changeprofileMessage(){
      this.$store.dispatch('postNotification',{msg:'Click change profile pic',variant:'info'})
    },
    logOut(){
      this.$store.dispatch('userLogout');
    },
     changePlaceData(data){
        //this.$store.getters.userdetails.city=data;
        this.city=data;
        this.$store.dispatch('selectedCity');
        this.options=[]
      },
      updateDetails(){
          if(!this.city || !this.abou || !this.moha){
            this.$store.dispatch('postNotification',{msg:'Please fill All the field',variant:'info'})
            console.log({city:this.city,about:this.abou,mohalla:this.moha})
          }else{
            const data = {token:this.userToken,id:this.userId,city:this.city,about:this.abou,mohalla:this.moha};
             this.nextUpdateProgress=true;
               axios.post('https://festalfactory.com:3000/upload/saveUserMoreData',data)
               .then((r)=>{
                 this.$store.dispatch('postNotification',{msg:r.data.msg,variant:r.data.variant})
                 this.nextUpdateProgress=false;
                 //window.alert(r)
               })
               .catch((e)=>{
                 //window.alert(e)
                 this.nextUpdateProgress=false;
                 this.$store.dispatch('postNotification',{msg:e.data.msg,variant:e.data.variant})
               })
          }
         
      },
      routeToAdmin(){
        this.$router.push({
          path:'/admin'
        })
      }
}
}
</script>

<style>
.image-upload>input {
  display: none;
}
img{
  border: 1px solid #ddd;
  padding: 5px;
  border-radius: 4px;
}
.login-clean form {
  max-width: 320px;
  width: 90%;
  margin: 0 auto;
  background-color: #ffffff;
  padding: 40px;
  border-radius: 4px;
  color: #505e6c;
  box-shadow: 1px 1px 5px rgba(0,0,0,0.1);
}
.blink_me {
  animation: blinker 1s linear infinite;
}

@keyframes blinker {  
  50% { opacity: 0; }
}

</style>