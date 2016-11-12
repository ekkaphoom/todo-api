var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect': 'sqlite',
    'storage': __dirname + '/basic-sqlite-data.sqlite'
});
var Todo = sequelize.define('todos', {
    description: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [1, 250]
        }
    },
    completed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});
sequelize.sync({
    force: true
}).then(function() {
    console.log('everthing is sync');
    // Todo.create({
    //     description: 'Walking my dog',
    //     completed: false
    // }).then(function(todo) {
    //     return Todo.create({
    //         description: 'clean office'
    //     });
    // }).then(function() {
    //     return Todo.findAll({
    //         where:{
    //             completed: false
    //         }
    //     });
    // }).then(function(todos) {
    //     if (todos) {
    //      todos.forEach(function(todo){
    //         console.log(todo.toJSON());
    //      })
    //     } else {
    //         console.log('no todo');
    //     }
    // }).catch(function(e) {
    //     console.log(e);
    // })
});