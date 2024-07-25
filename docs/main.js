/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls */ "./node_modules/three/examples/jsm/controls/OrbitControls.js");
/* harmony import */ var three_examples_jsm_postprocessing_EffectComposer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three/examples/jsm/postprocessing/EffectComposer */ "./node_modules/three/examples/jsm/postprocessing/EffectComposer.js");
/* harmony import */ var three_examples_jsm_postprocessing_RenderPass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! three/examples/jsm/postprocessing/RenderPass */ "./node_modules/three/examples/jsm/postprocessing/RenderPass.js");
/* harmony import */ var three_examples_jsm_postprocessing_UnrealBloomPass__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! three/examples/jsm/postprocessing/UnrealBloomPass */ "./node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js");
/* harmony import */ var cannon_es__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! cannon-es */ "./node_modules/cannon-es/dist/cannon-es.js");
/* harmony import */ var tone__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! tone */ "./node_modules/tone/build/esm/index.js");
/* harmony import */ var _tonejs_midi__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @tonejs/midi */ "./node_modules/@tonejs/midi/dist/Midi.js");
/* harmony import */ var _tonejs_midi__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_tonejs_midi__WEBPACK_IMPORTED_MODULE_5__);








class ThreeJSContainer {
    // 3Dシーン
    scene;
    light;
    cubes = [];
    world;
    maxCubes = 512;
    // MIDI
    synth;
    midiData = undefined;
    // UI
    uiElements = undefined;
    currentNoteIndex = undefined;
    totalNotes = undefined;
    isPaused = false;
    constructor() {
        // 初期設定時にスタイルシートを読み込む
        this.styleSheet();
        // 音声の設定 (マスター)
        this.synth = new tone__WEBPACK_IMPORTED_MODULE_4__.PolySynth(tone__WEBPACK_IMPORTED_MODULE_4__.Synth).toDestination();
        // MIDIデータの読み込み
        this.loadMIDI("A.mid");
        // MIDIデータをD&Dできるようにする
        this.setupFileDrop();
        // UIの作成
        this.createUI();
    }
    // MIDIデータの読み込み
    loadMIDI = async (path) => {
        const data = await _tonejs_midi__WEBPACK_IMPORTED_MODULE_5__.Midi.fromUrl(path);
        this.midiData = data;
    };
    // MIDIデータの処理
    processMidi = () => {
        this.currentNoteIndex = 0;
        this.totalNotes = 0;
        // 一度のみ処理 (クリックイベントを削除)
        document.removeEventListener("click", this.processMidi);
        // MIDIデータがない場合は処理しない
        if (!this.midiData)
            return;
        // トラックごとに処理
        this.midiData.tracks.forEach((track) => {
            // ノートごとに処理
            track.notes.forEach((note) => {
                const now = tone__WEBPACK_IMPORTED_MODULE_4__.now(); // 現在の時間
                const time = note.time; // 開始時間
                const velocity = note.velocity; // 音の大きさ
                const pitch = note.midi; // 音の高さ
                const duration = note.duration; // 音の長さ
                this.totalNotes++; // ノートの合計を更新
                this.updateUI();
                tone__WEBPACK_IMPORTED_MODULE_4__.Transport.scheduleOnce(() => {
                    // 時間が来たら立方体を落とす
                    this.fallingCube(velocity, pitch, duration);
                    // 現在のノートを更新
                    this.currentNoteIndex++;
                    // UIの更新
                    this.updateUI();
                }, now + time);
            });
        });
        // MIDIデータを再生
        tone__WEBPACK_IMPORTED_MODULE_4__.Transport.start();
    };
    // MIDIデータをD&Dできるようにする
    setupFileDrop = () => {
        // ドロップエリアの作成
        const dropArea = document.body;
        // ドラッグオーバー時の処理
        dropArea.addEventListener("dragover", (event) => {
            event.preventDefault(); // ドラッグ時のデフォルトの挙動をキャンセル
            event.dataTransfer.dropEffect = "copy"; // ドロップ時の挙動をコピーにする
        });
        // ドロップ時の処理
        dropArea.addEventListener("drop", async (event) => {
            event.preventDefault();
            // ドロップされたファイルを取得
            const files = event.dataTransfer.files;
            if (files.length > 0) {
                // 複数D&Dされた場合1つ目のファイルのみ取得
                const file = files[0];
                // MIDIデータだった場合
                if (file.type === "audio/midi" || file.name.endsWith(".mid")) {
                    const arrayBuffer = await file.arrayBuffer(); // ArrayBufferに変換
                    this.midiData = new _tonejs_midi__WEBPACK_IMPORTED_MODULE_5__.Midi(arrayBuffer); // MIDIデータに変換
                }
            }
        });
    };
    // UIの作成
    createUI = () => {
        const ui = document.createElement("div");
        ui.style.position = "absolute";
        ui.style.top = "0";
        ui.style.left = "0";
        ui.style.margin = "1em 2em";
        ui.style.fontSize = "14px";
        ui.style.color = "white";
        ui.style.fontFamily = "sans-serif";
        ui.style.zIndex = "1000";
        document.body.appendChild(ui);
        // ガイド
        const guide = document.createElement("p");
        guide.innerText = "Click (or drop a MIDI file) to play";
        ui.appendChild(guide);
        // 現在のノートを表示
        const currentNoteLabel = document.createElement("p");
        currentNoteLabel.innerText = "Current Note: 0";
        ui.appendChild(currentNoteLabel);
        // ノートの合計を表示
        const totalNoteLabel = document.createElement("p");
        totalNoteLabel.innerText = "Total Note: 0";
        ui.appendChild(totalNoteLabel);
        this.uiElements = {
            guide: guide,
            currentNote: currentNoteLabel,
            totalNote: totalNoteLabel,
        };
    };
    // UIの更新
    updateUI = () => {
        if (!this.uiElements)
            return;
        const currentNoteIndex = this.currentNoteIndex ?? 0;
        const totalNotes = this.totalNotes ?? 0;
        // ガイドを更新 (一時停止中、終了時、再生中)
        this.uiElements.guide.innerText = `${this.isPaused // 一時停止中か
            ? "Paused... (Space to Play)" // Yes
            : currentNoteIndex === totalNotes // No → 最後のノートまで再生したか
                ? "Finished!" // Yes
                : "Now Playing... (Space to Pause)" // No
        }`;
        // 現在のノートを表示
        this.uiElements.currentNote.innerText = `Current Note: ${currentNoteIndex}`;
        // ノートの合計を表示
        this.uiElements.totalNote.innerText = `Total Note: ${totalNotes}`;
    };
    // 画面部分の作成(表示する枠ごとに)
    createRendererDOM = (cameraPos) => {
        let renderer = new three__WEBPACK_IMPORTED_MODULE_6__.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(new three__WEBPACK_IMPORTED_MODULE_6__.Color(0x1e1e1e));
        renderer.shadowMap.enabled = true; // シャドウ有効
        //カメラの設定
        let camera = new three__WEBPACK_IMPORTED_MODULE_6__.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.copy(cameraPos);
        camera.lookAt(new three__WEBPACK_IMPORTED_MODULE_6__.Vector3(0, 0, 0));
        // カメラ操作の設定
        let orbitControls = new three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__.OrbitControls(camera, renderer.domElement);
        // シーンの作成
        this.createScene();
        // レンダリングの設定
        const renderPass = new three_examples_jsm_postprocessing_RenderPass__WEBPACK_IMPORTED_MODULE_2__.RenderPass(this.scene, camera);
        // 発光エフェクトの設定
        const bloomPass = new three_examples_jsm_postprocessing_UnrealBloomPass__WEBPACK_IMPORTED_MODULE_3__.UnrealBloomPass(new three__WEBPACK_IMPORTED_MODULE_6__.Vector2(window.innerWidth, window.innerHeight), 0.5, // ぼかしの強さ
        1.2, // ぼかしの半径
        0.0 // しきい値
        );
        // ポストプロセッシングの設定
        const composer = new three_examples_jsm_postprocessing_EffectComposer__WEBPACK_IMPORTED_MODULE_1__.EffectComposer(renderer);
        composer.addPass(renderPass);
        composer.addPass(bloomPass);
        composer.setSize(window.innerWidth, window.innerHeight);
        // 毎フレームのupdateを呼んでrender
        // requestAnimationFrame により次フレームを呼ぶ
        let render = (time) => {
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
    createPlane = () => {
        // 平面の作成
        const geometry = new three__WEBPACK_IMPORTED_MODULE_6__.PlaneGeometry(200, 200);
        const material = new three__WEBPACK_IMPORTED_MODULE_6__.MeshStandardMaterial({ color: 0x1e1e1e });
        const plane = new three__WEBPACK_IMPORTED_MODULE_6__.Mesh(geometry, material);
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.set(0, -1, 0);
        this.scene.add(plane);
        // 平面の物理演算
        const shape = new cannon_es__WEBPACK_IMPORTED_MODULE_7__.Plane();
        const body = new cannon_es__WEBPACK_IMPORTED_MODULE_7__.Body({ mass: 0, shape: shape });
        body.position.set(plane.position.x, plane.position.y, plane.position.z);
        body.quaternion.set(plane.quaternion.x, plane.quaternion.y, plane.quaternion.z, plane.quaternion.w);
        this.world.addBody(body);
    };
    // 落下する立方体の作成
    fallingCube = (velocity, pitch, duration) => {
        if (this.cubes.length >= this.maxCubes) {
            // 立方体が最大数に達している場合は一番古いものを削除
            const oldCube = this.cubes.shift(); // 一番古い立方体を取得 + 削除
            oldCube && this.removeCube(oldCube); // (立方体が存在していたら削除)
        }
        // 立方体の作成
        this.createCube(velocity, pitch, duration);
    };
    createCube = (velocity, // 音の大きさ
    pitch, // 音の高さ
    duration // 音の長さ
    ) => {
        // 音の大きさを幅に
        const width = velocity / 5 + 0.02;
        // 音の高さを色に
        const color = new three__WEBPACK_IMPORTED_MODULE_6__.Color().setHSL(pitch / 40, 1.0, 0.5);
        // 音の長さを高さに
        const height = duration / 4;
        // 立方体の作成 (ネオン調に光る)
        let geometry = new three__WEBPACK_IMPORTED_MODULE_6__.BoxGeometry(width, height, width);
        let material = new three__WEBPACK_IMPORTED_MODULE_6__.MeshToonMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 0.5,
        });
        const cube = new three__WEBPACK_IMPORTED_MODULE_6__.Mesh(geometry, material);
        cube.castShadow = true;
        this.scene.add(cube);
        // 物理エンジンの設定
        const shape = new cannon_es__WEBPACK_IMPORTED_MODULE_7__.Box(new cannon_es__WEBPACK_IMPORTED_MODULE_7__.Vec3(width / 2, height / 2, width / 2));
        const body = new cannon_es__WEBPACK_IMPORTED_MODULE_7__.Body({ mass: 1, shape: shape });
        this.world.addBody(body);
        // 立方体の初期位置
        const x = (pitch - 50) / 5;
        const z = 0;
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
    removeCube = (cubeInfo) => {
        this.scene.remove(cubeInfo.mesh);
        this.world.removeBody(cubeInfo.body);
        this.cubes = this.cubes.filter((cube) => cube !== cubeInfo);
    };
    // シーンの作成(全体で1回)
    createScene = () => {
        this.scene = new three__WEBPACK_IMPORTED_MODULE_6__.Scene();
        const axesHelper = new three__WEBPACK_IMPORTED_MODULE_6__.AxesHelper(5);
        axesHelper.position.set(0, -1, 0);
        this.scene.add(axesHelper);
        // 物理エンジンの設定
        this.world = new cannon_es__WEBPACK_IMPORTED_MODULE_7__.World({
            gravity: new cannon_es__WEBPACK_IMPORTED_MODULE_7__.Vec3(0, -9.82, 0),
        });
        // 平面の作成
        this.createPlane();
        // MIDIデータの処理 (クリックされたら)
        document.addEventListener("click", this.processMidi);
        // スペースキーで一時停止
        document.addEventListener("keydown", (event) => {
            if (event.key === " ") {
                this.isPaused = !this.isPaused;
                this.isPaused ? tone__WEBPACK_IMPORTED_MODULE_4__.Transport.pause() : tone__WEBPACK_IMPORTED_MODULE_4__.Transport.start();
                // UIの更新
                this.updateUI();
            }
        });
        //ライトの設定
        this.light = new three__WEBPACK_IMPORTED_MODULE_6__.DirectionalLight(0xffffff);
        let lvec = new three__WEBPACK_IMPORTED_MODULE_6__.Vector3(8, 10, 1).clone().normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.light.intensity = 0.5;
        this.scene.add(this.light);
        const ambientLight = new three__WEBPACK_IMPORTED_MODULE_6__.AmbientLight(0xffffff, 0.1);
        this.scene.add(ambientLight);
        // 衝突検知 (シミュレーションしたとき)
        this.world.addEventListener("postStep", this.onCollision);
        // 時間を扱う
        const clock = new three__WEBPACK_IMPORTED_MODULE_6__.Clock();
        // 毎フレームのupdateを呼んで更新
        // requestAnimationFrame により次フレームを呼ぶ
        let update = (time) => {
            const delta = clock.getDelta();
            // 物理エンジンの更新 (進んだ時間だけ)
            this.world.fixedStep();
            // 物理エンジンの更新
            this.cubes.forEach((cube) => {
                cube.body.position.z -= 1.5 * delta;
                cube.mesh.position.copy(cube.body.position);
                cube.mesh.quaternion.copy(cube.body.quaternion);
            });
            requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    };
    // 衝突検知
    onCollision = () => {
        this.cubes.forEach((cube) => {
            if (cube.body.position.z < -0.8 && !cube.isPlayed) {
                cube.isPlayed = true;
                this.playSound(cube.velocity, cube.pitch, cube.duration);
            }
        });
    };
    // 音を鳴らす
    playSound = (velocity, pitch, duration) => {
        this.synth.triggerAttackRelease(tone__WEBPACK_IMPORTED_MODULE_4__.Frequency(pitch, "midi").toNote(), duration, undefined, velocity);
    };
    styleSheet = () => {
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
    let viewport = container.createRendererDOM(new three__WEBPACK_IMPORTED_MODULE_6__.Vector3(-0.4, 0.7, 1));
    document.body.appendChild(viewport);
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunksound_three_js"] = self["webpackChunksound_three_js"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_tonejs_midi_dist_Midi_js-node_modules_cannon-es_dist_cannon-es_js-node_m-ea912c"], () => (__webpack_require__("./src/app.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO1dBQ0E7V0FDQTtXQUNBOzs7OztXQzNCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7V0NOQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsTUFBTSxxQkFBcUI7V0FDM0I7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7Ozs7O1VFaERBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zb3VuZC10aHJlZS1qcy8uL3NyYy9hcHAudHMiLCJ3ZWJwYWNrOi8vc291bmQtdGhyZWUtanMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vc291bmQtdGhyZWUtanMvd2VicGFjay9ydW50aW1lL2NodW5rIGxvYWRlZCIsIndlYnBhY2s6Ly9zb3VuZC10aHJlZS1qcy93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9zb3VuZC10aHJlZS1qcy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vc291bmQtdGhyZWUtanMvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9zb3VuZC10aHJlZS1qcy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3NvdW5kLXRocmVlLWpzL3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL3NvdW5kLXRocmVlLWpzL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vc291bmQtdGhyZWUtanMvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL3NvdW5kLXRocmVlLWpzL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IE9yYml0Q29udHJvbHMgfSBmcm9tIFwidGhyZWUvZXhhbXBsZXMvanNtL2NvbnRyb2xzL09yYml0Q29udHJvbHNcIjtcbmltcG9ydCB7IEVmZmVjdENvbXBvc2VyIH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS9wb3N0cHJvY2Vzc2luZy9FZmZlY3RDb21wb3NlclwiO1xuaW1wb3J0IHsgUmVuZGVyUGFzcyB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vcG9zdHByb2Nlc3NpbmcvUmVuZGVyUGFzc1wiO1xuaW1wb3J0IHsgVW5yZWFsQmxvb21QYXNzIH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS9wb3N0cHJvY2Vzc2luZy9VbnJlYWxCbG9vbVBhc3NcIjtcblxuaW1wb3J0ICogYXMgQ0FOTk9OIGZyb20gXCJjYW5ub24tZXNcIjtcbmltcG9ydCAqIGFzIFRXRUVOIGZyb20gXCJAdHdlZW5qcy90d2Vlbi5qc1wiO1xuaW1wb3J0ICogYXMgVE9ORSBmcm9tIFwidG9uZVwiO1xuaW1wb3J0IHsgTWlkaSB9IGZyb20gXCJAdG9uZWpzL21pZGlcIjtcblxuaW50ZXJmYWNlIEN1YmVJbmZvIHtcbiAgICBtZXNoOiBUSFJFRS5NZXNoO1xuICAgIGJvZHk6IENBTk5PTi5Cb2R5O1xuICAgIGNyZWF0ZWRUaW1lOiBudW1iZXI7XG4gICAgaXNQbGF5ZWQ6IGJvb2xlYW47XG4gICAgdmVsb2NpdHk6IG51bWJlcjtcbiAgICBwaXRjaDogbnVtYmVyO1xuICAgIGR1cmF0aW9uOiBudW1iZXI7XG59XG5cbmludGVyZmFjZSBVSUVsZW1lbnRzIHtcbiAgICBndWlkZTogSFRNTFBhcmFncmFwaEVsZW1lbnQ7XG4gICAgY3VycmVudE5vdGU6IEhUTUxQYXJhZ3JhcGhFbGVtZW50O1xuICAgIHRvdGFsTm90ZTogSFRNTFBhcmFncmFwaEVsZW1lbnQ7XG59XG5cbmNsYXNzIFRocmVlSlNDb250YWluZXIge1xuICAgIC8vIDNE44K344O844OzXG4gICAgcHJpdmF0ZSBzY2VuZTogVEhSRUUuU2NlbmU7XG4gICAgcHJpdmF0ZSBsaWdodDogVEhSRUUuTGlnaHQ7XG4gICAgcHJpdmF0ZSBjdWJlczogQ3ViZUluZm9bXSA9IFtdO1xuICAgIHByaXZhdGUgd29ybGQ6IENBTk5PTi5Xb3JsZDtcbiAgICBwcml2YXRlIG1heEN1YmVzID0gNTEyO1xuXG4gICAgLy8gTUlESVxuICAgIHByaXZhdGUgc3ludGg6IFRPTkUuUG9seVN5bnRoO1xuICAgIHByaXZhdGUgbWlkaURhdGE6IE1pZGkgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG5cbiAgICAvLyBVSVxuICAgIHByaXZhdGUgdWlFbGVtZW50czogVUlFbGVtZW50cyB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgICBwcml2YXRlIGN1cnJlbnROb3RlSW5kZXg6IG51bWJlciB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgICBwcml2YXRlIHRvdGFsTm90ZXM6IG51bWJlciB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgICBwcml2YXRlIGlzUGF1c2VkID0gZmFsc2U7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgLy8g5Yid5pyf6Kit5a6a5pmC44Gr44K544K/44Kk44Or44K344O844OI44KS6Kqt44G/6L6844KAXG4gICAgICAgIHRoaXMuc3R5bGVTaGVldCgpO1xuXG4gICAgICAgIC8vIOmfs+WjsOOBruioreWumiAo44Oe44K544K/44O8KVxuICAgICAgICB0aGlzLnN5bnRoID0gbmV3IFRPTkUuUG9seVN5bnRoKFRPTkUuU3ludGgpLnRvRGVzdGluYXRpb24oKTtcblxuICAgICAgICAvLyBNSURJ44OH44O844K/44Gu6Kqt44G/6L6844G/XG4gICAgICAgIHRoaXMubG9hZE1JREkoXCJBLm1pZFwiKTtcblxuICAgICAgICAvLyBNSURJ44OH44O844K/44KSRCZE44Gn44GN44KL44KI44GG44Gr44GZ44KLXG4gICAgICAgIHRoaXMuc2V0dXBGaWxlRHJvcCgpO1xuXG4gICAgICAgIC8vIFVJ44Gu5L2c5oiQXG4gICAgICAgIHRoaXMuY3JlYXRlVUkoKTtcbiAgICB9XG5cbiAgICAvLyBNSURJ44OH44O844K/44Gu6Kqt44G/6L6844G/XG4gICAgcHJpdmF0ZSBsb2FkTUlESSA9IGFzeW5jIChwYXRoOiBzdHJpbmcpID0+IHtcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IE1pZGkuZnJvbVVybChwYXRoKTtcbiAgICAgICAgdGhpcy5taWRpRGF0YSA9IGRhdGE7XG4gICAgfTtcblxuICAgIC8vIE1JREnjg4fjg7zjgr/jga7lh6bnkIZcbiAgICBwcml2YXRlIHByb2Nlc3NNaWRpID0gKCkgPT4ge1xuICAgICAgICB0aGlzLmN1cnJlbnROb3RlSW5kZXggPSAwO1xuICAgICAgICB0aGlzLnRvdGFsTm90ZXMgPSAwO1xuXG4gICAgICAgIC8vIOS4gOW6puOBruOBv+WHpueQhiAo44Kv44Oq44OD44Kv44Kk44OZ44Oz44OI44KS5YmK6ZmkKVxuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5wcm9jZXNzTWlkaSk7XG5cbiAgICAgICAgLy8gTUlESeODh+ODvOOCv+OBjOOBquOBhOWgtOWQiOOBr+WHpueQhuOBl+OBquOBhFxuICAgICAgICBpZiAoIXRoaXMubWlkaURhdGEpIHJldHVybjtcblxuICAgICAgICAvLyDjg4jjg6njg4Pjgq/jgZTjgajjgavlh6bnkIZcbiAgICAgICAgdGhpcy5taWRpRGF0YS50cmFja3MuZm9yRWFjaCgodHJhY2spID0+IHtcbiAgICAgICAgICAgIC8vIOODjuODvOODiOOBlOOBqOOBq+WHpueQhlxuICAgICAgICAgICAgdHJhY2subm90ZXMuZm9yRWFjaCgobm90ZSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5vdyA9IFRPTkUubm93KCk7IC8vIOePvuWcqOOBruaZgumWk1xuICAgICAgICAgICAgICAgIGNvbnN0IHRpbWUgPSBub3RlLnRpbWU7IC8vIOmWi+Wni+aZgumWk1xuICAgICAgICAgICAgICAgIGNvbnN0IHZlbG9jaXR5ID0gbm90ZS52ZWxvY2l0eTsgLy8g6Z+z44Gu5aSn44GN44GVXG4gICAgICAgICAgICAgICAgY29uc3QgcGl0Y2ggPSBub3RlLm1pZGk7IC8vIOmfs+OBrumrmOOBlVxuICAgICAgICAgICAgICAgIGNvbnN0IGR1cmF0aW9uID0gbm90ZS5kdXJhdGlvbjsgLy8g6Z+z44Gu6ZW344GVXG4gICAgICAgICAgICAgICAgdGhpcy50b3RhbE5vdGVzKys7IC8vIOODjuODvOODiOOBruWQiOioiOOCkuabtOaWsFxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlVUkoKTtcblxuICAgICAgICAgICAgICAgIFRPTkUuVHJhbnNwb3J0LnNjaGVkdWxlT25jZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOaZgumWk+OBjOadpeOBn+OCieeri+aWueS9k+OCkuiQveOBqOOBmVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZhbGxpbmdDdWJlKHZlbG9jaXR5LCBwaXRjaCwgZHVyYXRpb24pO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIOePvuWcqOOBruODjuODvOODiOOCkuabtOaWsFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnROb3RlSW5kZXgrKztcblxuICAgICAgICAgICAgICAgICAgICAvLyBVSeOBruabtOaWsFxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVVJKCk7XG4gICAgICAgICAgICAgICAgfSwgbm93ICsgdGltZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gTUlESeODh+ODvOOCv+OCkuWGjeeUn1xuICAgICAgICBUT05FLlRyYW5zcG9ydC5zdGFydCgpO1xuICAgIH07XG5cbiAgICAvLyBNSURJ44OH44O844K/44KSRCZE44Gn44GN44KL44KI44GG44Gr44GZ44KLXG4gICAgcHJpdmF0ZSBzZXR1cEZpbGVEcm9wID0gKCkgPT4ge1xuICAgICAgICAvLyDjg4njg63jg4Pjg5fjgqjjg6rjgqLjga7kvZzmiJBcbiAgICAgICAgY29uc3QgZHJvcEFyZWEgPSBkb2N1bWVudC5ib2R5O1xuXG4gICAgICAgIC8vIOODieODqeODg+OCsOOCquODvOODkOODvOaZguOBruWHpueQhlxuICAgICAgICBkcm9wQXJlYS5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ292ZXJcIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpOyAvLyDjg4njg6njg4PjgrDmmYLjga7jg4fjg5Xjgqnjg6vjg4jjga7mjJnli5XjgpLjgq3jg6Pjg7Pjgrvjg6tcbiAgICAgICAgICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJjb3B5XCI7IC8vIOODieODreODg+ODl+aZguOBruaMmeWLleOCkuOCs+ODlOODvOOBq+OBmeOCi1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyDjg4njg63jg4Pjg5fmmYLjga7lh6bnkIZcbiAgICAgICAgZHJvcEFyZWEuYWRkRXZlbnRMaXN0ZW5lcihcImRyb3BcIiwgYXN5bmMgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAvLyDjg4njg63jg4Pjg5fjgZXjgozjgZ/jg5XjgqHjgqTjg6vjgpLlj5blvpdcbiAgICAgICAgICAgIGNvbnN0IGZpbGVzID0gZXZlbnQuZGF0YVRyYW5zZmVyLmZpbGVzO1xuICAgICAgICAgICAgaWYgKGZpbGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAvLyDopIfmlbBEJkTjgZXjgozjgZ/loLTlkIgx44Gk55uu44Gu44OV44Kh44Kk44Or44Gu44G/5Y+W5b6XXG4gICAgICAgICAgICAgICAgY29uc3QgZmlsZSA9IGZpbGVzWzBdO1xuXG4gICAgICAgICAgICAgICAgLy8gTUlESeODh+ODvOOCv+OBoOOBo+OBn+WgtOWQiFxuICAgICAgICAgICAgICAgIGlmIChmaWxlLnR5cGUgPT09IFwiYXVkaW8vbWlkaVwiIHx8IGZpbGUubmFtZS5lbmRzV2l0aChcIi5taWRcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXJyYXlCdWZmZXIgPSBhd2FpdCBmaWxlLmFycmF5QnVmZmVyKCk7IC8vIEFycmF5QnVmZmVy44Gr5aSJ5o+bXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWlkaURhdGEgPSBuZXcgTWlkaShhcnJheUJ1ZmZlcik7IC8vIE1JREnjg4fjg7zjgr/jgavlpInmj5tcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvLyBVSeOBruS9nOaIkFxuICAgIHByaXZhdGUgY3JlYXRlVUkgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHVpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdWkuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG4gICAgICAgIHVpLnN0eWxlLnRvcCA9IFwiMFwiO1xuICAgICAgICB1aS5zdHlsZS5sZWZ0ID0gXCIwXCI7XG4gICAgICAgIHVpLnN0eWxlLm1hcmdpbiA9IFwiMWVtIDJlbVwiO1xuICAgICAgICB1aS5zdHlsZS5mb250U2l6ZSA9IFwiMTRweFwiO1xuICAgICAgICB1aS5zdHlsZS5jb2xvciA9IFwid2hpdGVcIjtcbiAgICAgICAgdWkuc3R5bGUuZm9udEZhbWlseSA9IFwic2Fucy1zZXJpZlwiO1xuICAgICAgICB1aS5zdHlsZS56SW5kZXggPSBcIjEwMDBcIjtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh1aSk7XG5cbiAgICAgICAgLy8g44Ks44Kk44OJXG4gICAgICAgIGNvbnN0IGd1aWRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgIGd1aWRlLmlubmVyVGV4dCA9IFwiQ2xpY2sgKG9yIGRyb3AgYSBNSURJIGZpbGUpIHRvIHBsYXlcIjtcbiAgICAgICAgdWkuYXBwZW5kQ2hpbGQoZ3VpZGUpO1xuXG4gICAgICAgIC8vIOePvuWcqOOBruODjuODvOODiOOCkuihqOekulxuICAgICAgICBjb25zdCBjdXJyZW50Tm90ZUxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgIGN1cnJlbnROb3RlTGFiZWwuaW5uZXJUZXh0ID0gXCJDdXJyZW50IE5vdGU6IDBcIjtcbiAgICAgICAgdWkuYXBwZW5kQ2hpbGQoY3VycmVudE5vdGVMYWJlbCk7XG5cbiAgICAgICAgLy8g44OO44O844OI44Gu5ZCI6KiI44KS6KGo56S6XG4gICAgICAgIGNvbnN0IHRvdGFsTm90ZUxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgIHRvdGFsTm90ZUxhYmVsLmlubmVyVGV4dCA9IFwiVG90YWwgTm90ZTogMFwiO1xuICAgICAgICB1aS5hcHBlbmRDaGlsZCh0b3RhbE5vdGVMYWJlbCk7XG5cbiAgICAgICAgdGhpcy51aUVsZW1lbnRzID0ge1xuICAgICAgICAgICAgZ3VpZGU6IGd1aWRlLFxuICAgICAgICAgICAgY3VycmVudE5vdGU6IGN1cnJlbnROb3RlTGFiZWwsXG4gICAgICAgICAgICB0b3RhbE5vdGU6IHRvdGFsTm90ZUxhYmVsLFxuICAgICAgICB9O1xuICAgIH07XG5cbiAgICAvLyBVSeOBruabtOaWsFxuICAgIHByaXZhdGUgdXBkYXRlVUkgPSAoKSA9PiB7XG4gICAgICAgIGlmICghdGhpcy51aUVsZW1lbnRzKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgY3VycmVudE5vdGVJbmRleCA9IHRoaXMuY3VycmVudE5vdGVJbmRleCA/PyAwO1xuICAgICAgICBjb25zdCB0b3RhbE5vdGVzID0gdGhpcy50b3RhbE5vdGVzID8/IDA7XG5cbiAgICAgICAgLy8g44Ks44Kk44OJ44KS5pu05pawICjkuIDmmYLlgZzmraLkuK3jgIHntYLkuobmmYLjgIHlho3nlJ/kuK0pXG4gICAgICAgIHRoaXMudWlFbGVtZW50cy5ndWlkZS5pbm5lclRleHQgPSBgJHtcbiAgICAgICAgICAgIHRoaXMuaXNQYXVzZWQgLy8g5LiA5pmC5YGc5q2i5Lit44GLXG4gICAgICAgICAgICAgICAgPyBcIlBhdXNlZC4uLiAoU3BhY2UgdG8gUGxheSlcIiAvLyBZZXNcbiAgICAgICAgICAgICAgICA6IGN1cnJlbnROb3RlSW5kZXggPT09IHRvdGFsTm90ZXMgLy8gTm8g4oaSIOacgOW+jOOBruODjuODvOODiOOBvuOBp+WGjeeUn+OBl+OBn+OBi1xuICAgICAgICAgICAgICAgID8gXCJGaW5pc2hlZCFcIiAvLyBZZXNcbiAgICAgICAgICAgICAgICA6IFwiTm93IFBsYXlpbmcuLi4gKFNwYWNlIHRvIFBhdXNlKVwiIC8vIE5vXG4gICAgICAgIH1gO1xuICAgICAgICAvLyDnj77lnKjjga7jg47jg7zjg4jjgpLooajnpLpcbiAgICAgICAgdGhpcy51aUVsZW1lbnRzLmN1cnJlbnROb3RlLmlubmVyVGV4dCA9IGBDdXJyZW50IE5vdGU6ICR7Y3VycmVudE5vdGVJbmRleH1gO1xuICAgICAgICAvLyDjg47jg7zjg4jjga7lkIjoqIjjgpLooajnpLpcbiAgICAgICAgdGhpcy51aUVsZW1lbnRzLnRvdGFsTm90ZS5pbm5lclRleHQgPSBgVG90YWwgTm90ZTogJHt0b3RhbE5vdGVzfWA7XG4gICAgfTtcblxuICAgIC8vIOeUu+mdoumDqOWIhuOBruS9nOaIkCjooajnpLrjgZnjgovmnqDjgZTjgajjgaspXG4gICAgcHVibGljIGNyZWF0ZVJlbmRlcmVyRE9NID0gKGNhbWVyYVBvczogVEhSRUUuVmVjdG9yMykgPT4ge1xuICAgICAgICBsZXQgcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcigpO1xuICAgICAgICByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAgICAgICByZW5kZXJlci5zZXRDbGVhckNvbG9yKG5ldyBUSFJFRS5Db2xvcigweDFlMWUxZSkpO1xuICAgICAgICByZW5kZXJlci5zaGFkb3dNYXAuZW5hYmxlZCA9IHRydWU7IC8vIOOCt+ODo+ODieOCpuacieWKuVxuXG4gICAgICAgIC8v44Kr44Oh44Op44Gu6Kit5a6aXG4gICAgICAgIGxldCBjYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoXG4gICAgICAgICAgICA2NSxcbiAgICAgICAgICAgIHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0LFxuICAgICAgICAgICAgMC4xLFxuICAgICAgICAgICAgMTAwMFxuICAgICAgICApO1xuICAgICAgICBjYW1lcmEucG9zaXRpb24uY29weShjYW1lcmFQb3MpO1xuICAgICAgICBjYW1lcmEubG9va0F0KG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAsIDApKTtcblxuICAgICAgICAvLyDjgqvjg6Hjg6nmk43kvZzjga7oqK3lrppcbiAgICAgICAgbGV0IG9yYml0Q29udHJvbHMgPSBuZXcgT3JiaXRDb250cm9scyhjYW1lcmEsIHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuXG4gICAgICAgIC8vIOOCt+ODvOODs+OBruS9nOaIkFxuICAgICAgICB0aGlzLmNyZWF0ZVNjZW5lKCk7XG5cbiAgICAgICAgLy8g44Os44Oz44OA44Oq44Oz44Kw44Gu6Kit5a6aXG4gICAgICAgIGNvbnN0IHJlbmRlclBhc3MgPSBuZXcgUmVuZGVyUGFzcyh0aGlzLnNjZW5lLCBjYW1lcmEpO1xuXG4gICAgICAgIC8vIOeZuuWFieOCqOODleOCp+OCr+ODiOOBruioreWumlxuICAgICAgICBjb25zdCBibG9vbVBhc3MgPSBuZXcgVW5yZWFsQmxvb21QYXNzKFxuICAgICAgICAgICAgbmV3IFRIUkVFLlZlY3RvcjIod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCksXG4gICAgICAgICAgICAwLjUsIC8vIOOBvOOBi+OBl+OBruW8t+OBlVxuICAgICAgICAgICAgMS4yLCAvLyDjgbzjgYvjgZfjga7ljYrlvoRcbiAgICAgICAgICAgIDAuMCAvLyDjgZfjgY3jgYTlgKRcbiAgICAgICAgKTtcblxuICAgICAgICAvLyDjg53jgrnjg4jjg5fjg63jgrvjg4Pjgrfjg7PjgrDjga7oqK3lrppcbiAgICAgICAgY29uc3QgY29tcG9zZXIgPSBuZXcgRWZmZWN0Q29tcG9zZXIocmVuZGVyZXIpO1xuICAgICAgICBjb21wb3Nlci5hZGRQYXNzKHJlbmRlclBhc3MpO1xuICAgICAgICBjb21wb3Nlci5hZGRQYXNzKGJsb29tUGFzcyk7XG4gICAgICAgIGNvbXBvc2VyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG5cbiAgICAgICAgLy8g5q+O44OV44Os44O844Og44GudXBkYXRl44KS5ZG844KT44GncmVuZGVyXG4gICAgICAgIC8vIHJlcXVlc3RBbmltYXRpb25GcmFtZSDjgavjgojjgormrKHjg5Xjg6zjg7zjg6DjgpLlkbzjgbZcbiAgICAgICAgbGV0IHJlbmRlcjogRnJhbWVSZXF1ZXN0Q2FsbGJhY2sgPSAodGltZSkgPT4ge1xuICAgICAgICAgICAgb3JiaXRDb250cm9scy51cGRhdGUoKTtcbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShyZW5kZXIpO1xuICAgICAgICAgICAgY29tcG9zZXIucmVuZGVyKCk7XG4gICAgICAgIH07XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShyZW5kZXIpO1xuXG4gICAgICAgIC8vIOW/teOBrueCuuWIneacn+aZguOBq+OCguODquOCteOCpOOCulxuICAgICAgICBvblJlc2l6ZSgpO1xuXG4gICAgICAgIC8vIOOCpuOCo+ODs+ODieOCpuOBruODquOCteOCpOOCuuOCkuaknOefpVxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBvblJlc2l6ZSk7XG5cbiAgICAgICAgZnVuY3Rpb24gb25SZXNpemUoKSB7XG4gICAgICAgICAgICAvLyDjgrXjgqTjgrrlj5blvpdcbiAgICAgICAgICAgIGNvbnN0IHdpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICAgICAgICBjb25zdCBoZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cbiAgICAgICAgICAgIC8vIOODrOODs+ODgOODqeODvOOBruOCteOCpOOCuuOCkuiqv+aVtFxuICAgICAgICAgICAgcmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyk7XG4gICAgICAgICAgICByZW5kZXJlci5zZXRTaXplKHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgICAgICAgICAvLyDjgqvjg6Hjg6njgpLoqr/mlbRcbiAgICAgICAgICAgIGNhbWVyYS5hc3BlY3QgPSB3aWR0aCAvIGhlaWdodDtcbiAgICAgICAgICAgIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVuZGVyZXIuZG9tRWxlbWVudDtcbiAgICB9O1xuXG4gICAgLy8g5bmz6Z2i44Gu5L2c5oiQXG4gICAgcHJpdmF0ZSBjcmVhdGVQbGFuZSA9ICgpID0+IHtcbiAgICAgICAgLy8g5bmz6Z2i44Gu5L2c5oiQXG4gICAgICAgIGNvbnN0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLlBsYW5lR2VvbWV0cnkoMjAwLCAyMDApO1xuICAgICAgICBjb25zdCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCh7IGNvbG9yOiAweDFlMWUxZSB9KTtcbiAgICAgICAgY29uc3QgcGxhbmUgPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICAgICAgICBwbGFuZS5yb3RhdGlvbi54ID0gLTAuNSAqIE1hdGguUEk7XG4gICAgICAgIHBsYW5lLnBvc2l0aW9uLnNldCgwLCAtMSwgMCk7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKHBsYW5lKTtcblxuICAgICAgICAvLyDlubPpnaLjga7niannkIbmvJTnrpdcbiAgICAgICAgY29uc3Qgc2hhcGUgPSBuZXcgQ0FOTk9OLlBsYW5lKCk7XG4gICAgICAgIGNvbnN0IGJvZHkgPSBuZXcgQ0FOTk9OLkJvZHkoeyBtYXNzOiAwLCBzaGFwZTogc2hhcGUgfSk7XG4gICAgICAgIGJvZHkucG9zaXRpb24uc2V0KHBsYW5lLnBvc2l0aW9uLngsIHBsYW5lLnBvc2l0aW9uLnksIHBsYW5lLnBvc2l0aW9uLnopO1xuICAgICAgICBib2R5LnF1YXRlcm5pb24uc2V0KFxuICAgICAgICAgICAgcGxhbmUucXVhdGVybmlvbi54LFxuICAgICAgICAgICAgcGxhbmUucXVhdGVybmlvbi55LFxuICAgICAgICAgICAgcGxhbmUucXVhdGVybmlvbi56LFxuICAgICAgICAgICAgcGxhbmUucXVhdGVybmlvbi53XG4gICAgICAgICk7XG4gICAgICAgIHRoaXMud29ybGQuYWRkQm9keShib2R5KTtcbiAgICB9O1xuXG4gICAgLy8g6JC95LiL44GZ44KL56uL5pa55L2T44Gu5L2c5oiQXG4gICAgcHJpdmF0ZSBmYWxsaW5nQ3ViZSA9IChcbiAgICAgICAgdmVsb2NpdHk6IG51bWJlcixcbiAgICAgICAgcGl0Y2g6IG51bWJlcixcbiAgICAgICAgZHVyYXRpb246IG51bWJlclxuICAgICkgPT4ge1xuICAgICAgICBpZiAodGhpcy5jdWJlcy5sZW5ndGggPj0gdGhpcy5tYXhDdWJlcykge1xuICAgICAgICAgICAgLy8g56uL5pa55L2T44GM5pyA5aSn5pWw44Gr6YGU44GX44Gm44GE44KL5aC05ZCI44Gv5LiA55Wq5Y+k44GE44KC44Gu44KS5YmK6ZmkXG4gICAgICAgICAgICBjb25zdCBvbGRDdWJlID0gdGhpcy5jdWJlcy5zaGlmdCgpOyAvLyDkuIDnlarlj6TjgYTnq4vmlrnkvZPjgpLlj5blvpcgKyDliYrpmaRcbiAgICAgICAgICAgIG9sZEN1YmUgJiYgdGhpcy5yZW1vdmVDdWJlKG9sZEN1YmUpOyAvLyAo56uL5pa55L2T44GM5a2Y5Zyo44GX44Gm44GE44Gf44KJ5YmK6ZmkKVxuICAgICAgICB9XG4gICAgICAgIC8vIOeri+aWueS9k+OBruS9nOaIkFxuICAgICAgICB0aGlzLmNyZWF0ZUN1YmUodmVsb2NpdHksIHBpdGNoLCBkdXJhdGlvbik7XG4gICAgfTtcblxuICAgIHByaXZhdGUgY3JlYXRlQ3ViZSA9IChcbiAgICAgICAgdmVsb2NpdHk6IG51bWJlciwgLy8g6Z+z44Gu5aSn44GN44GVXG4gICAgICAgIHBpdGNoOiBudW1iZXIsIC8vIOmfs+OBrumrmOOBlVxuICAgICAgICBkdXJhdGlvbjogbnVtYmVyIC8vIOmfs+OBrumVt+OBlVxuICAgICkgPT4ge1xuICAgICAgICAvLyDpn7Pjga7lpKfjgY3jgZXjgpLluYXjgatcbiAgICAgICAgY29uc3Qgd2lkdGggPSB2ZWxvY2l0eSAvIDUgKyAwLjAyO1xuXG4gICAgICAgIC8vIOmfs+OBrumrmOOBleOCkuiJsuOBq1xuICAgICAgICBjb25zdCBjb2xvciA9IG5ldyBUSFJFRS5Db2xvcigpLnNldEhTTChwaXRjaCAvIDQwLCAxLjAsIDAuNSk7XG5cbiAgICAgICAgLy8g6Z+z44Gu6ZW344GV44KS6auY44GV44GrXG4gICAgICAgIGNvbnN0IGhlaWdodCA9IGR1cmF0aW9uIC8gNDtcblxuICAgICAgICAvLyDnq4vmlrnkvZPjga7kvZzmiJAgKOODjeOCquODs+iqv+OBq+WFieOCiylcbiAgICAgICAgbGV0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KHdpZHRoLCBoZWlnaHQsIHdpZHRoKTtcbiAgICAgICAgbGV0IG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hUb29uTWF0ZXJpYWwoe1xuICAgICAgICAgICAgY29sb3I6IGNvbG9yLFxuICAgICAgICAgICAgZW1pc3NpdmU6IGNvbG9yLFxuICAgICAgICAgICAgZW1pc3NpdmVJbnRlbnNpdHk6IDAuNSxcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IGN1YmUgPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICAgICAgICBjdWJlLmNhc3RTaGFkb3cgPSB0cnVlO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZChjdWJlKTtcblxuICAgICAgICAvLyDniannkIbjgqjjg7Pjgrjjg7Pjga7oqK3lrppcbiAgICAgICAgY29uc3Qgc2hhcGUgPSBuZXcgQ0FOTk9OLkJveChcbiAgICAgICAgICAgIG5ldyBDQU5OT04uVmVjMyh3aWR0aCAvIDIsIGhlaWdodCAvIDIsIHdpZHRoIC8gMilcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgYm9keSA9IG5ldyBDQU5OT04uQm9keSh7IG1hc3M6IDEsIHNoYXBlOiBzaGFwZSB9KTtcbiAgICAgICAgdGhpcy53b3JsZC5hZGRCb2R5KGJvZHkpO1xuXG4gICAgICAgIC8vIOeri+aWueS9k+OBruWIneacn+S9jee9rlxuICAgICAgICBjb25zdCB4ID0gKHBpdGNoIC0gNTApIC8gNTtcbiAgICAgICAgY29uc3QgeiA9IDA7XG4gICAgICAgIGN1YmUucG9zaXRpb24uc2V0KHgsIDEsIHopO1xuICAgICAgICBib2R5LnBvc2l0aW9uLnNldCh4LCAxLCB6KTtcblxuICAgICAgICAvLyDnq4vmlrnkvZPjga7mg4XloLHjgpLkv53lrZhcbiAgICAgICAgdGhpcy5jdWJlcy5wdXNoKHtcbiAgICAgICAgICAgIG1lc2g6IGN1YmUsXG4gICAgICAgICAgICBib2R5OiBib2R5LFxuICAgICAgICAgICAgY3JlYXRlZFRpbWU6IERhdGUubm93KCksXG4gICAgICAgICAgICBpc1BsYXllZDogZmFsc2UsXG4gICAgICAgICAgICB2ZWxvY2l0eTogdmVsb2NpdHksXG4gICAgICAgICAgICBwaXRjaDogcGl0Y2gsXG4gICAgICAgICAgICBkdXJhdGlvbjogZHVyYXRpb24sXG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvLyDnq4vmlrnkvZPjga7liYrpmaRcbiAgICBwcml2YXRlIHJlbW92ZUN1YmUgPSAoY3ViZUluZm86IEN1YmVJbmZvKSA9PiB7XG4gICAgICAgIHRoaXMuc2NlbmUucmVtb3ZlKGN1YmVJbmZvLm1lc2gpO1xuICAgICAgICB0aGlzLndvcmxkLnJlbW92ZUJvZHkoY3ViZUluZm8uYm9keSk7XG4gICAgICAgIHRoaXMuY3ViZXMgPSB0aGlzLmN1YmVzLmZpbHRlcigoY3ViZSkgPT4gY3ViZSAhPT0gY3ViZUluZm8pO1xuICAgIH07XG5cbiAgICAvLyDjgrfjg7zjg7Pjga7kvZzmiJAo5YWo5L2T44GnMeWbnilcbiAgICBwcml2YXRlIGNyZWF0ZVNjZW5lID0gKCkgPT4ge1xuICAgICAgICB0aGlzLnNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG5cbiAgICAgICAgY29uc3QgYXhlc0hlbHBlciA9IG5ldyBUSFJFRS5BeGVzSGVscGVyKDUpO1xuICAgICAgICBheGVzSGVscGVyLnBvc2l0aW9uLnNldCgwLCAtMSwgMCk7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGF4ZXNIZWxwZXIpO1xuXG4gICAgICAgIC8vIOeJqeeQhuOCqOODs+OCuOODs+OBruioreWumlxuICAgICAgICB0aGlzLndvcmxkID0gbmV3IENBTk5PTi5Xb3JsZCh7XG4gICAgICAgICAgICBncmF2aXR5OiBuZXcgQ0FOTk9OLlZlYzMoMCwgLTkuODIsIDApLFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyDlubPpnaLjga7kvZzmiJBcbiAgICAgICAgdGhpcy5jcmVhdGVQbGFuZSgpO1xuXG4gICAgICAgIC8vIE1JREnjg4fjg7zjgr/jga7lh6bnkIYgKOOCr+ODquODg+OCr+OBleOCjOOBn+OCiSlcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMucHJvY2Vzc01pZGkpO1xuXG4gICAgICAgIC8vIOOCueODmuODvOOCueOCreODvOOBp+S4gOaZguWBnOatolxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmIChldmVudC5rZXkgPT09IFwiIFwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pc1BhdXNlZCA9ICF0aGlzLmlzUGF1c2VkO1xuICAgICAgICAgICAgICAgIHRoaXMuaXNQYXVzZWQgPyBUT05FLlRyYW5zcG9ydC5wYXVzZSgpIDogVE9ORS5UcmFuc3BvcnQuc3RhcnQoKTtcblxuICAgICAgICAgICAgICAgIC8vIFVJ44Gu5pu05pawXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVVSSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvL+ODqeOCpOODiOOBruioreWumlxuICAgICAgICB0aGlzLmxpZ2h0ID0gbmV3IFRIUkVFLkRpcmVjdGlvbmFsTGlnaHQoMHhmZmZmZmYpO1xuICAgICAgICBsZXQgbHZlYyA9IG5ldyBUSFJFRS5WZWN0b3IzKDgsIDEwLCAxKS5ub3JtYWxpemUoKTtcbiAgICAgICAgdGhpcy5saWdodC5wb3NpdGlvbi5zZXQobHZlYy54LCBsdmVjLnksIGx2ZWMueik7XG4gICAgICAgIHRoaXMubGlnaHQuaW50ZW5zaXR5ID0gMC41O1xuICAgICAgICB0aGlzLnNjZW5lLmFkZCh0aGlzLmxpZ2h0KTtcblxuICAgICAgICBjb25zdCBhbWJpZW50TGlnaHQgPSBuZXcgVEhSRUUuQW1iaWVudExpZ2h0KDB4ZmZmZmZmLCAwLjEpO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZChhbWJpZW50TGlnaHQpO1xuXG4gICAgICAgIC8vIOihneeqgeaknOefpSAo44K344Of44Ol44Os44O844K344On44Oz44GX44Gf44Go44GNKVxuICAgICAgICB0aGlzLndvcmxkLmFkZEV2ZW50TGlzdGVuZXIoXCJwb3N0U3RlcFwiLCB0aGlzLm9uQ29sbGlzaW9uKTtcblxuICAgICAgICAvLyDmmYLplpPjgpLmibHjgYZcbiAgICAgICAgY29uc3QgY2xvY2sgPSBuZXcgVEhSRUUuQ2xvY2soKTtcblxuICAgICAgICAvLyDmr47jg5Xjg6zjg7zjg6Djga51cGRhdGXjgpLlkbzjgpPjgafmm7TmlrBcbiAgICAgICAgLy8gcmVxdWVzdEFuaW1hdGlvbkZyYW1lIOOBq+OCiOOCiuasoeODleODrOODvOODoOOCkuWRvOOBtlxuICAgICAgICBsZXQgdXBkYXRlOiBGcmFtZVJlcXVlc3RDYWxsYmFjayA9ICh0aW1lKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBkZWx0YSA9IGNsb2NrLmdldERlbHRhKCk7XG5cbiAgICAgICAgICAgIC8vIOeJqeeQhuOCqOODs+OCuOODs+OBruabtOaWsCAo6YCy44KT44Gg5pmC6ZaT44Gg44GRKVxuICAgICAgICAgICAgdGhpcy53b3JsZC5maXhlZFN0ZXAoKTtcblxuICAgICAgICAgICAgLy8g54mp55CG44Ko44Oz44K444Oz44Gu5pu05pawXG4gICAgICAgICAgICB0aGlzLmN1YmVzLmZvckVhY2goKGN1YmUpID0+IHtcbiAgICAgICAgICAgICAgICBjdWJlLmJvZHkucG9zaXRpb24ueiAtPSAxLjUgKiBkZWx0YTtcbiAgICAgICAgICAgICAgICBjdWJlLm1lc2gucG9zaXRpb24uY29weShjdWJlLmJvZHkucG9zaXRpb24gYXMgYW55KTtcbiAgICAgICAgICAgICAgICBjdWJlLm1lc2gucXVhdGVybmlvbi5jb3B5KGN1YmUuYm9keS5xdWF0ZXJuaW9uIGFzIGFueSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHVwZGF0ZSk7XG4gICAgICAgIH07XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGUpO1xuICAgIH07XG5cbiAgICAvLyDooZ3nqoHmpJznn6VcbiAgICBwcml2YXRlIG9uQ29sbGlzaW9uID0gKCkgPT4ge1xuICAgICAgICB0aGlzLmN1YmVzLmZvckVhY2goKGN1YmUpID0+IHtcbiAgICAgICAgICAgIGlmIChjdWJlLmJvZHkucG9zaXRpb24ueiA8IC0wLjggJiYgIWN1YmUuaXNQbGF5ZWQpIHtcbiAgICAgICAgICAgICAgICBjdWJlLmlzUGxheWVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXlTb3VuZChjdWJlLnZlbG9jaXR5LCBjdWJlLnBpdGNoLCBjdWJlLmR1cmF0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8vIOmfs+OCkumztOOCieOBmVxuICAgIHByaXZhdGUgcGxheVNvdW5kID0gKHZlbG9jaXR5OiBudW1iZXIsIHBpdGNoOiBudW1iZXIsIGR1cmF0aW9uOiBudW1iZXIpID0+IHtcbiAgICAgICAgdGhpcy5zeW50aC50cmlnZ2VyQXR0YWNrUmVsZWFzZShcbiAgICAgICAgICAgIFRPTkUuRnJlcXVlbmN5KHBpdGNoLCBcIm1pZGlcIikudG9Ob3RlKCksXG4gICAgICAgICAgICBkdXJhdGlvbixcbiAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHZlbG9jaXR5XG4gICAgICAgICk7XG4gICAgfTtcblxuICAgIHByaXZhdGUgc3R5bGVTaGVldCA9ICgpID0+IHtcbiAgICAgICAgY29uc3Qgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gICAgICAgIHN0eWxlLmlubmVySFRNTCA9IGBcbiAgICAgICAgICAgIGJvZHkge1xuICAgICAgICAgICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgICAgICAgICAgfVxuICAgICAgICBgO1xuICAgICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgICB9O1xufVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgaW5pdCk7XG5cbmZ1bmN0aW9uIGluaXQoKSB7XG4gICAgbGV0IGNvbnRhaW5lciA9IG5ldyBUaHJlZUpTQ29udGFpbmVyKCk7XG4gICAgbGV0IHZpZXdwb3J0ID0gY29udGFpbmVyLmNyZWF0ZVJlbmRlcmVyRE9NKG5ldyBUSFJFRS5WZWN0b3IzKC0wLjQsIDAuNywgMSkpO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodmlld3BvcnQpO1xufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBfX3dlYnBhY2tfbW9kdWxlc19fO1xuXG4iLCJ2YXIgZGVmZXJyZWQgPSBbXTtcbl9fd2VicGFja19yZXF1aXJlX18uTyA9IChyZXN1bHQsIGNodW5rSWRzLCBmbiwgcHJpb3JpdHkpID0+IHtcblx0aWYoY2h1bmtJZHMpIHtcblx0XHRwcmlvcml0eSA9IHByaW9yaXR5IHx8IDA7XG5cdFx0Zm9yKHZhciBpID0gZGVmZXJyZWQubGVuZ3RoOyBpID4gMCAmJiBkZWZlcnJlZFtpIC0gMV1bMl0gPiBwcmlvcml0eTsgaS0tKSBkZWZlcnJlZFtpXSA9IGRlZmVycmVkW2kgLSAxXTtcblx0XHRkZWZlcnJlZFtpXSA9IFtjaHVua0lkcywgZm4sIHByaW9yaXR5XTtcblx0XHRyZXR1cm47XG5cdH1cblx0dmFyIG5vdEZ1bGZpbGxlZCA9IEluZmluaXR5O1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGRlZmVycmVkLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIFtjaHVua0lkcywgZm4sIHByaW9yaXR5XSA9IGRlZmVycmVkW2ldO1xuXHRcdHZhciBmdWxmaWxsZWQgPSB0cnVlO1xuXHRcdGZvciAodmFyIGogPSAwOyBqIDwgY2h1bmtJZHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdGlmICgocHJpb3JpdHkgJiAxID09PSAwIHx8IG5vdEZ1bGZpbGxlZCA+PSBwcmlvcml0eSkgJiYgT2JqZWN0LmtleXMoX193ZWJwYWNrX3JlcXVpcmVfXy5PKS5ldmVyeSgoa2V5KSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXy5PW2tleV0oY2h1bmtJZHNbal0pKSkpIHtcblx0XHRcdFx0Y2h1bmtJZHMuc3BsaWNlKGotLSwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmdWxmaWxsZWQgPSBmYWxzZTtcblx0XHRcdFx0aWYocHJpb3JpdHkgPCBub3RGdWxmaWxsZWQpIG5vdEZ1bGZpbGxlZCA9IHByaW9yaXR5O1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihmdWxmaWxsZWQpIHtcblx0XHRcdGRlZmVycmVkLnNwbGljZShpLS0sIDEpXG5cdFx0XHR2YXIgciA9IGZuKCk7XG5cdFx0XHRpZiAociAhPT0gdW5kZWZpbmVkKSByZXN1bHQgPSByO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufTsiLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBubyBiYXNlVVJJXG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8vIFtyZXNvbHZlLCByZWplY3QsIFByb21pc2VdID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJtYWluXCI6IDBcbn07XG5cbi8vIG5vIGNodW5rIG9uIGRlbWFuZCBsb2FkaW5nXG5cbi8vIG5vIHByZWZldGNoaW5nXG5cbi8vIG5vIHByZWxvYWRlZFxuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0XG5cbl9fd2VicGFja19yZXF1aXJlX18uTy5qID0gKGNodW5rSWQpID0+IChpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPT09IDApO1xuXG4vLyBpbnN0YWxsIGEgSlNPTlAgY2FsbGJhY2sgZm9yIGNodW5rIGxvYWRpbmdcbnZhciB3ZWJwYWNrSnNvbnBDYWxsYmFjayA9IChwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbiwgZGF0YSkgPT4ge1xuXHR2YXIgW2NodW5rSWRzLCBtb3JlTW9kdWxlcywgcnVudGltZV0gPSBkYXRhO1xuXHQvLyBhZGQgXCJtb3JlTW9kdWxlc1wiIHRvIHRoZSBtb2R1bGVzIG9iamVjdCxcblx0Ly8gdGhlbiBmbGFnIGFsbCBcImNodW5rSWRzXCIgYXMgbG9hZGVkIGFuZCBmaXJlIGNhbGxiYWNrXG5cdHZhciBtb2R1bGVJZCwgY2h1bmtJZCwgaSA9IDA7XG5cdGlmKGNodW5rSWRzLnNvbWUoKGlkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2lkXSAhPT0gMCkpKSB7XG5cdFx0Zm9yKG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG5cdFx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8obW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLm1bbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihydW50aW1lKSB2YXIgcmVzdWx0ID0gcnVudGltZShfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblx0fVxuXHRpZihwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbikgcGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24oZGF0YSk7XG5cdGZvcig7aSA8IGNodW5rSWRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y2h1bmtJZCA9IGNodW5rSWRzW2ldO1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhpbnN0YWxsZWRDaHVua3MsIGNodW5rSWQpICYmIGluc3RhbGxlZENodW5rc1tjaHVua0lkXSkge1xuXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdWzBdKCk7XG5cdFx0fVxuXHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IDA7XG5cdH1cblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uTyhyZXN1bHQpO1xufVxuXG52YXIgY2h1bmtMb2FkaW5nR2xvYmFsID0gc2VsZltcIndlYnBhY2tDaHVua3NvdW5kX3RocmVlX2pzXCJdID0gc2VsZltcIndlYnBhY2tDaHVua3NvdW5kX3RocmVlX2pzXCJdIHx8IFtdO1xuY2h1bmtMb2FkaW5nR2xvYmFsLmZvckVhY2god2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCAwKSk7XG5jaHVua0xvYWRpbmdHbG9iYWwucHVzaCA9IHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2guYmluZChjaHVua0xvYWRpbmdHbG9iYWwpKTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGRlcGVuZHMgb24gb3RoZXIgbG9hZGVkIGNodW5rcyBhbmQgZXhlY3V0aW9uIG5lZWQgdG8gYmUgZGVsYXllZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8odW5kZWZpbmVkLCBbXCJ2ZW5kb3JzLW5vZGVfbW9kdWxlc190b25lanNfbWlkaV9kaXN0X01pZGlfanMtbm9kZV9tb2R1bGVzX2Nhbm5vbi1lc19kaXN0X2Nhbm5vbi1lc19qcy1ub2RlX20tZWE5MTJjXCJdLCAoKSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2FwcC50c1wiKSkpXG5fX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKF9fd2VicGFja19leHBvcnRzX18pO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9