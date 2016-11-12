var env = process.env.NODE_ENV || 'development';
var Sequelize = require('sequelize');
var sequelize;
if (env === 'production') {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres'
    });
} else {
    sequelize = new Sequelize(undefined, undefined, undefined, {
        'dialect': 'sqlite',
        'storage': __dirname + '/data/data-to-api.sqlite'
    });
}
var db = {};
db.todos = sequelize.import(__dirname + '/models/todo.js')
db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;