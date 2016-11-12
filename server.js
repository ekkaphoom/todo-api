var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var todos = [];
var todoNextId = 1;
app.use(bodyParser.json());
app.get('/', function(res, res) {
    res.send('to do API');
});
app.get('/todos', function(req, res, next) {
    var queryParams = req.query;
    var filterTodos = todos;     
    var where = {};
    if (queryParams.hasOwnProperty('completed')) {
        var completed = queryParams.completed === 'true' ? true : false;
        where.completed = completed
    }
    if (queryParams.hasOwnProperty('q') && _.isString(queryParams.q) && queryParams.q.length > 0) {
       var q = queryParams.q;
       where.description={
            $like:'%'+q+'%'
       };
    }
    db.todos.findAll({where:where}).then(function(todos){
        if(todos){
            res.send(todos);
        }
        else{
            res.status(404).send();
        }

    },function(err){
        res.status(500).send(err);
    })
        // if (queryParams.hasOwnProperty('completed')) {
        //     var completed = queryParams.completed === 'true' ? true : false;
        //     filterTodos = _.where(filterTodos, {
        //         completed: completed
        //     });
        // }
        // if (queryParams.hasOwnProperty('q') && _.isString(queryParams.q) && queryParams.q.length > 0) {
        //     var q = queryParams.q;
        //     filterTodos = _.filter(filterTodos, function(todo) {
        //         return todo.description.indexOf(q) > 0
        //     })
        // }
        // res.json(filterTodos);
});
app.get('/todos/:id', function(req, res, next) {
    var todosId = parseInt(req.params.id, 10);
    db.todos.findById(todosId).then(function(todo) {
            if (todo) {
                res.json(todo.toJSON());
            } else {
                res.status(404).send();
            }
        }, function(err) {
            res.status(500).send(err);
        })
        // var result = _.findWhere(todos, {
        //     id: todosId
        // });
        // if (!result) {
        //     res.status(404).send();
        // } else {
        //     res.send(result);
        // }
});
app.post('/todos', function(req, res) {
    var body = _.pick(req.body, 'description', 'completed');
    db.todos.create(body).then(function(todo) {
            res.send(todo.toJSON());
        }, function(e) {
            res.status(400).json(e);
        })
        // if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
        //     res.status(400).send();
        // }
        // body.description = body.description.trim();
        // body.id = todoNextId;
        // todos.push(body);
        // todoNextId++;
        // res.send(body);
})
app.delete('/todos/:id', function(req, res, next) {
    var todosId = parseInt(req.params.id);
    var deleted_obj = _.findWhere(todos, {
        id: todosId
    });
    if (!deleted_obj) {
        res.status(404).send({
            error: 'cannot found todo item'
        });
    } else {
        todos = _.without(todos, deleted_obj);
    }
    res.send(deleted_obj);
});
app.put('/todos/:id', function(req, res) {
    var todosId = parseInt(req.params.id, 10);
    var body = _.pick(req.body, 'description', 'completed');
    var validAttributed = {};
    var match_obj = _.findWhere(todos, {
        id: todosId
    });
    if (!match_obj) {
        return res.status(404).send({
            error: "not found"
        });
    }
    console.log(body.completed);
    console.log(body.hasOwnProperty('completed'))
    if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
        validAttributed.completed = body.completed;
    } else {
        return res.status(400).send({
            error: "completed is not valid"
        });
    }
    if (body.hasOwnProperty('description') && _.isString(body.description) && (body.description.trim().length != 0)) {
        validAttributed.description = body.description;
    } else if (body.hasOwnProperty('description')) {
        return res.status(400).send({
            error: "description is not valid"
        });
    }
    // var todo_obj = _.findWhere(todos, {
    //     id: todosId
    // });
    // todo_obj = validAttributed;
    _.extend(match_obj, validAttributed);
    return res.send(todos);
})
db.sequelize.sync().then(function() {
    app.listen(PORT, function() {
        console.log('express is listening on ' + PORT);
    });
});