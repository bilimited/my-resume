
export interface Resume{
  header:ResumeHeader
  context:ResumeItem[]
  meta:ResumeMeta
}

export interface ResumeHeader{
  author:string
  avatar:string
  custom:{[key:string]:string}
}

export type ResumeItem = ResumeContext

export type ResumeItemType = "line"|"header"|"block"

export interface ResumeContext{
  id:string
  content:string
  children?:ResumeItem[]
}

export interface ResumeMeta{
  theme:string
}
