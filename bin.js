#!/usr/bin/env node
/**
 * Created by hzwangfei3@corp.netease.com on 2016/9/19.
 */
// var path = require("path")
//     , fs = require("fs")
//     , args = process.argv.slice(1);
// var arg, base;
// do arg = args.shift();
// while ( fs.realpathSync(arg) !== __filename
// && !(base = path.basename(arg)).match(/^tinylrs$|^tinylrs.js$|^node-tinylrs$/)
// );

require("./index.js").run(null);