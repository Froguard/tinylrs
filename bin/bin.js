#!/usr/bin/env node
/**
 * liveReload
 * @author Froguard
 * @date   2016/9/19.
 */
var args = require('minimist')(process.argv.slice(2)),
    version = require("../package.json").version,
    isWin = !!process.platform.match(/win32|win64/g),
    color = require("../lib/color"),
    path = require("path");

// console.log(JSON.stringify(args,4,null));
// console.log("args._[0] = "+args._[0]);

/*
args value is different in env between osx and windows
$ tinylrs ./*.js
win: {"_":["./*.js"]}
osx: {"_":["./jsfile1.js","./jsfile2.js","./jsfile3.js",...]}//put all matched file into var '_'
*/
function trimAndDelQutoChar(str){
    return typeof(str)!="string" ? 0 : str.replace(/^(\s|\u00A0)+/,'').replace(/(\s|\u00A0)+$/,'').replace(/\'|\"/g,"");
}
function warningOut(str){
    console.warn(color("[warning]","red","yellow","bold") + color(" "+str,"yellow"));
}
function errorOut(str){
    console.error(color("[error]","brightRed","brightYellow","bold") + color(" "+str,"brightRed"));
}
function help(){
    console.log("\n  tinylrs "+version+"\n"
        + "\n  Usage:  tinylrs [options]\n"
        + "\n     eg:  tinylrs './dist/**/*.*'"
        + "\n          tinylrs './dist/**/*.js,./dist/**/*.css,../../views/**/*.html'"
        + "\n          tinylrs -d './dist/**/*.js,./dist/**/*.css'  -p 35279 "
        + "\n          tinylrs --dirs='./dist/**/*.js,./dist/**/*.css'  --port=35279"
        + "\n"
        + "\n  Options:\n"
        + "\n    -h, --help               show usage information"
        + "\n    -V, --version            show current version information"
        + "\n    -d, --dirs   <folder>    *necessary!!* The director of watch targets files,both path-array and single-path"
        + "\n    -p, --port   <integer>   unnecessary! The server port,both websocket-server and static-file-server,default 35279"
        + "\n    -l, --lrfile <file>      unnecessary! The filepath of 'livereload.js',default a build-in-file"
        + "\n    -c, --config <file>      The filepath of configuration(include all configuration-item),default './tinylrs.json',"
        + "\n                             if the val is set,config-file will overwrite all options above"
        + "\n"
    );
}

if(args.v || args.V || args.version){
    console.log(version);

}else if(args.h || args.help || (!args.c && !args.config && !args.d && !args.dirs && !args._.length)){
    help();

}else{
    // start-config-options
    var options = null;

    // if config file is existed
    if(args.c || args.config){
        if(typeof(args.c)!="string" && typeof(args.config)!="string"){
            warningOut("U'd better type in a completed command like 'tinylrs -c ./your_diy_config.json' or the file './tinylrs.json' will be resolved");
        }
        var configPath = typeof(args.c)=="string" ? args.c : typeof(args.config)=="string" ? args.config : "./tinylrs.json",
            _configPath = path.join(process.cwd(),trimAndDelQutoChar(configPath)),
            config = null;
        // console.log(configPath+"\n",_configPath);
        try{
            config = require(_configPath);
        }catch(e){
            config = false;
            errorOut("The file '"+_configPath+"' wasn't found");
        }
        // console.log(config);
        if(config){
            if(Array.isArray(config.dirs)){
                config.watchList = config.dirs;
            }else{
                warningOut("The param \"dir\" in file "+configPath+" is not an array,check it plz!");
                config.watchList = [];
            }
            options = config;
        }else{
            options = false;
        }
    }
    // config-file is not existed,config by argv
    if(!options){
        var dirsStr = args.d || args.dirs || (isWin ? args._[0] : args._),
            dirs = [];
        if(Array.isArray(dirsStr)){//osx
            dirsStr.forEach(function(ele){
                if(ele.indexOf && ~ele.indexOf(",")){
                    ele.split(",").forEach(function(subEle){
                        dirs.push(trimAndDelQutoChar(subEle));
                    });
                }else{
                    dirs.push(trimAndDelQutoChar(ele));
                }
            });
        }else{//windows
            if(typeof(dirsStr)=="string"){
                dirs = trimAndDelQutoChar(dirsStr).split(",");
            }else{
                if(typeof(dirsStr)=="boolean"){
                    warningOut("U'd better type in a completed command,like: tinylrs -d './dist/*.js'");
                }else{
                    warningOut("The param dir should be a string,check it plz!");
                }
                dirs = [];
            }
        }
        var port = parseInt(args.p || args.port || (isWin ? args._[1] : 0) ) || 35729;
        var lrfile = trimAndDelQutoChar(args.l || args.lrfile) || false;
        var rootDir = trimAndDelQutoChar(args.r || args.root) || false;
        options = {
            watchList: dirs,
            port: port,
            lrfile: lrfile,
            rootDir: rootDir
        };
    }
    // start server
    require("../index.js")(options).start();
}

