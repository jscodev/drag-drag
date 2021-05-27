# drag-drag

[中文文档](https://github.com/jscodev/drag-drag/blob/main/ich/READMD.md)

## Install

npm install

```zsh
npm i drag
```

Via script tag

```html

<script src='./dist/drag-you.min.js'></script>
<script>
import Drag from 'drag'

let dragNode = new Drag({
  el: '.drag'
})

dragNode.init()

</script>

```

## Usage

```js

import Drag from 'drag'

let dragNode = new Drag({
  el: '.drag'
})

dragNode.init()

```

There are many ways to bind elements:

```js
// Bind a single class or id element
new Drag('.e')
// Bind dom
let dom = document.querySelector('div')
new Drag(dom)
// Bind multiple elements
new Drag(['.e','#a',dom, {el: 'p'}])
// Use the object mode to configure the style, which is more important than the style configured by the options
new Drag({
  el: '.e',
  style: {
    width: '100px'
  }
})
// Multiple binding style element declaration methods
new Drag([{
  el: '.e',
  style: {

  }
},
{
  el: '.a',
  style: {

  }
}
])
// Global style, in options
new Drag('.e',{
  style: {
    width: '100px'
  }
})

// Configuration and binding combined writing
new Drag({
  el: '.e',
  style: {

  },
  open: true,
  direction: ['x','y']
})

```

* open Control the drag switch (default is `true`)
* direction Control the dragging direction (default is `x,y`)

## Updata Method

The configuration items can be updated by calling the updata function

```js

let options = {
  el: '.el'
  open: true,
  direction: ['x','y'],
  style: {
    width: '100px'
  }
}

let drag = new Drag(options)

drag.init()

function btn() {
  options.style.width = '200px'
  options.open = false
  direction.pop()
  drag.updata()
}


// Or make an element drag and drop

let options = {
  open: true,
  direction: ['x','y']
}

let nodes = [{el: '.p'},'.el']

let drag = new Drag(nodea,options)

options.open = false
nodes[0].open = true

drag.updata()

// You can also directly pass the new configuration to updata

drag.updata({open: false})

```

## Stop Method

When you control only one element in an instance, you can use this method to stop it. If you control multiple elements, all of them will lose their drag ability.

```js

let drag = new Drag(nodea,options)

drag.stop()

```

## Start Method

Restore drag ability

```js

let drag = new Drag(nodea,options)

drag.start()

```

## ClearStyle Method

Clear the style of the element

```js

let drag = new Drag('.el', {
  style: {
    width: '100px'
  }
})
drag.clearStyle()

```

**note**

When the node parameter is only bound to one element, it is recommended to use id. If you need to bind multiple class names, you can use an array.

When you pass Array in the first parameter node, the configuration can only be written in options, and the configuration of a single element needs to configure the style field in each object separately.

The style of the node parameter is always greater than the style of options.

When you pass the object in the first parameter node, it is recommended to write the configuration items in the node, do not pass the options parameter, otherwise, the configuration items of the options parameter will be the main one.

When you pass parameters in updata, the old configuration object will be discarded and the passed parameters will be used as the new configuration object.

Using clearStyle will clear all inline styles, including the current element position, and it will look like nothing happened after use.
