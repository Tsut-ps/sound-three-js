import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as CANNON from "cannon-es";
import * as TWEEN from "@tweenjs/tween.js";

class ThreeJSContainer {
    private scene: THREE.Scene;
    private light: THREE.Light;
    private gltfModel: THREE.Object3D | undefined;

    constructor() {
        // 初期設定時にスタイルシートを読み込む
        this.styleSheet();
    }

    // 画面部分の作成(表示する枠ごとに)
    public createRendererDOM = (cameraPos: THREE.Vector3) => {
        let renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(new THREE.Color(0x495ed));

        //カメラの設定
        let camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.copy(cameraPos);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        let orbitControls = new OrbitControls(camera, renderer.domElement);

        this.createScene();
        // 毎フレームのupdateを呼んでrender
        // requestAnimationFrame により次フレームを呼ぶ
        let render: FrameRequestCallback = (time) => {
            orbitControls.update();

            renderer.render(this.scene, camera);
            requestAnimationFrame(render);
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

        //ライトの設定
        this.light = new THREE.DirectionalLight(0xffffff);
        let lvec = new THREE.Vector3(1, 1, 1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);

        // 3Dモデルの読み込み
        const loader = new GLTFLoader();
        loader.load(
            "./256kokon.glb",
            (gltf) => {
                // glbは全部入りなのでシーンのみ読み込む
                this.gltfModel = gltf.scene;
                this.scene.add(this.gltfModel);

                // セルルックにする
                this.gltfModel.traverse((obj) => {
                    if (obj instanceof THREE.Mesh) {
                        const originalMaterial = obj.material as THREE.MeshStandardMaterial;
                        const toonMaterial = new THREE.MeshToonMaterial({
                            color: originalMaterial.color,
                            map: originalMaterial.map,
                            side: originalMaterial.side,
                        });
                        obj.material = toonMaterial;
                    }
                });
                // シーンの中心にモデルを配置
                this.gltfModel.position.set(-0.2, -0.58, 0);

                // 斜めに回転
                this.gltfModel.rotation.set(0.5, 0, 0);
            },
            undefined,
            (error) => {
                console.error(error);
            }
        );

        // 毎フレームのupdateを呼んで更新
        // requestAnimationFrame により次フレームを呼ぶ
        let update: FrameRequestCallback = (time) => {

            if (this.gltfModel) {
                this.gltfModel.rotation.y += 0.01;
            }

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
    let viewport = container.createRendererDOM(new THREE.Vector3(-1, -0.5, 1));
    document.body.appendChild(viewport);
}
