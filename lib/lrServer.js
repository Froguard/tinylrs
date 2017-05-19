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
    // gaze = require("gaze"),//version1.1.2
    // debug   = require('debug')('tinylr:server'),
    cwd = process.cwd();
// process.env.DEBUG = process.env.DEBUG || 'tinylr*';

var chokidar = require('chokidar');

var LOGO = color(
      "\n        ______  _                   __"
    + "\n       /_  __/ (_) ____    __  __  / / _____  _____"
    + "\n        / /   / / / __ \\  / / / / / / / ___/ / ___/"
    + "\n       / /   / / / / / / / /_/ / / / / /    (__  )"
    + "\n      /_/   /_/ /_/ /_/  \\__, / /_/ /_/    /____/"
    + "\n                        /____/","brightCyan"),
    RES_ROOT = null;// simplify msg-str content via wb-server send

function cleanObjEmptyProps(obj){
    for(var i in obj){
        if(obj.hasOwnProperty(i)){
            var oi = obj[i];
            if(oi===undefined || oi===null){
                delete obj[i];
            }
        }
    }
}

function cv(n){
    return n > 9 ? n : ("0"+n);
}
function genGetCurTFn(){
    var cur = new Date();
    var curCalced = false;
    var res = "[" + color([cv(cur.getHours()),cv(cur.getMinutes()),cv(cur.getSeconds())].join(":"), "gray") + "]";
    return function(){
        if(!curCalced){
            cur = new Date();
            res = "[" + color([cv(cur.getHours()),cv(cur.getMinutes()),cv(cur.getSeconds())].join(":"), "gray") + "]";
            curCalced = true;
            setTimeout(function(){
                curCalced = false;
            },300);
        }
        return res;
    }
}
var getCurT = genGetCurTFn();

function warningOut(str){
    console.log(color("[warning]","red","yellow","bold") + color(" "+str,"yellow"));
}
function errorOut(str){
    console.error(color("[error]","brightRed","brightYellow","bold") + color(" "+str,"brightRed"));
}
/**
 * create a tinylrs instance
 *
 * @param {Object} options
 *        {Array}  options.watchList      []
 *        {Number} options.port           35729
 *        {File}   options.lrfile         livereload.js file path
 *        {Object} options.svrOpts        {}       *only config in js-options*
 */
function lrs(options){

    // 0.options default
    options = options || {};
    options.watchList = options.watchList || options.dirs || [];
    options.port =  parseInt(options.port || 0) || 35729;
    options.lrfile = options.lrfile || false;
    var notFound = false;
    options.svrOpts = options.svrOpts || {};
    try{
        options.svrOpts.livereload = !!options.lrfile ? require.resolve(options.lrfile) : _livereload;
    }catch(e){
        notFound = true;
        options.svrOpts.livereload = _livereload;
        errorOut("The file '" + path.join(cwd,options.lrfile) + "' wasn't found, the build-in file would work.");
    }
    // options.debounceDelay = parseInt(options.debounceDelay) || null;
    // options.pollInterval = parseInt(options.pollInterval) || null;
    // options.mode = options.mode || 'poll';
    options.rootDir = "" + (options.rootDir || "./");
    options.rootDir = options.rootDir.replace(/^(\s|\u00A0)+/,'').replace(/(\s|\u00A0)+$/,'').replace(/\'|\"/g,"");
    RES_ROOT = path.join(cwd,options.rootDir);

    // 1.config server
    var server = tinyLr(options.svrOpts);
    var sendMsgTimer = null;
    function sendMsg(msg){
        sendMsgTimer && clearTimeout(sendMsgTimer);
        sendMsgTimer = setTimeout(function(){
            tinyLr.changed(msg);//It is not 'server.changed({ params: { files: files }})'
        }, 0);
    }

    // 2.watch file
    (function() {
        var em = new (events.EventEmitter)();
        // watch event
        var evtArr = [
            // "added","changed","deleted",// gaze event
            "add","change","unlink"
        ];// different with fs.watch event[change,rename,add,delete] and fs.watch is unstable & unsafe
        evtArr.forEach(function(evt){
            em.on(evt, function(file) {
                file = path.normalize(file);
                // file = path.relative(cwd,file).replace(/\\/g,"/") || file;
                file = path.relative(RES_ROOT,file).replace(/\\/g,"/") || file || "error/path";
                console.log(getCurT() + " Send-Changed: " + color(file,"cyan"));
                // send msg of changed file info
                // sendMsg(file || "index.html");
                tinyLr.changed(file || "index.html");//It is not 'server.changed({ params: { files: files }})'
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
                targets.push(path.resolve(cwd, fPath));//absolute file path
            }
        });

        /*
        // watcher1：gaze
        // var gOpts = {
        //     interval: options.pollInterval,
        //     debounceDelay: options.debounceDelay,
        //     mode: options.mode || 'poll'
        // };
        // cleanObjEmptyProps(gOpts);
        // // console.log(gOpts);
        // // watch
        // gaze(targets,
        //     gOpts,
        //     function(err,watcher){
        //         if(err){
        //             console.log(color('Error:\r\n','red'), err);
        //         }
        //         this.on('all', function(event, filepath) {//filePath is a absolute file address
        //             // console.log(getCurT() + " Catch-Changed: " + "  " + color(filepath,"cyan"));
        //             event = !~evtArr.indexOf(event) ? 'changed' : event;
        //             em.emit(event, filepath);
        //         });
        //     }
        // );
        */

        // watcher2：chokidar
        var watcher = chokidar.watch(targets, {
            ignored: /(^|[\/\\])\../,
            ignoreInitial: false,
            persistent: true
            // followSymlinks: true,
            // cwd: '.',
            // disableGlobbing: false,
            // usePolling: true,
            // interval: 100,
            // binaryInterval: 300,
            // alwaysStat: false,
            // depth: 99,
            // awaitWriteFinish: {
            //   stabilityThreshold: 2000,
            //   pollInterval: 100
            // },
            // ignorePermissionErrors: false,
            // atomic: true // or a custom 'atomicity delay', in milliseconds (default 100) 
        });
        watcher.on('all', function(event, filepath){
            // console.log(getCurT() + " Catch-Changed: " + "  " + color(filepath,"cyan"));
            event = !~evtArr.indexOf(event) ? 'change' : event;
            em.emit(event, filepath);
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
        + "\n      lrfile = " + color(!options.lrfile ? "default" : (notFound ? "default (Cause the file wasn't found!)" : options.lrfile),"yellow")
        + "\n        mode = " + color(options.mode, "yellow")
        // +"\n   env.DEBUG = " + color(process.env.DEBUG,"yellow")
    );
    // warn
    if(!options.watchList.length){
        warningOut("Are you sure that options.watchList(the watch 'dirs') is a empty array?Check it (dirs),plz!");
    }

    // 3.export
    return {
        server:server,
        start:function(port){
            port = port || options.port;
            server.listen(port,function() {
                console.log(color("Start Livereload on " + port + " success!" + (!options.watchList.length?" But it reports some warnings!":"") + "\n","green"));
            });
            // server.on("error",function(e){
            //     console.log(e);
            // });
        }
    };

}

//export
module.exports = lrs;
