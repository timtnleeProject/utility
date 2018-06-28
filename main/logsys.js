import Vue from 'vue/dist/vue.js';

import LogSystem from '../src/logsys';
import BesAjaxRequest from 'bes-ajax';

const logsys = new LogSystem({
    max: 20,
    prefix: '[LOGSYS]:',
    debug: true
});
console.log(localStorage.getItem(logsys.storeKey))
const ajaxHandler = new BesAjaxRequest();
const defualtRequest = ajaxHandler.createRequest({
    host: 'http://127.0.0.1:3000',
    path: 'api/delay'
}, {
    responseType: 'text',
    name: 'defualtRequest'
});
defualtRequest.onsuccess = function() {
    console.log('onsucess 1')
    //send log
    logsys.log('[Request]: ' + this.options.name + ' done.')
}
defualtRequest.onerror = function() {
    logsys.log('[Request]: ' + this.options.name + ' failed.')
}
const request2 = defualtRequest.extend({ path: 'api' }, { responseType: 'json', name: 'request2' })
request2.onsuccess = function() {
    console.log('onsucess 2')
}
const sendLogs = defualtRequest.extend({ method: 'post', headers: { 'Content-Type': 'application/json' }, path: 'api/logsys' }, { name: 'sendLogs' })
document.addEventListener('DOMContentLoaded', () => {
	console.log('ready')
    const vm = new Vue({
        el: '#app',
        data: {
            logs: logsys.get().log
        },
        methods: {
            log: function() {
                console.log(logsys.storage)
            },
            warn: function() {
                logsys.warn('warn btn')
            },
            error: function() {
                logsys.error('error btn')
            },
            api: function() {
                request2.send().then((res) => {
                    console.log(res)
                })
            },
            sendLogs: function() {
                sendLogs.fetchoptions.body = JSON.stringify(logsys.get());
                sendLogs.send();
            },
            clearLogs: function() {
            	logsys.clearAll()
            	this.logs = logsys.get().log;
            }
        }
    })
})
