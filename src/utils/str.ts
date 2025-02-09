export function insertString(original:string, insert:string, index:number) {
  return original.slice(0, index) + insert + original.slice(index);
}

export function replaceString(original: string, str: string, start: number, end: number) {
  return original.slice(0, start) + str + original.slice(end);
}
