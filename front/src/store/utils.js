export function  loginUser(){
    return !!(JSON.parse(localStorage.getItem('PanjabUniversity')));
  }
export function admin(){
  return JSON.parse(localStorage.getItem('userDetail'))
}