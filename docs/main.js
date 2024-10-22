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
    progress = 0;
    constructor() {
        // 初期設定時にスタイルシートを読み込む
        this.styleSheet();
        // 音声の設定 (マスター)
        this.synth = new tone__WEBPACK_IMPORTED_MODULE_4__.PolySynth(tone__WEBPACK_IMPORTED_MODULE_4__.Synth).toDestination();
        // MIDIデータの読み込み
        this.loadMIDI("Catch-on-Fire.mid");
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
        // スペースを作成しプログレスバーとする
        const space = document.createElement("div");
        space.style.width = "200px";
        space.style.height = "16px";
        space.style.backgroundColor = "white";
        space.style.borderRadius = "2px";
        space.style.marginTop = "1em";
        space.style.overflow = "hidden";
        ui.appendChild(space);
        // スペースにプログレスバーを追加
        const progress = document.createElement("div");
        progress.style.width = this.progress * 100 + "%";
        progress.style.height = "100%";
        progress.style.backgroundColor = "#1177bb";
        space.appendChild(progress);
        this.uiElements = {
            progress: progress,
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
        this.progress = currentNoteIndex / totalNotes;
        // プログレスバーを更新
        this.uiElements.progress.style.width = this.progress * 100 + "%";
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
        // 物理演算のシミュレーション後に実行
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
                cube.body.position.z -= 2 * delta;
                cube.mesh.position.copy(cube.body.position);
                cube.mesh.quaternion.copy(cube.body.quaternion);
            });
            requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    };
    // 一定距離を超えたら音を鳴らす
    onCollision = () => {
        this.cubes.forEach((cube) => {
            if (cube.body.position.z < -1.2 && !cube.isPlayed) {
                cube.isPlayed = true;
                this.playSound(cube.velocity, cube.pitch, cube.duration);
            }
        });
    };
    // 音を鳴らす
    playSound = (velocity, pitch, duration) => {
        this.synth.triggerAttackRelease(tone__WEBPACK_IMPORTED_MODULE_4__.Frequency(pitch, "midi").toNote(), duration, undefined, velocity / 2 // 音割れを防ぐために音の大きさを半分に
        );
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O1dBQ0E7V0FDQTs7Ozs7V0MzQkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLE1BQU0scUJBQXFCO1dBQzNCO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBOzs7OztVRWhEQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc291bmQtdGhyZWUtanMvLi9zcmMvYXBwLnRzIiwid2VicGFjazovL3NvdW5kLXRocmVlLWpzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3NvdW5kLXRocmVlLWpzL3dlYnBhY2svcnVudGltZS9jaHVuayBsb2FkZWQiLCJ3ZWJwYWNrOi8vc291bmQtdGhyZWUtanMvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vc291bmQtdGhyZWUtanMvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3NvdW5kLXRocmVlLWpzL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vc291bmQtdGhyZWUtanMvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9zb3VuZC10aHJlZS1qcy93ZWJwYWNrL3J1bnRpbWUvanNvbnAgY2h1bmsgbG9hZGluZyIsIndlYnBhY2s6Ly9zb3VuZC10aHJlZS1qcy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL3NvdW5kLXRocmVlLWpzL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9zb3VuZC10aHJlZS1qcy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBPcmJpdENvbnRyb2xzIH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS9jb250cm9scy9PcmJpdENvbnRyb2xzXCI7XG5pbXBvcnQgeyBFZmZlY3RDb21wb3NlciB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vcG9zdHByb2Nlc3NpbmcvRWZmZWN0Q29tcG9zZXJcIjtcbmltcG9ydCB7IFJlbmRlclBhc3MgfSBmcm9tIFwidGhyZWUvZXhhbXBsZXMvanNtL3Bvc3Rwcm9jZXNzaW5nL1JlbmRlclBhc3NcIjtcbmltcG9ydCB7IFVucmVhbEJsb29tUGFzcyB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vcG9zdHByb2Nlc3NpbmcvVW5yZWFsQmxvb21QYXNzXCI7XG5cbmltcG9ydCAqIGFzIENBTk5PTiBmcm9tIFwiY2Fubm9uLWVzXCI7XG5pbXBvcnQgKiBhcyBUT05FIGZyb20gXCJ0b25lXCI7XG5pbXBvcnQgeyBNaWRpIH0gZnJvbSBcIkB0b25lanMvbWlkaVwiO1xuXG5pbnRlcmZhY2UgQ3ViZUluZm8ge1xuICAgIG1lc2g6IFRIUkVFLk1lc2g7XG4gICAgYm9keTogQ0FOTk9OLkJvZHk7XG4gICAgY3JlYXRlZFRpbWU6IG51bWJlcjtcbiAgICBpc1BsYXllZDogYm9vbGVhbjtcbiAgICB2ZWxvY2l0eTogbnVtYmVyO1xuICAgIHBpdGNoOiBudW1iZXI7XG4gICAgZHVyYXRpb246IG51bWJlcjtcbn1cblxuaW50ZXJmYWNlIFVJRWxlbWVudHMge1xuICAgIHByb2dyZXNzOiBIVE1MRGl2RWxlbWVudDtcbiAgICBndWlkZTogSFRNTFBhcmFncmFwaEVsZW1lbnQ7XG4gICAgY3VycmVudE5vdGU6IEhUTUxQYXJhZ3JhcGhFbGVtZW50O1xuICAgIHRvdGFsTm90ZTogSFRNTFBhcmFncmFwaEVsZW1lbnQ7XG59XG5cbmNsYXNzIFRocmVlSlNDb250YWluZXIge1xuICAgIC8vIDNE44K344O844OzXG4gICAgcHJpdmF0ZSBzY2VuZTogVEhSRUUuU2NlbmU7XG4gICAgcHJpdmF0ZSBsaWdodDogVEhSRUUuTGlnaHQ7XG4gICAgcHJpdmF0ZSBjdWJlczogQ3ViZUluZm9bXSA9IFtdO1xuICAgIHByaXZhdGUgd29ybGQ6IENBTk5PTi5Xb3JsZDtcbiAgICBwcml2YXRlIG1heEN1YmVzID0gNTEyO1xuXG4gICAgLy8gTUlESVxuICAgIHByaXZhdGUgc3ludGg6IFRPTkUuUG9seVN5bnRoO1xuICAgIHByaXZhdGUgbWlkaURhdGE6IE1pZGkgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG5cbiAgICAvLyBVSVxuICAgIHByaXZhdGUgdWlFbGVtZW50czogVUlFbGVtZW50cyB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgICBwcml2YXRlIGN1cnJlbnROb3RlSW5kZXg6IG51bWJlciB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgICBwcml2YXRlIHRvdGFsTm90ZXM6IG51bWJlciB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgICBwcml2YXRlIGlzUGF1c2VkID0gZmFsc2U7XG4gICAgcHJpdmF0ZSBwcm9ncmVzczogbnVtYmVyID0gMDtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAvLyDliJ3mnJ/oqK3lrprmmYLjgavjgrnjgr/jgqTjg6vjgrfjg7zjg4jjgpLoqq3jgb/ovrzjgoBcbiAgICAgICAgdGhpcy5zdHlsZVNoZWV0KCk7XG5cbiAgICAgICAgLy8g6Z+z5aOw44Gu6Kit5a6aICjjg57jgrnjgr/jg7wpXG4gICAgICAgIHRoaXMuc3ludGggPSBuZXcgVE9ORS5Qb2x5U3ludGgoVE9ORS5TeW50aCkudG9EZXN0aW5hdGlvbigpO1xuXG4gICAgICAgIC8vIE1JREnjg4fjg7zjgr/jga7oqq3jgb/ovrzjgb9cbiAgICAgICAgdGhpcy5sb2FkTUlESShcIkNhdGNoLW9uLUZpcmUubWlkXCIpO1xuXG4gICAgICAgIC8vIE1JREnjg4fjg7zjgr/jgpJEJkTjgafjgY3jgovjgojjgYbjgavjgZnjgotcbiAgICAgICAgdGhpcy5zZXR1cEZpbGVEcm9wKCk7XG5cbiAgICAgICAgLy8gVUnjga7kvZzmiJBcbiAgICAgICAgdGhpcy5jcmVhdGVVSSgpO1xuICAgIH1cblxuICAgIC8vIE1JREnjg4fjg7zjgr/jga7oqq3jgb/ovrzjgb9cbiAgICBwcml2YXRlIGxvYWRNSURJID0gYXN5bmMgKHBhdGg6IHN0cmluZykgPT4ge1xuICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgTWlkaS5mcm9tVXJsKHBhdGgpO1xuICAgICAgICB0aGlzLm1pZGlEYXRhID0gZGF0YTtcbiAgICB9O1xuXG4gICAgLy8gTUlESeODh+ODvOOCv+OBruWHpueQhlxuICAgIHByaXZhdGUgcHJvY2Vzc01pZGkgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuY3VycmVudE5vdGVJbmRleCA9IDA7XG4gICAgICAgIHRoaXMudG90YWxOb3RlcyA9IDA7XG5cbiAgICAgICAgLy8g5LiA5bqm44Gu44G/5Yem55CGICjjgq/jg6rjg4Pjgq/jgqTjg5njg7Pjg4jjgpLliYrpmaQpXG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLnByb2Nlc3NNaWRpKTtcblxuICAgICAgICAvLyBNSURJ44OH44O844K/44GM44Gq44GE5aC05ZCI44Gv5Yem55CG44GX44Gq44GEXG4gICAgICAgIGlmICghdGhpcy5taWRpRGF0YSkgcmV0dXJuO1xuXG4gICAgICAgIC8vIOODiOODqeODg+OCr+OBlOOBqOOBq+WHpueQhlxuICAgICAgICB0aGlzLm1pZGlEYXRhLnRyYWNrcy5mb3JFYWNoKCh0cmFjaykgPT4ge1xuICAgICAgICAgICAgLy8g44OO44O844OI44GU44Go44Gr5Yem55CGXG4gICAgICAgICAgICB0cmFjay5ub3Rlcy5mb3JFYWNoKChub3RlKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgbm93ID0gVE9ORS5ub3coKTsgLy8g54++5Zyo44Gu5pmC6ZaTXG4gICAgICAgICAgICAgICAgY29uc3QgdGltZSA9IG5vdGUudGltZTsgLy8g6ZaL5aeL5pmC6ZaTXG4gICAgICAgICAgICAgICAgY29uc3QgdmVsb2NpdHkgPSBub3RlLnZlbG9jaXR5OyAvLyDpn7Pjga7lpKfjgY3jgZVcbiAgICAgICAgICAgICAgICBjb25zdCBwaXRjaCA9IG5vdGUubWlkaTsgLy8g6Z+z44Gu6auY44GVXG4gICAgICAgICAgICAgICAgY29uc3QgZHVyYXRpb24gPSBub3RlLmR1cmF0aW9uOyAvLyDpn7Pjga7plbfjgZVcbiAgICAgICAgICAgICAgICB0aGlzLnRvdGFsTm90ZXMrKzsgLy8g44OO44O844OI44Gu5ZCI6KiI44KS5pu05pawXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVVSSgpO1xuXG4gICAgICAgICAgICAgICAgVE9ORS5UcmFuc3BvcnQuc2NoZWR1bGVPbmNlKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8g5pmC6ZaT44GM5p2l44Gf44KJ56uL5pa55L2T44KS6JC944Go44GZXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmFsbGluZ0N1YmUodmVsb2NpdHksIHBpdGNoLCBkdXJhdGlvbik7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8g54++5Zyo44Gu44OO44O844OI44KS5pu05pawXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudE5vdGVJbmRleCsrO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFVJ44Gu5pu05pawXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlVUkoKTtcbiAgICAgICAgICAgICAgICB9LCBub3cgKyB0aW1lKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBNSURJ44OH44O844K/44KS5YaN55SfXG4gICAgICAgIFRPTkUuVHJhbnNwb3J0LnN0YXJ0KCk7XG4gICAgfTtcblxuICAgIC8vIE1JREnjg4fjg7zjgr/jgpJEJkTjgafjgY3jgovjgojjgYbjgavjgZnjgotcbiAgICBwcml2YXRlIHNldHVwRmlsZURyb3AgPSAoKSA9PiB7XG4gICAgICAgIC8vIOODieODreODg+ODl+OCqOODquOCouOBruS9nOaIkFxuICAgICAgICBjb25zdCBkcm9wQXJlYSA9IGRvY3VtZW50LmJvZHk7XG5cbiAgICAgICAgLy8g44OJ44Op44OD44Kw44Kq44O844OQ44O85pmC44Gu5Yem55CGXG4gICAgICAgIGRyb3BBcmVhLmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnb3ZlclwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IC8vIOODieODqeODg+OCsOaZguOBruODh+ODleOCqeODq+ODiOOBruaMmeWLleOCkuOCreODo+ODs+OCu+ODq1xuICAgICAgICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcImNvcHlcIjsgLy8g44OJ44Ot44OD44OX5pmC44Gu5oyZ5YuV44KS44Kz44OU44O844Gr44GZ44KLXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIOODieODreODg+ODl+aZguOBruWHpueQhlxuICAgICAgICBkcm9wQXJlYS5hZGRFdmVudExpc3RlbmVyKFwiZHJvcFwiLCBhc3luYyAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIC8vIOODieODreODg+ODl+OBleOCjOOBn+ODleOCoeOCpOODq+OCkuWPluW+l1xuICAgICAgICAgICAgY29uc3QgZmlsZXMgPSBldmVudC5kYXRhVHJhbnNmZXIuZmlsZXM7XG4gICAgICAgICAgICBpZiAoZmlsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIC8vIOikh+aVsEQmROOBleOCjOOBn+WgtOWQiDHjgaTnm67jga7jg5XjgqHjgqTjg6vjga7jgb/lj5blvpdcbiAgICAgICAgICAgICAgICBjb25zdCBmaWxlID0gZmlsZXNbMF07XG5cbiAgICAgICAgICAgICAgICAvLyBNSURJ44OH44O844K/44Gg44Gj44Gf5aC05ZCIXG4gICAgICAgICAgICAgICAgaWYgKGZpbGUudHlwZSA9PT0gXCJhdWRpby9taWRpXCIgfHwgZmlsZS5uYW1lLmVuZHNXaXRoKFwiLm1pZFwiKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBhcnJheUJ1ZmZlciA9IGF3YWl0IGZpbGUuYXJyYXlCdWZmZXIoKTsgLy8gQXJyYXlCdWZmZXLjgavlpInmj5tcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5taWRpRGF0YSA9IG5ldyBNaWRpKGFycmF5QnVmZmVyKTsgLy8gTUlESeODh+ODvOOCv+OBq+WkieaPm1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8vIFVJ44Gu5L2c5oiQXG4gICAgcHJpdmF0ZSBjcmVhdGVVSSA9ICgpID0+IHtcbiAgICAgICAgY29uc3QgdWkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB1aS5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgICAgICAgdWkuc3R5bGUudG9wID0gXCIwXCI7XG4gICAgICAgIHVpLnN0eWxlLmxlZnQgPSBcIjBcIjtcbiAgICAgICAgdWkuc3R5bGUubWFyZ2luID0gXCIxZW0gMmVtXCI7XG4gICAgICAgIHVpLnN0eWxlLmZvbnRTaXplID0gXCIxNHB4XCI7XG4gICAgICAgIHVpLnN0eWxlLmNvbG9yID0gXCJ3aGl0ZVwiO1xuICAgICAgICB1aS5zdHlsZS5mb250RmFtaWx5ID0gXCJzYW5zLXNlcmlmXCI7XG4gICAgICAgIHVpLnN0eWxlLnpJbmRleCA9IFwiMTAwMFwiO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHVpKTtcblxuICAgICAgICAvLyDjgqzjgqTjg4lcbiAgICAgICAgY29uc3QgZ3VpZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgICAgZ3VpZGUuaW5uZXJUZXh0ID0gXCJDbGljayAob3IgZHJvcCBhIE1JREkgZmlsZSkgdG8gcGxheVwiO1xuICAgICAgICB1aS5hcHBlbmRDaGlsZChndWlkZSk7XG5cbiAgICAgICAgLy8g54++5Zyo44Gu44OO44O844OI44KS6KGo56S6XG4gICAgICAgIGNvbnN0IGN1cnJlbnROb3RlTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgICAgY3VycmVudE5vdGVMYWJlbC5pbm5lclRleHQgPSBcIkN1cnJlbnQgTm90ZTogMFwiO1xuICAgICAgICB1aS5hcHBlbmRDaGlsZChjdXJyZW50Tm90ZUxhYmVsKTtcblxuICAgICAgICAvLyDjg47jg7zjg4jjga7lkIjoqIjjgpLooajnpLpcbiAgICAgICAgY29uc3QgdG90YWxOb3RlTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgICAgdG90YWxOb3RlTGFiZWwuaW5uZXJUZXh0ID0gXCJUb3RhbCBOb3RlOiAwXCI7XG4gICAgICAgIHVpLmFwcGVuZENoaWxkKHRvdGFsTm90ZUxhYmVsKTtcblxuICAgICAgICAvLyDjgrnjg5rjg7zjgrnjgpLkvZzmiJDjgZfjg5fjg63jgrDjg6zjgrnjg5Djg7zjgajjgZnjgotcbiAgICAgICAgY29uc3Qgc3BhY2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBzcGFjZS5zdHlsZS53aWR0aCA9IFwiMjAwcHhcIjtcbiAgICAgICAgc3BhY2Uuc3R5bGUuaGVpZ2h0ID0gXCIxNnB4XCI7XG4gICAgICAgIHNwYWNlLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwid2hpdGVcIjtcbiAgICAgICAgc3BhY2Uuc3R5bGUuYm9yZGVyUmFkaXVzID0gXCIycHhcIjtcbiAgICAgICAgc3BhY2Uuc3R5bGUubWFyZ2luVG9wID0gXCIxZW1cIjtcbiAgICAgICAgc3BhY2Uuc3R5bGUub3ZlcmZsb3cgPSBcImhpZGRlblwiO1xuICAgICAgICB1aS5hcHBlbmRDaGlsZChzcGFjZSk7XG5cbiAgICAgICAgLy8g44K544Oa44O844K544Gr44OX44Ot44Kw44Os44K544OQ44O844KS6L+95YqgXG4gICAgICAgIGNvbnN0IHByb2dyZXNzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgcHJvZ3Jlc3Muc3R5bGUud2lkdGggPSB0aGlzLnByb2dyZXNzICogMTAwICsgXCIlXCI7XG4gICAgICAgIHByb2dyZXNzLnN0eWxlLmhlaWdodCA9IFwiMTAwJVwiO1xuICAgICAgICBwcm9ncmVzcy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiMxMTc3YmJcIjtcbiAgICAgICAgc3BhY2UuYXBwZW5kQ2hpbGQocHJvZ3Jlc3MpO1xuXG4gICAgICAgIHRoaXMudWlFbGVtZW50cyA9IHtcbiAgICAgICAgICAgIHByb2dyZXNzOiBwcm9ncmVzcyxcbiAgICAgICAgICAgIGd1aWRlOiBndWlkZSxcbiAgICAgICAgICAgIGN1cnJlbnROb3RlOiBjdXJyZW50Tm90ZUxhYmVsLFxuICAgICAgICAgICAgdG90YWxOb3RlOiB0b3RhbE5vdGVMYWJlbCxcbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgLy8gVUnjga7mm7TmlrBcbiAgICBwcml2YXRlIHVwZGF0ZVVJID0gKCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMudWlFbGVtZW50cykgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGN1cnJlbnROb3RlSW5kZXggPSB0aGlzLmN1cnJlbnROb3RlSW5kZXggPz8gMDtcbiAgICAgICAgY29uc3QgdG90YWxOb3RlcyA9IHRoaXMudG90YWxOb3RlcyA/PyAwO1xuICAgICAgICB0aGlzLnByb2dyZXNzID0gY3VycmVudE5vdGVJbmRleCAvIHRvdGFsTm90ZXM7XG5cbiAgICAgICAgLy8g44OX44Ot44Kw44Os44K544OQ44O844KS5pu05pawXG4gICAgICAgIHRoaXMudWlFbGVtZW50cy5wcm9ncmVzcy5zdHlsZS53aWR0aCA9IHRoaXMucHJvZ3Jlc3MgKiAxMDAgKyBcIiVcIjtcblxuICAgICAgICAvLyDjgqzjgqTjg4njgpLmm7TmlrAgKOS4gOaZguWBnOatouS4reOAgee1guS6huaZguOAgeWGjeeUn+S4rSlcbiAgICAgICAgdGhpcy51aUVsZW1lbnRzLmd1aWRlLmlubmVyVGV4dCA9IGAke1xuICAgICAgICAgICAgdGhpcy5pc1BhdXNlZCAvLyDkuIDmmYLlgZzmraLkuK3jgYtcbiAgICAgICAgICAgICAgICA/IFwiUGF1c2VkLi4uIChTcGFjZSB0byBQbGF5KVwiIC8vIFllc1xuICAgICAgICAgICAgICAgIDogY3VycmVudE5vdGVJbmRleCA9PT0gdG90YWxOb3RlcyAvLyBObyDihpIg5pyA5b6M44Gu44OO44O844OI44G+44Gn5YaN55Sf44GX44Gf44GLXG4gICAgICAgICAgICAgICAgPyBcIkZpbmlzaGVkIVwiIC8vIFllc1xuICAgICAgICAgICAgICAgIDogXCJOb3cgUGxheWluZy4uLiAoU3BhY2UgdG8gUGF1c2UpXCIgLy8gTm9cbiAgICAgICAgfWA7XG4gICAgICAgIC8vIOePvuWcqOOBruODjuODvOODiOOCkuihqOekulxuICAgICAgICB0aGlzLnVpRWxlbWVudHMuY3VycmVudE5vdGUuaW5uZXJUZXh0ID0gYEN1cnJlbnQgTm90ZTogJHtjdXJyZW50Tm90ZUluZGV4fWA7XG4gICAgICAgIC8vIOODjuODvOODiOOBruWQiOioiOOCkuihqOekulxuICAgICAgICB0aGlzLnVpRWxlbWVudHMudG90YWxOb3RlLmlubmVyVGV4dCA9IGBUb3RhbCBOb3RlOiAke3RvdGFsTm90ZXN9YDtcbiAgICB9O1xuXG4gICAgLy8g55S76Z2i6YOo5YiG44Gu5L2c5oiQKOihqOekuuOBmeOCi+aeoOOBlOOBqOOBqylcbiAgICBwdWJsaWMgY3JlYXRlUmVuZGVyZXJET00gPSAoY2FtZXJhUG9zOiBUSFJFRS5WZWN0b3IzKSA9PiB7XG4gICAgICAgIGxldCByZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKCk7XG4gICAgICAgIHJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gICAgICAgIHJlbmRlcmVyLnNldENsZWFyQ29sb3IobmV3IFRIUkVFLkNvbG9yKDB4MWUxZTFlKSk7XG4gICAgICAgIHJlbmRlcmVyLnNoYWRvd01hcC5lbmFibGVkID0gdHJ1ZTsgLy8g44K344Oj44OJ44Km5pyJ5Yq5XG5cbiAgICAgICAgLy/jgqvjg6Hjg6njga7oqK3lrppcbiAgICAgICAgbGV0IGNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYShcbiAgICAgICAgICAgIDY1LFxuICAgICAgICAgICAgd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQsXG4gICAgICAgICAgICAwLjEsXG4gICAgICAgICAgICAxMDAwXG4gICAgICAgICk7XG4gICAgICAgIGNhbWVyYS5wb3NpdGlvbi5jb3B5KGNhbWVyYVBvcyk7XG4gICAgICAgIGNhbWVyYS5sb29rQXQobmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgMCkpO1xuXG4gICAgICAgIC8vIOOCq+ODoeODqeaTjeS9nOOBruioreWumlxuICAgICAgICBsZXQgb3JiaXRDb250cm9scyA9IG5ldyBPcmJpdENvbnRyb2xzKGNhbWVyYSwgcmVuZGVyZXIuZG9tRWxlbWVudCk7XG5cbiAgICAgICAgLy8g44K344O844Oz44Gu5L2c5oiQXG4gICAgICAgIHRoaXMuY3JlYXRlU2NlbmUoKTtcblxuICAgICAgICAvLyDjg6zjg7Pjg4Djg6rjg7PjgrDjga7oqK3lrppcbiAgICAgICAgY29uc3QgcmVuZGVyUGFzcyA9IG5ldyBSZW5kZXJQYXNzKHRoaXMuc2NlbmUsIGNhbWVyYSk7XG5cbiAgICAgICAgLy8g55m65YWJ44Ko44OV44Kn44Kv44OI44Gu6Kit5a6aXG4gICAgICAgIGNvbnN0IGJsb29tUGFzcyA9IG5ldyBVbnJlYWxCbG9vbVBhc3MoXG4gICAgICAgICAgICBuZXcgVEhSRUUuVmVjdG9yMih3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KSxcbiAgICAgICAgICAgIDAuNSwgLy8g44G844GL44GX44Gu5by344GVXG4gICAgICAgICAgICAxLjIsIC8vIOOBvOOBi+OBl+OBruWNiuW+hFxuICAgICAgICAgICAgMC4wIC8vIOOBl+OBjeOBhOWApFxuICAgICAgICApO1xuXG4gICAgICAgIC8vIOODneOCueODiOODl+ODreOCu+ODg+OCt+ODs+OCsOOBruioreWumlxuICAgICAgICBjb25zdCBjb21wb3NlciA9IG5ldyBFZmZlY3RDb21wb3NlcihyZW5kZXJlcik7XG4gICAgICAgIGNvbXBvc2VyLmFkZFBhc3MocmVuZGVyUGFzcyk7XG4gICAgICAgIGNvbXBvc2VyLmFkZFBhc3MoYmxvb21QYXNzKTtcbiAgICAgICAgY29tcG9zZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcblxuICAgICAgICAvLyDmr47jg5Xjg6zjg7zjg6Djga51cGRhdGXjgpLlkbzjgpPjgadyZW5kZXJcbiAgICAgICAgLy8gcmVxdWVzdEFuaW1hdGlvbkZyYW1lIOOBq+OCiOOCiuasoeODleODrOODvOODoOOCkuWRvOOBtlxuICAgICAgICBsZXQgcmVuZGVyOiBGcmFtZVJlcXVlc3RDYWxsYmFjayA9ICh0aW1lKSA9PiB7XG4gICAgICAgICAgICBvcmJpdENvbnRyb2xzLnVwZGF0ZSgpO1xuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlbmRlcik7XG4gICAgICAgICAgICBjb21wb3Nlci5yZW5kZXIoKTtcbiAgICAgICAgfTtcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlbmRlcik7XG5cbiAgICAgICAgLy8g5b+144Gu54K65Yid5pyf5pmC44Gr44KC44Oq44K144Kk44K6XG4gICAgICAgIG9uUmVzaXplKCk7XG5cbiAgICAgICAgLy8g44Km44Kj44Oz44OJ44Km44Gu44Oq44K144Kk44K644KS5qSc55+lXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIG9uUmVzaXplKTtcblxuICAgICAgICBmdW5jdGlvbiBvblJlc2l6ZSgpIHtcbiAgICAgICAgICAgIC8vIOOCteOCpOOCuuWPluW+l1xuICAgICAgICAgICAgY29uc3Qgd2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgICAgICAgIGNvbnN0IGhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblxuICAgICAgICAgICAgLy8g44Os44Oz44OA44Op44O844Gu44K144Kk44K644KS6Kq/5pW0XG4gICAgICAgICAgICByZW5kZXJlci5zZXRQaXhlbFJhdGlvKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKTtcbiAgICAgICAgICAgIHJlbmRlcmVyLnNldFNpemUod2lkdGgsIGhlaWdodCk7XG5cbiAgICAgICAgICAgIC8vIOOCq+ODoeODqeOCkuiqv+aVtFxuICAgICAgICAgICAgY2FtZXJhLmFzcGVjdCA9IHdpZHRoIC8gaGVpZ2h0O1xuICAgICAgICAgICAgY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZW5kZXJlci5kb21FbGVtZW50O1xuICAgIH07XG5cbiAgICAvLyDlubPpnaLjga7kvZzmiJBcbiAgICBwcml2YXRlIGNyZWF0ZVBsYW5lID0gKCkgPT4ge1xuICAgICAgICAvLyDlubPpnaLjga7kvZzmiJBcbiAgICAgICAgY29uc3QgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuUGxhbmVHZW9tZXRyeSgyMDAsIDIwMCk7XG4gICAgICAgIGNvbnN0IG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsKHsgY29sb3I6IDB4MWUxZTFlIH0pO1xuICAgICAgICBjb25zdCBwbGFuZSA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbCk7XG4gICAgICAgIHBsYW5lLnJvdGF0aW9uLnggPSAtMC41ICogTWF0aC5QSTtcbiAgICAgICAgcGxhbmUucG9zaXRpb24uc2V0KDAsIC0xLCAwKTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQocGxhbmUpO1xuXG4gICAgICAgIC8vIOW5s+mdouOBrueJqeeQhua8lOeul1xuICAgICAgICBjb25zdCBzaGFwZSA9IG5ldyBDQU5OT04uUGxhbmUoKTtcbiAgICAgICAgY29uc3QgYm9keSA9IG5ldyBDQU5OT04uQm9keSh7IG1hc3M6IDAsIHNoYXBlOiBzaGFwZSB9KTtcbiAgICAgICAgYm9keS5wb3NpdGlvbi5zZXQocGxhbmUucG9zaXRpb24ueCwgcGxhbmUucG9zaXRpb24ueSwgcGxhbmUucG9zaXRpb24ueik7XG4gICAgICAgIGJvZHkucXVhdGVybmlvbi5zZXQoXG4gICAgICAgICAgICBwbGFuZS5xdWF0ZXJuaW9uLngsXG4gICAgICAgICAgICBwbGFuZS5xdWF0ZXJuaW9uLnksXG4gICAgICAgICAgICBwbGFuZS5xdWF0ZXJuaW9uLnosXG4gICAgICAgICAgICBwbGFuZS5xdWF0ZXJuaW9uLndcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy53b3JsZC5hZGRCb2R5KGJvZHkpO1xuICAgIH07XG5cbiAgICAvLyDokL3kuIvjgZnjgovnq4vmlrnkvZPjga7kvZzmiJBcbiAgICBwcml2YXRlIGZhbGxpbmdDdWJlID0gKFxuICAgICAgICB2ZWxvY2l0eTogbnVtYmVyLFxuICAgICAgICBwaXRjaDogbnVtYmVyLFxuICAgICAgICBkdXJhdGlvbjogbnVtYmVyXG4gICAgKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmN1YmVzLmxlbmd0aCA+PSB0aGlzLm1heEN1YmVzKSB7XG4gICAgICAgICAgICAvLyDnq4vmlrnkvZPjgYzmnIDlpKfmlbDjgavpgZTjgZfjgabjgYTjgovloLTlkIjjga/kuIDnlarlj6TjgYTjgoLjga7jgpLliYrpmaRcbiAgICAgICAgICAgIGNvbnN0IG9sZEN1YmUgPSB0aGlzLmN1YmVzLnNoaWZ0KCk7IC8vIOS4gOeVquWPpOOBhOeri+aWueS9k+OCkuWPluW+lyArIOWJiumZpFxuICAgICAgICAgICAgb2xkQ3ViZSAmJiB0aGlzLnJlbW92ZUN1YmUob2xkQ3ViZSk7IC8vICjnq4vmlrnkvZPjgYzlrZjlnKjjgZfjgabjgYTjgZ/jgonliYrpmaQpXG4gICAgICAgIH1cbiAgICAgICAgLy8g56uL5pa55L2T44Gu5L2c5oiQXG4gICAgICAgIHRoaXMuY3JlYXRlQ3ViZSh2ZWxvY2l0eSwgcGl0Y2gsIGR1cmF0aW9uKTtcbiAgICB9O1xuXG4gICAgcHJpdmF0ZSBjcmVhdGVDdWJlID0gKFxuICAgICAgICB2ZWxvY2l0eTogbnVtYmVyLCAvLyDpn7Pjga7lpKfjgY3jgZVcbiAgICAgICAgcGl0Y2g6IG51bWJlciwgLy8g6Z+z44Gu6auY44GVXG4gICAgICAgIGR1cmF0aW9uOiBudW1iZXIgLy8g6Z+z44Gu6ZW344GVXG4gICAgKSA9PiB7XG4gICAgICAgIC8vIOmfs+OBruWkp+OBjeOBleOCkuW5heOBq1xuICAgICAgICBjb25zdCB3aWR0aCA9IHZlbG9jaXR5IC8gNSArIDAuMDI7XG5cbiAgICAgICAgLy8g6Z+z44Gu6auY44GV44KS6Imy44GrXG4gICAgICAgIGNvbnN0IGNvbG9yID0gbmV3IFRIUkVFLkNvbG9yKCkuc2V0SFNMKHBpdGNoIC8gNDAsIDEuMCwgMC41KTtcblxuICAgICAgICAvLyDpn7Pjga7plbfjgZXjgpLpq5jjgZXjgatcbiAgICAgICAgY29uc3QgaGVpZ2h0ID0gZHVyYXRpb24gLyA0O1xuXG4gICAgICAgIC8vIOeri+aWueS9k+OBruS9nOaIkCAo44ON44Kq44Oz6Kq/44Gr5YWJ44KLKVxuICAgICAgICBsZXQgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkod2lkdGgsIGhlaWdodCwgd2lkdGgpO1xuICAgICAgICBsZXQgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFRvb25NYXRlcmlhbCh7XG4gICAgICAgICAgICBjb2xvcjogY29sb3IsXG4gICAgICAgICAgICBlbWlzc2l2ZTogY29sb3IsXG4gICAgICAgICAgICBlbWlzc2l2ZUludGVuc2l0eTogMC41LFxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgY3ViZSA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbCk7XG4gICAgICAgIGN1YmUuY2FzdFNoYWRvdyA9IHRydWU7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGN1YmUpO1xuXG4gICAgICAgIC8vIOeJqeeQhuOCqOODs+OCuOODs+OBruioreWumlxuICAgICAgICBjb25zdCBzaGFwZSA9IG5ldyBDQU5OT04uQm94KFxuICAgICAgICAgICAgbmV3IENBTk5PTi5WZWMzKHdpZHRoIC8gMiwgaGVpZ2h0IC8gMiwgd2lkdGggLyAyKVxuICAgICAgICApO1xuICAgICAgICBjb25zdCBib2R5ID0gbmV3IENBTk5PTi5Cb2R5KHsgbWFzczogMSwgc2hhcGU6IHNoYXBlIH0pO1xuICAgICAgICB0aGlzLndvcmxkLmFkZEJvZHkoYm9keSk7XG5cbiAgICAgICAgLy8g56uL5pa55L2T44Gu5Yid5pyf5L2N572uXG4gICAgICAgIGNvbnN0IHggPSAocGl0Y2ggLSA1MCkgLyA1O1xuICAgICAgICBjb25zdCB6ID0gMDtcbiAgICAgICAgY3ViZS5wb3NpdGlvbi5zZXQoeCwgMSwgeik7XG4gICAgICAgIGJvZHkucG9zaXRpb24uc2V0KHgsIDEsIHopO1xuXG4gICAgICAgIC8vIOeri+aWueS9k+OBruaDheWgseOCkuS/neWtmFxuICAgICAgICB0aGlzLmN1YmVzLnB1c2goe1xuICAgICAgICAgICAgbWVzaDogY3ViZSxcbiAgICAgICAgICAgIGJvZHk6IGJvZHksXG4gICAgICAgICAgICBjcmVhdGVkVGltZTogRGF0ZS5ub3coKSxcbiAgICAgICAgICAgIGlzUGxheWVkOiBmYWxzZSxcbiAgICAgICAgICAgIHZlbG9jaXR5OiB2ZWxvY2l0eSxcbiAgICAgICAgICAgIHBpdGNoOiBwaXRjaCxcbiAgICAgICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbixcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8vIOeri+aWueS9k+OBruWJiumZpFxuICAgIHByaXZhdGUgcmVtb3ZlQ3ViZSA9IChjdWJlSW5mbzogQ3ViZUluZm8pID0+IHtcbiAgICAgICAgdGhpcy5zY2VuZS5yZW1vdmUoY3ViZUluZm8ubWVzaCk7XG4gICAgICAgIHRoaXMud29ybGQucmVtb3ZlQm9keShjdWJlSW5mby5ib2R5KTtcbiAgICAgICAgdGhpcy5jdWJlcyA9IHRoaXMuY3ViZXMuZmlsdGVyKChjdWJlKSA9PiBjdWJlICE9PSBjdWJlSW5mbyk7XG4gICAgfTtcblxuICAgIC8vIOOCt+ODvOODs+OBruS9nOaIkCjlhajkvZPjgacx5ZueKVxuICAgIHByaXZhdGUgY3JlYXRlU2NlbmUgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcblxuICAgICAgICBjb25zdCBheGVzSGVscGVyID0gbmV3IFRIUkVFLkF4ZXNIZWxwZXIoNSk7XG4gICAgICAgIGF4ZXNIZWxwZXIucG9zaXRpb24uc2V0KDAsIC0xLCAwKTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQoYXhlc0hlbHBlcik7XG5cbiAgICAgICAgLy8g54mp55CG44Ko44Oz44K444Oz44Gu6Kit5a6aXG4gICAgICAgIHRoaXMud29ybGQgPSBuZXcgQ0FOTk9OLldvcmxkKHtcbiAgICAgICAgICAgIGdyYXZpdHk6IG5ldyBDQU5OT04uVmVjMygwLCAtOS44MiwgMCksXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIOW5s+mdouOBruS9nOaIkFxuICAgICAgICB0aGlzLmNyZWF0ZVBsYW5lKCk7XG5cbiAgICAgICAgLy8gTUlESeODh+ODvOOCv+OBruWHpueQhiAo44Kv44Oq44OD44Kv44GV44KM44Gf44KJKVxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5wcm9jZXNzTWlkaSk7XG5cbiAgICAgICAgLy8g44K544Oa44O844K544Kt44O844Gn5LiA5pmC5YGc5q2iXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKGV2ZW50LmtleSA9PT0gXCIgXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmlzUGF1c2VkID0gIXRoaXMuaXNQYXVzZWQ7XG4gICAgICAgICAgICAgICAgdGhpcy5pc1BhdXNlZCA/IFRPTkUuVHJhbnNwb3J0LnBhdXNlKCkgOiBUT05FLlRyYW5zcG9ydC5zdGFydCgpO1xuXG4gICAgICAgICAgICAgICAgLy8gVUnjga7mm7TmlrBcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVVJKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8v44Op44Kk44OI44Gu6Kit5a6aXG4gICAgICAgIHRoaXMubGlnaHQgPSBuZXcgVEhSRUUuRGlyZWN0aW9uYWxMaWdodCgweGZmZmZmZik7XG4gICAgICAgIGxldCBsdmVjID0gbmV3IFRIUkVFLlZlY3RvcjMoOCwgMTAsIDEpLm5vcm1hbGl6ZSgpO1xuICAgICAgICB0aGlzLmxpZ2h0LnBvc2l0aW9uLnNldChsdmVjLngsIGx2ZWMueSwgbHZlYy56KTtcbiAgICAgICAgdGhpcy5saWdodC5pbnRlbnNpdHkgPSAwLjU7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKHRoaXMubGlnaHQpO1xuXG4gICAgICAgIGNvbnN0IGFtYmllbnRMaWdodCA9IG5ldyBUSFJFRS5BbWJpZW50TGlnaHQoMHhmZmZmZmYsIDAuMSk7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGFtYmllbnRMaWdodCk7XG5cbiAgICAgICAgLy8g54mp55CG5ryU566X44Gu44K344Of44Ol44Os44O844K344On44Oz5b6M44Gr5a6f6KGMXG4gICAgICAgIHRoaXMud29ybGQuYWRkRXZlbnRMaXN0ZW5lcihcInBvc3RTdGVwXCIsIHRoaXMub25Db2xsaXNpb24pO1xuXG4gICAgICAgIC8vIOaZgumWk+OCkuaJseOBhlxuICAgICAgICBjb25zdCBjbG9jayA9IG5ldyBUSFJFRS5DbG9jaygpO1xuXG4gICAgICAgIC8vIOavjuODleODrOODvOODoOOBrnVwZGF0ZeOCkuWRvOOCk+OBp+abtOaWsFxuICAgICAgICAvLyByZXF1ZXN0QW5pbWF0aW9uRnJhbWUg44Gr44KI44KK5qyh44OV44Os44O844Og44KS5ZG844G2XG4gICAgICAgIGxldCB1cGRhdGU6IEZyYW1lUmVxdWVzdENhbGxiYWNrID0gKHRpbWUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGRlbHRhID0gY2xvY2suZ2V0RGVsdGEoKTtcblxuICAgICAgICAgICAgLy8g54mp55CG44Ko44Oz44K444Oz44Gu5pu05pawICjpgLLjgpPjgaDmmYLplpPjgaDjgZEpXG4gICAgICAgICAgICB0aGlzLndvcmxkLmZpeGVkU3RlcCgpO1xuXG4gICAgICAgICAgICAvLyDniannkIbjgqjjg7Pjgrjjg7Pjga7mm7TmlrBcbiAgICAgICAgICAgIHRoaXMuY3ViZXMuZm9yRWFjaCgoY3ViZSkgPT4ge1xuICAgICAgICAgICAgICAgIGN1YmUuYm9keS5wb3NpdGlvbi56IC09IDIgKiBkZWx0YTtcbiAgICAgICAgICAgICAgICBjdWJlLm1lc2gucG9zaXRpb24uY29weShjdWJlLmJvZHkucG9zaXRpb24gYXMgYW55KTtcbiAgICAgICAgICAgICAgICBjdWJlLm1lc2gucXVhdGVybmlvbi5jb3B5KGN1YmUuYm9keS5xdWF0ZXJuaW9uIGFzIGFueSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHVwZGF0ZSk7XG4gICAgICAgIH07XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGUpO1xuICAgIH07XG5cbiAgICAvLyDkuIDlrprot53pm6LjgpLotoXjgYjjgZ/jgonpn7PjgpLps7TjgonjgZlcbiAgICBwcml2YXRlIG9uQ29sbGlzaW9uID0gKCkgPT4ge1xuICAgICAgICB0aGlzLmN1YmVzLmZvckVhY2goKGN1YmUpID0+IHtcbiAgICAgICAgICAgIGlmIChjdWJlLmJvZHkucG9zaXRpb24ueiA8IC0xLjIgJiYgIWN1YmUuaXNQbGF5ZWQpIHtcbiAgICAgICAgICAgICAgICBjdWJlLmlzUGxheWVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXlTb3VuZChjdWJlLnZlbG9jaXR5LCBjdWJlLnBpdGNoLCBjdWJlLmR1cmF0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8vIOmfs+OCkumztOOCieOBmVxuICAgIHByaXZhdGUgcGxheVNvdW5kID0gKHZlbG9jaXR5OiBudW1iZXIsIHBpdGNoOiBudW1iZXIsIGR1cmF0aW9uOiBudW1iZXIpID0+IHtcbiAgICAgICAgdGhpcy5zeW50aC50cmlnZ2VyQXR0YWNrUmVsZWFzZShcbiAgICAgICAgICAgIFRPTkUuRnJlcXVlbmN5KHBpdGNoLCBcIm1pZGlcIikudG9Ob3RlKCksXG4gICAgICAgICAgICBkdXJhdGlvbixcbiAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHZlbG9jaXR5IC8gMiAvLyDpn7PlibLjgozjgpLpmLLjgZDjgZ/jgoHjgavpn7Pjga7lpKfjgY3jgZXjgpLljYrliIbjgatcbiAgICAgICAgKTtcbiAgICB9O1xuXG4gICAgcHJpdmF0ZSBzdHlsZVNoZWV0ID0gKCkgPT4ge1xuICAgICAgICBjb25zdCBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgICAgICAgc3R5bGUuaW5uZXJIVE1MID0gYFxuICAgICAgICAgICAgYm9keSB7XG4gICAgICAgICAgICAgICAgbWFyZ2luOiAwO1xuICAgICAgICAgICAgICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgICAgICAgICB9XG4gICAgICAgIGA7XG4gICAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICAgIH07XG59XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBpbml0KTtcblxuZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBsZXQgY29udGFpbmVyID0gbmV3IFRocmVlSlNDb250YWluZXIoKTtcbiAgICBsZXQgdmlld3BvcnQgPSBjb250YWluZXIuY3JlYXRlUmVuZGVyZXJET00obmV3IFRIUkVFLlZlY3RvcjMoLTAuNCwgMC43LCAxKSk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh2aWV3cG9ydCk7XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbiIsInZhciBkZWZlcnJlZCA9IFtdO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5PID0gKHJlc3VsdCwgY2h1bmtJZHMsIGZuLCBwcmlvcml0eSkgPT4ge1xuXHRpZihjaHVua0lkcykge1xuXHRcdHByaW9yaXR5ID0gcHJpb3JpdHkgfHwgMDtcblx0XHRmb3IodmFyIGkgPSBkZWZlcnJlZC5sZW5ndGg7IGkgPiAwICYmIGRlZmVycmVkW2kgLSAxXVsyXSA+IHByaW9yaXR5OyBpLS0pIGRlZmVycmVkW2ldID0gZGVmZXJyZWRbaSAtIDFdO1xuXHRcdGRlZmVycmVkW2ldID0gW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldO1xuXHRcdHJldHVybjtcblx0fVxuXHR2YXIgbm90RnVsZmlsbGVkID0gSW5maW5pdHk7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgZGVmZXJyZWQubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldID0gZGVmZXJyZWRbaV07XG5cdFx0dmFyIGZ1bGZpbGxlZCA9IHRydWU7XG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBjaHVua0lkcy5sZW5ndGg7IGorKykge1xuXHRcdFx0aWYgKChwcmlvcml0eSAmIDEgPT09IDAgfHwgbm90RnVsZmlsbGVkID49IHByaW9yaXR5KSAmJiBPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLk8pLmV2ZXJ5KChrZXkpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fLk9ba2V5XShjaHVua0lkc1tqXSkpKSkge1xuXHRcdFx0XHRjaHVua0lkcy5zcGxpY2Uoai0tLCAxKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZ1bGZpbGxlZCA9IGZhbHNlO1xuXHRcdFx0XHRpZihwcmlvcml0eSA8IG5vdEZ1bGZpbGxlZCkgbm90RnVsZmlsbGVkID0gcHJpb3JpdHk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKGZ1bGZpbGxlZCkge1xuXHRcdFx0ZGVmZXJyZWQuc3BsaWNlKGktLSwgMSlcblx0XHRcdHZhciByID0gZm4oKTtcblx0XHRcdGlmIChyICE9PSB1bmRlZmluZWQpIHJlc3VsdCA9IHI7XG5cdFx0fVxuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59OyIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIG5vIGJhc2VVUklcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcIm1haW5cIjogMFxufTtcblxuLy8gbm8gY2h1bmsgb24gZGVtYW5kIGxvYWRpbmdcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5PLmogPSAoY2h1bmtJZCkgPT4gKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9PT0gMCk7XG5cbi8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xudmFyIHdlYnBhY2tKc29ucENhbGxiYWNrID0gKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uLCBkYXRhKSA9PiB7XG5cdHZhciBbY2h1bmtJZHMsIG1vcmVNb2R1bGVzLCBydW50aW1lXSA9IGRhdGE7XG5cdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuXHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcblx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMDtcblx0aWYoY2h1bmtJZHMuc29tZSgoaWQpID0+IChpbnN0YWxsZWRDaHVua3NbaWRdICE9PSAwKSkpIHtcblx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcblx0XHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG5cdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKHJ1bnRpbWUpIHZhciByZXN1bHQgPSBydW50aW1lKF9fd2VicGFja19yZXF1aXJlX18pO1xuXHR9XG5cdGlmKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKSBwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbihkYXRhKTtcblx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcblx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgJiYgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG5cdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF1bMF0oKTtcblx0XHR9XG5cdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcblx0fVxuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHJlc3VsdCk7XG59XG5cbnZhciBjaHVua0xvYWRpbmdHbG9iYWwgPSBzZWxmW1wid2VicGFja0NodW5rc291bmRfdGhyZWVfanNcIl0gPSBzZWxmW1wid2VicGFja0NodW5rc291bmRfdGhyZWVfanNcIl0gfHwgW107XG5jaHVua0xvYWRpbmdHbG9iYWwuZm9yRWFjaCh3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIDApKTtcbmNodW5rTG9hZGluZ0dsb2JhbC5wdXNoID0gd2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCBjaHVua0xvYWRpbmdHbG9iYWwucHVzaC5iaW5kKGNodW5rTG9hZGluZ0dsb2JhbCkpOyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgZGVwZW5kcyBvbiBvdGhlciBsb2FkZWQgY2h1bmtzIGFuZCBleGVjdXRpb24gbmVlZCB0byBiZSBkZWxheWVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyh1bmRlZmluZWQsIFtcInZlbmRvcnMtbm9kZV9tb2R1bGVzX3RvbmVqc19taWRpX2Rpc3RfTWlkaV9qcy1ub2RlX21vZHVsZXNfY2Fubm9uLWVzX2Rpc3RfY2Fubm9uLWVzX2pzLW5vZGVfbS1lYTkxMmNcIl0sICgpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvYXBwLnRzXCIpKSlcbl9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8oX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=