import  Axios from 'axios'
import type {  Method, ResponseType, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import router from '@/router'
import { MsgErr, MsgInfo, MsgWarning } from './message'
import globalConfig from '@/globalConfig'
interface IAxiosData {
  url: string
  method: Method
  headers?: unknown
  json: boolean
  contentType?: string
  data?: unknown
  params?: unknown
  timeout?: number
  responseType?: ResponseType
}

export interface Response<T>{
  code:number
  msg:string
  data:T
}

const axios = Axios.create({
  baseURL: globalConfig.BASE_API, //注释此行以启用mock
  timeout: 20000
})

//const cancelTokenSource = Axios.CancelToken.source();

// 允许携带cookie
axios.defaults.withCredentials = true
// 请求头信息
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
// 默认使用 application/json 形式
axios.defaults.headers.post['Content-Type'] = 'application/json'

// 请求拦截器。用于在请求头嵌入Token
axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (sessionStorage.getItem('accessToken')) {
      config.headers.token = `${sessionStorage.getItem('accessToken')}`
    }
    return config
  },
  (err) => Promise.reject(err)
)


const handleResponse = (res)=>{
  if (!res.data.code || !res.data.msg) {
    MsgErr("返回数据格式错误");
  }
  else if (res.data.code && res.data.code != 200) {
    MsgWarning(res.data.msg);
  }
}

// 响应拦截器。用于处理错误信息等
axios.interceptors.response.use(
  (res: AxiosResponse) => {
    handleResponse(res);
    console.log("axios.interceptors成功响应:",res);
    return res;

  },
  (err) => {
    console.error("axios.interceptors处理错误:",err);
    if (err.response && err.response.data) {

      //TODO:需要登录信息的处理（后端错误改成正常返回？？？）
      const code = err.response.status
      const msg = err.response.data.message
      if(msg==="NEED_LOGIN"){
        MsgWarning("登录过期，请先登录");
        router.push("/login");
      }else{
        MsgErr(`Code: ${code}, Message: ${msg}`)
      }



    } else {
      MsgErr(`${err}`)
    }
    return Promise.reject(err)
  }
)

export async function fastRequest<T>(
  url:string,
  data:unknown,
  successMsg:string = "",
  FailMsg:string = "",
  success:(v:T)=>void = ()=>{},
  fail:(v:T) => void = ()=>{}
){
  return await request({
    url:url,
    method:'POST',
    json:true,
    data:data
  }).then((v:Response<T>)=>{
    if( successMsg != ""){
      MsgInfo(successMsg)
    }
   success(v.data)
    return v.data
  },(v:Response<T>)=>{
    if(FailMsg!=""){
      MsgErr(FailMsg);
    }
    fail(v.data)
  })
}

/** *
 * axios({url,method,content,params,datas})
 *
 * @param {string}  url，(必填)
 * @param {string}  method,默认post
 * @param {boolean} json, content-type类型，(必填)
 * @param {object}  params
 * @param {object}  datas  //token在datas中
 *
 */
export default function request(arr: IAxiosData) {
  return new Promise<Response<unknown>>((resolve, reject) => {
    // arr = requestValidate(arr)
    axios({
      timeout: arr.timeout === undefined ? 10000 : arr.timeout, // 请求超时时间
      url: arr.url,
      method: arr.method || 'POST',
      headers: {
        // 'Authorization': arr.token || '',

        'content-type': arr.contentType ? arr.contentType : arr.json ? 'application/json; charset=UTF-8' : 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      params: arr.params || '',
      data: arr.data || '',
      responseType: arr.responseType || 'json',

    })
      .then((response: AxiosResponse<Response<unknown>>) => {
        /**
         * response格式
         *
         * {
          data:{},
          status:200,
          statusText:'OK',//从服务器返回的http状态文本
          headers: {},//响应头信息
          config: {} //`config`是在请求的时候的一些配置信息
        }
         */
        const responseStatus = `${response.status}`
        // 状态码2开头的处理逻辑
        if (responseStatus.charAt(0) === '2') {
          // if (response.data.code === '1' || response.data.code === 'err_9999') {
          //   MsgErr(response.data.msg)
          //   reject(response.data)
          //   return
          // }

          resolve(response.data)
        } else {
          MsgErr(response.data.msg)
          reject(response.data)
        }



      })
      .catch((err) => {
        MsgErr(err.msg)
        reject(err)
      })
  })
}

export async function uploadFormData(url:string,formdata:FormData){
  const data = (await axios.post(
    globalConfig.BASE_API + url,
    formdata,
    {
      headers:{
        "Content-Type": 'multipart/form-data'
      }
    }
  ).then((v)=>{
    return v.data;
  })) as Response<unknown>
  return data;
}
