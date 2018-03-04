let compo = {
    list: [],
    set name(val) {
        if (compo.list[compo.list.length - 1] && compo.list[compo.list.length - 1].name === undefined) {
            compo.list[compo.list.length - 1].name = val;
        } else {
            compo.list.push({
                name: val
            })
        }
    },
    set options(val) {
        if (compo.list[compo.list.length - 1] && compo.list[compo.list.length - 1].options === undefined) {
            compo.list[compo.list.length - 1].options = val;
        } else {
            compo.list.push({
                options: val
            })
        }
    },
    create: function() {
        compo.list.forEach(function(li) {
            Vue.component(li.name, li.options);
        })
    }
};
compo.name = 'ajax-btn';
compo.options = {
    template: '<div class="ajax-btn" :class="\'ajax-btn-\'+status" v-on:click="send">\
    <div v-if="status===\'ready\'">{{text}}</div>\
    <div v-else-if="status===\'pending\'"><div class="loading"></div></div>\
    <div v-else-if="status===\'success\'">success</div>\
    <div v-else-if="status===\'fail\'">fail</div>\
    </div>',
    props: {
    	text:{
    		type: String
    	},
    	type:{
    		type: String,
    		default: 'default'
    	},
        url: {
            type: String,
            required: true
        },
        method:{
        	type: String,
        	required: false,
        	default: 'GET'
        },
        headers:{
        	type:Array,
        	required: false,
        	default:function(){return []}
        }
    },
    data: function() {
        return {
        	status:'ready'
        }
    },
    methods: {
        send: function() {
            if (this.status === 'ready') {
            	this.status = 'pending'
                var xhr = new XMLHttpRequest();
                xhr.open(this.method, this.url);
                this.headers.forEach(function(h){
                	xhr.setRequestHeader(h.name, h.value)
                })
                xhr.send()

                var com = this;
                xhr.onreadystatechange = function() {
                    if (this.readyState === 4 && this.status === 200) {
                    	if(com.type==='once')
                    		com.status = 'success'
                    	else
                    		com.status= 'ready'
                    	com.$emit('end', this.responseText)
                    } else if(this.readyState===4){
                    	if(com.type==='once')
                    		com.status = 'fail'
                    	else
                    		com.status= 'ready'
                    	com.$emit('error')
                    }
                }
            }

        }
    }
}
compo.create()