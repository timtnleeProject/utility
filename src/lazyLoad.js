function lazyLoad(options) {
    
    //const completeLoad = [];
    if (!options)
        options = {}
    const offset = options.offset || 0;
    const twoway = options.lazyTop || false;
    const load =  options.loadingSrc || '';
    const err = options.errorSrc || '';
    const selector = options.selector || 'img.lazy-load';
    const attr = options.attribute || 'lazy-src';
    const elements = document.querySelectorAll(selector)
    
    let imgList = [];
    let timer;
    for (let i = 0; i < elements.length; i++) {
        let img = elements[i];
        img.src = load;
        img.onerror = function(e) {
            img.src = err;
        }
        imgList.push(img)
    }
    window.addEventListener('scroll', function(e) {
        onScroll()
    })
    onScroll()

    function onScroll() {
        if (timer)
            clearTimeout(timer)
        if(imgList.length===0)
        	return;
        timer = setTimeout(function() {
            const clone = imgList.slice();
            clone.reverse();
            for (let i = clone.length - 1; i >= 0; i--) {
                const el = clone[i]
                let atBot = el.getBoundingClientRect().top < window.innerHeight + offset;
                let atTop = (twoway) ? el.getBoundingClientRect().top > (offset * -1) : true;
                if (atBot && atTop) {
                    el.src = el.getAttribute(attr)
                    clone.splice(i, 1)
                }
            }
            imgList = clone
        }, 0)
    }
}

export default lazyLoad;