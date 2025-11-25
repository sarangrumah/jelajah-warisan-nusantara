const unescapeHtml = (str) => {
    if (!str) return '';
    return str
        .replace(/</g, '<')
        .replace(/>/g, '>')
        .replace(/"/g, '"')
        .replace(/'/g, "'")
        .replace(/&/g, '&');
}

const brokenUnescapeHtml = (str) => {
    if (!str) return '';
    return str
        .replace(/</g, '<')
        .replace(/>/g, '>')
        .replace(/"/g, '"')
        .replace(/'/g, "'")
        .replace(/&/g, '&');
}

const input = "<p>Hello</p>";
console.log("Input:", input);
console.log("Broken Unescape:", brokenUnescapeHtml(input));
console.log("Correct Unescape:", unescapeHtml(input));

const input2 = "<p>Hello</p>";
console.log("Input 2:", input2);
console.log("Broken Unescape 2:", brokenUnescapeHtml(input2));