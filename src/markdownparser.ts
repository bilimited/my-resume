import type { Resume, ResumeItem } from "./types/resume";


export default class MarkdownParser {

  static parse(md:string):ResumeItem[]{

    const lines = md.split('\n')
    console.log(lines);
    return lines.map((v,i)=>{
      return {
        id:`${i}`,
        content:v
      }
    })
  }

  static unparse(resume:Resume){
    let s = ""
    resume.context.forEach((v)=>{
      s += (v.content + '\n')
    })
    return s
  }

}
