# 3D HTML
Display HTML on the faces of a 3d cube that can be rotated with the cursor.

## Demo
See a demonstration of the project here:
[kdjdev.github.io/3d-html/](kdjdev.github.io/3d-html/)

## Installation
### Using npm:
```sh 
npm install 3d-html
```
### or using yarn:
```
sh yarn add 3d-html
```

Once the package is installed, you then need to setup your cube. Represent the cube in HTML by including a `div` tag with class `cubeUIContainer` somewhere in the DOM. It is also recommended that you apply the `loading` class, which will attempt to hide the container using CSS before the cube is ready.
```html
<div class="cubeUIContainer loading">

</div>
```
You will then need to specify 4 faces of the cube(only 4 faces will ever be seen, so you only need 4). These faces are represented by `div` tags with class `cubeUIFace`. You can then include whatever HTML you want to appear on the faces of the cube inside of the `cubeUIFace` `div`s.

```html
<div class="cubeUIContainer loading">
   <div class="cubeUIFace">
      <!--content of first face-->
   </div>
   <div class="cubeUIFace">
      <!--content of second face-->
   </div>
   <div class="cubeUIFace">
      <!--content of third face-->
   </div>
   <div class="cubeUIFace">
      <!--content of fourth face-->
   </div>
</div>
```
To actually convert this HTML into the cube, you finally need to run the initialize function.
```js
import initialize from "3d-html";
initialize();
```
#### Here is a full sample setup of 3d-html
```html
<body>
   <div class="cubeUIContainer loading">
      <div class="cubeUIFace">
         <!--content of first face-->
      </div>
      <div class="cubeUIFace">
         <!--content of second face-->
      </div>
      <div class="cubeUIFace">
         <!--content of third face-->
      </div>
      <div class="cubeUIFace">
         <!--content of fourth face-->
      </div>
   </div>
   
   <script type="module">
      import initialize from "3d-html";
      initialize();
   </script>
</body>
```
If you are using some javascript framework instead of vanilla, you may not be able to run the initialize function inside of an HTML `script` tag, but must run it elsewhere.

Documentation in progress...
