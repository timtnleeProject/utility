var list = [{
        title: 'color-ticks'
    },
    {
        title: 'text-display'
    },
    {
        title: 'ajax-button',
        group: ['ajax-btn(get)', 'ajax-btn(post)'],
        show: false
    },
    {
        title: 'on-off-btn',
    },
    {
        title: 'message-bar',
    },
    {
        title: 'check-box',
    },
    {
        title: 'radio-group',
    },
    {
        title: 'text-input'
    },
    {
        title: 'drop-menu'
    },
    {
        title: 'popup',
        group: ['popup-alert', 'popup-confirm'],
        show: false
    },
    {
        title: 'datepicker'
    }
]
Vue.component('card-input', {
    template: '<div class="input-group mb-2">\
                <span class="input-group-addon" id="basic-addon1">{{title}}</span>\
                <input v-model="inside" :computed="ch" class="form-control" aria-describedby="basic-addon1">\
            </div>',
    props: ['title', 'value'],
    data: function() {
        return {
            inside: this.value
        }
    },
    computed: {
        ch: function() {
            this.$emit('input', this.inside);
            return
        }
    }
})
Vue.component('card-span', {
    template: '<div class="input-group mb-2">\
                <span class="input-group-addon" id="basic-addon1">{{title}}</span>\
                <span class="form-control" aria-describedby="basic-addon1">\
                    {{value}}\
                </span>\
            </div>',
    props: ['title', 'value'],
})
Vue.component('card', {
    template: '<div class="card-block">\
                    <h4 class="text-primary">{{title}}</h4>\
                    <slot></slot>\
                </div>',
    props: ['title']
})
Vue.component('card-sub', {
    template: '<div class="card-block">\
                        <h5 v-if="title" :id="title" class="mb-3">#{{title}}</h5>\
                        <slot class="card-block"></slot>\
                    </div>',
    props: ['title'],
})
document.addEventListener('DOMContentLoaded', function() {
    var app = new Vue({
        el: '#app',
        data: {
            inputText: '',
            list: list,
            colorTicks: [{
                r: 0,
                g: 14,
                b: 26,
                a: 1
            }, {
                r: 100,
                g: 100,
                b: 120,
                a: 1
            }, {
                r: 140,
                g: 140,
                b: 160,
                a: 1
            }, {
                r: 0,
                g: 187,
                b: 179,
                a: 1
            }, {
                r: 0,
                g: 252,
                b: 233,
                a: 1
            }, {
                r: 255,
                g: 255,
                b: 167,
                a: 1
            }, {
                r: 255,
                g: 255,
                b: 47,
                a: 1
            }, {
                r: 255,
                g: 255,
                b: 255,
                a: 1
            }],
            colorHex: ['#000e1a', '#646478', '#8c8ca0', '#00bbb3', '#00fce9', '#ffffa7', '#ffff2f', '#ffffff'],
            textDisplay: {
                langs: ['TW', 'JP', 'EN'],
                picked: 'TW',
                "TW": {
                    title: "標題 產品",
                    context: "歡迎 攝影機，登入 登出 首頁 產品 查看更多"
                },
                "JP": {
                    title: "タイトル製品",
                    context: "ようこそカメラ、ログインログアウトホーム製品もっと見る",
                },
                "EN": {
                    title: "Title Products",
                    context: "Welcome camera, Login Log Out Home Products See More",
                }
            },
            ajaxBtn: {
                url: 'http://127.0.0.1:3000/api/delay',
                result: '',
                headers: { hello: 'world' },
                body: { name: 'tim' },
                isvalid: true
            },
            onOffBtn: {
                on: true
            },
            messageBar: {
                message: [],
                newMes: 'new ',
                count: 0
            },
            checkBox: {
                picked: 'product-2',
                products: ['product-1', 'product-2', 'product-3'],
                product: [{
                    name: 'product-1',
                    checked: false
                }, {
                    name: 'product-2',
                    checked: false
                }, {
                    name: 'product-2-pro',
                    checked: false
                }, {
                    name: 'product-3',
                    checked: false
                }]
            },
            textInput: {
                text: ''
            },
            dropMenu: {
                selected: 'product-3',
                options: ['product-1', 'product-2', 'product-3', 'product-4', 'product-5', 'product-6']
            },
            popup: {
                message: 'You\'ve already registered.',
                input: '',
                alert: {
                    show: false
                },
                alertCustom: {
                    show: false
                },
                confirm: {
                    show: false
                },
                confirmCustom: {
                    show: false
                },
                confirmCustomValid: {
                    show: false
                },
                prompt: {
                    show: false
                },
                promptCustom: {
                    show: false
                }
            },
            datepicker: '',
            editor: '',
        },
        methods: {
            confirm: function(com) {
                this.popup.input = com;
            },
            goTop: function() {
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;
            },
            validate: function() {
                let valid = this.ajaxBtn.body.name !== ''
                this.ajaxBtn.isvalid = valid
                return valid
            },
            rgbaCalc:function(index,key,e){
                let val = e.target.value;
                if(val<0)
                    val =0;
                else if(val>255)
                    val = 255;
                e.target.value=val;
                this.colorTicks[index][key]=val;
                const color=this.colorTicks[index];
                let hexColor = {}
                    let str = '#';
                    for (i in color) {
                        if (i != 'a') {
                            hexColor[i] = parseInt(color[i]).toString(16);
                            if (hexColor[i].length === 1)
                                hexColor[i] = '0' + hexColor[i]
                        }
                    }
                    for (i in hexColor) {
                        str += hexColor[i];
                    }
                this.colorHex[index] = str
            },
            strCalc:function(index,e){
                let val = e.target.value;
                if(val.length>7)
                    val=val.slice(0,7)
                e.target.value=val
                this.colorHex[index]=val
                
                if(val.length<7||val.indexOf('#')!==0)
                    return;

                const r = val.slice(1,3);
                const g = val.slice(3,5);
                const b = val.slice(5,7);
                const color =this.colorTicks[index];
                color.r = parseInt(r,16);
                color.g = parseInt(g,16);
                color.b = parseInt(b,16);
            },
            toggleClass:function(query,cla){
                const el = document.querySelector(query);
                if(el.classList.contains(cla))
                    el.classList.remove(cla)
                else
                    el.classList.add(cla)
            },
            removeClass:function(query,cla){
                const el = document.querySelector(query);
                if(el.classList.contains(cla))
                    el.classList.remove(cla)
            }
        },
        computed: {
            validation_body: function() {
                return this.ajaxBtn.body.name.trim() !== '';
            },
            validation: function() {
                if (this.inputText.trim() !== '')
                    return true;
                else
                    return false
            },
            validationMes: function() {
                if (this.validation)
                    return ''
                else
                    return 'name is empty'
            }
        }
    })

    var editor = new Quill('#editor', {
        modules: {
            toolbar: [
                [{ header: [1, 2, false] }],
                ['bold', 'italic', 'underline'],
                ['link','image', 'code-block']
            ]
        },
        placeholder: 'Compose an epic...',
        theme:'snow'
    });
})