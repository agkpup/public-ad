<template>
  <div>
        <div class="container-fluid">
    <form onsubmit="return false">
        <img class="rounded-circle mb-3 p-3" alt="140x140" style="width: 100px; height: 100px; margin-left: auto;display: block;margin-right: auto;width: 100px;  " src="https://png.pngtree.com/png-clipart/20190924/original/pngtree-user-vector-avatar-png-image_4830521.jpg"/>
        <center class="p-1 card mb-2">Sign Up</center>
        <div class="form-group"><input type="name" class="form-control" name="name" placeholder="Name" v-model="signUpDetail.nameG" autocomplete="off"/><small class="text-danger blink_me" v-if="!!signUpDetail.nameGerror">{{signUpDetail.nameGerror}}</small></div>
        <div class="form-group"><div class="input-group-prepend"><span class="input-group-text">+91</span> <input type="tel" class="form-control" autocomplete="off" name="mobile" placeholder="Mobile" v-model="signUpDetail.mobileG" /></div><small class="text-danger blink_me" v-if="!!signUpDetail.mobileGerror">{{signUpDetail.mobileGerror}}</small></div>
        <div class="form-group"><div class="input-group-append"><span class="input-group-text" @click="viewPass" autocomplete="off"><i class="fa fa-eye" aria-hidden="true"></i></span> <input type="password" id="pass1" class="form-control" name="password" placeholder="Password" v-model="signUpDetail.passwordG" /></div><small class="text-danger blink_me" v-if="!!signUpDetail.passwordGerror">{{signUpDetail.passwordGerror}}</small></div>
        <div class="form-group"><div class="input-group-append"><span class="input-group-text" @click="viewPass" autocomplete="off"><i class="fa fa-eye" aria-hidden="true"></i></span> <input type="password" id="pass2" class="form-control" name="password-repeat" placeholder="Password (repeat)" v-model="signUpDetail.rpasswordG" /></div><small class="text-danger blink_me" v-if="!!signUpDetail.rpasswordGerror">{{signUpDetail.rpasswordGerror}}</small></div>
        <div class="form-group">
            <div class="form-check"><label class="form-check-label"><input type="checkbox" class="form-check-input" v-model="signUpDetail.agreeG"/>I agree to the license terms.</label><small class="text-danger blink_me" v-if="!!signUpDetail.agreeGerror">{{signUpDetail.agreeGerror}}</small></div>
        </div>
        <div class="form-group"><button class="btn btn-primary btn-block" @click.prevent="sign_up">Sign Up</button></div>
        <a class="forgot" href="/signin"> Login ? Click Here</a>

    </form>
</div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            signUpDetail:{
          nameG:'',
          mobileG:'',
          passwordG:'',
          rpasswordG:'',
          agreeG:false,
          nameGerror:'',
          mobileGerror:'',
          passwordGerror:'',
          rpasswordGerror:'',
          agreeGerror:''
        },
        }
    },
methods:{
       viewPass(){
      var x = document.getElementById("pass1");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
  var y=document.getElementById("pass2");
  if (y.type === "password") {
    y.type = "text";
  } else {
    y.type = "password";
  }
    },
  validateSignUp(){
      if(!this.signUpDetail.nameG){
        this.signUpDetail.nameGerror = 'Empty Name'
      }else{
        this.signUpDetail.nameGerror = ''
      }
      if(!this.signUpDetail.mobileG){
        this.signUpDetail.mobileGerror='Empty Mobile Number'  
      }else{
        this.signUpDetail.mobileGerror=''
      }
      if(this.signUpDetail.passwordG.length<8){
        this.signUpDetail.passwordGerror ='Password must be 8 char'
      }else{
        this.signUpDetail.passwordGerror =''
      }
      if(this.signUpDetail.rpasswordG !== this.signUpDetail.passwordG ){
        this.signUpDetail.rpasswordGerror = 'password must match'
      }else{
         this.signUpDetail.rpasswordGerror = ''
      }
      if(this.signUpDetail.agreeG !==true){
        this.signUpDetail.agreeGerror = 'Check Licence Terms '
      }else{
           this.signUpDetail.agreeGerror = ''
      }
    },
  sign_up(){
      console.log('hey signning up');
      console.groupCollapsed(this.signUpDetail);
      this.validateSignUp();
      if(!!this.signUpDetail.nameG && !!this.signUpDetail.mobileG && !!(this.signUpDetail.passwordG.length>7) &&  !!(this.signUpDetail.rpasswordG == this.signUpDetail.passwordG ) && !!(this.signUpDetail.agreeG ==true) ){
        
        const data = {
          name:this.signUpDetail.nameG,
          mobile:this.signUpDetail.mobileG,
          password:this.signUpDetail.passwordG
        }
        //console.log(this.$store)
        this.$store.dispatch('register',data);
        this.$store.dispatch('postNotification',{msg:'waiting...',variant:'success'})
        .then(() => {
          this.signUpDetail.nameG='';
          this.signUpDetail.mobileG='';
          this.signUpDetail.passwordG='';
          this.signUpDetail.rpasswordG='';
          this.signUpDetail.agreeG=false;
        })
        
      }else{
        this.$store.dispatch('postNotification',{msg:'Error Siging up..',variant:'danger'})
      }
    },
}
}
</script>

<style scoped>
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
  margin: 0 0;
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