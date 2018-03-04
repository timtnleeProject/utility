var list = [
	{
		title: 'ajax-btn',
		group:['ajax-btn','ajax-btn-custom'],
		show:false
	}
]


document.addEventListener('DOMContentLoaded', function() {
    var app = new Vue({
        el: '#app',
        data: {
            list:list,
            ajaxBtn:{
            	url:'http://127.0.0.1:3000/api',
                result:''
            }
        }
    })
})