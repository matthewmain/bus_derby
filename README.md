# BUS DERBY

A 3D vehicle derby video game rendered in three.js and run on a physi.js physics engine. UV maps designed in Adobe Illustrator; meshes created in Blender and imported as glTF. 

<br>

![screenshot](https://dzwonsemrish7.cloudfront.net/items/2m0U072g25250e0I3m19/ezgif.com-video-to-gif.gif)

<br>

## Running Locally

Physijs runs a web worker, which, when run locally, violates cross-origin policies of some browsers, including Chrome. To play Bus Derby locally, you'll need to run a local server instead of simply opening `index.html`. There are number of ways to do this, but a quick way is to use `http-server`. First install http-server with npm:

```
$ npm install http-server -g
```

The just CD into the bus_derby directory and run:

```
$ http-server .
```