import Vue from 'vue/dist/vue.js';
import Datepicker from 'vuejs-datepicker';
import besTemplate from '~/src/besTemplate';
import '~/sass/besTemplate.sass';
Vue.component('datepicker', Datepicker)
Vue.use(besTemplate)
window.Vue = Vue;