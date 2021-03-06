## tinylrs(tiny-livereload-server)

<!--[![npm version](https://badge.fury.io/js/tinylrs.svg)](https://badge.fury.io/js/tinylrs)-->
[![version](https://img.shields.io/npm/v/tinylrs.svg "version")](https://www.npmjs.com/package/tinylrs) 
[![Build Status](https://img.shields.io/travis/Froguard/tinylrs.svg)](https://travis-ci.org/Froguard/tinylrs)
[![download](https://img.shields.io/npm/dt/tinylrs.svg "download")](https://www.npmjs.com/package/tinylrs)
[![GitHub issues](https://img.shields.io/github/issues/Froguard/tinylrs.svg)](https://github.com/Froguard/tinylrs/issues?q=is%3Aopen+is%3Aissue)
[![Github licences](https://img.shields.io/github/license/Froguard/tinylrs.svg)](https://github.com/Froguard/tinylrs/blob/master/LICENSE)
<!--[![label](https://img.shields.io/github/issues-raw/Froguard/tinylrs.svg?style=flat-square)](https://github.com/Froguard/tinylrs/issues)-->
<!--[![download](https://img.shields.io/npm/dm/tinylrs.svg "download")](https://www.npmjs.com/package/tinylrs) -->
[![nodei](https://nodei.co/npm/tinylrs.png?downloads=true)](https://www.npmjs.com/package/tinylrs)

- Watched files changed ==&gt; reload browser pages
- A **separate** livereload server that include both static-file-server(just script) and websocket
- You **don't need install the livereload browser-extension**,such as chrome,or other.
- Just only npm, **don't need grunt or gulp or others**, **don't need download file livereload.js** any more
- **Simple** and **tiny**: Only 3 Dependencies:
[tinylr](https://github.com/mklabs/tiny-lr) ,
[gaze](https://github.com/shama/gaze),
[minimist](https://github.com/substack/minimist)
- **Cross platform** Windows, *nix(Mac-OSX or Linux).

## 1.Installation
```bash
$ npm install -g tinylrs
````
or ````npm install --save-dev tinylrs````


## 2.Usage

### step 1: inject a &lt;script&gt; tag into html (the tail of &lt;body&gt; tag)
```html
<script src="http://localhost:35729/livereload.js?snipver=1"></script>
````
**Just only inject the code.And you don't need download the file(livereload.js)!**


### step 2: start tinylrs
run in bash directly (need install it globally first)
```bash
$ cd %your_project_dir%
$ tinylrs './your_watch_dir/**/*.*'
````
Maybe you should add char '' to include the target dir if you use it in osx(mac) or other unix like.


### step 3: visit the web site by your own server
```bash
eg: http://localhost:8080/index
````
Now,browser page will be refreshed when your watched-target-files were changed!




### More-detail
#### 1.command line
```bash
$ tinylrs --help
````

```bash
Usage: tinylrs [options]
   eg: tinylrs './dist/**/*.*'
       tinylrs './dist/**/*.js,./dist/**/*.css,../../views/**/*.html'
       tinylrs -d './dist/**/*.js,./dist/**/*.css'  -p 35279
       tinylrs --dirs='./dist/**/*.js,./dist/**/*.css'  --port=35279

Options:

 -h,--help           show usage information
 -V,--version        show current version information
 -d,--dirs<folder>   *necessary!!* The director of watch targets files,
                     both path-array and single-path
 -p,--port<integer>  unnecessary! The server port,both websocket-server
                     and static-file-server,default 35279
 -l,--lrfile<file>   unnecessary! The filepath of 'livereload.js',
                     default a build-in-file
````

(1).param support the array,just like this: (array ele split by char ',')
```bash
$ tinylrs './watch_dir_0/**/*.js,./watch_dir_1/**/*.css,./watch_dir_2/**/*.html'
````

(2).You can also set the server port by runtime args:*
```bash
$ tinylrs -d './your_watch_dir/**/*.*'  -p 66666
````
*besides,you should set the same port to the &lt;script&gt; tag*
```html
<script src="http://localhost:66666/livereload.js?snipver=1"></script>
````

(3).run in your npm-scripts
> 1: package.json
```json
{
  "scripts":{
    "tinylrs": "tinylrs -d './your_watch_dir/**/*.*' -p 66666"
  }
}
````
> 2: run in bash
```bash
$ npm run tinylrs
````


#### 2.development
```js
var Tinylrs = require("tinylrs");
var myTlrs = Tinylrs({
    watchList: [
        "./dist/**/*.*",
        "../public/views/*.html"
    ],
    port: 66666,
    lrfile: null
});
myTlrs.start();
// you can also use the myTlrs.server,it is a tiny-lr server instance
````


### Questions

> 1.Install failed: You maybe include 'sudo' in front of command line,if use it on *unix os like linux or mac-osx
```bash
sudo npm i -g tinylrs
````

> 2.No matches found: xxxx/path/xxxx

check the directors you have type in,if use it on *unix os like linux or mac-osx


#### Have fun with it!



