


console.log('service world!');


let CACHE_VERSOIN = 3;
let CACHE_NAME = 'cache_v' + CACHE_VERSOIN;
let CAChE_URLS = [
    '/',
    '/api/movies',
    '/js/main.js',
    '/js/render.js',
    '/js/ui.js',
    '/css/main.css',
    '/img/logo.png',
]


function precache() {
    return caches.open(CACHE_NAME)
        .then(function(cache){
            return cache.addAll(CAChE_URLS);
            // 抓取一个URL数组，检索并把返回的response对象添加到给定的Cache对象。
        })

}
// 当注册成功后, 会触发install
// 预缓存
self.addEventListener('install', function(event){
    event.waitUntil(
        precache().then(self.skipWaiting)
        // self 是当前 context 的 global 变量，
        // 执行该方法表示强制当前处在 waiting 状态的 Service Worker 进入 activate 状态。
    );
});

function clearCache() {
    return caches.keys().then(keys=>{
        keys.forEach(key => {
            if(key !== CACHE_NAME) {
                caches.delete(key);
            }
        })
    })
}
self.addEventListener('activate', function(event){
    event.waitUntil(
        Promise.all([
            clearCache(),
            self.clients.claim(), //获取控制权
        ])
    );
})

// api 请求 获取最新的数据 存入缓存
function saveToCache(req, res){
    return caches.open(CACHE_NAME)
        .then(cache => cache.put(req, res)); //更新缓存
}

function fetchAndCache(req){
    return fetch(req).then(function(res){
        saveToCache(req, res.clone());
        return res;
    })
}

// 当前域下发起的请求, 都会进行拦截
// 当浏览器在当前指定的 scope 下发起请求时，会触发 fetch 事件，
// 并得到传有 response 参数的回调函数，回调中就可以做各种代理缓存的事情了。
self.addEventListener('fetch', function(event){
    // console.log('request:', event.request.url);
    // console.log(event);
    let url = new URL(event.request.url);
    if(url.origin !== self.origin){ // 不同域下面 走cdn
        return ;
    }

    if(event.request.url.includes('/api/movies')){
        event.respondWith(
            fetchAndCache(event.request).catch(function(){
                return caches.match(event.request); //失败 去缓存中 去取数据
            })
        );

        return;
    }
 
    event.respondWith(
        fetch(event.request).catch(function(){
            return caches.match(event.request);
        })
    )
})




