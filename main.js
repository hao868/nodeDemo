const eventEmitter = require('events').EventEmitter
const event = new eventEmitter()

console.log('--------------------------心跳开始-----------------------')

// event.on('some_event', (arg1, arg2) => {
//   console.log('some_event 事件触发', arg1, arg2)
// })
// event.on('some_event', (arg1, arg2) => {
//   console.log('事件2', arg1, arg2)
// })

// const listenerCount = event.listenerCount('some_event')
// console.log('监听器个数',listenerCount)

// setTimeout(() => {
//   event.emit('some_event', '三生有幸遇见你', '纵使悲凉也是情')
// }, 1000)

const listener1 = () => { console.log('监听器 listener1, Node.js 使用了一个事件驱动、非阻塞式I/O的模型，使其轻量又高效。') }
const listener2 = () => { console.log('监听器 listener2, Node.js 使用了一个事件驱动、非阻塞式I/O的模型，使其轻量又高效。') }

event.addListener('connection', listener1)
event.on('connection', listener2)

console.log('connection监听器连接事件个数：', event.listenerCount('connection'))
event.emit('connection')

event.removeListener('connection', listener1)
console.log('listener1 不再受监听，Node.js 使用了一个事件模型、非阻塞式 I/O 的模型，使其轻量又高效。')

event.emit('connection')

console.log('connection监听器连接事件个数：', event.listenerCount('connection'))
console.log('--------------------------心跳停止-----------------------')


var fs = require("fs");

fs.readFile('input.txt', function (err, data) {
   if (err){
      console.log(err.stack, '==========');
      return;
   }
   console.log(data.toString());
});
console.log("程序执行完毕");
