import Vue from 'vue/dist/vue.js';
import lazyLoad from '../src/lazyLoad';
import {i18nVue} from '../src/i18n';

window.addEventListener('DOMContentLoaded', () => {

    const vm = new Vue({
        el: '#app',
        data: {
            num: 50,
            o:{},
            show: false,
            langList: ['tw','en']
        },
        methods: {
        	switchLang: function(l){
        		const url = 'http://'+window.location.host + '/assets/lang/'+l+'.json';
        		i18nVue(url,vm,'o');
        	},
        	closeGlobShow: function() {
                if(this.show===true) this.show = false;
            },
        }
    })
    const url = 'http://'+window.location.host + '/assets/lang/tw.json';
    
    i18nVue(url,vm,'o');
    lazyLoad({
        offset: -20,
        lazyTop: true,
        loadingSrc: "/assets/image/loading.gif",
        errorSrc: "/assets/image/error.jpg",
    })
})