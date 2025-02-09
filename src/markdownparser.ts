import type {
  Node,
  Root,
  Parent,
  Literal,
  RootContent
} from 'mdast'


export function printSyntaxTree(node: Parent | Root | Literal | RootContent, level = 0) {
  const indent = '  '.repeat(level);
  if ('value' in node) {
    console.log(`${indent}${node.type}: ${node.value}`);
  } else {
    console.log(`${indent}${node.type}`);
  }
  if ('children' in node) {
    node.children.forEach(child => printSyntaxTree(child, level + 1));
  }
}

/**
 * 根据 offset 查找节点
 * @param root - Markdown 语法树的根节点
 * @param offset - 要查找的 offset
 * @returns 匹配的节点或 null
 */
export function findNodeByOffset(root: RootContent, offset: number): Node | null {
  if (root.position && root.position.start.offset !== undefined && root.position.end.offset !== undefined) {
    if (offset >= root.position.start.offset && offset <= root.position.end.offset && root.type === 'text') {
      return root;
    }
  }

  if ('children' in root && root.children) {
    for (const child of root.children) {
      const result = findNodeByOffset(child, offset);
      if (result) {
        return result;
      }
    }
  }

  return null;
}

/**
 * 根据 line 查找节点
 * @param root - Markdown 语法树的根节点
 * @param line - 要查找的行号
 * @returns 匹配的节点或 null
 */
export function findNodeByLine(root: RootContent, line: number): Node | null {
  if (root.position) {
    if (line >= root.position.start.line && line <= root.position.end.line && root.type==='text') {
      return root;
    }
  }

  if ('children' in root && root.children) {
    for (const child of root.children) {
      const result = findNodeByLine(child, line);
      if (result) {
        return result;
      }
    }
  }

  return null;
}

