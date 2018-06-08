const http = require('http');
const express = require('express');

const webpack = require('webpack');
const prodConfig = require('../webpack.prod.js');
const merge = require('webpack-merge');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser')

const chunks = fs.readdirSync(path.join(__dirname, '../chunk'));

const importStr = (name) => {
    return "import '~/chunk/" + name + "';";
}
//express middleware
const app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, '../')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build.html'))
})
app.get('/doc', (req,res)=>{
	res.sendFile(path.join(__dirname, 'doc.html'))
})
app.get('/chunks', (req, res) => {
    let obj = {
        chunks
    }
    res.end(JSON.stringify(obj))
})
app.post('/build', (req, res) => {
    const selected = req.body.chunks;
    const distName = req.body.fileName || 'utility.min.js';
    if (selected.length === 0){
        res.end(JSON.stringify({ text: 'You didn\' select any chunk.' }));
        return
    }
    let str = '';
    selected.forEach((c) => {
        str += importStr(c);
    })
    fs.writeFile(path.join(__dirname, 'build.web.js'), str, (err) => {
    	if(err){
    		res.end(JSON.stringify({text:err}));
    		return;
    	}
    	const customConfig = merge(prodConfig,{
    		entry:{utility:path.resolve(__dirname,'build.web.js')},
    		output:{
    			 filename: distName
    		}
    	})
        webpack(customConfig, (err, stats) => {
            if (err || stats.hasErrors()) {
                // Handle errors here
                res.end(JSON.stringify({text:'webpack build ERROR'}))
            }
            // Done processing
            res.end(JSON.stringify({text:'OK',link:'/dist/build-scripts/'+distName,name:distName}))
        });
    })
})
//create http server
let port = 3000;
const server = http.createServer(app);
server.on('error', (err) => {
    if (err.code = 'EADDRINUSE') {
        setTimeout(() => {
            server.close();
            server.listen(++port);
        }, 500)
    } else {
        console.log(err.code)
    }
})
server.listen(port, () => {
    console.log('build scripts server on port ' + port)
})