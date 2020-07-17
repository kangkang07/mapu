export const hex2rgb = (hex:string, alpha = 1) => {
    if (hex.length === 4) {
        hex = '#'+ hex.charAt(1)+ hex.charAt(1)+ hex.charAt(2)+ hex.charAt(2)+ hex.charAt(3)+ hex.charAt(3)
    }
    return `rgba(${parseInt(hex.substr(1,2),16)},${parseInt(hex.substr(3,2),16)},${parseInt(hex.substr(5,2),16)},${alpha})`

}
export const rgb2hex = (rgb: string) => {
    let values = rgb.substring(rgb.indexOf('(')+1, rgb.length - 1).split(',')
    const convert = (v:string) => Number(v).toString(16).padStart(2,'0')
    return `#${convert(values[0])}${convert(values[1])}${convert(values[2])}`
}

export const toRGBA = (val: string, alpha = 1) => {
    if (val.indexOf('#') === 0) {
        return hex2rgb(val,alpha)
    } else if (val.indexOf('rgb') === 0) {
        return hex2rgb(rgb2hex(val), alpha)
    }
}

export const generateColor = (alpha: number = 1): string => {
    const hue = 199
    return `rgba(${Math.round(Math.random() * hue)},${Math.round(Math.random() * hue)},${Math.round(Math.random() * hue)}, ${alpha})`
}

export const generateColors = (num: number = 1, alpha: number = 1): string | string[] => {

    let arr = []
    for (let i = 1; i < num; i++){
        arr.push(generateColor() as string)
    }
    return arr
}


type CalcType = 'log10'|'log2'|'ln'|'logx'|'linear'
export const calcColorLevel = (val: number, max: number, calcType: CalcType = 'linear', base: number = Math.E) => {
    let ratio 
    if (calcType === 'linear') {
        return val / max 
    }
    if (calcType === 'log10') {
        ratio = val / max * 9 + 1
        return Math.log10(ratio)
    } else if (calcType === 'log2') {
        ratio = val / max + 1
        return Math.log2(ratio)
    } else if (calcType === 'ln') {
        ratio = val / max * (Math.E - 1) + 1
        return Math.log(ratio)
    } else if (calcType === 'logx') {
        ratio = val / max * (base - 1) + 1
        return Math.log(ratio) / Math.log(base)
    }
}

export const colorUtils = {
    calcColorLevel,
    generateColor,
    hex2rgb,
    rgb2hex,
    toRGBA
}