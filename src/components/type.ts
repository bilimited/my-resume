import type { RootContent, RootContentMap } from "mdast"


interface NodeExtend{
  isUnderH1?:boolean,
  blockType?:keyof RootContentMap[]
}

export type ExtendedRootContent = RootContent & NodeExtend
