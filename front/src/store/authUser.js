import axios from 'axios'
const state = {
    userLoggedIn:JSON.parse(localStorage.getItem('PanjabUniversity')),
    message:null,
    rmessage:null,
    userdetail:JSON.parse(localStorage.getItem('userDetail'))
}
const getters = {
   userdetails(state){
       return state.userdetail;
   },
   userLoggedIns(state){
       return state.userLoggedIn
   },
}
const mutations = {
SETUSER(state,data){
    if(!!data){
        localStorage.clear();
        localStorage.setItem('userDetail',JSON.stringify(data));
        localStorage.setItem('PanjabUniversity',!!data);
    }
},
async USERLOGOUT(state){
   await localStorage.removeItem('userDetail');
   await localStorage.removeItem('PanjabUniversity');
   await localStorage.clear();
   state.userLoggedIn = false;
   location.reload();
}
}
const actions = {
setuserlogin(context,data){context.commit('SETLOGIN',data)},
async login(context,data){
    //console.log('data recievd at store authuser',data);
   await axios.post('https://festalfactory.com:3000/auth/login',data)
    .then((res)=>{
        console.log('authUser res',res);
        context.commit('SETNOTIFICATIONMSG',res.data);
            //context.commit('SETMESSAGE',res.data.msg);
             context.commit('SETUSER',res.data.data);
    })
    .catch((err)=>{
        context.commit('SETNOTIFICATIONMSG',err.data);
    })
},
register(context,data){
    console.log('Vuex register data',data);
    axios.post('https://festalfactory.com:3000/auth/register',data)
    .then((res)=>{
        //console.log(res);
        context.commit('SETNOTIFICATIONMSG',res.data);
        setTimeout(()=>{
            location.href('/signin')
        },2000)
    })
    .catch((err)=>{
        context.commit('SETNOTIFICATIONMSG',err.data);
        //console.log(err);
        //console.log('error msg register',this.getters.rmessage)
    }) 
    
},
userLogout(context){
    context.commit('USERLOGOUT');
    context.commit('SETNOTIFICATIONMSG',{msg:'Loggin out...',variant:'danger'});
}
}
export default{
    state,
    getters,
    mutations,
    actions,
    axios
}