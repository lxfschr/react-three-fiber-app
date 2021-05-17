// r, g, and b are assumed to be 0-1 which is how ThreeJs material colors are stored
export default function rgbToHex(r, g, b) {
    const red = rgbComponentToHex(r*255);
    const green = rgbComponentToHex(g*255);
    const blue = rgbComponentToHex(b*255);
    return "#"+red+green+blue;
}

// Convert single component assumed to be 0-255 to hex. 
function rgbComponentToHex(rgbComponent) { 
  let hex = Number(rgbComponent).toString(16);
  if (hex.length < 2) {
    hex = "0" + hex;
  }
  return hex;
}