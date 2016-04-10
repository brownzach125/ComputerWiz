// TODO understand mongoose
// TODO use ssl
// TODO hash passwords

var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var config = require('./config'); // get our config file
// =======================
// configuration =========
// =======================
var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
mongoose.connect(config.database); // connect to database TODO have connection fail case
app.set('superSecret', config.secret); // secret variable
app.set('views', './');

app.set('view engine', 'jade')

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// =======================
// routes ================
// =======================
// basic route
app.get('/', function(req, res) {
    res.render('newapp/index');
});

app.get('/views/:view', function(req,res){
   var filename = req.params.view;
   res.render('newapp/' + filename);
});


app.use('/',express.static('./newapp'));

//------------------
// Include routes
//------------------
var userRoutes = require('./app/old/routes/user.js')(app);

// apply the routes to our application with the prefix /api
app.use('/user', userRoutes);

// =======================
// start the gameserver.js ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);