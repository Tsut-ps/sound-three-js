import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

import * as CANNON from "cannon-es";
import * as TWEEN from "@tweenjs/tween.js";

class ThreeJSContainer {
    private scene: THREE.Scene;
    private light: THREE.Light;

    constructor() {
        // 初期設定時にスタイルシートを読み込む
        this.styleSheet();
    }

    // 画面部分の作成(表示する枠ごとに)
    public createRendererDOM = (cameraPos: THREE.Vector3) => {
        let renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(new THREE.Color(0x1e1e1e));
        renderer.shadowMap.enabled = true; // シャドウ有効

        //カメラの設定
        let camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.copy(cameraPos);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        // カメラ操作の設定
        let orbitControls = new OrbitControls(camera, renderer.domElement);

        // シーンの作成
        this.createScene();

        // レンダリングの設定
        const renderPass = new RenderPass(this.scene, camera);

        // 発光エフェクトの設定
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            0.4, // ぼかしの強さ
            1.2, // ぼかしの半径
            0.0 // しきい値
        );

        // ポストプロセッシングの設定
        const composer = new EffectComposer(renderer);
        composer.addPass(renderPass);
        composer.addPass(bloomPass);
        composer.setSize(window.innerWidth, window.innerHeight);

        // 毎フレームのupdateを呼んでrender
        // requestAnimationFrame により次フレームを呼ぶ
        let render: FrameRequestCallback = (time) => {
            orbitControls.update();
            requestAnimationFrame(render);
            composer.render();
        };
        requestAnimationFrame(render);

        // 念の為初期時にもリサイズ
        onResize();

        // ウィンドウのリサイズを検知
        window.addEventListener("resize", onResize);

        function onResize() {
            // サイズ取得
            const width = window.innerWidth;
            const height = window.innerHeight;

            // レンダラーのサイズを調整
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(width, height);

            // カメラを調整
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        }

        return renderer.domElement;
    };

    // シーンの作成(全体で1回)
    private createScene = () => {
        this.scene = new THREE.Scene();

        // 平面の作成
        let planeGeometry = new THREE.PlaneGeometry(10, 10);
        let planeMaterial = new THREE.MeshStandardMaterial({ color: 0x1e1e1e });
        let plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.set(0, -1, 0);
        this.scene.add(plane);

        const axesHelper = new THREE.AxesHelper(5);
        axesHelper.position.set(0, -1, 0);
        this.scene.add(axesHelper);

        // 立方体の作成 (ネオン調に光る)
        let cubeGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        let cubeMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 0.5,
        });
        let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(0, -1 + 0.1, 0);
        this.scene.add(cube);

        //ライトの設定
        this.light = new THREE.DirectionalLight(0xffffff);
        let lvec = new THREE.Vector3(8, 10, 1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.light.intensity = 0.5;
        this.scene.add(this.light);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
        this.scene.add(ambientLight);

        // 毎フレームのupdateを呼んで更新
        // requestAnimationFrame により次フレームを呼ぶ
        let update: FrameRequestCallback = (time) => {
            requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    };

    private styleSheet = () => {
        const style = document.createElement("style");
        style.innerHTML = `
            body {
                margin: 0;
                overflow: hidden;
            }
        `;
        document.head.appendChild(style);
    };
}

window.addEventListener("DOMContentLoaded", init);

function init() {
    let container = new ThreeJSContainer();
    let viewport = container.createRendererDOM(new THREE.Vector3(-1, 1, 1));
    document.body.appendChild(viewport);
}
