const http = require('http')
const path = require('path')
const bodyParser = require('body-parser');
const express = require('express')
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname)));

app.use((req,res,next)=>{
	res.header('Access-Control-Allow-Origin','*');
	res.header('Access-Control-Allow-Headers', '*')
	next()
})
app.get('/', (req,res)=>{
	res.end('<a href="demo.html">Demo</a><br><a href="fetch.html">Fetch</a>')
})
app.get('/api', (req,res)=>{
	res.end('API response')
})
app.post('/api', (req,res)=>{
	res.end('API response')
})
app.get('/api/delay', (req,res)=>{
	setTimeout(()=>{
		res.end(`現在時間 : ${new Date()}`)
	},1000)
})
let fatalcount =0
app.get('/api/fatal', (req,res)=>{
	if(fatalcount%3!==0)
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

http.createServer(app).listen(3000,()=>{
	console.log('server listen on port 3000')
})