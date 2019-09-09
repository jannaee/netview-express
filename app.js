const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const showsRouter = require('./routes/shows');
const publicDirPath = "./public"; //public path for express engine rendering

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
/**
 * cors middleware
 */
/*app.use(cors({
    origin:[
        "http://localhost:3000",
        "https://www.newsobserver.com"
    ],
    credentials: true
})); */

app.use(cors());

app.use(express.static(publicDirPath));
// NetView - add middleware
app.use('/shows', showsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});
// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
