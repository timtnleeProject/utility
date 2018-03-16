function BesAjaxRequest() {
	function log(mes){
		if(np.log)
			console.log(mes)
	}
    function EventListener() {
        this.listener = {}
    }
    EventListener.prototype.on = function(event, fn) {
        this.listener[event] = fn;
    }
    EventListener.prototype.emit = function() {
        args = [];
        for (let a in arguments) {
            if (a != 0)
                args.push(arguments[a])
        }
        let fName = arguments[0];
        if(this.listener[fName])
        	this.listener[fName].apply(this, args);
    }

    function TaskPool(maxSize) {
    	EventListener.call(this)
        this.exePool = [];
        this.waitingPool = [];
        this.maxSize = maxSize;
        this.idList = {};
        let me = this;
        this.on('clean' ,function(){
        	me.checkWaiting()
        })
    }
    TaskPool.prototype = Object.create(EventListener.prototype);
    TaskPool.prototype.constructor = TaskPool;
    TaskPool.prototype.getId = function(num) {
        const char = 'qwertasdfgzxcvb1234567890';
        let id = '';
        for (let i = 0; i < num; i++) {
            let index = Math.floor(Math.random() * char.length)
            id += char[index];
        }
        return id;
    }
    TaskPool.prototype.getUniqueId = function(num) {
        let id = this.getId(num);
        while (this.idList[id]) {
            id = this.getId(num)
        }
        this.idList[id] = true
        return id;
    }
    TaskPool.prototype.releaseId = function(id) {
        delete this.idList[id]
    }
    TaskPool.prototype.addTask = function(task) {
        task.id = this.getUniqueId(5);
        //pool已滿 查看是否primary task 
        if (this.exePool.length >= this.maxSize) {
        	log('[TaskPool] : full')
            if (task.primary) { //primary
                this.transfer();//把bg(有的話) 移動到waiting
            }
        }
        //檢查pool大小，加入pool
        if (this.exePool.length < this.maxSize) {
        	log('[TaskPool] : put to exePool')
            this.exePool.push(task)
            task.run()
        } else{
        	log('[TaskPool] : put to waitingPool')
        	this.waitingPool.push(task)
        }
    }
    TaskPool.prototype.clean = function(id) {
        let index = this.exePool.findIndex(function(t) {
            return t.id === id
        })
        this.exePool.splice(index, 1)
        this.releaseId(id)
        this.emit('clean')
    }
    TaskPool.prototype.transfer = function() {
        let index = this.exePool.findIndex(function(t) {
            return t.primary !== true
        })
        if (index >= 0) {
        	log('[TaskPool] : VIP replace bg')
        	let task = this.exePool[index];
            task.pause();
            this.waitingPool.push(task)
            this.exePool.splice(index, 1);
        }
    }
    TaskPool.prototype.checkWaiting = function(){
    	if(this.waitingPool.length>0){
    		log('[TaskPool] waitingPool to exePool')
    		let index=this.waitingPool.findIndex(function(t){
    			return t.primary
    		})
    		if(index<0)
    			index=0;
			let task = this.waitingPool[index]
			this.addTask(task)
			this.waitingPool.splice(index,1)
    	}
    }
    function BesRequest(fetchopt, opt, linkage) {
    	EventListener.call(this);
        this.fetchoptions = fetchopt;
        this.options = opt;
        this.fetchoptions.headers = new Headers(fetchopt.headers)
    }
    BesRequest.prototype = Object.create(EventListener.prototype);
    BesRequest.prototype.constructor = BesRequest;
    BesRequest.prototype.clone = function(){
        let originFetchOpt = {};
        let originOpt = {};
        for (let i in this.fetchoptions) {
            originFetchOpt[i] = this.fetchoptions[i]
        }
        for (let i in this.options) {
            originOpt[i] = this.options[i]
        }
        return new BesRequest(originFetchOpt, originOpt);
    }
    BesRequest.prototype.extend = function(newfetchopt, newopt) {
        let clone = this.clone();
        if (newfetchopt) {
            for (let i in newfetchopt) {
                if (i !== 'headers')
                    clone.fetchoptions[i] = newfetchopt[i]
            }
            for (let h in newfetchopt.headers) {
                clone.fetchoptions.headers.append(h, newfetchopt.headers[h])
            }
        }
        if (newopt) {
            for (let i in newopt) {
                clone.options[i] = newopt[i]
            }
        }
        return clone
    }
    BesRequest.prototype.send = function(fetchoptions, options) {
    	let clone = this.clone(fetchoptions, options)
        const task = new Task(clone.fetchoptions, clone.options);
        np.taskPool.addTask(task)
        return new Promise(function(resolve, reject) {
            task.on('done', function(status, res) {
                if (status === 'success') {
                	//if 共同成功回呼...
                    resolve(res)
                } else if (status === 'fail') {
                    //共同失敗處理
                    np.errorHandler(res)
                    reject(res)
                }
                np.taskPool.clean(task.id)
            })
        })
    }
    function Task(fetchoptions, options) {
        EventListener.call(this);
        this.fetchoptions = fetchoptions;
        this.options = options;
        this.primary = (options.VIP) ? true : false;
        this.type = options.responseType;
        this.count = 0;
        this.stop = false;
        this.id;
        this.retry = (options.retry) ? options.retry : 1;
        this.sleep = (options.sleep) ? options.sleep : 100;
    }
    Task.prototype = Object.create(EventListener.prototype);
    Task.prototype.constructor = Task;
    Task.prototype.pause = function() {
        this.stop = true;
    }
    Task.prototype.run = function() {
        const me = this;
        this.stop = false;
        new Promise(function(resolve, reject) {
        	let path = (me.fetchoptions.path)?me.fetchoptions.path:'/';
            let url = (me.fetchoptions.url) ? me.fetchoptions.url : me.fetchoptions.host + path;
            fetch(url, me.fetchoptions)
                .then(function(response) {
                    if (!response.ok) {
                        return Promise.reject(response.statusText)
                    }
                    log(`[Task]"${me.options.name}" success with status ${response.status}`)
                    response = (me.type) ? response[me.type]() : response;
                    resolve(response)
                }).catch(function(e) {
                    if (++me.count < me.retry) {
                    	log(`[Task]"${me.options.name}" retry with statusText : ${e}`)
                        setTimeout(function() {
                            if (!me.stop)
                                me.run();
                            else
                            	log(`[Task]"${me.options.name}" stop retry : VIP primary`)
                        }, me.sleep)
                    } else {
                        reject(e)
                        log(`[Task]"${me.options.name}" fail with statusText ${e}`)
                        return;
                    }
                })
        }).then(function(response) {
            me.emit('done', 'success', response)
        }).catch(function(e) {
            me.emit('done', 'fail', e)
        });
    }
    const np = { //namespace
    	log:false,
        taskPool: new TaskPool(5),
        errorHandler: function(e) {},
    }

    np.createRequest = function(fetchopt, opt) {
        return new BesRequest(fetchopt, opt);
    }
    return np;
}