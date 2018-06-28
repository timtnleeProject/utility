function i18nVue(url ,vm, key) {
	const ajx = new XMLHttpRequest();
	ajx.open('get',url);
	ajx.responseType ='json';
	ajx.onreadystatechange = function(){
		if(this.readyState === 4){
			if(this.status >= 200 && this.status<300)
				vm[key]=this.response
			else 
				console.error('[Error]: i18n fail to get '+url)
		} 
	}
	ajx.send();
}

function i18nAttr(url,attr){
	const atr = attr||'i18n'
	const el=document.querySelectorAll('['+atr+']')
	const ajx = new XMLHttpRequest();
	ajx.open('get',url);
	ajx.responseType ='json';
	ajx.onreadystatechange = function(){
		if(this.readyState === 4){
			if(this.status >= 200 && this.status<300)
				setText(this.response)
			else 
				console.error('[Error]: i18n fail to get '+url)
		} 
	}
	ajx.send();
	function setText(res) {
		for(let i =0;i<el.length;i++){
			const key = el[i].getAttribute(atr).split('.');
			const re =/[\d+]/
			let txt = res;
			key.forEach(function(k){
				let match = k.match(re)
				if(txt===undefined)
					throw '[i18n] cannot find property of undefined'
				if(match){
					let aryName = k.slice(0,match.index-1)
					let index=k.slice(match.index,k.length-1)
					txt = txt[aryName][index];
				} else{
					txt = txt[k];
				}
			})
			el[i].innerText = txt
		}
	}
}

export {i18nVue, i18nAttr} 