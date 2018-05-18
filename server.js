const http = require('http')
const path = require('path')
const bodyParser = require('body-parser');
const express = require('express')
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req,res,next)=>{
	res.header('Access-Control-Allow-Origin','*');
	res.header('Access-Control-Allow-Headers', '*')
	next()
})
app.use(express.static(path.join(__dirname)));

app.get('/', (req,res)=>{
	res.redirect('/index.html')
})
app.get('/api', (req,res)=>{
	let json={"format":"json"}
	res.end(JSON.stringify(json))
})
app.post('/api', (req,res)=>{
	res.end('API response')
})
app.get('/api/delay', (req,res)=>{
	setTimeout(()=>{
		res.end(`delay 1 s.`)
	},1000)
})
app.get('/api/delay2', (req,res)=>{
	setTimeout(()=>{
		res.end(`delay 3 s`)
	},3000)
})
let fatalcount =0
app.get('/api/fatal', (req,res)=>{
	if(fatalcount%5!==0)
		res.status(500);
	fatalcount++;
	res.end('fatal')
})
app.post('/api/delay', (req,res)=>{
	console.log(req.body)
	setTimeout(()=>{
		res.end(`hello ${req.body.name}`)
	},1000)
})
app.post('/api/logsys', (req,res)=>{
	console.log(req.body)
	res.end()
})
http.createServer(app).listen(3000,()=>{
	console.log('server listen on port 3000')
})