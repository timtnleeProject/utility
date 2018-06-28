import Vue from 'vue/dist/vue.min.js';
import Datepicker from 'vuejs-datepicker';
import besTemplate from '~/src/besTemplate/besTemplate';
import '~/src/besTemplate/besTemplate.sass';
Vue.component('datepicker', Datepicker)
Vue.use(besTemplate)
window.Vue = Vue;