import type { Plugin } from 'unified';
import type { Root } from 'mdast';
import { syntax } from './micromarkExtentsion';
import { fromMarkdown } from './mdastExtentsion';

const remarkColon: Plugin<[], Root> = function() {
  const data = this.data();
  function add(key: string, value: unknown) {
    if (Array.isArray(data[key])) {
      (data[key] as unknown[]).push(value);
    } else {
      data[key] = [value];
    }
  }
  add('micromarkExtensions', syntax());
  add('fromMarkdownExtensions', fromMarkdown());
}
export default remarkColon;
