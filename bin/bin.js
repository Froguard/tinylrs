#!/usr/bin/env node
/**
 * liveReload
 * @author Froguard
 * @date   2016/9/19.
 */
var args = require('minimist')(process.argv.slice(2)),
    version = require("../package.json").version;

// console.log(JSON.stringify(args,2,null));

function help(){
    console.log("\r\n  tinylrs "+version+"\r\n"
        + "\r\n  Usage:  tinylrs [options]\r\n"
        + "\r\n     eg:  tinylrs ./**/*.*"
        + "\r\n          tinylrs ./dist/**/*.js,./dist/**/*.css,../../views/**/*.html  35279"
        + "\r\n          tinylrs -d ./dist/**/*.js,./dist/**/*.css     -p 35279 "
        + "\r\n          tinylrs -dirs=./dist/**/*.js,./dist/**/*.css  -port=35279"
        + "\r\n"
        + "\r\n  Options:\r\n"
        + "\r\n    -h, --help               show usage information"
        + "\r\n    -V, --version            show current version information"
        + "\r\n    -d, --dirs   <folder>    *necessary!!* The director of watch targets files,both path-array and single-path"
        + "\r\n    -p, --port   <integer>   unnecessary! The server port,both websocket-server and static-file-server,default 35279"
        + "\r\n    -lr,--lrpath <file>      unnecessary! The filepath of 'livereload.js',default a build-in-file"
        + "\r\n"
    );
}

if(args.v || args.V || args.version){
    console.log(version);

}else if(args.h || args.help || (!args.d && !args.dirs && !args._.length)){
    help();

}else{
    var dirsStr = args.d || args.dirs || args._[0],
        dirs = dirsStr.split(",");
    var port = parseInt(args.p || args.port || args._[1] ) || 35729;
    var lrPath = args.lr || args.lrpath || args._[2] || false;
    var options = {
        watchList: dirs,
        port: port,
        lrPath: lrPath
    };
    require("../index.js")(options).start();
}
