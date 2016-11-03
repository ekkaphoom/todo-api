var express=require('express');
var app=express();
var PORT= process.env.PORT || 3000;

app.get('/',function(res,res){
    res.send('to do API');
});

app.listen(PORT,function(){
    console.log('express is listening on '+PORT);
})