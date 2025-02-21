import { useResumeSrcStore } from "@/stores/resume"
import { MsgInfo } from "@/utils/message"
import request, { fastRequest, type Response } from "@/utils/request"

export interface UploadResumeDto{
  content:string
  thumbnail:string
  theme:string
}

export interface UpdateResumeDto {
  name:string
  content:string
  thumbnail:string
  theme:string
}

// 从服务器返回的Resume类型，与数据库定义相同。
export interface ResumeEntity {
  id:number,
  user_id:number,
  name:string,
  createTime:string,
  updateTime:string,
  description:string,
  content:string,
  thumbnail:string,
  theme:string
}


export default class Service {

  static async getAllResume(){
    return await request({
      url:"/resume/all",
      method:'GET',
      json:true,
    }).then((v:Response<{resumes:ResumeEntity[]}>)=>{
      console.log(v);
      return v.data.resumes;
    })
  }

  static getResumeById(id:number,callback:(res:ResumeEntity)=>void){
    request({
      url:"/resume/id="+id,
      method:'GET',
      json:true,
    }).then((v:Response<{resume:ResumeEntity}>)=>{
      console.log(v);
      callback(v.data.resume);
    })
  }

  static async uploadResume(data:UploadResumeDto){
    const id = await request({
      url:"/resume/upload",
      data:data,
      method:"POST",
      json:true
    }).then((v:Response<{id:number}>)=>{
      MsgInfo("创建成功！")

      const store = useResumeSrcStore()
      store.resume_id = v.data.id;
      store.is_saved = true;

      return v.data.id;
    });

    console.log("ID in Async ",id);
    return id;
  }

  static async updateResume(data:UploadResumeDto){

    const store = useResumeSrcStore()
    console.log("Update",store.resume_id);
    await fastRequest("/resume/update",{...data, id:store.resume_id},"保存成功~")
    store.is_saved = true;
  }

  static async deleteResume(id:number){

    const store = useResumeSrcStore()
    if(store.resume_id != null){
      store.close()
    }
    await fastRequest("/resume/delete",{id:id},"删除成功！","")


  }



}
