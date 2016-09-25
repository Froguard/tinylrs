#!/usr/bin/env node
/**
 * liveReload
 * @author Froguard
 * @date   2016/9/19.
 */
var args = require('minimist')(process.argv.slice(2)),
    version = require("../package.json").version,
    isWin = !!process.platform.match(/win32|win64/g);

// console.log(JSON.stringify(args,2,null));
/*
args value is different in env between osx and windows
$ tinylrs ./*.js
win: {"_":["./*.js"]}
osx: {"_":["./jsfile1.js","./jsfile2.js","./jsfile3.js",...]}//put all matched file into var '_'
*/

function help(){
    console.log("\n  tinylrs "+version+"\n"
        + "\n  Usage:  tinylrs [options]\n"
        + "\n     eg:  tinylrs ./**/*.*"
        + "\n          tinylrs ./dist/**/*.js,./dist/**/*.css,../../views/**/*.html"
        + "\n          tinylrs -d ./dist/**/*.js,./dist/**/*.css     -p 35279 "
        + "\n          tinylrs -dirs=./dist/**/*.js,./dist/**/*.css  -port=35279"
        + "\n"
        + "\n  Options:\n"
        + "\n    -h, --help               show usage information"
        + "\n    -V, --version            show current version information"
        + "\n    -d, --dirs   <folder>    *necessary!!* The director of watch targets files,both path-array and single-path"
        + "\n    -p, --port   <integer>   unnecessary! The server port,both websocket-server and static-file-server,default 35279"
        + "\n    -lr,--lrpath <file>      unnecessary! The filepath of 'livereload.js',default a build-in-file"
        + "\n"
    );
}

if(args.v || args.V || args.version){
    console.log(version);

}else if(args.h || args.help || (!args.d && !args.dirs && !args._.length)){
    help();

}else{
    var dirsStr = args.d || args.dirs || (isWin ? args._[0] : args._),
        dirs;
    if(Array.isArray(dirsStr)){//osx
        dirs = dirsStr;
    }else{
        dirs = dirsStr.split(",");//win
    }
    var port = parseInt(args.p || args.port || (isWin ? args._[1] : 0) ) || 35729;
    var lrPath = args.lr || args.lrpath || (isWin ? args._[2] : 0) || false;
    var options = {
        watchList: dirs,
        port: port,
        lrPath: lrPath
    };
    require("../index.js")(options).start();
}
