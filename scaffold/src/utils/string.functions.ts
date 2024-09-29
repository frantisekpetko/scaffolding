export function capitalizeFirstLetter(string: string): string{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getObjectBetweenParentheses(str) {
    let re: RegExp = /(([^}]+))/g, text: RegExpExecArray;

    text = re.exec(str);
    
    return JSON.parse(text[1]);
}

function getWordsBetweenCurlies(str) {
  let results: any = [], re: RegExp = /{([^}]+)}/g, text: RegExpMatchArray;

  while(text = re.exec(str)) {
    results.push(text[1]);
  }
  return results;
}