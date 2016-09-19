/**
 *
 * @author Froguard
 * @date   2016/9/18.
 */
'use strict';
var fs = require("fs"),
    path = require("path"),
    events = require('events'),
    color = require("./color"),
    tinyLr = require("tiny-lr"),
    _livereload = require.resolve("./livereload-js/livereload"),
    gaze = require("gaze"),
    debug   = require('debug')('tinylr:server'),
    cwd = process.cwd();
process.env.DEBUG = process.env.DEBUG || 'tinylr*';
function getCurT(){
    var cur = new Date();
    return "["+color([cur.getHours(),cur.getMinutes(),cur.getSeconds()].join(":"),"gray")+"]";
}
/**
 * options：
 *     priority：process.argv > js-options > default-values
 * @param {Object} options
 *        {Array}  options.watchList      []
 *        {Number} options.port           35729
 *        {File}   options.lrPath         livereload.js file path
 *        {Number} options.delay          200ms    *only config in js-options*
 *        {Number} options.pollInterval   200ms    *only config in js-options*
 *        {Object} options.svrOpts        {}       *only config in js-options*
 */
function lrs(options){

    // 0.options default
    options = options || {};
    options.watchList = (!!process.argv[2] && (""+process.argv[2]).split(",")) || options.watchList || [];
    options.port =  parseInt(process.argv[3]) || parseInt(options.port) || 35729;
    options.lrPath = process.argv[4] || options.lrPath || false;
    var notFound = false;
    options.svrOpts = options.svrOpts || {};
    try{
        options.svrOpts.livereload = !!options.lrPath ? require.resolve(options.lrPath) : _livereload;
    }catch(e){
        notFound = true;
        options.svrOpts.livereload = _livereload;
        console.error(color("Can't found the file '"+options.lrPath+"'","red"));
    }
    options.delay = parseInt(options.delay) || 200;
    options.pollInterval = parseInt(options.pollInterval) || 200;
    // 1.config server
    var server = tinyLr(options.svrOpts);

    // 2.watch file
    (function(em) {
        em = em || new (events.EventEmitter)();
        // watch event
        var evtArr = ["changed","deleted","added"];// different with fs.watch event[change,rename,add,delete]，and fs.watch is unstable & unsafe
        evtArr.forEach(function(evt){
            em.on(evt, function(file) {
                tinyLr.changed(file);//It is not 'server.changed'
            });
        });
        // watch targets
        var targets = [];
        options.watchList.forEach(function(fPath){
            // "../public/dist/**/*.*"
            // targets.push(path.join(__dirname,""+fPath));
            targets.push(path.resolve(cwd, fPath));
        });
        // watch
        gaze(targets,
            {
                interval: options.pollInterval || 200
            },
            function(err,watcher){
                let lrTimer = null;
                this.on('all', function(event, filepath) {
                    !!lrTimer && clearTimeout(lrTimer);
                    lrTimer = setTimeout(function(){
                        console.log(getCurT() + color(" File changed, refresh the browser's page!","cyan"));
                        em.emit(event, filepath);
                    },options.delay);
                });
            });
    })();

    // print out
    console.log("\r\nLiveReload Configuration:"
           +"\r\n        port = " + color(options.port,"yellow")
           +"\r\n   watchList = " + color("["+options.watchList.join(",")+"]","yellow")
           +"\r\n      lrPath = " + color((!options.lrPath?"default":options.lrPath)+" "+(notFound ? " Not found the file!" : ""),"yellow")
           +"\r\n       delay = " + color(options.delay+"ms","yellow")
           +"\r\n   env.DEBUG = " + color(process.env.DEBUG,"yellow")
    );

    // 3.export
    return {
        server:server,
        start:function(port){
            port = port || options.port;
            server.listen(port,function(err) {
                err && console.error(color(JSON.stringify(err,null,4),"red"));
            });
            console.log(color("\r\nStart Livereload on "+port+"!\r\n","green"));
        }
    };

}

//export
module.exports = lrs;