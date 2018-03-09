function AjaxUnit(arg){
	this.url;
	this.method;
	this.headers;
	this.retryTimes;
	this.sleep;
	this.errorHandler;
	for(i in arg){
		this[i]=arg[i];
	}
}

AjaxUnit.prototype.extend = function(first_argument) {
	
};

AjaxUnit.prototype.append = function() {

};

AjaxUnit.prototype.send = function(){

};

const defaultGetRequest = new AjaxUnit({
	method:'get',
	headers:{
		'Accept-Content':'...'
	}
})

defaultGetRequest.append({
	url:'http://....'
}).send()