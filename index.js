import './style.css';
import * as htmlToImage from 'html-to-image';
import cubeHandler from './cubeHandler.js';

async function initialize() {
    for (let element of document.querySelectorAll(".cubeUIContainer")) {
        let faces = Array.from(element.children);

        let largestWidth = 0;
        let largestHeight = 0;
        for (let face of faces) {
            const rect = face.getBoundingClientRect();
            largestWidth = rect.width > largestWidth ? rect.width : largestWidth;
            largestHeight = rect.height > largestHeight ? rect.height : largestHeight;
        }

        let faceImageURLs = {};
        async function updateFaceImage(index) {
            faceImageURLs[index] = await htmlToImage.toPng(faces[index], { style: { 'opacity': '1' } });
        }
        async function updateFaceImages() {
            for (let [index] of faces.entries()) {
                await updateFaceImage(index);
            }
        }
        await updateFaceImages();

        let isDragging = false;
        function drag() {
            isDragging = true;
        }
        function releaseDrag() {
            setTimeout(() => { //delay is for tween time
                isDragging = false;
            }, 100);
        }

        let observer;
        function setActiveFace(index) {
            for (let face of faces) {
                face.classList.add("hide");
            }
            faces[index].classList.remove("hide");

            observer && observer.disconnect();
            const config = { attributes: true, childList: true, subtree: true };
            async function tryUpdate(){
                if (!isDragging) {
                    await updateFaceImage(index);
                    cubeHandler.updateCube(cube, faceImageURLs);
                }
            }
            observer = new MutationObserver(tryUpdate);
            observer.observe(faces[index], config);

            for (let input of faces[index].getElementsByTagName("input")){
                input.addEventListener('change', tryUpdate);
            }
        }
        setActiveFace(0);
        let cube = cubeHandler.createCube(element, setActiveFace, [largestWidth, largestHeight], [drag, releaseDrag]);
        cubeHandler.updateCube(cube, faceImageURLs);

        element.classList.remove("loading");
    }
}
export default initialize;