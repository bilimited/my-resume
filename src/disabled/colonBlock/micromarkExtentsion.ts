import type { Construct, Tokenizer, State, Extension as MicroMarkExtension, Effects, Code } from "micromark-util-types"

// codes: 定义了各种符号,包括字母数字之类的。为什么我不能直接输符号？
import { codes, types, constants } from 'micromark-util-symbol'
import { markdownLineEnding } from 'micromark-util-character';
import { factorySpace } from 'micromark-factory-space';
import { effect } from "vue";

/**
 * 拓展库中的类型
 */
declare module 'micromark-util-types' {
  interface TokenTypeMap {
    icon: 'icon',
    iconMarker: 'iconMarker',
    iconString: 'iconString',
  }
}

// icon块的语法：（暂定）  :icon IconName:
// 当icon块解析成功时返回ok，否则返回nok。
const tokenizeIcon: Tokenizer = function (effects: Effects, ok: State, nok: State) {
  // const self = this;
  function start(code: Code) {
    // 打开一个Token,即icon块的整体
    effects.enter('icon')
    //icon块标识符（即':'）
    effects.enter('iconMarker')
    //消费一个字符，导致指针指向下一个字符
    effects.consume(code)
    //iconMarker只有一个字符，所以读完了就腿出iconMarker，到下一个
    effects.exit('iconMarker')
    //进入icon块的内容
    effects.enter('iconString')
    return begin
  }

  function begin(code: number) {
    return code === codes.colon ? nok(code) : inside(code)
  }

  function inside(code: number) {
    // -5:回车 -4：LineFeed（？） -3：回车换行符 null：EOF
    if (code === -5 || code === -4 || code === -3 || code === null) {
      return nok(code);
    }

    // 处理转义字符： '\:'
    if (code === 92) {
      effects.consume(code);
      return insideEscape
    }

    // 结束
    if (code == codes.colon) {
      effects.exit('iconString')
      effects.enter('iconMarker')
      effects.consume(code);
      effects.exit('iconMarker')
      effects.exit('icon')
      return ok
    }

    effects.consume(code)
    return inside; // 继续读
  }


  function insideEscape(code: number) {
    if (code === codes.colon) {
      effects.consume(code);
      return inside
    }
    return inside(code)
  }

  return start;
}


const iconconstruct = {
  name: "icon",
  tokenize: tokenizeIcon,
}

export const syntax = (): MicroMarkExtension => {
  return {
    text: {
      // 如果读取到code.colon(即冒号),则进入iconconstruct。
      [codes.colon]: iconconstruct
    }
  };
}
