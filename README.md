# tinylsr(tiny-liveReload-server)

a livereload server that include both static-file-server(just script) and websocket

### 1.init
````
npm i
````

### 2.useage

> step 1: inject a &lt;script&gt; tag to html (the last tail of &lt;body&gt; tag)
```html
<script src="http://localhost:35729/livereload.js?snipver=1" type="text/javascript"></script>
````

> step 2: start tinylrs
Install-way1: in your npm-scripts

```js
npm i --save tinylrs
````
package.json
```json
{
    "scripts":{
        "tinylrs":"tinylrs ./your_watch_dir/*.js"
    }
}
````
```js
npm run tinylrs
````


Install-way2: Or install it globally
```js
npm i -g tinylrs
$ tinylrs ./your_watch_dir/*.js
````

> step 3: visit the web site by your own server
````
eg: localhost:8080/index
````

Now,when your watched target-files were changed

,your browser page will be refresh!







