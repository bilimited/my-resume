import type { RootContentMap } from "mdast"

declare module 'mdast' {
  interface Node {
    isUnderH1?:boolean,
    blockType?:keyof RootContentMap[]
  }
}
