import request from '@/utils/request';

const loginApi = {
    userLogin: '/user/login',
    userRegistery: 'user/registry'
}

interface LoginAPI{
  phone:string
  password:string
}

interface RegistryAPI {
  phone:string
  password:string
  username:string
}

interface LoginResponse {
  code:string,
  msg:string,
  data:{
    accessToken:string
  }
}

class Service {



    static postLogin(data:LoginAPI){
        return request({
            url:loginApi.userLogin,
            method: 'POST',
            json: true,
            data
        }).then((res:LoginResponse)=>{

            console.log(res);

            sessionStorage.setItem('auth', 'true');
            sessionStorage.setItem('accessToken', res.data.accessToken);

            return Promise.resolve(res);
        })
    }

    static postRegistery(data:RegistryAPI){
        return request({
            url:loginApi.userRegistery,
            method: 'POST',
            json: true,
            data
        }).then((res:unknown)=>{
            console.log("Service:",res)

            return Promise.resolve(res);
        })
    }
}
export default Service;
