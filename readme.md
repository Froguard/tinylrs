# tinylsr(tiny-liveReload-server)

- A simple livereload server that include both static-file-server(just script) and websocket
- You don't need install install the livereload browser-extension,such as chrome,or other.
- It's written based on [mklabs](https://github.com/mklabs)'s project named [tinylr](https://github.com/mklabs/tiny-lr)

### 1.install
````
$ npm install -g tinylrs
````
or
````
$ npm install --save tinylrs
````

### 2.use

#### step 1: inject a &lt;script&gt; tag into html (the last tail of &lt;body&gt; tag)
```html
<script src="http://localhost:35729/livereload.js?snipver=1"></script>
````

#### step 2: start tinylrs

> Install-way1: in your npm-scripts

Edit package.json
```json
{
  "scripts":{
    "tinylrs": "tinylrs ./your_watch_dir/**/*.*"
  }
}
````
run in bash
```html
$ npm run tinylrs
````


> Install-way2: bash directly (need install it globally)
```html
$ tinylrs ./your_watch_dir/**/*.*
````

param support the array,just like this: (array elements are split by char ',')

```html
$ tinylrs ./watch_dir_0/**/*.js,./watch_dir_1/**/*.css,./watch_dir_2/**/*.html
````

#### step 3: visit the web site by your own server

```html
eg: http://localhost:8080/index
````

Now,when your watched target-files were changed,your browser page will be refresh!

Have fun with it!


#### Others:
You can also set the server port by runtime args:
```html
$ tinylrs ./your_watch_dir/**/*.*  66666
````
besides,you should set the same port to she script tag

```html
<script src="http://localhost:66666/livereload.js?snipver=1"></script>
````






