const defaultColors = {
  keyColor: 'dimgray',
  numberColor: 'lightskyblue',
  stringColor: 'lightcoral',
  trueColor: 'lightseagreen',
  falseColor: '#f66578',
  nullColor: 'cornflowerblue'
}

interface ColorOptions {
  keyColor?: string;
  numberColor?: string;
  stringColor?: string;
  trueColor?: string;
  falseColor?: string;
  nullColor?: string;
}

const entityMap: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '`': '&#x60;',
  '=': '&#x3D;'
};

function escapeHtml (html: string): string {
  return String(html).replace(/[&<>"'`=]/g, function (s) {
      return entityMap[s];
  });
}

export default function (json: any, colorOptions: ColorOptions = {}): string {
  const valueType: string = typeof json
  if (valueType !== 'string') {
    // Handle Map objects by converting to array
    if (json instanceof Map) {
      json = Array.from(json)
    }
    json = JSON.stringify(json, null, 2) || valueType
  }
  let colors: Required<ColorOptions> = Object.assign({}, defaultColors, colorOptions)
  json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>')
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+]?\d+)?)/g, (match: string) => {
    let color: string = colors.numberColor
    let style: string = ''
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        color = colors.keyColor
      } else {
        color = colors.stringColor;
        match = '"' + escapeHtml(match.substr(1, match.length - 2)) + '"';
        style = 'word-wrap:break-word;white-space:pre-wrap;';
      }
    } else {
      color = /true/.test(match)
        ? colors.trueColor
        : /false/.test(match)
          ? colors.falseColor
          : /null/.test(match)
            ? colors.nullColor
            : color
    }
    return `<span style="${style}color:${color}">${match}</span>`
  })
}
