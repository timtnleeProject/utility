## BesAjax
**Ajax handler using fetch API.**

* Create default request.
* Extend requests based on default request.
* Retry when request fail.
* VIP requests and background requests.

### How to use ###
	var besAjax = BesAjaxRequest();
	var defaultRequest = besAjax.createRequest({
		host: 'http://127.0.0.1:3000',
        path: '/api'
	},{
		responseType: 'text',
        retry: 7,
        sleep: 1000,
		VIP: false,
        name: 'defaultReq'
	});
	defaultRequest.send().then((res)=>{
		//handle response
	}).catch((e)=>{
		//handle error
	})

### Extend requests ###
	var postRequest = defaultRequest.extend({
        method: 'post',
        headers: { 'Content-Type':'application/json', 'myHeader':'hello'},
        body: JSON.stringify({ name: 'p0855' })
    }, {
        VIP: true,
        name: 'postReq'
    });
	postRequest.send();

# Document
##BesAjaxRequest
### BesAjaxRequest()
- create a new BesAjaxObject.
- **type** `<Function>`
- **return** `BesAjaxObject`
## BesAjaxObject
### BesAjaxObject
- This object can create request object, handle execute pool and waiting pool.
- **type** `<Object>`

### BesAjaxObject.createRequest(`fetchOptions`,`options`)
- create a request object.
- **type** `<Function>`
- **parameters**
	- `fetchOptions`
	- `options` 
- **return** `BesRequestObject`

### BesAjaxObject.log
- Turn log on/off
- **type** `<Boolean>`
- **default** `false`
- **value**
	- `true`:turn on logs.
	- `false`:turn off logs.

### BesAjaxObject.poolSize
- Max size of execute pool.
- **type** `<Integer>`
- **default** `5`

### BesAjaxObject.errorHandler(`e`)
- Global error handle function for all requests in BesAjaxObject. To use it, just overwrite it.
- **type** `<Function>`
## BesRequestObject
### BesRequestObject
- Request object
- **type** `<Object>`

### BesRequestObject.extend(`fetchOptions`,`options`)
- Create another `BesRequestObject` extended `fetchOptions`, `options`
- **!** Same properties in `fetchOptions`, `options` will overwrite the original `fetchOptions`, `options` in `BesRequestObject`. But only `fetchOptions.headers` will use `Headers.append()`, see [Fetch Headers](https://developer.mozilla.org/en-US/docs/Web/API/Headers/append).
- **type** `<Function>`
- **parameters**
	- `fetchOptions`
	- `options`
- **return** `BesRequestObject`

### BesRequestObject.send()
- Send request.
- **type** `<Function>`
- **return** `Promise`
### fetchOptions

	 

- **Bold** (`Ctrl+B`) and *Italic* (`Ctrl+I`)
- Quotes (`Ctrl+Q`)
- Code blocks (`Ctrl+K`)
- Headings 1, 2, 3 (`Ctrl+1`, `Ctrl+2`, `Ctrl+3`)
- Lists (`Ctrl+U` and `Ctrl+Shift+O`)

### See your changes instantly with LivePreview ###

Don't guess if your [hyperlink syntax](http://markdownpad.com) is correct; LivePreview will show you exactly what your document looks like every time you press a key.

### Make it your own ###

Fonts, color schemes, layouts and stylesheets are all 100% customizable so you can turn MarkdownPad into your perfect editor.

### A robust editor for advanced Markdown users ###

MarkdownPad supports multiple Markdown processing engines, including standard Markdown, Markdown Extra (with Table support) and GitHub Flavored Markdown.

With a tabbed document interface, PDF export, a built-in image uploader, session management, spell check, auto-save, syntax highlighting and a built-in CSS management interface, there's no limit to what you can do with MarkdownPad.