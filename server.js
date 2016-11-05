var express=require('express');
var app=express();
var PORT= process.env.PORT || 3000;
var bodyParser=require('body-parser');

var todos=[];
var todoNextId=1;

app.use(bodyParser.json());

app.get('/',function(res,res){
    res.send('to do API');
});

app.get('/todos',function(req,res,next){
    res.json(todos);
});

app.get('/todos/:id',function(req,res,next){
    var todosId=req.params.id;
    var result;
    todos.forEach(function(data){
        if  (data.id===todosId){
            result=data;
        }
    })
    if(!result){
    res.status(404).send();
    }
    else{
        res.send(result);
    }
});

app.post('/todos',function(req,res){
    var body=req.body;
    // console.log('description:');
    // console.log(body);
    body.id=todoNextId;
    todos.push(body);
    todoNextId++;
    res.send(body);
})

app.listen(PORT,function(){
    console.log('express is listening on '+PORT);
})