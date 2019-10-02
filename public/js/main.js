/**
 * @file main.js
 * @author huanghuiquan
 */

define(function (require) {
    'use strict';
    let axios = require('axios');
    let render = require('./render');
    let ui = require('./ui');

    // 异步请求数据，并在前端渲染
    axios.get('/api/movies').then(function (response) {
        let $movieList = document.querySelector('.movie-list');

        if (response.status !== 200) {
            $movieList.innerHTML = '网络错误';
            return;
        }
        $movieList.innerHTML = render(response.data);
    });

    // load 
    if('serviceWorker' in navigator){

        // 避免阻塞进程
        
        window.addEventListener('load', function(){
            // 首次加载 注册
            navigator.serviceWorker.register('sw.js', {scope: '/'})
                .then(function(registation){
                    console.log("service worker register success with scope" , registation)
                })
                .catch(function(error){
                    console.log(error);
                })

            // 当控制权改变的时候
            navigator.serviceWorker.oncontrollerchange = function(){
                ui.showToast('页面已更新', 'info');
            }

            if(!navigator.onLine){
                ui.showToast('网络已断开,内容可能过期', 'warning');
                
                window.addEventListener('online', function(event){
                    ui.showToast('网络已经连接,刷新获取最新内容', 'info');
                })
            }
        })
    }
    
});
