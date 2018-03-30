function lazyLoad(){
	const elements = document.querySelectorAll('img.lazy-load')
	const completeLoad = [];
	let imgList = [];
	for(let i =0 ; i<elements.length;i++){
		imgList.push(elements[i])
	} 
	imgList.forEach(function(el){
		
		const promise = new Promise(function(res,rej){
			el.onLoad = function(){
				res()
			}
		})
		completeLoad.push(promise)
		el.src="/assets/gallery/loading.gif"
	})
	window.addEventListener('scroll' ,function(e){
		onScreen()
	})
	Promise.all(completeLoad).then(function(){
		onScreen()
	})
	function onScreen(){
		const clone = imgList.slice();
		for(let i=0;i<clone.length;i++){
			const el = clone[i]
			if(el.getBoundingClientRect().top < window.innerHeight - 200){
				console.log(el.getAttribute('lazy-src'))
				el.src =el.getAttribute('lazy-src')
				imgList.splice(i,1)
				i--;
			}
		}
	}
}