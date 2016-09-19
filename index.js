/**
 * liveReload
 * @author hzwangfei3
 * @date   2016/9/19.
 */
var lrs = require("./lrServer");

function run(options){
    options = options || {};
    // {
    //   port: 35729,
    //   lrPath:"",
    //   watchList:["../public/dist/**/*.*"],
    //   svrOpts:{
    //   }
    // }
    var app = lrs(options);
    app.start();
}

module.exports.run = run;