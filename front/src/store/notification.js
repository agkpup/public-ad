import axios from 'axios'
const state = {
    notificationMsg:{
        msg:'',
        variant:''
      } 
}
const getters = {
notificationMsgs(state){
    return state.notificationMsg;
}
}
const mutations = {
SETNOTIFICATIONMSG(state,data){
    if(!!data){
    state.notificationMsg.msg = data.msg;
    state.notificationMsg.variant = data.variant;
    console.log({'notification message':state.notificationMsg})
    var audio = new Audio('./sound/ntf.mp3');
    audio.play();
    setTimeout(()=>{
        state.notificationMsg.msg = '';
        state.notificationMsg.variant = '';   
    },3000)

    }
    
}
}
const actions = {
    postNotification(context,data){
      /*console.log('SETNOTIFICATIONMSG',data); */
        context.commit('SETNOTIFICATIONMSG',data);
    }
}
export default{
    state,
    getters,
    mutations,
    actions,
    axios
}