<template>
  <div>
        <section class="login-clean">
    <form onsubmit="return false">
        <img class="rounded-circle mb-1" alt="140x140" style=" margin-left: auto;display: block;margin-right: auto;width: 100px; height: 100px;" src="https://png.pngtree.com/png-clipart/20190924/original/pngtree-user-vector-avatar-png-image_4830521.jpg"/>      
        <div class="form-group"><div class="input-group-prepend"><span class="input-group-text">+91</span> <input type="tel" class="form-control" name="login-mobile" placeholder="Login Mobile" v-model="loginDetail.mobileG" autocomplete="off"/></div><small class="text-danger blink_me" v-if="!!loginDetail.mobileGerror">{{loginDetail.mobileGerror}}</small></div>
         <div class="form-group"><div class="input-group-append"><span class="input-group-text" @click="viewPass"><i class="fa fa-eye" aria-hidden="true"></i></span> <input type="password" id="pass3" class="form-control" name="password-login" placeholder="Login Password" v-model="loginDetail.passwordG" autocomplete="off"/></div><small class="text-danger blink_me" v-if="!!loginDetail.passwordGerror">{{loginDetail.passwordGerror}}</small></div>
        <div class="form-group"><button class="btn btn-primary btn-block" type="submit" @click="LogIn()">Log In</button></div>
        <a class="forgot" href="/signup"> Want A new Account ? Click Here</a>
    </form>
</section>
  </div>
</template>

<script>
export default {
data() {
    return {
        loginDetail:{
          mobileG:'',
          passwordG:'',
          mobileGerror:'',
          passwordGerror:''
        }
    }
},
methods:{
   viewPass(){
      var x = document.getElementById("pass3");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
    },
    validateeLogIn(){
      if(this.loginDetail.mobileG.length !==10){
        this.loginDetail.mobileGerror='Login mobile must be 10 digit'
      }else{
        this.loginDetail.mobileGerror=''
      }
      if(this.loginDetail.passwordG.length<8){
        this.loginDetail.passwordGerror='Password must be 8 char'
      }else{
          this.loginDetail.passwordGerror=''
      }
    },
    LogIn(){
      this.validateeLogIn();
      //console.warn(this.loginDetail);
      if(this.loginDetail.mobileG.length == 10 && this.loginDetail.passwordG.length>7){
          this.$store.dispatch('postNotification',{msg:'Loggin in..',variant:'success'});
          const data = {
            mobile:this.loginDetail.mobileG ,
            password:this.loginDetail.passwordG ,
          }
          this.$store.dispatch('login',data)
          .then(()=>{
            this.loginDetail.mobileG='',
          this.loginDetail.passwordG=''
          setTimeout(()=>{
            location.reload();
          },2000)
          })
      }else{
  this.$store.dispatch('postNotification',{msg:'Error Siging In..',variant:'danger'})
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