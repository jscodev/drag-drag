import {
  isArray,
  isString,
  isObject,
  isNodeList,
  getDom,
  getDoms,
} from '../utils/utils'
import mixins from '../utils/mixins'
import Style from './style'

class Drag extends mixins(Style) {
  constructor(node, options) {
    super()
    if (!window) return
    if (!(this instanceof Drag)) {
      return new Drag()
    }
    Drag.opt = {
      node: node,
      options:
        isObject(node) && !isObject(options) ? node : options ? options : null,
      position: {},
    }

    if (isObject(node) && isObject(options)) {
      Drag.opt.options = Object.assign(Drag.opt.node, Drag.opt.options)
    }
  }
  init() {
    let opt = Drag.opt
    let options = {
      open: true,
      direction: ['x', 'y'],
      ...opt.options,
    }
    if (!opt.node) {
      throw new Error('Parameter error')
    }
    if (isArray(opt.options)) {
      throw new Error('options cannot be an array')
    }
    let node
    let isArr = isArray(opt.node) || isArray(opt.node.el)
    ;(opt.node instanceof HTMLElement || isArr) && (node = opt.node)
    opt.node.el instanceof HTMLElement && (node = opt.node.el)
    isString(opt.node) && (node = getDom(opt.node))
    isString(opt.node.el) && (node = getDom(opt.node.el))
    if (!node) {
      throw new Error(
        'If the first parameter is not a dom node, please configure the id or class name of the corresponding element of el'
      )
    } else {
      opt.node = node
    }
    if (
      isObject(opt.options) &&
      Object.getOwnPropertyNames(opt.options).length
    ) {
      for (let key in options) {
        opt.options[key] = options[key]
      }
    } else {
      opt.options = options
    }
    Drag.singleTouch()
  }
  updata(option) {
    let options = {
      open: true,
      direction: ['x', 'y'],
      ...option,
    }
    let opt = Drag.opt
    if (option) {
      opt.options = options
    }
    if (opt.hasOwnProperty('nodes') && opt.options.open) {
      Drag.clearEvent(opt.nodes)
    }
    Drag.singleTouch()
  }
  stop() {
    Drag.opt.options.open = false
    Drag.singleTouch()
  }
  start() {
    Drag.opt.options.open = true
    Drag.singleTouch()
  }
  clearStyle() {
    let opt = Drag.opt
    if (isArray(opt.node)) {
      for (let item of opt.nodes) {
        item.style.cssText = ''
      }
    } else {
      opt.node.style.cssText = ''
    }
  }
  static singleTouch() {
    let opt = Drag.opt
    if (opt.options.open) {
      Drag.scrollLeft = document.documentElement.scrollLeft
      Drag.scrollTop = document.documentElement.scrollTop
      window.addEventListener('scroll', listenScroll)
      if (!opt.hasOwnProperty('nodes')) {
        if (!isArray(opt.node) && !isArray(opt.node.el)) {
          Drag.openDrag()
        } else {
          Drag.dragList()
        }
      } else {
        Drag.dragList()
      }
    } else {
      window.removeEventListener('scroll', listenScroll)
      if (opt.hasOwnProperty('nodes')) {
        Drag.clearEvent(opt.nodes)
      } else if (opt.node instanceof HTMLElement) {
        opt.node.removeEventListener('pointerdown', bindPointerdown)
        opt.node.removeEventListener('pointerup', bindPointerup)
        opt.node.removeEventListener('pointermove', bindMoveTransform)
      }
    }
  }
  static clearEvent(doms) {
    for (let item of doms) {
      item.node.removeEventListener('pointerdown', bindPointerdown)
      item.node.removeEventListener('pointerup', bindPointerup)
      item.node.removeEventListener('pointermove', bindMoveTransform)
    }
  }
  static dragList() {
    let opt = Drag.opt
    let type = isArray(opt.node) ? 'nArray' : 'eArray'
    switch (type) {
      case 'nArray':
        opt.nodes = Drag.getNodes(opt.node, opt)
        break
      case 'eArray':
        opt.nodes = Drag.getNodes(opt.node.el, opt)
        break
    }

    Drag.openDrags()
    for (let index = 0; index < opt.node.length; index++) {
      const c = opt.node[index]
      const element = opt.nodes[index]
      if (isObject(c) && !c.open) {
        element.node.removeEventListener('pointerdown', bindPointerdown)
      }
    }
  }
  static openDrags() {
    let opt = Drag.opt
    for (let item of opt.nodes) {
      item.node._params = item
      item.node.addEventListener('pointerdown', bindPointerdown)
      item.node.addEventListener('pointerup', bindPointerup)
    }
  }
  static openDrag() {
    let opt = Drag.opt
    Style.initStyle(opt.node, opt.options)
    opt.node._params = opt
    opt.node.addEventListener('pointerdown', bindPointerdown)
    opt.node.addEventListener('pointerup', bindPointerup)
  }
  static getNodes(node, opt) {
    let nodes = []
    let saveNode = {}
    for (let index = 0; index < node.length; index++) {
      let dom
      if (node[index] instanceof HTMLElement) {
        dom = node[index]
      } else if (isObject(node[index])) {
        dom = Style.initStyle(node[index])
      } else {
        dom = getDoms(node[index])
      }
      if (isNodeList(dom)) {
        for (let item of dom) {
          Drag.addGlobalStyle(item, opt, node[index])
          saveNode = {
            node: item,
            direction: isObject(node[index]) && node[index].direction,
            position: {},
          }
          nodes.push(saveNode)
        }
      } else {
        saveNode = {
          node: dom,
          direction: isObject(node[index]) && node[index].direction,
          position: {},
        }
        Drag.addGlobalStyle(dom, opt, node[index])
        nodes.push(saveNode)
      }
      if (!saveNode.direction) {
        delete saveNode.direction
      }
    }
    return nodes
  }
  static addGlobalStyle(dom, opt, target) {
    if (opt.options.hasOwnProperty('style')) {
      Style.globalStyle(dom, opt.options.style, target)
    }
  }
  static getElementPoisition(ele) {
    let left = ele.getBoundingClientRect().left
    let right = ele.getBoundingClientRect().right
    let top = ele.getBoundingClientRect().top
    let bottom = ele.getBoundingClientRect().bottom

    return {
      left,
      right,
      top,
      bottom,
    }
  }
}

function listenScroll() {
  Drag.scrollLeft = document.documentElement.scrollLeft
  Drag.scrollTop = document.documentElement.scrollTop
}

function parentOffSet(node, lr) {
  if (
    !node.offsetParent ||
    node.offsetParent.tagName.toLocaleLowerCase() === 'body'
  ) {
    lr.left += node.offsetLeft
    lr.top += node.offsetTop
    return
  }
  lr.left += node.offsetLeft
  lr.top += node.offsetTop
  parentOffSet(node.offsetParent, lr)
}

function bindPointerdown(e) {
  const { left, top } = Drag.getElementPoisition(this)
  this._params.position.eOfx = e.pageX - (Drag.scrollLeft + left)
  this._params.position.eOfy = e.pageY - (Drag.scrollTop + top)
  Drag.scrollWidth = document.documentElement.scrollWidth
  Drag.scrollHeight = document.documentElement.scrollHeight

  let position = this.offsetParent
    ? getComputedStyle(this.offsetParent).position
    : null

  if (position && position !== 'static') {
    let lr = { left: 0, top: 0 }
    parentOffSet(this.offsetParent, lr)
    this._params.position.nodeOfx = this.offsetLeft + lr.left
    this._params.position.nodeOfy = this.offsetTop + lr.top
  } else {
    this._params.position.nodeOfx = this.offsetLeft
    this._params.position.nodeOfy = this.offsetTop
  }
  this.addEventListener('pointermove', bindMoveTransform)
  this.setPointerCapture(e.pointerId)
}

function bindPointerup(e) {
  this.removeEventListener('pointermove', bindMoveTransform)
  this.releasePointerCapture(e.pointerId)
}

function bindMoveTransform(e) {
  const direction = Drag.opt.options.direction
  const { position, node } = this._params
  let translate
  let x, y
  const { left, top } = Drag.getElementPoisition(this)
  const topBoundary = top + Drag.scrollTop
  const leftBoundaryX = Drag.scrollWidth - node.offsetWidth + position.eOfx
  const topBoundaryY = Drag.scrollHeight - node.offsetHeight + position.eOfy

  if (left <= 0) {
    x = e.pageX <= position.eOfx ? position.eOfx : e.pageX
  } else {
    x = e.pageX >= leftBoundaryX ? leftBoundaryX : e.pageX
  }
  if (topBoundary <= 0) {
    y = e.pageY <= position.eOfy ? position.eOfy : e.pageY
  } else {
    y = e.pageY >= topBoundaryY ? topBoundaryY : e.pageY
  }

  if (this._params.hasOwnProperty('direction')) {
    direction = this._params.direction
  }

  if (direction && direction.indexOf('x') >= 0 && direction.indexOf('y') < 0) {
    translate = `translateX(${x - position.eOfx - position.nodeOfx}px`
  } else if (
    direction &&
    direction.indexOf('x') < 0 &&
    direction.indexOf('y') >= 0
  ) {
    translate = `translateY(${y - position.eOfy - position.nodeOfy}px)`
  } else {
    translate = `translate(${x - position.eOfx - position.nodeOfx}px,${
      y - position.eOfy - position.nodeOfy
    }px)`
  }
  this.style.transform = translate
}

export default Drag
