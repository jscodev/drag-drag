# drag-drag

## 安装

npm install

```zsh
npm i drag
```

通过script标签

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

## 使用

```js

import Drag from 'drag'

let dragNode = new Drag({
  el: '.drag'
})

dragNode.init()

```

绑定元素的方式有很多种：

```js
// 绑定单个class或者id的元素
new Drag('.e')
// 绑定dom
let dom = document.querySelector('div')
new Drag(dom)
// 绑定多个元素
new Drag(['.e','#a',dom, {el: 'p'}])
// 使用object模式可以配置样式，权重大于options配置的样式
new Drag({
  el: '.e',
  style: {
    width: '100px'
  }
})
// 多个绑定样式的元素声明方式
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
// 全局样式，在options里面
new Drag('.e',{
  style: {
    width: '100px'
  }
})

// 配置与绑定合并写法
new Drag({
  el: '.e',
  style: {

  },
  open: true,
  direction: ['x','y']
})

```

* open 控制拖动开关（默认为`true`）
* direction 控制拖动方向（默认为`x,y`）

## Updata Method

调用updata函数可以更新配置项

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

// 或者让某一个元素可以拖拽

let options = {
  open: true,
  direction: ['x','y']
}

let nodes = [{el: '.p'},'.el']

let drag = new Drag(nodea,options)

options.open = false
nodes[0].open = true

drag.updata()

// 也可以直接给updata传新的配置

drag.updata({open: false})

```

## Stop Method

当你在一个实例中只控制了一个元素可以使用这个方法使他停止，如果控制的多个元素那么将全部失去拖拽能力。

```js

let drag = new Drag(nodea,options)

drag.stop()

```

## Start Method

恢复拖拽能力

```js

let drag = new Drag(nodea,options)

drag.start()

```

## ClearStyle Method

清空元素的样式

```js

let drag = new Drag('.el', {
  style: {
    width: '100px'
  }
})
drag.clearStyle()

```

**注意**

当node参数只绑定一个元素时建议使用id，如果需要多个class类名绑定可以使用数组。

当你在第一个参数node传Array时，配置只能写在options，单个元素配置需在每个对象中单独配置style字段。
node参数的style永远大于options的style。

当你在第一个参数node传object时，推荐把配置项写在node中，不要再传options参数，否者将以options参数的配置项为主。

当你在updata中传递了参数，那么旧配置对象将被丢弃，使用传入的参数作为新的配置对象。

使用clearStyle会清空全部行内样式，包括当前元素位置，使用后将会像是什么都没有发生过一样。

