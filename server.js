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
app.get('/api/delay', (req,res)=>{
	setTimeout(()=>{
		res.end(`現在時間 : ${new Date()}`)
	},1000)
})
app.post('/api/delay', (req,res)=>{
	setTimeout(()=>{
		res.end(`hello ${req.body.name}`)
	},1000)
})

http.createServer(app).listen(3000,()=>{
	console.log('server listen on port 3000')
})