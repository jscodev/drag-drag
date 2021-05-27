import { isObject, getDoms } from '../utils/utils'

export default class Style {
  static initStyle(node, opts) {
    if (!node.hasOwnProperty('el') && !node instanceof HTMLElement) {
      throw new Error('Missing el attribute')
    }
    let doms = []
    if (opts && opts.hasOwnProperty('style')) {
      if (node instanceof HTMLElement && isObject(opts.style)) {
        for (let key in opts.style) {
          let style = Style.fmtStyle(key, opts.style[key])
          node.style.cssText += style
        }
      }
    } else {
      doms = node.el instanceof HTMLElement ? node.el : getDoms(node.el)
      if (node.hasOwnProperty('style') && isObject(node.style)) {
        for (let key in node.style) {
          let style = Style.fmtStyle(key, node.style[key])
          if (doms instanceof HTMLElement) {
            doms.style.cssText += style
            break
          }
          for (let item of doms) {
            item.style.cssText += style
          }
        }
      }
    }
    return doms
  }
  static fmtStyle(key, value) {
    let style
    let k = key.replace(/[A-Z]+/, t => {
      return '-' + t.toLowerCase()
    })
    style = k + ':' + value + ';'
    return style
  }
  static globalStyle(dom, style, target) {
    let styl = ''
    for (let key in style) {
      if (isObject(target) && target.hasOwnProperty('style')) {
        if (target.style.hasOwnProperty(key)) {
          continue
        }
      }
      styl += Style.fmtStyle(key, style[key])
    }
    dom.style.cssText += styl
  }
}
