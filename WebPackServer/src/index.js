import '../index.html'

/**
 * @time  2019/3/30 14:50
 * @author  Bill Wang <vuejs@vip.qq.com>
 * @desc   代理模式
 *
 *    - 使用者无法直接操作目标对象
 *    - 需要通过中间部分进行代理
 */


document.querySelector('button')
    .addEventListener('click',function handleClick() {
        console.log('点击我了');
        startWorker()
    },false);

function startWorker() {
    if (window.Worker){
        const worker = new Worker('../startTimeLock.js');
        worker.postMessage('你好');
    }

}




