#!/usr/bin/env node

const express = require('express')
const app = express()
let port = 3001 
var parseString = require('xml2js').parseString;
var excors = require('cors')
var str2ab = require('string-to-arraybuffer')
const path = require('path');
const opn = require('opn');

app.use(excors())
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

const axios = require('axios');
const util = require('util')

app.use(express.static(path.join(__dirname, 'public'))) 


app.get( '/' ,  function(req , res ){
    res.send('Test 1 2 3....');
    res.redirect("index.html")
    //res.sendFile( './index.html' );
});

app.get( '/api/MessageProcessingLogs' ,  function(req , res ){
    var login = req.headers.login;
    var server_URL = 'MessageProcessingLogs?%24orderby=LogEnd%20desc';

    if(login){
        //Gerekli verileri alalım.
        var URL = req.headers.url;
        var username = req.headers.username;
        var password = req.headers.password;

        var auth = Buffer.from(username+':'+password).toString('base64')
        var header = {
            'Authorization':'Basic ' + auth,
            'Accept':'*/*'
        };

        var MessageProcessingLogURL = URL + '/api/v1/' + server_URL;
        console.log(MessageProcessingLogURL);
        axios({
            method: 'get',
            url: MessageProcessingLogURL,
            responseType: 'document',
            headers:header
        })
        .then(function (response) {
            parseString(response.data,{trim: true}, function (err, result) {
                console.log(util.inspect(result, {showHidden: false, depth: null}))
                res.set('Content-Type', 'application/json; type=feed;charset=utf-8');
                return res.status(200).send( result );
            });
        })
        .catch(function (error) {
            parseString(error.response,{trim: true}, function (err, result) {
                console.log(util.inspect(result, {showHidden: false, depth: null}))
                res.set('Content-Type', 'application/json; type=feed;charset=utf-8');
                return res.status(error.response.status).send( result );
            });
        });

    }else{
        return res.status(400).send( "You need to login first." );
    }

});

app.get( '/api/GetMessageProcessingLogs' ,  function(req , res ){
    var login = req.headers.login;
   
    if(login){
        //Gerekli verileri alalım.
        var URL = req.headers.url;
        var username = req.headers.username;
        var password = req.headers.password;
        var url_info = req.headers.url_info;

        var auth = Buffer.from(username+':'+password).toString('base64')
        var header = {
            'Authorization':'Basic ' + auth,
            'Accept':'*/*'
        };

        var MessageProcessingLogURL = URL + '/api/v1/' + url_info;
        console.log(MessageProcessingLogURL);
        axios({
            method: 'get',
            url: MessageProcessingLogURL,
            responseType: 'document',
            headers:header
        })
        .then(function (response) {
            parseString(response.data,{trim: true}, function (err, result) {
                console.log(util.inspect(result, {showHidden: false, depth: null}))
                res.set('Content-Type', 'application/json; type=feed;charset=utf-8');
                return res.status(200).send( result );
            });
        })
        .catch(function (error) {
            parseString(error.response,{trim: true}, function (err, result) {
                console.log(util.inspect(result, {showHidden: false, depth: null}))
                res.set('Content-Type', 'application/json; type=feed;charset=utf-8');
                return res.status(error.response.status).send( result );
            });
        });

    }else{
        return res.status(400).send( "You need to login first." );
    }

});

app.get( '/api/CustomHeaders/:messageid' ,  function(req , res ){
    var login = req.headers.login;
    var server_URL = 'MessageProcessingLogs(\''+req.params["messageid"]+'\')/CustomHeaderProperties';

    if(login){
        //Gerekli verileri alalım.
        var URL = req.headers.url;
        var username = req.headers.username;
        var password = req.headers.password;

        var auth = Buffer.from(username+':'+password).toString('base64')
        var header = {
            'Authorization':'Basic ' + auth,
            'Accept':'*/*'
        };
        var MessageCustomHeadersURL = URL + '/api/v1/' + server_URL;
        console.log(MessageCustomHeadersURL);
        axios({
            method: 'get',
            url: MessageCustomHeadersURL,
            responseType: 'document',
            headers:header
        })
        .then(function (response) {
            parseString(response.data,{trim: true}, function (err, result) {
                console.log(util.inspect(result, {showHidden: false, depth: null}))
                res.set('Content-Type', 'application/json; type=feed;charset=utf-8');
                return res.status(200).send( result );
            });
        })
        .catch(function (error) {
            parseString(error.response,{trim: true}, function (err, result) {
                console.log(util.inspect(result, {showHidden: false, depth: null}))
                res.set('Content-Type', 'application/json; type=feed;charset=utf-8');
                return res.status(error.response.status).send( result );
            });
        });



    }else{
        return res.status(400).send( "You need to login first." );
    }

});


app.get( '/api/MessageAttachment/:messageid' ,  function(req , res ){
    var login = req.headers.login;
    var server_URL = 'MessageProcessingLogs(\''+req.params["messageid"]+'\')/Attachments';

    if(login){
        //Gerekli verileri alalım.
        var URL = req.headers.url;
        var username = req.headers.username;
        var password = req.headers.password;

        var auth = Buffer.from(username+':'+password).toString('base64')
        var header = {
            'Authorization':'Basic ' + auth,
            'Accept':'*/*'
        };
        var MessageAttachmentURL = URL + '/api/v1/' + server_URL;
        console.log(MessageAttachmentURL);
        axios({
            method: 'get',
            url: MessageAttachmentURL,
            responseType: 'document',
            headers:header
        })
        .then(function (response) {
            parseString(response.data,{trim: true}, function (err, result) {
                console.log(util.inspect(result, {showHidden: false, depth: null}))
                res.set('Content-Type', 'application/json; type=feed;charset=utf-8');
                return res.status(200).send( result );
            });
        })
        .catch(function (error) {
            parseString(error.response,{trim: true}, function (err, result) {
                console.log(util.inspect(result, {showHidden: false, depth: null}))
                res.set('Content-Type', 'application/json; type=feed;charset=utf-8');
                return res.status(error.response.status).send( result );
            });
        });



    }else{
        return res.status(400).send( "You need to login first." );
    }

});

app.get( '/api/MessageRuns/:messageid' ,  function(req , res ){
    var login = req.headers.login;
    var server_URL = 'MessageProcessingLogs(\''+ req.params["messageid"]+ '\')/Runs';

    if(login){
        //Gerekli verileri alalım.
        var URL = req.headers.url;
        var username = req.headers.username;
        var password = req.headers.password;

        var auth = Buffer.from(username+':'+password).toString('base64')
        var header = {
            'Authorization':'Basic ' + auth,
            'Accept':'*/*'
        };
        var MessageRunSteps = URL + '/api/v1/' + server_URL;
        console.log(MessageRunSteps);
        axios({
            method: 'get',
            url: MessageRunSteps,
            responseType: 'document',
            headers:header
        })
        .then(function (response) {
            parseString(response.data,{trim: true}, function (err, result) {
                console.log(util.inspect(result, {showHidden: false, depth: null}))
                res.set('Content-Type', 'application/json; type=feed;charset=utf-8');
                return res.status(200).send( result );
            });
        })
        .catch(function (error) {
            parseString(error.response,{trim: true}, function (err, result) {
                console.log(util.inspect(result, {showHidden: false, depth: null}))
                res.set('Content-Type', 'application/json; type=feed;charset=utf-8');
                return res.status(error.response.status).send( result );
            });
        });



    }else{
        return res.status(400).send( "You need to login first." );
    }

});

app.get( '/api/RunSteps/:messageid' ,  function(req , res ){
    var login = req.headers.login;
    var server_URL = 'MessageProcessingLogRuns(\''+req.params["messageid"]+'\')/RunSteps';

    if(login){
        //Gerekli verileri alalım.
        var URL = req.headers.url;
        var username = req.headers.username;
        var password = req.headers.password;

        var auth = Buffer.from(username+':'+password).toString('base64')
        var header = {
            'Authorization':'Basic ' + auth,
            'Accept':'*/*'
        };
        var MessageRunAllSteps = URL + '/api/v1/' + server_URL;
        console.log(MessageRunAllSteps);
        axios({
            method: 'get',
            url: MessageRunAllSteps,
            responseType: 'document',
            headers:header
        })
        .then(function (response) {
            parseString(response.data,{trim: true}, function (err, result) {
                console.log(util.inspect(result, {showHidden: false, depth: null}))
                res.set('Content-Type', 'application/json; type=feed;charset=utf-8');
                return res.status(200).send( result );
            });
        })
        .catch(function (error) {
            parseString(error.response,{trim: true}, function (err, result) {
                console.log(util.inspect(result, {showHidden: false, depth: null}))
                res.set('Content-Type', 'application/json; type=feed;charset=utf-8');
                return res.status(error.response.status).send( result );
            });
        });



    }else{
        return res.status(400).send( "You need to login first." );
    }

});


app.get( '/api/MessageErrorLog/:messageid' ,  function(req , res ){
    var login = req.headers.login;
    var server_URL = 'MessageProcessingLogs(\''+req.params["messageid"]+'\')/ErrorInformation';

    if(login){
        //Gerekli verileri alalım.
        var URL = req.headers.url;
        var username = req.headers.username;
        var password = req.headers.password;

        var auth = Buffer.from(username+':'+password).toString('base64')
        var header = {
            'Authorization':'Basic ' + auth,
            'Accept':'*/*'
        };
        var MessageErrorLogURL = URL + '/api/v1/' + server_URL;
        console.log(MessageErrorLogURL);
        axios({
            method: 'get',
            url: MessageErrorLogURL,
            responseType: 'document',
            headers:header
        })
        .then(function (response) {
            parseString(response.data,{trim: true}, function (err, result) {
                console.log(util.inspect(result, {showHidden: false, depth: null}))
                res.set('Content-Type', 'application/json; type=feed;charset=utf-8');
                return res.status(200).send( result );
            });
        })
        .catch(function (error) {
            parseString(error.response,{trim: true}, function (err, result) {
                console.log(util.inspect(result, {showHidden: false, depth: null}))
                res.set('Content-Type', 'application/json; type=feed;charset=utf-8');
                return res.status(error.response.status).send( result );
            });
        });



    }else{
        return res.status(400).send( "You need to login first." );
    }

});


app.get( '/api/GetAttachment/:messageid' ,  function(req , res ){
    var login = req.headers.login;
    var server_URL = 'MessageProcessingLogAttachments(\''+req.params["messageid"]+'\')/$value';

    if(login){
        //Gerekli verileri alalım.
        var URL = req.headers.url;
        var username = req.headers.username;
        var password = req.headers.password;

        var auth = Buffer.from(username+':'+password).toString('base64')
        var header = {
            'Authorization':'Basic ' + auth,
            'Accept':'*/*'
        };
        var MessageAttachment = URL + '/api/v1/' + server_URL;
        console.log(MessageAttachment);
        axios({
            method: 'get',
            url: MessageAttachment,
            responseType: 'text',
            headers:header
        })
        .then(function (response) {
            console.log(util.inspect(response.data, {showHidden: false, depth: null}))
            //var buffer = str2ab(response.data)
            return res.status(200).send( response.data );
        })
        .catch(function (error) {
            console.log( error )
            parseString(error.response,{trim: true}, function (err, result) {
                console.log(util.inspect(result, {showHidden: false, depth: null}))
                res.set('Content-Type', 'application/json; type=feed;charset=utf-8');
                return res.status(error.response.status).send( result );
            });
        });



    }else{
        return res.status(400).send( "You need to login first." );
    }

});


app.get( '/api/ErrorLogValue/:messageid' ,  function(req , res ){
    var login = req.headers.login;
    var server_URL = 'MessageProcessingLogErrorInformations(\''+req.params["messageid"]+'\')/$value';

    if(login){
        //Gerekli verileri alalım.
        var URL = req.headers.url;
        var username = req.headers.username;
        var password = req.headers.password;

        var auth = Buffer.from(username+':'+password).toString('base64')
        var header = {
            'Authorization':'Basic ' + auth,
            'Accept':'*/*'
        };
        var MessageErrorLogURL = URL + '/api/v1/' + server_URL;
        console.log(MessageErrorLogURL);
        axios({
            method: 'get',
            url: MessageErrorLogURL,
            responseType: 'text',
            headers:header
        })
        .then(function (response) {
            console.log( response.data )
            res.set('Content-Type', 'text/plain; type=feed;charset=utf-8');
            return res.status(200).send( response.data );
        })
        .catch(function (error) {
            console.log( error.response )
            parseString(error.response,{trim: true}, function (err, result) {
                console.log(util.inspect(result, {showHidden: false, depth: null}))
                res.set('Content-Type', 'application/json; type=feed;charset=utf-8');
                return res.status(error.response.status).send( result );
            });
        });



    }else{
        return res.status(400).send( "You need to login first." );
    }

});

app.locals.data = null;

app.listen
(
    port, () => {
            console.log(`Listening on port ${port}!`)
    }
)

opn('http://localhost:'+port);