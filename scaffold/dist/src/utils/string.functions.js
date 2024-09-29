"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getObjectBetweenParentheses = exports.capitalizeFirstLetter = void 0;
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
exports.capitalizeFirstLetter = capitalizeFirstLetter;
function getObjectBetweenParentheses(str) {
    let re = /(([^}]+))/g, text;
    text = re.exec(str);
    return JSON.parse(text[1]);
}
exports.getObjectBetweenParentheses = getObjectBetweenParentheses;
function getWordsBetweenCurlies(str) {
    let results = [], re = /{([^}]+)}/g, text;
    while (text = re.exec(str)) {
        results.push(text[1]);
    }
    return results;
}
//# sourceMappingURL=string.functions.js.map