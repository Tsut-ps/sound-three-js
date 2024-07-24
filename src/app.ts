import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

import * as CANNON from "cannon-es";
import * as TWEEN from "@tweenjs/tween.js";
import * as TONE from "tone";
import { Midi } from "@tonejs/midi";

interface CubeInfo {
    mesh: THREE.Mesh;
    body: CANNON.Body;
    createdTime: number;
    isPlayed: boolean;
    velocity: number;
    pitch: number;
    duration: number;
}

class ThreeJSContainer {
    private scene: THREE.Scene;
    private light: THREE.Light;
    private cubes: CubeInfo[] = [];
    private world: CANNON.World;
    private maxCubes = 25;
    private synth: TONE.PolySynth;
    private midiData: Midi | undefined = undefined;

    constructor() {
        // 初期設定時にスタイルシートを読み込む
        this.styleSheet();

        // 音声の設定 (マスター)
        this.synth = new TONE.PolySynth(TONE.Synth).toDestination();

        // MIDIデータの読み込み
        this.loadMIDI("A.mid");
    }

    // MIDIデータの読み込み
    private loadMIDI = async (path: string) => {
        const data = await Midi.fromUrl(path);
        this.midiData = data;
    };

    // MIDIデータの処理
    private processMidi = () => {
        // 一度のみ処理 (クリックイベントを削除)
        document.removeEventListener("click", this.processMidi);

        // MIDIデータがない場合は処理しない
        if (!this.midiData) return;

        // トラックごとに処理
        this.midiData.tracks.forEach((track) => {
            // ノートごとに処理
            track.notes.forEach((note) => {
                const now = TONE.now(); // 現在の時間
                const time = note.time; // 開始時間
                const velocity = note.velocity; // 音の大きさ
                const pitch = note.midi; // 音の高さ
                const duration = note.duration; // 音の長さ

                TONE.Transport.scheduleOnce(() => {
                    // 時間が来たら立方体を落とす
                    this.fallingCube(velocity, pitch, duration);
                }, now + time);
            });
        });

        TONE.Transport.start();
    };

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

    // 平面の作成
    private createPlane = () => {
        // 平面の作成
        const geometry = new THREE.PlaneGeometry(10, 10);
        const material = new THREE.MeshStandardMaterial({ color: 0x1e1e1e });
        const plane = new THREE.Mesh(geometry, material);
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.set(0, -1, 0);
        // 透明にする
        plane.material.transparent = true;
        plane.material.opacity = 0;
        this.scene.add(plane);

        // 平面の物理演算
        const shape = new CANNON.Plane();
        const body = new CANNON.Body({ mass: 0 });
        body.addShape(shape);
        body.position.set(plane.position.x, plane.position.y, plane.position.z);
        body.quaternion.set(
            plane.quaternion.x,
            plane.quaternion.y,
            plane.quaternion.z,
            plane.quaternion.w
        );
        this.world.addBody(body);
    };

    // 落下する立方体の作成
    private fallingCube = (
        velocity: number,
        pitch: number,
        duration: number
    ) => {
        if (this.cubes.length >= this.maxCubes) {
            // 立方体が最大数に達している場合は一番古いものを削除
            const oldCube = this.cubes.shift(); // 一番古い立方体を取得 + 削除
            oldCube && this.removeCube(oldCube); // (立方体が存在していたら削除)
        }
        // 立方体の作成
        this.createCube(velocity, pitch, duration);
    };

    private createCube = (
        velocity: number, // 音の大きさ
        pitch: number, // 音の高さ
        duration: number // 音の長さ
    ) => {
        // 音の大きさを幅に
        const width = velocity / 5;

        // 音の高さを色に
        const color = new THREE.Color().setHSL(pitch / 40, 1.0, 0.5);

        // 音の長さを高さに
        const height = duration * 0.1;

        // 立方体の作成 (ネオン調に光る)
        let geometry = new THREE.BoxGeometry(width, height, width);
        let material = new THREE.MeshToonMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 0.5,
        });
        const cube = new THREE.Mesh(geometry, material);
        cube.castShadow = true;
        this.scene.add(cube);

        // 物理エンジンの設定
        const shape = new CANNON.Box(
            new CANNON.Vec3(width / 2, height / 2, width / 2)
        );
        const body = new CANNON.Body({ mass: 1 });
        body.addShape(shape);
        this.world.addBody(body);

        // 立方体の初期位置
        const x = (2 - Math.floor(this.cubes.length / 5)) / 2;
        const z = (-2 + (this.cubes.length % 5)) / 2;
        cube.position.set(x, 1, z);
        body.position.set(x, 1, z);

        // 立方体の情報を保存
        this.cubes.push({
            mesh: cube,
            body: body,
            createdTime: Date.now(),
            isPlayed: false,
            velocity: velocity,
            pitch: pitch,
            duration: duration,
        });
    };

    // 立方体の削除
    private removeCube = (cubeInfo: CubeInfo) => {
        this.scene.remove(cubeInfo.mesh);
        this.world.removeBody(cubeInfo.body);
        this.cubes = this.cubes.filter((cube) => cube !== cubeInfo);

        // 他の立方体を移動
        this.cubes.forEach((cube, index) => {
            if (cube.createdTime > cubeInfo.createdTime) {
                const x = (2 - Math.floor(index / 5)) / 2;
                const y = cube.mesh.position.y;
                const z = (-2 + (index % 5)) / 2;
                cube.mesh.position.set(x, y, z);
                cube.body.position.set(x, y, z);
            }
        });
    };

    // シーンの作成(全体で1回)
    private createScene = () => {
        this.scene = new THREE.Scene();

        const axesHelper = new THREE.AxesHelper(5);
        axesHelper.position.set(0, -1, 0);
        this.scene.add(axesHelper);

        // 物理エンジンの設定
        this.world = new CANNON.World({
            gravity: new CANNON.Vec3(0, -9.82, 0),
        });

        // 平面の作成
        this.createPlane();

        // MIDIデータの処理 (クリックされたら)
        document.addEventListener("click", this.processMidi);

        //ライトの設定
        this.light = new THREE.DirectionalLight(0xffffff);
        let lvec = new THREE.Vector3(8, 10, 1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.light.intensity = 0.5;
        this.scene.add(this.light);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
        this.scene.add(ambientLight);

        // 衝突検知 (シミュレーションしたとき)
        this.world.addEventListener("postStep", this.onCollision);

        // 毎フレームのupdateを呼んで更新
        // requestAnimationFrame により次フレームを呼ぶ
        let update: FrameRequestCallback = (time) => {
            // 物理エンジンの更新 (進んだ時間だけ)
            this.world.fixedStep();

            // 物理エンジンの更新
            this.cubes.forEach((cube) => {
                cube.mesh.position.copy(cube.body.position as any);
                cube.mesh.quaternion.copy(cube.body.quaternion as any);
            });

            requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    };

    // 衝突検知
    private onCollision = () => {
        this.cubes.forEach((cube) => {
            if (cube.body.position.y < -0.8 && !cube.isPlayed) {
                cube.isPlayed = true;
                this.playSound(cube.velocity, cube.pitch, cube.duration);
            }
        });
    };

    // 音を鳴らす
    private playSound = (velocity: number, pitch: number, duration: number) => {
        this.synth.triggerAttackRelease(
            TONE.Frequency(pitch, "midi").toNote(),
            duration,
            undefined,
            velocity
        );
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
