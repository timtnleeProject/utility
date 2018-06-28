import BesAjaxRequest from '../src/bes-ajax/ajax.js'
import Vue from 'vue/dist/vue.js';
import '../src/besTemplate/besTemplate.sass';
import besTemplate from '../src/besTemplate/besTemplate';
Vue.use(besTemplate)
/*  BesAjaxRequest(options)
        @params options: object 
        這些是default值
    */
    var besAjax = BesAjaxRequest({
        log : false,
        resolveFirst: false,
        poolSize: 5
    });
    /*也可之後再做設定*/
    besAjax.abort= false;
    besAjax.log=true;
    besAjax.poolSize = 3;
    /*產生一個root request*/
    var defaultRequest = besAjax.createRequest({//第一個option是request的參數
        host: 'https://my-test-api1080.herokuapp.com/' 
    }, {//第二個option是處理request的設定 ex: timeout   這裡的color只是我做demo用, 非模組內的參數
        responseType: 'text',
        primary: 5,
        timeout: 4000,
        color:'lightgray',
    })
    //每個request可以有自己的onsucces, onerror functions, child request也會繼承到
    defaultRequest.onsuccess = function(){
        if(window.chrome)
            console.log('%c request success :)','font-size:large;font-weight:bold');
        else
            console.log('request success :)')
    }
     defaultRequest.onerror = function(){
        if(window.chrome)
            console.log('%c request failed :(','font-size:large;font-weight:bold;color:red');
        else
            console.log('request failed :(')
    }
    /*之後便可以根據先前的request繼承產生不同的新的request*/
    var badRequest = defaultRequest.extend({
        path: '/fatal'
    }, {
        retry: 5,
        sleep: 500,
        primary:10,
        //expofn: function(x,a){let y=a+(x)*100; return (y>3000)?3000:y;},
        color:'red',
    })
    var delayRequest = defaultRequest.extend({
        path: '/delay'
    }, {
        name: 'delayRequest',//取名字, 在log或是debug時候就能知道是哪一個request
        primary: 0,//優先順序 0 最優先
        color: 'rgba(0,0,255,0.7)',
    })
    var instantRequest = defaultRequest.extend({
        path: '/json'
    }, {
        name: 'instantRequest1',
        primary: 1,
        responseType: 'json'//處理response的方式：response回來是一個body物件，用text, json, blob等等方式處理(詳見fetch的response物件)
    })

    var app = new Vue({
        el: '#app',
        data: {
            results: [],
            exePool: [],
            waitingPool: [],
            controll : besAjax,
            delayRequest: delayRequest,
            postRequest: delayRequest.extend({
                method: 'post',
                path:'json',
                body: JSON.stringify({ "name": "postRequest" }),
                headers: { 'Content-Type': 'application/json' }
            }, {
                name: 'postRequest',
                primary: 2,
                color:'rgba(188,188,0,0.7)'
            }),
            instantRequest: instantRequest,
            instantRequest2: instantRequest.extend({}, { name: 'instantRequest20', primary: 20, responseType: 'text' })
        }
    })

    //這個是global的success, error handle function, 所有besAjax產生的request都套用
    besAjax.successHandler = function(res, name) {
        app.results.unshift('['+name+' done]: response: '+res)
        if (app.results.length > 30)
            app.results.pop()
    }
    besAjax.errorHandler = function(e, name) {
        app.results.unshift('['+name+' fail]: error: '+e)
        if (app.results.length > 30)
            app.results.pop()
    }
    //on pool, pool發生變化時，也是為了demo平常應該不太會用到
    besAjax.taskPool.on('pool', function() {
        app.exePool = besAjax.taskPool.exePool;
        app.waitingPool = besAjax.taskPool.waitingPool
    })

    function sendBadRequest() {
        for (var i = 0; i < 15; i++) {
            badRequest.extend({ query: 'index='+i }, { name: 'badRequest'+i }).send()
                .then(function(res) {})
                .catch(function(e) {})
        }
    }
    window.sendBadRequest = sendBadRequest
    sendBadRequest();
    for(var i=0;i<5;i++){
        delayRequest.extend({query:'i='+i},{primary:4,name:'delayRequest4',color: 'rgba(0,0,255,0.2)',}).send()
    }
    for(var i=0;i<5;i++){
        delayRequest.extend({path:'delay',query:'i='+i},{name:'delayRequest2',primary:2,color: 'rgba(188,188,0,0.2)'}).send()
    }
    setTimeout(function(){
        for(var i=0;i<5;i++){
            delayRequest.extend({path:'delay2',query:'i='+i},{primary:0,name:'delayRequest0'}).send()
        }
    },100)
    