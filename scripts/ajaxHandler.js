function BesAjaxRequest() {
    const np = new Object()

    function log(title, mes) {
        if (np.log)
            console.log(`[${title}] : ${mes}`);
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
        if (this.listener[fName])
            this.listener[fName].apply(this, args);
    }

    function TaskPool() {
        EventListener.call(this)
        this.exePool = [];
        this.waitingPool = [];
        this.idList = {};
        let me = this;
        this.on('clean', function() {
            me.checkWaiting()
        })
        this.on('update', function() {
            if (me.timer) {
                clearTimeout(me.timer)
            }
            me.timer = setTimeout(function() {
                me.execute();
            }, 0)
        })
    }
    TaskPool.prototype = Object.create(EventListener.prototype);
    TaskPool.prototype.constructor = TaskPool;
    TaskPool.prototype.execute = function() {
        this.exePool.forEach(function(task) {
            if (!task.start) {
                task.run();
            } else if (task.start && task.stop) {
                task.stop = false;
                task.run();
            }
        })
        console.log(this.exePool.length,this.waitingPool.length)
        log('TaskPool', 'execute all task in exePool');
    }
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
    // TaskPool.prototype.addTask = function(task) {
    // 	//---name
    //     // console.log(this.exePool.length, maxSize)
    //     // let names = []
    //     // this.exePool.forEach(function(t) {
    //     //     names.push(t.options.name)
    //     // })
    //     // console.log(names)
    //     //----
    //     console.log('----addTask----')
    //     let maxSize = np.poolSize;
    //     let me = this;
    //     task.id = this.getUniqueId(5);
    //     //檢查pool大小，加入pool,pool已滿 查看是否primary task 
    //     if(this.exePool.length< maxSize){
    //     	this.exePool.push(task)
    //     	this.emit('update')
    //     } else{
    //     	let lessIndex=this.exePool.findIndex(function(t){
    //     		return t.primary>task.primary
    //     	})
    //     	if(lessIndex>=0){
    //     		console.log('代替'+lessIndex)
    //     		let less = this.exePool[lessIndex];
    //     		less.pause()
    //     		this.waitingPool.push(less);
    //     		this.exePool.splice(lessIndex,1)
    //     	}
    //     }
    //     // if (this.exePool.length >= maxSize) {
    //     //     log('TaskPool', 'exePool is full')
    //     //     let less = this.exePool.find(function(t, index) {
    //     //         if (t.primary > task.primary) { //如果有less primary, 移動到waiting pool
    //     //             let task = me.exePool[index];
    //     //             log('TaskPool', `move less primary task "${task.options.name}" from exePool to waitingPool and pause it.`)
    //     //             t.pause();
    //     //             me.exePool.splice(index, 1);
    //     //             me.waitingPool.push(t)
    //     //         } 
    //     //         return t.primary > task.primary
    //     //     })
    //     // } else if (this.exePool.length < maxSize) {
    //     //     log('TaskPool', `put task "${task.options.name}" to exePool`)
    //     //     console.log('TaskPool', `put task "${task.options.name}" to exePool`)
    //     //     console.log(this.exePool.push(task))
    //     //     //---name
    //     //     // console.log(this.exePool.length, maxSize)
    //     //     // let names = []
    //     //     // this.exePool.forEach(function(t) {
    //     //     //     names.push(t.options.name)
    //     //     // })
    //     //     // console.log(names)
    //     //     //----
    //     //     this.emit('update')
    //     // } 
    //     // else {
    //     //     log('TaskPool', `put task "${task.options.name}" to waitingPool`)
    //     //     this.waitingPool.push(task)
    //     // }
    // }
    
    TaskPool.prototype.clean = function(id) {
        let index = this.exePool.findIndex(function(t) {
            return t.id === id
        })
        this.exePool.splice(index, 1)
        this.releaseId(id)
        this.emit('clean')
    }
    TaskPool.prototype.transfer = function(index) {
        let task = this.exePool[index];
        log('TaskPool', `move less primary task "${task.options.name}" from exePool to waitingPool and pause it.`)
        task.pause();
        this.exePool.splice(index, 1);
        this.waitingPool.push(task)
    }
    TaskPool.prototype.checkWaiting = function() {
        log('TaskPool', 'checkWaiting')
        if (this.waitingPool.length > 0) {
            this.waitingPool.sort(function(a, b) {
                return a.primary - b.primary;
            })
            let task = this.waitingPool.shift()
            this.addTask(task)
            log('TaskPool', `move task "${task.options.name}" from waitingPool to exePool`)
        } else {
            log('TaskPool', 'waitingPool is empty')
        }
    }

    function BesRequest(fetchopt, opt) {
        EventListener.call(this);
        this.fetchoptions = fetchopt;
        this.options = opt;
        this.fetchoptions.headers = new Headers(fetchopt.headers)
    }
    BesRequest.prototype = Object.create(EventListener.prototype);
    BesRequest.prototype.constructor = BesRequest;
    BesRequest.prototype.clone = function() {
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
    BesRequest.prototype.send = function() {
        log('BesRequest', 'Besrequest.send()')
        const task = new Task(this.fetchoptions, this.options);
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
        this.primary = (options.primary) ? options.primary : 1;
        this.type = options.responseType;
        this.count = 0;
        this.stop = false;
        this.start = false;
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
        console.log(`${this.options.name}: run`)
        const me = this;
        if (!this.start)
            this.start = true;
        if (!this.stop)
            this.stop = false;
        new Promise(function(resolve, reject) {
            let path = (me.fetchoptions.path) ? me.fetchoptions.path : '/';
            let query = (me.fetchoptions.query) ? me.fetchoptions.query : '?';
            let url = (me.fetchoptions.url) ? me.fetchoptions.url + query : me.fetchoptions.host + path + query;
            fetch(url, me.fetchoptions)
                .then(function(response) {
                    if (!response.ok) { //fetch won't catch 404, 500 error, etc...check response.ok
                        return Promise.reject(response.statusText)
                    }
                    log('Task', `task "${me.options.name}" success with status ${response.status}`)
                    response = (me.type) ? response[me.type]() : response;
                    resolve(response)
                }).catch(function(e) {
                    if (++me.count < me.retry) {
                        log('Task', `task "${me.options.name}" will retry with statusText : ${e}, has retried ${me.count} times`)
                        setTimeout(function() {
                            if (!me.stop)
                                me.run();
                            else
                                log('Task', `task "${me.options.name}" stop retry due to pause.`)
                        }, me.sleep)
                    } else {
                        reject(e)
                        log('Task', `task "${me.options.name}" fail with statusText ${e}`)
                        return;
                    }
                })
        }).then(function(response) {
            me.emit('done', 'success', response)
        }).catch(function(e) {
            me.emit('done', 'fail', e)
        });
    }
    np.log = false;
    np.poolSize = 5;
    np.taskPool = new TaskPool();
    np.errorHandler = function(e) {};
    np.createRequest = function(fetchopt, opt) {
        return new BesRequest(fetchopt, opt);
    }
    return np;
}