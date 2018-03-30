var list = [
    {
        title:'color-ticks'
    },
    {
        title: 'text-display'
    },
	{
		title: 'ajax-button',
		group:['ajax-btn(get)','ajax-btn(post)'],
		show:false
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
        title:'text-input'
    },
    {
        title:'drop-down-menu',
        group:['drop-menu'],
        show:false
    },
    {
        title: 'popup',
        group:['popup-alert','popup-confirm'],
        show:false
    }
]

document.addEventListener('DOMContentLoaded', function() {
    var app = new Vue({
        el: '#app',
        data: {
            inputText:'',
            list:list,
            colorTicks:[{
                r:0,g:14,b:26,a:1
            },{
                r:100,g:100,b:120,a:1
            },{
                r:140,g:140,b:160,a:1
            },{
                r:0,g:187,b:179,a:1
            },{
                r:0,g:252,b:233,a:1
            },{
                r:255,g:255,b:167,a:1
            },{
                r:255,g:255,b:47,a:1
            },{
                r:255,g:255,b:255,a:1
            }],
            textDisplay:{
                langs:['TW','JP','EN'],
                picked:'TW',
                "TW":{
                    title:"標題 產品",
                    context:"歡迎 攝影機，登入 登出 首頁 產品 查看更多"
                },
                "JP":{
                    title:"タイトル製品",
                    context:"ようこそカメラ、ログインログアウトホーム製品もっと見る",
                },
                "EN":{
                    title:"Title Products",
                    context:"Welcome camera, Login Log Out Home Products See More",
                }
            },
            ajaxBtn:{
            	url:'http://127.0.0.1:3000/api/delay',
                result:'',
                headers:{hello:'world'},
                body:{name:'tim'},
                isvalid:true
            },
            onOffBtn:{
                on:true
            },
            messageBar:{
                messages:[],
                newMes :'new message',
                count:0
            },
            checkBox:{
                picked:'product-2',
                products:['product-1','product-2','product-3'],
                product:[{
                    name:'product-1',
                    checked:false
                },{
                    name:'product-2',
                    checked:false
                },{
                    name:'product-2-pro',
                    checked:false
                },{
                    name:'product-3',
                    checked:false
                }]
            },
            textInput:{
                text:''
            },
            dropMenu:{
                selected:'product-3',
                options:['product-1','product-2','product-3','product-4','product-5','product-6']
            },
            popup:{
                message:'You\'ve already registered.',
                input:'',
                alert:{
                    show:false
                },
                alertCustom:{
                    show:false
                },
                confirm:{
                    show:false
                },
                confirmCustom:{
                    show:false
                },
                confirmCustomValid:{
                    show:false
                },
                prompt:{
                    show:false
                },
                promptCustom:{
                    show:false
                }
            }
        },
        methods:{
            confirm: function(com){
                this.popup.input = com;
            },
            goTop:function(){
                document.documentElement.scrollTop=0;
                document.body.scrollTop =0;
            },
            validate:function(){
                let valid = this.ajaxBtn.body.name!==''
                this.ajaxBtn.isvalid=valid
                return valid
            }
        },
        computed:{
            validation_body:function(){
                return this.ajaxBtn.body.name.trim()!=='';
            },
            colorTicksHex: function(){
                let hex=this.colorTicks.map(function(color){
                    let hexColor = {}
                    let str = '#';
                    for(i in color){
                        if(i!='a'){
                            hexColor[i]=parseInt(color[i]).toString(16);
                            if(hexColor[i].length===1)
                                hexColor[i]='0'+hexColor[i]
                        }
                    }
                    for(i in hexColor){
                        str+=hexColor[i];
                    }
                    return str
                })
                return hex
            },
            validation: function(){
                if(this.inputText.trim()!=='')
                    return true;
                else
                    return false
            },
            validationMes: function(){
                if(this.validation)
                    return ''
                else
                    return 'name is empty'
            }
        }
    })
})