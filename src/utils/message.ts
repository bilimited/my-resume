import type { MessageApiInjection } from "naive-ui/es/message/src/MessageProvider";



export function MsgWarning(_text:string){
  console.warn(_text);
  (window['$message'] as MessageApiInjection).warning(_text)
}

export function MsgErr(_text:string){
  console.error(_text);
  (window['$message'] as MessageApiInjection).error(_text)
}

export function MsgInfo(_text:string){
  console.log(_text);
  (window['$message'] as MessageApiInjection).success(_text)
}
