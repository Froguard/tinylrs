/**
 * liveReload
 * @author Froguard
 * @date   2016/9/19.
 */
var lrs = require("./lib/lrServer");
// create
function create(options){
    // {
    //   port: 35729,
    //   lrPath:"",
    //   watchList:["./dist/**/*.*"],
    //   svrOpts:{
    //   }
    // }
    return lrs(options || {});
}
// exports
module.exports = create;
