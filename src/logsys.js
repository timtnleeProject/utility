/* logsys */
import LZString from 'lz-string';

function LogSystem(arg) {
    arg = arg || {};
    this.storeKey = arg.storeKey || '_logsys_';
    this.attr = arg.attr || 'logsys';
    this.max = arg.max || 16;
    this.ver = '1.0.0';
    this.id; //record user?
    this.prefix = arg.prefix;
    this.debug = (arg.debug !== undefined) ? arg.debug : false;
    this.init();
    const me = this;
    window.addEventListener('click', function(e) {
        const merge = (this.currentEl === e.target);
        this.currentEl = e.target;
        const txt = e.target.getAttribute(me.attr);
        if (txt) {
            me.log(txt, merge,true)
        }
    })
}
LogSystem.prototype.delog = function(txt,type) {
	let color;
	switch(type){
		case 'warn':
		color = '#FFBB00';
		break;
		case 'error':
		color = 'red';
		break;
		default :
		color = 'black';
		break;
	}
    if (this.debug) {
        if (window.chrome)
            console.log('%c [Logsys DEBUG] ' + txt, 'background: #eee;font-weight: bold; color:'+color);
        else
            console.log('[Logsys DEBUG] ' + txt);
    }
}
LogSystem.prototype.init = function() {
    this.storage = localStorage.getItem(this.storeKey)

    if (!this.storage) {
        this.storage = { log: [], ver: this.ver };
        localStorage.setItem(this.storeKey, LZString.compress(JSON.stringify(this.storage)));
    } else {
        this.storage = JSON.parse(LZString.decompress(this.storage))
    }
    this.delog('init logs: '+ JSON.stringify(this.storage))
}
LogSystem.prototype.clearAll = function() {
    localStorage.removeItem(this.storeKey)
    this.init();
}
LogSystem.prototype.log = function(txt, merge) {
	this.delog('[log]'+txt)
	let o = { text: this.prefix+txt, times: 1, date: Date(), ver: this.ver}
	if(merge!==undefined)
		o.type = 'click'
	else
		o.type = 'log'
    this.write(o, merge)
}
LogSystem.prototype.warn = function(txt) {
	this.delog('[warn]'+txt, 'warn')
    this.write({ text: this.prefix+txt, date: Date(), ver: this.ver, type:'warn'})
}
LogSystem.prototype.error = function(txt) {
	this.delog('[error]'+txt, 'error')
    this.write({ text: this.prefix+txt, date: Date(), ver: this.ver, type:'error'})
}
LogSystem.prototype.write = function(o,merge) {
	if (merge) {
		if(this.storage.log[0].type ==='click'){
        	this.storage.log[0].times += 1; 
		}
    } else{
        this.storage.log.unshift(o)
        while (this.storage.log.length > this.max) this.storage.log.pop()
    }
    let compressStr = LZString.compress(JSON.stringify(this.storage))
    localStorage.setItem(this.storeKey, compressStr)
}
LogSystem.prototype.get = function() {
    return this.storage;
}

export default LogSystem;