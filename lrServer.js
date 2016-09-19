/**
 *
 * @author hzwangfei3
 * @date   2016/9/18.
 */
'use strict';
var fs = require("fs"),
    path = require("path"),
    events = require('events'),
    colors = require("colors"),
    tinyLr = require("tiny-lr"),
    _livereload = require.resolve("./livereload-js/livereload"),
    gaze = require("gaze"),
    debug   = require('debug')('tinylr:server'),
    cwd = process.cwd();
process.env.DEBUG = process.env.DEBUG || 'tinylr*';
function getCurT(){
    var cur = new Date();
    return "["+colors.gray([cur.getHours(),cur.getMinutes(),cur.getSeconds()].jion(":"))+"]";
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
        console.error(colors/red("Can't found the file '"+options.lrPath+"'"));
    }
    options.delay = parseInt(options.delay) || 200;
    options.pollInterval = parseInt(options.pollInterval) || 200;
    // 1.config server
    var server = tinyLr(options.svrOpts);

    // 2.watch file
    (function(em) {
        em = em || new (events.EventEmitter)();
        // watch event
        var evtArr = ["changed","deleted","added"];// 跟 fs.watch中抛出的event不同[change,rename,add,delete]，且fs.watch不安全，不稳定
        evtArr.forEach(function(evt){
            em.on(evt, function(file) {
                tinyLr.changed(file);//这里不要写成server.changed容易混淆
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
                    // console.log(colors.magenta(event), filepath);
                    !!lrTimer && clearTimeout(lrTimer);
                    lrTimer = setTimeout(function(){
                        console.log(colors.magenta(getCurT() + " File changed, refresh the browser's page!"));
                        em.emit(event, filepath);
                    },options.delay);
                });
            });
    })();

    // print out
    console.log("\r\nLiveReload Configuration:"
           +"\r\n        port = " + colors.magenta(options.port)
           +"\r\n   watchList = " + colors.magenta("["+options.watchList.join(",")+"]")
           +"\r\n      lrPath = " + colors.magenta((!options.lrPath?"default":options.lrPath)+" "+(notFound ? " Not found the file!" : ""))
           +"\r\n       delay = " + colors.magenta(options.delay+"ms")
           +"\r\n   env.DEBUG = " + colors.magenta(process.env.DEBUG)
    );

    // 3.export
    return {
        server:server,
        start:function(port){
            port = port || options.port;
            server.listen(port,function(err) {
                err && console.error(colors.red(JSON.stringify(err,null,4)));
            });
            console.log(colors.green("\r\nStart Livereload on "+port+"!\r\n"));
        }
    };

}

//export
module.exports = lrs;