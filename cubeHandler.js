import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';

function createCube(container, setActiveFace, size, dragFunctions) {
    function setElementsSelectable(bool) {
        for (let element of document.getElementsByTagName("*")) {
            if (bool) {
                element.classList.remove("preventSelect");
            } else {
                element.classList.add("preventSelect");
            }
        }
    }

    let faces = Array.from(container.children);
    if (faces.length !== 4){
        console.error(`You must specify 4 cubeUIFaces for the cube. You currently have ${faces.length} faces.`);
    }
    function hideFaces(bool) {
        for (let face of faces) {
            if (bool) {
                face.classList.add("hide2");
            } else {
                face.classList.remove("hide2");
            }
        }
    }
    container.insertAdjacentHTML("afterbegin", `<canvas class="cubeUICanvas hide"></canvas>`);
    const canvas = container.querySelector(".cubeUICanvas");

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(size[0], size[1]);
    camera.position.setZ(1.15);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const cube = new THREE.Mesh(geometry);
    scene.add(cube);

    const light = new THREE.PointLight(0xFFFFFF, 1, 1000);
    light.position.set(0, 0, 5);
    scene.add(light);

    renderer.render(scene, camera);

    var isDragging = false;
    var previousMousePosition = {
        x: 0,
        y: 0
    };
    function drag() {
        isDragging = true;
        dragFunctions[0]();
    }
    renderer.domElement.onpointerdown = drag;
    container.onpointerdown = drag;
    function move(e) {
        var deltaMove = {
            x: e.offsetX - (previousMousePosition.x || e.offsetX)
        };
        function inputFocused() {
            for (let element of document.getElementsByTagName("input")) {
                if (document.activeElement === element) {
                    return true;
                }
            }
            return false;
        }
        if (isDragging && !inputFocused()) {
            canvas.classList.remove("hide");
            hideFaces(true);

            setElementsSelectable(false);
            cube.rotation.y += deltaMove.x / 50;
        }

        previousMousePosition = {
            x: e.offsetX
        };
    }
    renderer.domElement.onmousemove = move;
    container.onmousemove = move;

    function mobileMove(e) {
        e.preventDefault();
        var bcr = e.target.getBoundingClientRect();
        var x = e.targetTouches[0].clientX - bcr.x;
        move({ offsetX:x});
    }
    renderer.domElement.ontouchmove = mobileMove;
    container.ontouchmove = mobileMove;

    function releaseDrag() {
        isDragging = false;
        dragFunctions[1]();
        const quarterRadian = Math.PI / 2;
        let nearestRad = Math.round(cube.rotation.y / quarterRadian) * quarterRadian;
        let activeIndex = Math.round(-((nearestRad / quarterRadian) % 4));
        while (activeIndex < 0) {
            activeIndex += 4;
        }
        setActiveFace(activeIndex);
        function animate(time) {
            requestAnimationFrame(animate)
            TWEEN.update(time)
        }
        requestAnimationFrame(animate)
        const coords = { y: cube.rotation.y }; // Start at (0, 0)
        const tween = new TWEEN.Tween(coords) // Create a new tween that modifies 'coords'.
            .to({ y: nearestRad }, 100) // Move to (300, 200) in 1 second.
            .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
            .onUpdate(() => {
                // Called after tween.js updates 'coords'.
                // Move 'box' to the position described by 'coords' with a CSS translation.
                cube.rotation.y = coords.y;
            })
            .start() // Start the tween immediately.
        tween.onComplete(function () {
            canvas.classList.add("hide");
            hideFaces(false);
        });

        setElementsSelectable(true);
    }
    document.onpointerup = releaseDrag;
    container.onpointerup = releaseDrag;
    // shim layer with setTimeout fallback
    window.requestAnimFrame = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    var lastFrameTime = new Date().getTime() / 1000;
    var totalGameTime = 0;
    function update(dt, t) {
        setTimeout(function () {
            var currTime = new Date().getTime() / 1000;
            var dt = currTime - (lastFrameTime || currTime);
            totalGameTime += dt;

            update(dt, totalGameTime);

            lastFrameTime = currTime;
        }, 0);
    }


    function render() {
        renderer.render(scene, camera);
        requestAnimFrame(render);
    }

    render();
    update(0, totalGameTime);

    return cube;
}
function updateCube(cube, faceImageURLs) {
    function createCubeMaterial() {
        function getTexture(imageURL) {
            return new THREE.TextureLoader().load(imageURL);
        }
        var cubeMaterial = [
            new THREE.MeshStandardMaterial({
                map: getTexture(faceImageURLs[1])
            }),
            new THREE.MeshStandardMaterial({
                map: getTexture(faceImageURLs[3])
            }),
            new THREE.MeshStandardMaterial({
                map: getTexture(faceImageURLs[0])
            }),
            new THREE.MeshStandardMaterial({
                map: getTexture(faceImageURLs[0])
            }),
            new THREE.MeshStandardMaterial({
                map: getTexture(faceImageURLs[0])
            }),
            new THREE.MeshStandardMaterial({
                map: getTexture(faceImageURLs[2])
            })
        ];
        return cubeMaterial;
    }
    cube.material = createCubeMaterial();
}

export default { createCube, updateCube };