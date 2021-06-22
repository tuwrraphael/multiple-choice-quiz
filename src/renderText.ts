function translateFormula(f: string) {
    return f.replace(/_([^\{])/g, "<sub>$1</sub>")
        .replace(/_\{(\S+?)\}/g, "<sub>$1</sub>")
        .replace(/\^([^\{])/g, "<sup>$1</sup>")
        .replace(/\^\{(\S+?)\}/g, "<sup>$1</sup>");
}

export function renderText(text: string) {
    let re = /\$(.+?)\$/g;
    let m;
    do {
        m = re.exec(text);
        if (m) {
            text = text.substr(0, m.index) + translateFormula(m[1]) + text.substr(m.index + m[0].length);
        }
    } while (m);
    return text;
}