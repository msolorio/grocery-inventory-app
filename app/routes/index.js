module.exports = function(app, passport) {

	require('./loginRouter')(app, passport);
	const usersRouter = require('./usersRouter')(app, passport);
	app.use('/users', usersRouter);

}