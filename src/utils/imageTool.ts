import html2Canvas from 'html2canvas'
import { jsPDF } from 'jspdf';

export class ImgTool {

  ele:HTMLElement
  data:string

  basescale = 1;
  exportscale = 1.5
  h:number;
  w:number;

  get exportH(){
    return this.h*this.exportscale;
  }

  get exportW(){
    return this.w*this.exportscale;
  }

  constructor(basescale:number){
    this.basescale = basescale;
  }

  async load(){
    const ele = document.getElementById('resume');
    this.h = ele.clientHeight;
    this.w = ele.clientWidth;

    this.data = await html2Canvas(ele,{scale:this.basescale * this.exportscale,useCORS:true}).then((canvas)=>{
      return canvas.toDataURL('img/png')
    })
    this.ele = ele;
    return this;
  }

  async loadThumbNail(){
    const ele = document.getElementById('resume');
    this.data = await html2Canvas(ele,{scale:this.basescale * 0.25,useCORS:true}).then((canvas)=>{
      return canvas.toDataURL('image/jpeg',0.4)
    })
    return this;
  }

  downloadAsPdf(name:string){
    const pdf = new jsPDF({
      format: "a4",
      compress:true,

    });

    // TODO: Why 0.2 ????
    const pdfscale = 0.2

    pdf.addImage(this.data,'PNG',0,0,this.exportW*pdfscale,this.exportH*pdfscale)
    pdf.save(name)
    return this
  }

  download(name:string){
    const link = document.createElement('a');
    link.href = this.data;
    link.download = name + '.png'; // 设置下载的文件名
    document.body.appendChild(link);
    link.click(); // 触发下载
    document.body.removeChild(link); // 下载后移除链接元素
    return this;
  }

}
