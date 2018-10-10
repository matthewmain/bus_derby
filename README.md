# BUS DERBY

A 3D vehicle derby video game rendered in three.js and run on a physi.js physics engine. UV maps designed in Adobe Illustrator; meshes created in Blender and imported as glTF. 

<br>

![screenshot](https://dzwonsemrish7.cloudfront.net/items/2m0U072g25250e0I3m19/ezgif.com-video-to-gif.gif)

<br>

## Running Locally

Physijs runs a web worker, which, if run locally, violates the cross-origin policies of some browsers (including Chrome). 

To play Bus Derby without hosting it, you'll likely need to run a local server instead of simply opening `index.html`. There are a number of ways to run a local server, but one quick way is to use [http-server](https://www.npmjs.com/package/http-server). To do this, first install it with [npm](https://www.npmjs.com/get-npm):

```
$ npm install http-server -g
```

Then just CD into the `bus_derby` directory and run:

```
$ http-server .
```

You'll now have a local server running at `http://127.0.0.1:8080`.