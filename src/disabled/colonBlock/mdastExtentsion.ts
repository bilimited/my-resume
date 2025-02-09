import { type Parent } from "mdast"
import type { Extension, Handle } from "mdast-util-from-markdown"

export interface ColonNode extends Parent {
  type: 'colonblock'
}

// 拓展库中的类型
declare module 'mdast' {
  interface BlockContentMap {
    colonblock:ColonNode
  }
}


export const fromMarkdown = (): Extension => {
  const enterColon: Handle = function(token) {
    this.enter<ColonNode>({
      type:'colonblock',
      children: []
    },token)
  }

  const exitColon: Handle= function(token) {
    const node = this.exit(token) as ColonNode;
    node.data = {
      ...node.data,
      hName: 'div',
    }
  }

  return {
    enter:{colonblock:enterColon},
    exit: {colonblock:exitColon} ,
  }
}
