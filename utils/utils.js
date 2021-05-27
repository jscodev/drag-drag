function isType(obj) {
  return Object.prototype.toString.call(obj).replace(/\[object\s|\]/g, '');
}

function isObject(n) {
  return isType(n) === 'Object'
}

function isArray(n) {
  return isType(n) === 'Array'
}

function isString(n) {
  return isType(n) === 'String'
}

function isNodeList(n) {
  return isType(n) === 'NodeList'
}

function getDom(el) {
  let dom = null;
  if(/^[.|#]*[a-zA-Z-a-zA-Z]+$/.test(el)) {
    dom = document.querySelector(el)
  }
  return dom
}


function getDoms(el) {
  let doms = null;
  if(/^[.|#]*[a-zA-Z-a-zA-Z]+$/.test(el)) {
    doms = document.querySelectorAll(el)
  }
  return doms
}


export {
  isObject,
  isArray,
  isString,
  isNodeList,
  getDom,
  getDoms
}