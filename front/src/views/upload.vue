
<template>
  <div>
    <div class="center" v-if="!this.$store.getters.userLoggedIns" >
  <div class="card mt-1 mb-1 ml-2 mr-1"><i class="fa fa-lock mr-2" aria-hidden="true"></i>Please LogIn to continue</div>
</div>
<div v-else>
<div  class="drop display-inline align-center" @dragover.prevent @drop="onDrop">
    <div class="helper"></div> 
	  <label v-if="!image" class="btn display-inline">
	        SELECT OR DROP AN IMAGE
	        <input type="file" name="image_name" @change="onChange" accept="image/*"/>
</label> 
        <div class="hidden display-inline align-center" v-else v-bind:class="{ 'image': true }">
        <img :src="image" alt="" class="img" />
        <button class="btn btn-success" @click.once="removeFile">REMOVE</button>
      </div>
  </div>
  <small class="text-danger blink_me" v-if="!image||!image_name||!file_">कृपया फोटो चुनें </small>

  <div class="mt-4 pt-4">
  <form method="" onsubmit="return false">
    <div class="form-group">
     <label for="input-with-list float-left"> <strong> खोज स्थान जहां दिखाना है </strong></label>
    <b-form-input list="input-list" v-model="city" id="input-with-list" placeholder="यहां स्थान तलाश करो" autocomplete="off"></b-form-input>
    <small class="text-danger blink_me" v-if="!city">कृपया जगह चुनें</small>
    <div v-for="n in options" :key="n.id" class="suggestions card p-1" @click="changePlaceData(n.name)">{{n.name}}  ({{n.state}})</div>
  </div>
   <label for="input-with-list float-left"><strong>इस पोस्ट के साथ कुछ लिखो</strong></label>
      <div class="form-group"><textarea class="form-control" v-model="message" placeholder="Message" rows="14"></textarea></div>
    <div class="form-group">
        <button class="btn btn-primary btn-block mr-2 ml-2 mt-3 mb-2 rounded" type="submit" @click.once="clickedForPosted='true',sendToDatabase()">
          <div v-if="clickedForPosted">
            <b-spinner small type="grow"></b-spinner>
            <b-spinner small type="grow"></b-spinner>
            <b-spinner small type="grow"></b-spinner>
          </div>
          <div v-else>Post</div>
        </button>    
     </div>
</form>
  </div>
  </div>
  </div>
</template>


<script>
/* eslint-disable */
import axios from 'axios'
export default {
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
  data() {
    return {
     image: '',
     file_:'',
     image_name:'',
     clickedForPosted:false,
     city:'',
     message:''
    }
  },
  mounted(){
  console.log('upload.vue userToken',this.userToken)
  },
  /*eslint no-mixed-spaces-and-tabs: ["error", "smart-tabs"]*/
  computed:{
options(){
  return this.$store.getters.getCity;
},
userToken(){
  return this.$store.getters.userdetails.token
}
  },
  updated(){
//console.log({citylist:this.options})
  },
methods: {
      onDrop: function(e) {
        e.stopPropagation();
        e.preventDefault();
        var files = e.dataTransfer.files;
        this.createFile(files[0]);
      },
      onChange(e) {
        var files = e.target.files;
        this.createFile(files[0]);
      },
      createFile(file) {
        console.log({original:file.size / 1024 })
        if (!file.type.match('image.*')) {
          alert('Select an image');
          return;
        }
        this.file_ = file;
        this.image_name = file.name;
        //var img = new Image();
        var reader = new FileReader();
        var vm = this;

        reader.onload = function(e) {
          vm.image = e.target.result;
          if((file.size / 1024)>30){
          alert('Image must be lesser than 30KB');
          setTimeout(()=>{
            vm.image ='',
             this.file_ = ''
          },1500)
        }
          
        }
        reader.readAsDataURL(file);
      },
      removeFile() {
        this.image = '';
        this.file_ = '';
      },
      changePlaceData(data){
        
        this.city=data;
        this.$store.dispatch('selectedCity');
        this.options=[]
      },
      sendToDatabase(){
       if(!this.image||!this.file_||!this.image_name||!this.city){
          this.$store.dispatch('postNotification',{msg:'please fill all field',variant:'danger'})
       }else{
          const data ={
          image:[
            {
               image:this.image,
               file_:this.file_,
               image_name:this.image_name,
            }
          ],
          city:this.city,
          message:this.message,
          userId:this.$store.getters.userdetails.ID,
          token:this.userToken
        }
        axios.post('https://festalfactory.com:3000/upload',data)
        .then((e)=>{
          console.log({success:e})
          this.$store.dispatch('postNotification',{msg:e.data.msg,variant:e.data.variant});
               this.image=''
               this.file_=''
               this.image_name=''
               this.city=''
               this.message=''
               this.clickedForPosted=false;
        })
        .catch((e)=>{
          this.$store.dispatch('postNotification',{msg:e.data.msg,variant:e.data.variant});
              this.image=''
               this.file_=''
               this.image_name=''
               this.city=''
               this.message=''
        })
        //console.log({sendToDatabase:data})
       }
      }
    }
}
</script>

<style scoped>
* {
  font-family: "Arial";
  font-size: 12px;
  overflow-x:hidden;
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
*,
*:after,
*:before {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-touch-callout: none;
}

html, body {
  height: 100%;
  text-align: center;
}

.btn {
  background-color: royalblue;
  border: 100%;
  color: #fff;
  cursor: pointer;
  display: inline-block;
  font-weight: bold;
  padding: 15px 35px;
  margin:20px;
  position: relative;
}
.btn:active {
  box-shadow: 0 4px #999;
  transform: translateY(4px);  
}
.btn-success{
  background-color: orange;
  border: 100%;
  color: #fff;
  margin:20px;
  cursor: pointer;
  display: inline-block;
  font-weight: bold;
  padding: 15px 35px;
  position: relative;
}

.btn:hover {
  background-color:rgb(0, 173, 9);
}

input[type=file] {
  position: absolute;
  opacity: 0;
  z-index: -1;
}

.align-center {
  text-align: center;
}

.helper {
  height: 100%;
  display: inline-block;
  vertical-align: middle;
  width: 0;
}

.hidden {
  display: none !important;
}

.hidden.image {
  display: inline-block !important;
}

.display-inline {
  display: inline-block;
  vertical-align: middle;
}

.img {
  border: 1px solid #f6f6f6;
  display: inline-block;
  height: auto;
  max-height: 100%;
  max-width: 100%;
  width: auto;
}

.drop {
  background-color: red;
  border: 4px dashed #ccc;
  background-color: #f6f6f6;
  border-radius: 2px;
  height: 100%;
  max-height: auto;
  max-width: auto;
  width: 100%;
}
.suggestions:hover {
cursor: pointer;
  background-color: #5bc0de;
}
.blink_me {
  animation: blinker 1s linear infinite;
}

@keyframes blinker {  
  50% { opacity: 0; }
}

</style>