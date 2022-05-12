import * as THREE from './lib/three.js-r133/build/three.module.js'
import {OrbitControls} from './lib/three.js-r133/examples/jsm/controls/OrbitControls.js'
import {TWEEN} from './lib/tween/tween.js'


let scene = new THREE.Scene()
// 雾化
scene.fog = new THREE.FogExp2(0x000000,0.001)
let width = window.innerWidth,
    height = window.innerHeight
let camera = new THREE.PerspectiveCamera(45,width/height,1,1000)
camera.position.set(300,300,300)
camera.lookAt(scene.position)

let renderer = new THREE.WebGLRenderer()
//初始化像素比
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width,height)
document.body.appendChild(renderer.domElement)

let controls = new OrbitControls(camera,renderer.domElement)
controls.enableZoom = true
controls.enablePan = true
controls.target.set(0,0,0)
controls.update()

let ambient = new THREE.AmbientLight(0xffffff,1)
scene.add(ambient)
let directLight = new THREE.DirectionalLight(0xffffff,1)
directLight.position.set(100,500,100)
scene.add(directLight)

// 初始化 geometry

let geometry = new THREE.BufferGeometry(),
    around = new THREE.BufferGeometry(),
    vertices = new Float32Array(20001),
    colors = new Float32Array(20001)


// 初始化例子
for (let i = 0 ;i < vertices.length;i++) {
    vertices[i] = 800 * Math.random() - 400
    // colors[i] = Math.random()
    colors[i] = 1
    // 顶点
}

let attribue = new THREE.BufferAttribute(vertices, 3);
geometry.attributes.position = attribue;

document.body.addEventListener('dblclick',dblClick)
let current_model_index = 0
function dblClick() {
    if (current_model_index === 5) {
        current_model_index = 1
    } else {
        current_model_index += 1
    } 
    fetch(`./static/00${current_model_index}.json`).then(res=>res.json()).then((res)=>{
        let current_position = geometry.getAttribute('position'),
            target_position = res.vertices
        for (let i = 0;i < current_position.array.length;i++) {
            let tween = new TWEEN.Tween(current_position.array),
                cur = i % target_position.length
            tween.to({
                [i * 3]:target_position[cur * 3] * 200,
                [i * 3 + 1]:target_position[cur * 3 + 1] * 200,
                [i * 3 + 2]:target_position[cur * 3 + 2] * 200,
            },3000)
            tween.easing(TWEEN.Easing.Exponential.In);

            tween.start();
    
            tween.onUpdate(() => {
                current_position.needsUpdate = true
            })
        }
            
    })
}



geometry.attributes.color = new THREE.BufferAttribute(colors, 3); 

let material = new THREE.PointsMaterial({
  vertexColors: THREE.VertexColors, 
  size:2,
  transparent:true,
  opacity:1
});

// 创建点
var points = new THREE.Points(geometry, material); //点模型对象

scene.add(points); 




window.onresize = function () {
    renderer.setSize(window.innerWidth,window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
}

function render() {
    // geometry.rotateY(Math.PI / 200)
    renderer.render(scene,camera)
    requestAnimationFrame(render)
    scene.rotateY(0.001)
    TWEEN.update()
}
render()