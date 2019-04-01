# Node.js葵花宝典

## 前言



​           欲练此功，必先自宫；

​           不必自宫，亦可练成；

​           兄台还是好好修炼此功吧！保持一个清醒的头脑，你将驾驭这匹野马！！！





## 第一篇  为何偏爱Node.js

#### 1.1 引子

- 前端职责范围变大，为了统一流程开发体验
- 在处理高并发，I/O密集型场景性能优势足够明显

#### 1.2 CPU密集 ==VS== IO密集

- CPU密集：压缩、解压、加密、解密
- I/O密集：文件操作、网络操作、数据库

#### 1.3 Web常见的场景

- 静态资源获取
- ......

#### 1.4 高并发对应之道

- 增加物理机的个数
- 增加每台机器的CPU数------多核

#### 1.5 关于进程线程那些事儿

- 进程：用一句比较接地气的一句话叙述就是，执行中的程序就叫做进程。
- 多进程：启动多个进程处理一个任务。
- 线程：进程内一个相对独立、可以调度的执行单元，与同属一个进程的线程共享进程资源。

#### 1.6 再来谈谈Node.js的单线程

- 单线程只是针对主进程，I/O操作系统底层进行多线程调度。也就是它仅仅起一个监听作用。

  

  ```bash
  ###  举个栗子叭
       场景：饭店
       情节：人流量高并发
       BOSS的策略：雇佣多名厨师，只雇佣一个服务员，当多名顾客点餐的时候，服务员告诉厨师，做菜，上菜。
  ```

- 单线程并不是只开一个进程。

  

  ```bash
  ###  Node.js中的cluster（集群）模块
       官方介绍：单个 Node.js 实例运行在单个线程中。 为了充分利用多核系统，有时需要启用一组 Node.js 进程去处理负载任务。
       Demo：
  const cluster = require('cluster');
  const http = require('http');
  const numCPUs = require('os').cpus().length;
  
  if (cluster.isMaster) {
    console.log(`主进程 ${process.pid} 正在运行`);
  
    // 衍生工作进程。
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
  
    cluster.on('exit', (worker, code, signal) => {
      console.log(`工作进程 ${worker.process.pid} 已退出`);
    });
  } else {
    // 工作进程可以共享任何 TCP 连接。
    // 在本例子中，共享的是 HTTP 服务器。
    http.createServer((req, res) => {
      res.writeHead(200);
      res.end('你好世界\n');
    }).listen(8000);
  
    console.log(`工作进程 ${process.pid} 已启动`);
  }
  ```

- 友情链接[Cluster](<http://nodejs.cn/api/cluster.html>)

#### 1.7 Node.js的常用场景

- Web server
- 本地代码构建

## 第二篇 环境&调试

#### 2.1 环境安装

- 移步[官网](nodejs.cn)

#### 2.2 环境必须

- CommonJS

  - 每个文件都是一个模块，有自己的作用域。（它会自动包裹函数）

  - 在模块内部`module`变量代表模块本身。

  - `module.exports`属性代表模块对外接口。

    `ModuleDemo.js`

    ```javascript
    console.log('this is a module');
    
    const testVar = 100;
    
    function test () {
        console.log(testVar);
    }
    
    module.exports.testVar = testVar;
    module.exports.testFn = test;
    ```

  - `使用模块之require规则`

  ​          -    `/`表示绝对路径，`./`表示相对于当前文件的路径。

  ​          -  支持`js`、`json`、`node`拓展名

  ​          -   不写路径则认为是`build-in`模块或者各级`node-modules`内的第三方模块

   `CommonJS Use Module`

  ```javascript
  const modu = require('ModuleDemo.js');
  
  console.log(modu.testVar);
  
  console.log(modu.test);
  ```

  - `require特性`
    - module被加载的时候执行，加载后缓存。（后边这一句的意义就是，只加载一次，加载完缓存）【注：可以做一个小test，在一个test文件中，同时加载两次模块，你就会发现其中的奥秘了。】
    - 一旦出现某个模块被循环加载，就只会输出已经执行的部分，还未执行的部分不会输出。

- Global

- Process

#### 2.3 Node.js引用系统模块与第三方模块

- 引用系统模块

  ```javascript
  const fs = require('fs');
  
  const result = fs.readFile('fs.js',( err, data) => {
      if (err) {
          return err;
      }
      
      console.log(data);
  });
  
  console.log(result);
  
  ```

- 引用第三方模块

  ```bash
  npm i chalk -S
  ```

  

  ```javascript
  const chalk = require('chalk');
  ```

#### 2.4 exports与module.exports

```javascript
{
    function(exports,require,module,__filename,__dirname) {
        // code
    }
}
```

- 简而言之，exports就是module.exports的一个简写，也就是一个引用，别名。

  ```javascript
  exports = {
      a: 1,
      b: 2,
      test: 123
  }
  //这样是错误的
  exports.test = 100；
  //只能添加属性，但是不能修改其指向
  
  //当然
  module.exports = {
      a:1,
      b:2,
      test:123,
  }
  //这样是没问题的
  ```

  

#### 2.5 Global对象

- CommonJS
- Buffer、process、console
- timer

```javascript
global.test = 200;
```

#### 2.6 process模块

```javascript
/**
 *  argv
 *  argv0 
 *  execArgv
 *  execPath
 */

const {argv, argv0, execArgv, execPath} = require('process');

argv.forEach( item => {
    console.log(item);
})

//打印当前工作进程的路径

console.log(process.cwd());

//setImmediate(fn),不需要任何时间参数，执行最慢
//process.nextTick(fn)
//二者的区别就是后者的执行会先于前者



```

- 简单说明一下，就是`process.nextTick()`会把任务放在当前事件循环队列的队尾，而`setImmediate()`会把任务放在下一个队列的队首，而`setTimeout()`会把任务放在它俩中间。

#### 2.7 Debug

- [Inspector](<http://nodejs.cn/api/inspector.html>)
- IDE进行调试

## 第三篇  Node.js-API

#### 3.1 path

   和路径有关的内置模块

- `path.basename()`取得一个路径的最后一部分文件名
- `path.normalize()`帮助修正路径
- `path.join()`用于路径拼接（参数为多个路径参数）
- `path.resolve()`将一个相对路径解析为绝对路径
- `{basename, dirname, extname}`
  - `basename` 完整名
  - `dirname` 上级路径名
  - `extname  ` 后缀名
- `{parse, format}`
  - `parse`用于解析当前路径为一个json格式的数据
  - `format`相当于格式化json数据为一个字符串

说明：`__dirname`、`__filename`总是返回文件的绝对路径

​             `process.cwd()`总是返回node命令所在文件夹

#### 3.2 Buffer

三个要点：

- Buffer用于处理二进制数据流
- 实例类似整数数组，大小固定
- C++代码在V8堆外分配物理内存



