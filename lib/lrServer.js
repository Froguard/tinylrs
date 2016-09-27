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
    _livereload = require.resolve("./livereload-js/livereload.js"),
    gaze = require("gaze"),
    // debug   = require('debug')('tinylr:server'),
    cwd = process.cwd();
// process.env.DEBUG = process.env.DEBUG || 'tinylr*';

var LOGO = color(
      "\n        ______  _                   __"
    + "\n       /_  __/ (_) ____    __  __  / / _____  _____"
    + "\n        / /   / / / __ \\  / / / / / / / ___/ / ___/"
    + "\n       / /   / / / / / / / /_/ / / / / /    (__  )"
    + "\n      /_/   /_/ /_/ /_/  \\__, / /_/ /_/    /____/"
    + "\n                        /____/","brightCyan"),
    RES_ROOT = null;

function cv(n){
    return n > 9 ? n : ("0"+n);
}
function getCurT(){
    var res,cur = new Date();
    res = "[" + color([cv(cur.getHours()),cv(cur.getMinutes()),cv(cur.getSeconds())].join(":"), "gray") + "]";
    return res;
}
function warningOut(str){
    console.log(color("[warning]","red","yellow","bold") + color(" "+str,"yellow"));
}
/**
 * create a tinylrs instance
 *
 * @param {Object} options
 *        {Array}  options.watchList      []
 *        {Number} options.port           35729
 *        {File}   options.lrPath         livereload.js file path
 *        {Number} options.debounceDelay  300ms    *only config in js-options*
 *        {Number} options.pollInterval   100ms    *only config in js-options*
 *        {Object} options.svrOpts        {}       *only config in js-options*
 */
function lrs(options){

    // 0.options default
    options = options || {};
    options.watchList = options.watchList || options.dirs || [];
    options.port =  parseInt(options.port || 0) || 35729;
    options.lrPath = options.lrPath || false;
    var notFound = false;
    options.svrOpts = options.svrOpts || {};
    try{
        options.svrOpts.livereload = !!options.lrPath ? require.resolve(options.lrPath) : _livereload;
    }catch(e){
        notFound = true;
        options.svrOpts.livereload = _livereload;
        console.error(color("Can't found the file '"+options.lrPath+"'","red"));
    }
    options.debounceDelay = parseInt(options.debounceDelay) || 300;
    options.pollInterval = parseInt(options.pollInterval) || 200;
    options.rootDir = "" + (options.rootDir || "./");
    options.rootDir = options.rootDir.replace(/^(\s|\u00A0)+/,'').replace(/(\s|\u00A0)+$/,'').replace(/\'|\"/g,"");
    RES_ROOT = path.join(cwd,options.rootDir);

    // 1.config server
    var server = tinyLr(options.svrOpts);

    // 2.watch file
    (function(em) {
        em = em || new (events.EventEmitter)();
        // watch event
        var evtArr = ["changed","deleted","added"];// different with fs.watch event[change,rename,add,delete] and fs.watch is unstable & unsafe
        evtArr.forEach(function(evt){
            em.on(evt, function(file) {
                file = path.normalize(file);
                // file = path.relative(cwd,file).replace(/\\/g,"/") || file;
                file = path.relative(RES_ROOT,file).replace(/\\/g,"/") || file || "error/path";
                console.log(getCurT() + " Catch: " + color(file,"cyan"));
                // send msg of changed file info
                tinyLr.changed(file || "/index.html");//It is not 'server.changed({ params: { files: files }})'
            });
        });
        // watch targets
        var targets = [];
        options.watchList.forEach(function(fPath,index){
            // "../public/dist/**/*.*"
            // targets.push(path.join(__dirname,""+fPath));
            if(typeof(fPath)!="string"){
                warningOut("Make sure typeof watchList["+index+"] is a string!");
            }else{
                targets.push(path.resolve(cwd, fPath));
            }
        });
        // watch
        gaze(targets,
            {
                interval: options.pollInterval,
                debounceDelay: options.debounceDelay
            },
            function(err,watcher){
                this.on('all', function(event, filepath) {
                    // console.log(getCurT() + " Catch-Changed: " + color(filepath,"cyan"));
                    em.emit(event, filepath);//filePath is a absolute file address
                });
            });
    })();

    // print out
    console.log(LOGO + "\n"
        + "\nLiveReload Configuration:"
        + "\n        port = " + color(options.port, "yellow")
        + (
        !options.watchList.length ?
          "\n   watchList = " + color("[ ] (empty!)", "yellow") :
        ( "\n   watchList = " + color("["
        + "\n                 " + options.watchList.join(","
        + "\n                 " )
        + "\n               ]", "yellow"))
        )
        + "\n     rootDir = " + color(options.rootDir, "yellow")
        + "\n      lrPath = " + color((!options.lrPath ? "default" : options.lrPath ) + " " + (notFound ? " Not found the file!" : ""),"yellow")
        // +"\n   env.DEBUG = " + color(process.env.DEBUG,"yellow")
    );
    // warn
    if(!options.watchList.length){
        console.warn(color("[warning]","red","yellow","bold") + color(" Are you sure that options.watchList(the watch 'dirs') is a empty array?Check it (dirs),plz!","yellow"));
    }

    // 3.export
    return {
        server:server,
        start:function(port){
            port = port || options.port;
            server.listen(port,function(err) {
                err && console.error(color(JSON.stringify(err,null,4),"red"));
            });
            // server.on("error",function(e){
            //     console.log(e);
            // });
            console.log(color("Start Livereload on " + port + " success!" + (!options.watchList.length?" But it reports some warnings!":"") + "\n","green"));
        }
    };

}

//export
module.exports = lrs;
