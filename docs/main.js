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
    scene;
    light;
    cubes = [];
    world;
    maxCubes = 25;
    synth;
    midiData = undefined;
    constructor() {
        // 初期設定時にスタイルシートを読み込む
        this.styleSheet();
        // 音声の設定 (マスター)
        this.synth = new tone__WEBPACK_IMPORTED_MODULE_4__.Synth().toDestination();
        // MIDIデータの読み込み
        this.loadMIDI("A.mid");
    }
    // MIDIデータの読み込み
    loadMIDI = async (path) => {
        const data = await _tonejs_midi__WEBPACK_IMPORTED_MODULE_5__.Midi.fromUrl(path);
        this.midiData = data;
    };
    // MIDIデータの処理
    processMidi = () => {
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
                tone__WEBPACK_IMPORTED_MODULE_4__.Transport.scheduleOnce(() => {
                    // 時間が来たら立方体を落とす
                    this.fallingCube(velocity, pitch, duration);
                }, now + time);
            });
        });
        tone__WEBPACK_IMPORTED_MODULE_4__.Transport.start();
    };
    // 画面部分の作成(表示する枠ごとに)
    createRendererDOM = (cameraPos) => {
        let renderer = new three__WEBPACK_IMPORTED_MODULE_6__.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(new three__WEBPACK_IMPORTED_MODULE_6__.Color(0x1e1e1e));
        renderer.shadowMap.enabled = true; // シャドウ有効
        //カメラの設定
        let camera = new three__WEBPACK_IMPORTED_MODULE_6__.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.copy(cameraPos);
        camera.lookAt(new three__WEBPACK_IMPORTED_MODULE_6__.Vector3(0, 0, 0));
        // カメラ操作の設定
        let orbitControls = new three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__.OrbitControls(camera, renderer.domElement);
        // シーンの作成
        this.createScene();
        // レンダリングの設定
        const renderPass = new three_examples_jsm_postprocessing_RenderPass__WEBPACK_IMPORTED_MODULE_2__.RenderPass(this.scene, camera);
        // 発光エフェクトの設定
        const bloomPass = new three_examples_jsm_postprocessing_UnrealBloomPass__WEBPACK_IMPORTED_MODULE_3__.UnrealBloomPass(new three__WEBPACK_IMPORTED_MODULE_6__.Vector2(window.innerWidth, window.innerHeight), 0.4, // ぼかしの強さ
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
        const geometry = new three__WEBPACK_IMPORTED_MODULE_6__.PlaneGeometry(10, 10);
        const material = new three__WEBPACK_IMPORTED_MODULE_6__.MeshStandardMaterial({ color: 0x1e1e1e });
        const plane = new three__WEBPACK_IMPORTED_MODULE_6__.Mesh(geometry, material);
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.set(0, -1, 0);
        // 透明にする
        plane.material.transparent = true;
        plane.material.opacity = 0;
        this.scene.add(plane);
        // 平面の物理演算
        const shape = new cannon_es__WEBPACK_IMPORTED_MODULE_7__.Plane();
        const body = new cannon_es__WEBPACK_IMPORTED_MODULE_7__.Body({ mass: 0 });
        body.addShape(shape);
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
        const width = velocity / 5;
        // 音の高さを色に
        const color = new three__WEBPACK_IMPORTED_MODULE_6__.Color().setHSL(pitch / 40, 1.0, 0.5);
        // 音の長さを高さに
        const height = duration * 0.1;
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
        const body = new cannon_es__WEBPACK_IMPORTED_MODULE_7__.Body({ mass: 1 });
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
    removeCube = (cubeInfo) => {
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
        // 毎フレームのupdateを呼んで更新
        // requestAnimationFrame により次フレームを呼ぶ
        let update = (time) => {
            // 物理エンジンの更新 (進んだ時間だけ)
            this.world.fixedStep();
            // 物理エンジンの更新
            this.cubes.forEach((cube) => {
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
            if (cube.body.position.y < -0.8 && !cube.isPlayed) {
                cube.isPlayed = true;
                this.playSound(cube.pitch, cube.duration);
            }
        });
    };
    // 音を鳴らす
    playSound = (pitch, duration) => {
        this.synth.triggerAttackRelease(tone__WEBPACK_IMPORTED_MODULE_4__.Frequency(pitch, "midi").toNote(), duration);
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
    let viewport = container.createRendererDOM(new three__WEBPACK_IMPORTED_MODULE_6__.Vector3(-1, 1, 1));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7Ozs7V0MzQkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLE1BQU0scUJBQXFCO1dBQzNCO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBOzs7OztVRWhEQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc291bmQtdGhyZWUtanMvLi9zcmMvYXBwLnRzIiwid2VicGFjazovL3NvdW5kLXRocmVlLWpzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3NvdW5kLXRocmVlLWpzL3dlYnBhY2svcnVudGltZS9jaHVuayBsb2FkZWQiLCJ3ZWJwYWNrOi8vc291bmQtdGhyZWUtanMvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vc291bmQtdGhyZWUtanMvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3NvdW5kLXRocmVlLWpzL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vc291bmQtdGhyZWUtanMvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9zb3VuZC10aHJlZS1qcy93ZWJwYWNrL3J1bnRpbWUvanNvbnAgY2h1bmsgbG9hZGluZyIsIndlYnBhY2s6Ly9zb3VuZC10aHJlZS1qcy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL3NvdW5kLXRocmVlLWpzL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9zb3VuZC10aHJlZS1qcy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBPcmJpdENvbnRyb2xzIH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS9jb250cm9scy9PcmJpdENvbnRyb2xzXCI7XG5pbXBvcnQgeyBFZmZlY3RDb21wb3NlciB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vcG9zdHByb2Nlc3NpbmcvRWZmZWN0Q29tcG9zZXJcIjtcbmltcG9ydCB7IFJlbmRlclBhc3MgfSBmcm9tIFwidGhyZWUvZXhhbXBsZXMvanNtL3Bvc3Rwcm9jZXNzaW5nL1JlbmRlclBhc3NcIjtcbmltcG9ydCB7IFVucmVhbEJsb29tUGFzcyB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vcG9zdHByb2Nlc3NpbmcvVW5yZWFsQmxvb21QYXNzXCI7XG5cbmltcG9ydCAqIGFzIENBTk5PTiBmcm9tIFwiY2Fubm9uLWVzXCI7XG5pbXBvcnQgKiBhcyBUV0VFTiBmcm9tIFwiQHR3ZWVuanMvdHdlZW4uanNcIjtcbmltcG9ydCAqIGFzIFRPTkUgZnJvbSBcInRvbmVcIjtcbmltcG9ydCB7IE1pZGkgfSBmcm9tIFwiQHRvbmVqcy9taWRpXCI7XG5cbmludGVyZmFjZSBDdWJlSW5mbyB7XG4gICAgbWVzaDogVEhSRUUuTWVzaDtcbiAgICBib2R5OiBDQU5OT04uQm9keTtcbiAgICBjcmVhdGVkVGltZTogbnVtYmVyO1xuICAgIGlzUGxheWVkOiBib29sZWFuO1xuICAgIHZlbG9jaXR5OiBudW1iZXI7XG4gICAgcGl0Y2g6IG51bWJlcjtcbiAgICBkdXJhdGlvbjogbnVtYmVyO1xufVxuXG5jbGFzcyBUaHJlZUpTQ29udGFpbmVyIHtcbiAgICBwcml2YXRlIHNjZW5lOiBUSFJFRS5TY2VuZTtcbiAgICBwcml2YXRlIGxpZ2h0OiBUSFJFRS5MaWdodDtcbiAgICBwcml2YXRlIGN1YmVzOiBDdWJlSW5mb1tdID0gW107XG4gICAgcHJpdmF0ZSB3b3JsZDogQ0FOTk9OLldvcmxkO1xuICAgIHByaXZhdGUgbWF4Q3ViZXMgPSAyNTtcbiAgICBwcml2YXRlIHN5bnRoOiBUT05FLlN5bnRoO1xuICAgIHByaXZhdGUgbWlkaURhdGE6IE1pZGkgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgLy8g5Yid5pyf6Kit5a6a5pmC44Gr44K544K/44Kk44Or44K344O844OI44KS6Kqt44G/6L6844KAXG4gICAgICAgIHRoaXMuc3R5bGVTaGVldCgpO1xuXG4gICAgICAgIC8vIOmfs+WjsOOBruioreWumiAo44Oe44K544K/44O8KVxuICAgICAgICB0aGlzLnN5bnRoID0gbmV3IFRPTkUuU3ludGgoKS50b0Rlc3RpbmF0aW9uKCk7XG5cbiAgICAgICAgLy8gTUlESeODh+ODvOOCv+OBruiqreOBv+i+vOOBv1xuICAgICAgICB0aGlzLmxvYWRNSURJKFwiQS5taWRcIik7XG4gICAgfVxuXG4gICAgLy8gTUlESeODh+ODvOOCv+OBruiqreOBv+i+vOOBv1xuICAgIHByaXZhdGUgbG9hZE1JREkgPSBhc3luYyAocGF0aDogc3RyaW5nKSA9PiB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBNaWRpLmZyb21VcmwocGF0aCk7XG4gICAgICAgIHRoaXMubWlkaURhdGEgPSBkYXRhO1xuICAgIH07XG5cbiAgICAvLyBNSURJ44OH44O844K/44Gu5Yem55CGXG4gICAgcHJpdmF0ZSBwcm9jZXNzTWlkaSA9ICgpID0+IHtcbiAgICAgICAgLy8g5LiA5bqm44Gu44G/5Yem55CGICjjgq/jg6rjg4Pjgq/jgqTjg5njg7Pjg4jjgpLliYrpmaQpXG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLnByb2Nlc3NNaWRpKTtcblxuICAgICAgICAvLyBNSURJ44OH44O844K/44GM44Gq44GE5aC05ZCI44Gv5Yem55CG44GX44Gq44GEXG4gICAgICAgIGlmICghdGhpcy5taWRpRGF0YSkgcmV0dXJuO1xuXG4gICAgICAgIC8vIOODiOODqeODg+OCr+OBlOOBqOOBq+WHpueQhlxuICAgICAgICB0aGlzLm1pZGlEYXRhLnRyYWNrcy5mb3JFYWNoKCh0cmFjaykgPT4ge1xuICAgICAgICAgICAgLy8g44OO44O844OI44GU44Go44Gr5Yem55CGXG4gICAgICAgICAgICB0cmFjay5ub3Rlcy5mb3JFYWNoKChub3RlKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgbm93ID0gVE9ORS5ub3coKTsgLy8g54++5Zyo44Gu5pmC6ZaTXG4gICAgICAgICAgICAgICAgY29uc3QgdGltZSA9IG5vdGUudGltZTsgLy8g6ZaL5aeL5pmC6ZaTXG4gICAgICAgICAgICAgICAgY29uc3QgdmVsb2NpdHkgPSBub3RlLnZlbG9jaXR5OyAvLyDpn7Pjga7lpKfjgY3jgZVcbiAgICAgICAgICAgICAgICBjb25zdCBwaXRjaCA9IG5vdGUubWlkaTsgLy8g6Z+z44Gu6auY44GVXG4gICAgICAgICAgICAgICAgY29uc3QgZHVyYXRpb24gPSBub3RlLmR1cmF0aW9uOyAvLyDpn7Pjga7plbfjgZVcblxuICAgICAgICAgICAgICAgIFRPTkUuVHJhbnNwb3J0LnNjaGVkdWxlT25jZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOaZgumWk+OBjOadpeOBn+OCieeri+aWueS9k+OCkuiQveOBqOOBmVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZhbGxpbmdDdWJlKHZlbG9jaXR5LCBwaXRjaCwgZHVyYXRpb24pO1xuICAgICAgICAgICAgICAgIH0sIG5vdyArIHRpbWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIFRPTkUuVHJhbnNwb3J0LnN0YXJ0KCk7XG4gICAgfTtcblxuICAgIC8vIOeUu+mdoumDqOWIhuOBruS9nOaIkCjooajnpLrjgZnjgovmnqDjgZTjgajjgaspXG4gICAgcHVibGljIGNyZWF0ZVJlbmRlcmVyRE9NID0gKGNhbWVyYVBvczogVEhSRUUuVmVjdG9yMykgPT4ge1xuICAgICAgICBsZXQgcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcigpO1xuICAgICAgICByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAgICAgICByZW5kZXJlci5zZXRDbGVhckNvbG9yKG5ldyBUSFJFRS5Db2xvcigweDFlMWUxZSkpO1xuICAgICAgICByZW5kZXJlci5zaGFkb3dNYXAuZW5hYmxlZCA9IHRydWU7IC8vIOOCt+ODo+ODieOCpuacieWKuVxuXG4gICAgICAgIC8v44Kr44Oh44Op44Gu6Kit5a6aXG4gICAgICAgIGxldCBjYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoXG4gICAgICAgICAgICA3NSxcbiAgICAgICAgICAgIHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0LFxuICAgICAgICAgICAgMC4xLFxuICAgICAgICAgICAgMTAwMFxuICAgICAgICApO1xuICAgICAgICBjYW1lcmEucG9zaXRpb24uY29weShjYW1lcmFQb3MpO1xuICAgICAgICBjYW1lcmEubG9va0F0KG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAsIDApKTtcblxuICAgICAgICAvLyDjgqvjg6Hjg6nmk43kvZzjga7oqK3lrppcbiAgICAgICAgbGV0IG9yYml0Q29udHJvbHMgPSBuZXcgT3JiaXRDb250cm9scyhjYW1lcmEsIHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuXG4gICAgICAgIC8vIOOCt+ODvOODs+OBruS9nOaIkFxuICAgICAgICB0aGlzLmNyZWF0ZVNjZW5lKCk7XG5cbiAgICAgICAgLy8g44Os44Oz44OA44Oq44Oz44Kw44Gu6Kit5a6aXG4gICAgICAgIGNvbnN0IHJlbmRlclBhc3MgPSBuZXcgUmVuZGVyUGFzcyh0aGlzLnNjZW5lLCBjYW1lcmEpO1xuXG4gICAgICAgIC8vIOeZuuWFieOCqOODleOCp+OCr+ODiOOBruioreWumlxuICAgICAgICBjb25zdCBibG9vbVBhc3MgPSBuZXcgVW5yZWFsQmxvb21QYXNzKFxuICAgICAgICAgICAgbmV3IFRIUkVFLlZlY3RvcjIod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCksXG4gICAgICAgICAgICAwLjQsIC8vIOOBvOOBi+OBl+OBruW8t+OBlVxuICAgICAgICAgICAgMS4yLCAvLyDjgbzjgYvjgZfjga7ljYrlvoRcbiAgICAgICAgICAgIDAuMCAvLyDjgZfjgY3jgYTlgKRcbiAgICAgICAgKTtcblxuICAgICAgICAvLyDjg53jgrnjg4jjg5fjg63jgrvjg4Pjgrfjg7PjgrDjga7oqK3lrppcbiAgICAgICAgY29uc3QgY29tcG9zZXIgPSBuZXcgRWZmZWN0Q29tcG9zZXIocmVuZGVyZXIpO1xuICAgICAgICBjb21wb3Nlci5hZGRQYXNzKHJlbmRlclBhc3MpO1xuICAgICAgICBjb21wb3Nlci5hZGRQYXNzKGJsb29tUGFzcyk7XG4gICAgICAgIGNvbXBvc2VyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG5cbiAgICAgICAgLy8g5q+O44OV44Os44O844Og44GudXBkYXRl44KS5ZG844KT44GncmVuZGVyXG4gICAgICAgIC8vIHJlcXVlc3RBbmltYXRpb25GcmFtZSDjgavjgojjgormrKHjg5Xjg6zjg7zjg6DjgpLlkbzjgbZcbiAgICAgICAgbGV0IHJlbmRlcjogRnJhbWVSZXF1ZXN0Q2FsbGJhY2sgPSAodGltZSkgPT4ge1xuICAgICAgICAgICAgb3JiaXRDb250cm9scy51cGRhdGUoKTtcbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShyZW5kZXIpO1xuICAgICAgICAgICAgY29tcG9zZXIucmVuZGVyKCk7XG4gICAgICAgIH07XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShyZW5kZXIpO1xuXG4gICAgICAgIC8vIOW/teOBrueCuuWIneacn+aZguOBq+OCguODquOCteOCpOOCulxuICAgICAgICBvblJlc2l6ZSgpO1xuXG4gICAgICAgIC8vIOOCpuOCo+ODs+ODieOCpuOBruODquOCteOCpOOCuuOCkuaknOefpVxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBvblJlc2l6ZSk7XG5cbiAgICAgICAgZnVuY3Rpb24gb25SZXNpemUoKSB7XG4gICAgICAgICAgICAvLyDjgrXjgqTjgrrlj5blvpdcbiAgICAgICAgICAgIGNvbnN0IHdpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICAgICAgICBjb25zdCBoZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cbiAgICAgICAgICAgIC8vIOODrOODs+ODgOODqeODvOOBruOCteOCpOOCuuOCkuiqv+aVtFxuICAgICAgICAgICAgcmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyk7XG4gICAgICAgICAgICByZW5kZXJlci5zZXRTaXplKHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgICAgICAgICAvLyDjgqvjg6Hjg6njgpLoqr/mlbRcbiAgICAgICAgICAgIGNhbWVyYS5hc3BlY3QgPSB3aWR0aCAvIGhlaWdodDtcbiAgICAgICAgICAgIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVuZGVyZXIuZG9tRWxlbWVudDtcbiAgICB9O1xuXG4gICAgLy8g5bmz6Z2i44Gu5L2c5oiQXG4gICAgcHJpdmF0ZSBjcmVhdGVQbGFuZSA9ICgpID0+IHtcbiAgICAgICAgLy8g5bmz6Z2i44Gu5L2c5oiQXG4gICAgICAgIGNvbnN0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLlBsYW5lR2VvbWV0cnkoMTAsIDEwKTtcbiAgICAgICAgY29uc3QgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwoeyBjb2xvcjogMHgxZTFlMWUgfSk7XG4gICAgICAgIGNvbnN0IHBsYW5lID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgICAgICAgcGxhbmUucm90YXRpb24ueCA9IC0wLjUgKiBNYXRoLlBJO1xuICAgICAgICBwbGFuZS5wb3NpdGlvbi5zZXQoMCwgLTEsIDApO1xuICAgICAgICAvLyDpgI/mmI7jgavjgZnjgotcbiAgICAgICAgcGxhbmUubWF0ZXJpYWwudHJhbnNwYXJlbnQgPSB0cnVlO1xuICAgICAgICBwbGFuZS5tYXRlcmlhbC5vcGFjaXR5ID0gMDtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQocGxhbmUpO1xuXG4gICAgICAgIC8vIOW5s+mdouOBrueJqeeQhua8lOeul1xuICAgICAgICBjb25zdCBzaGFwZSA9IG5ldyBDQU5OT04uUGxhbmUoKTtcbiAgICAgICAgY29uc3QgYm9keSA9IG5ldyBDQU5OT04uQm9keSh7IG1hc3M6IDAgfSk7XG4gICAgICAgIGJvZHkuYWRkU2hhcGUoc2hhcGUpO1xuICAgICAgICBib2R5LnBvc2l0aW9uLnNldChwbGFuZS5wb3NpdGlvbi54LCBwbGFuZS5wb3NpdGlvbi55LCBwbGFuZS5wb3NpdGlvbi56KTtcbiAgICAgICAgYm9keS5xdWF0ZXJuaW9uLnNldChcbiAgICAgICAgICAgIHBsYW5lLnF1YXRlcm5pb24ueCxcbiAgICAgICAgICAgIHBsYW5lLnF1YXRlcm5pb24ueSxcbiAgICAgICAgICAgIHBsYW5lLnF1YXRlcm5pb24ueixcbiAgICAgICAgICAgIHBsYW5lLnF1YXRlcm5pb24ud1xuICAgICAgICApO1xuICAgICAgICB0aGlzLndvcmxkLmFkZEJvZHkoYm9keSk7XG4gICAgfTtcblxuICAgIC8vIOiQveS4i+OBmeOCi+eri+aWueS9k+OBruS9nOaIkFxuICAgIHByaXZhdGUgZmFsbGluZ0N1YmUgPSAoXG4gICAgICAgIHZlbG9jaXR5OiBudW1iZXIsXG4gICAgICAgIHBpdGNoOiBudW1iZXIsXG4gICAgICAgIGR1cmF0aW9uOiBudW1iZXJcbiAgICApID0+IHtcbiAgICAgICAgaWYgKHRoaXMuY3ViZXMubGVuZ3RoID49IHRoaXMubWF4Q3ViZXMpIHtcbiAgICAgICAgICAgIC8vIOeri+aWueS9k+OBjOacgOWkp+aVsOOBq+mBlOOBl+OBpuOBhOOCi+WgtOWQiOOBr+S4gOeVquWPpOOBhOOCguOBruOCkuWJiumZpFxuICAgICAgICAgICAgY29uc3Qgb2xkQ3ViZSA9IHRoaXMuY3ViZXMuc2hpZnQoKTsgLy8g5LiA55Wq5Y+k44GE56uL5pa55L2T44KS5Y+W5b6XICsg5YmK6ZmkXG4gICAgICAgICAgICBvbGRDdWJlICYmIHRoaXMucmVtb3ZlQ3ViZShvbGRDdWJlKTsgLy8gKOeri+aWueS9k+OBjOWtmOWcqOOBl+OBpuOBhOOBn+OCieWJiumZpClcbiAgICAgICAgfVxuICAgICAgICAvLyDnq4vmlrnkvZPjga7kvZzmiJBcbiAgICAgICAgdGhpcy5jcmVhdGVDdWJlKHZlbG9jaXR5LCBwaXRjaCwgZHVyYXRpb24pO1xuICAgIH07XG5cbiAgICBwcml2YXRlIGNyZWF0ZUN1YmUgPSAoXG4gICAgICAgIHZlbG9jaXR5OiBudW1iZXIsIC8vIOmfs+OBruWkp+OBjeOBlVxuICAgICAgICBwaXRjaDogbnVtYmVyLCAvLyDpn7Pjga7pq5jjgZVcbiAgICAgICAgZHVyYXRpb246IG51bWJlciAvLyDpn7Pjga7plbfjgZVcbiAgICApID0+IHtcbiAgICAgICAgLy8g6Z+z44Gu5aSn44GN44GV44KS5bmF44GrXG4gICAgICAgIGNvbnN0IHdpZHRoID0gdmVsb2NpdHkgLyA1O1xuXG4gICAgICAgIC8vIOmfs+OBrumrmOOBleOCkuiJsuOBq1xuICAgICAgICBjb25zdCBjb2xvciA9IG5ldyBUSFJFRS5Db2xvcigpLnNldEhTTChwaXRjaCAvIDQwLCAxLjAsIDAuNSk7XG5cbiAgICAgICAgLy8g6Z+z44Gu6ZW344GV44KS6auY44GV44GrXG4gICAgICAgIGNvbnN0IGhlaWdodCA9IGR1cmF0aW9uICogMC4xO1xuXG4gICAgICAgIC8vIOeri+aWueS9k+OBruS9nOaIkCAo44ON44Kq44Oz6Kq/44Gr5YWJ44KLKVxuICAgICAgICBsZXQgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkod2lkdGgsIGhlaWdodCwgd2lkdGgpO1xuICAgICAgICBsZXQgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFRvb25NYXRlcmlhbCh7XG4gICAgICAgICAgICBjb2xvcjogY29sb3IsXG4gICAgICAgICAgICBlbWlzc2l2ZTogY29sb3IsXG4gICAgICAgICAgICBlbWlzc2l2ZUludGVuc2l0eTogMC41LFxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgY3ViZSA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbCk7XG4gICAgICAgIGN1YmUuY2FzdFNoYWRvdyA9IHRydWU7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGN1YmUpO1xuXG4gICAgICAgIC8vIOeJqeeQhuOCqOODs+OCuOODs+OBruioreWumlxuICAgICAgICBjb25zdCBzaGFwZSA9IG5ldyBDQU5OT04uQm94KFxuICAgICAgICAgICAgbmV3IENBTk5PTi5WZWMzKHdpZHRoIC8gMiwgaGVpZ2h0IC8gMiwgd2lkdGggLyAyKVxuICAgICAgICApO1xuICAgICAgICBjb25zdCBib2R5ID0gbmV3IENBTk5PTi5Cb2R5KHsgbWFzczogMSB9KTtcbiAgICAgICAgYm9keS5hZGRTaGFwZShzaGFwZSk7XG4gICAgICAgIHRoaXMud29ybGQuYWRkQm9keShib2R5KTtcblxuICAgICAgICAvLyDnq4vmlrnkvZPjga7liJ3mnJ/kvY3nva5cbiAgICAgICAgY29uc3QgeCA9ICgyIC0gTWF0aC5mbG9vcih0aGlzLmN1YmVzLmxlbmd0aCAvIDUpKSAvIDI7XG4gICAgICAgIGNvbnN0IHogPSAoLTIgKyAodGhpcy5jdWJlcy5sZW5ndGggJSA1KSkgLyAyO1xuICAgICAgICBjdWJlLnBvc2l0aW9uLnNldCh4LCAxLCB6KTtcbiAgICAgICAgYm9keS5wb3NpdGlvbi5zZXQoeCwgMSwgeik7XG5cbiAgICAgICAgLy8g56uL5pa55L2T44Gu5oOF5aCx44KS5L+d5a2YXG4gICAgICAgIHRoaXMuY3ViZXMucHVzaCh7XG4gICAgICAgICAgICBtZXNoOiBjdWJlLFxuICAgICAgICAgICAgYm9keTogYm9keSxcbiAgICAgICAgICAgIGNyZWF0ZWRUaW1lOiBEYXRlLm5vdygpLFxuICAgICAgICAgICAgaXNQbGF5ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgdmVsb2NpdHk6IHZlbG9jaXR5LFxuICAgICAgICAgICAgcGl0Y2g6IHBpdGNoLFxuICAgICAgICAgICAgZHVyYXRpb246IGR1cmF0aW9uLFxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLy8g56uL5pa55L2T44Gu5YmK6ZmkXG4gICAgcHJpdmF0ZSByZW1vdmVDdWJlID0gKGN1YmVJbmZvOiBDdWJlSW5mbykgPT4ge1xuICAgICAgICB0aGlzLnNjZW5lLnJlbW92ZShjdWJlSW5mby5tZXNoKTtcbiAgICAgICAgdGhpcy53b3JsZC5yZW1vdmVCb2R5KGN1YmVJbmZvLmJvZHkpO1xuICAgICAgICB0aGlzLmN1YmVzID0gdGhpcy5jdWJlcy5maWx0ZXIoKGN1YmUpID0+IGN1YmUgIT09IGN1YmVJbmZvKTtcblxuICAgICAgICAvLyDku5bjga7nq4vmlrnkvZPjgpLnp7vli5VcbiAgICAgICAgdGhpcy5jdWJlcy5mb3JFYWNoKChjdWJlLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgaWYgKGN1YmUuY3JlYXRlZFRpbWUgPiBjdWJlSW5mby5jcmVhdGVkVGltZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHggPSAoMiAtIE1hdGguZmxvb3IoaW5kZXggLyA1KSkgLyAyO1xuICAgICAgICAgICAgICAgIGNvbnN0IHkgPSBjdWJlLm1lc2gucG9zaXRpb24ueTtcbiAgICAgICAgICAgICAgICBjb25zdCB6ID0gKC0yICsgKGluZGV4ICUgNSkpIC8gMjtcbiAgICAgICAgICAgICAgICBjdWJlLm1lc2gucG9zaXRpb24uc2V0KHgsIHksIHopO1xuICAgICAgICAgICAgICAgIGN1YmUuYm9keS5wb3NpdGlvbi5zZXQoeCwgeSwgeik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvLyDjgrfjg7zjg7Pjga7kvZzmiJAo5YWo5L2T44GnMeWbnilcbiAgICBwcml2YXRlIGNyZWF0ZVNjZW5lID0gKCkgPT4ge1xuICAgICAgICB0aGlzLnNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG5cbiAgICAgICAgY29uc3QgYXhlc0hlbHBlciA9IG5ldyBUSFJFRS5BeGVzSGVscGVyKDUpO1xuICAgICAgICBheGVzSGVscGVyLnBvc2l0aW9uLnNldCgwLCAtMSwgMCk7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGF4ZXNIZWxwZXIpO1xuXG4gICAgICAgIC8vIOeJqeeQhuOCqOODs+OCuOODs+OBruioreWumlxuICAgICAgICB0aGlzLndvcmxkID0gbmV3IENBTk5PTi5Xb3JsZCh7XG4gICAgICAgICAgICBncmF2aXR5OiBuZXcgQ0FOTk9OLlZlYzMoMCwgLTkuODIsIDApLFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyDlubPpnaLjga7kvZzmiJBcbiAgICAgICAgdGhpcy5jcmVhdGVQbGFuZSgpO1xuXG4gICAgICAgIC8vIE1JREnjg4fjg7zjgr/jga7lh6bnkIYgKOOCr+ODquODg+OCr+OBleOCjOOBn+OCiSlcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMucHJvY2Vzc01pZGkpO1xuXG4gICAgICAgIC8v44Op44Kk44OI44Gu6Kit5a6aXG4gICAgICAgIHRoaXMubGlnaHQgPSBuZXcgVEhSRUUuRGlyZWN0aW9uYWxMaWdodCgweGZmZmZmZik7XG4gICAgICAgIGxldCBsdmVjID0gbmV3IFRIUkVFLlZlY3RvcjMoOCwgMTAsIDEpLm5vcm1hbGl6ZSgpO1xuICAgICAgICB0aGlzLmxpZ2h0LnBvc2l0aW9uLnNldChsdmVjLngsIGx2ZWMueSwgbHZlYy56KTtcbiAgICAgICAgdGhpcy5saWdodC5pbnRlbnNpdHkgPSAwLjU7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKHRoaXMubGlnaHQpO1xuXG4gICAgICAgIGNvbnN0IGFtYmllbnRMaWdodCA9IG5ldyBUSFJFRS5BbWJpZW50TGlnaHQoMHhmZmZmZmYsIDAuMSk7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGFtYmllbnRMaWdodCk7XG5cbiAgICAgICAgLy8g6KGd56qB5qSc55+lICjjgrfjg5/jg6Xjg6zjg7zjgrfjg6fjg7PjgZfjgZ/jgajjgY0pXG4gICAgICAgIHRoaXMud29ybGQuYWRkRXZlbnRMaXN0ZW5lcihcInBvc3RTdGVwXCIsIHRoaXMub25Db2xsaXNpb24pO1xuXG4gICAgICAgIC8vIOavjuODleODrOODvOODoOOBrnVwZGF0ZeOCkuWRvOOCk+OBp+abtOaWsFxuICAgICAgICAvLyByZXF1ZXN0QW5pbWF0aW9uRnJhbWUg44Gr44KI44KK5qyh44OV44Os44O844Og44KS5ZG844G2XG4gICAgICAgIGxldCB1cGRhdGU6IEZyYW1lUmVxdWVzdENhbGxiYWNrID0gKHRpbWUpID0+IHtcbiAgICAgICAgICAgIC8vIOeJqeeQhuOCqOODs+OCuOODs+OBruabtOaWsCAo6YCy44KT44Gg5pmC6ZaT44Gg44GRKVxuICAgICAgICAgICAgdGhpcy53b3JsZC5maXhlZFN0ZXAoKTtcblxuICAgICAgICAgICAgLy8g54mp55CG44Ko44Oz44K444Oz44Gu5pu05pawXG4gICAgICAgICAgICB0aGlzLmN1YmVzLmZvckVhY2goKGN1YmUpID0+IHtcbiAgICAgICAgICAgICAgICBjdWJlLm1lc2gucG9zaXRpb24uY29weShjdWJlLmJvZHkucG9zaXRpb24gYXMgYW55KTtcbiAgICAgICAgICAgICAgICBjdWJlLm1lc2gucXVhdGVybmlvbi5jb3B5KGN1YmUuYm9keS5xdWF0ZXJuaW9uIGFzIGFueSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHVwZGF0ZSk7XG4gICAgICAgIH07XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGUpO1xuICAgIH07XG5cbiAgICAvLyDooZ3nqoHmpJznn6VcbiAgICBwcml2YXRlIG9uQ29sbGlzaW9uID0gKCkgPT4ge1xuICAgICAgICB0aGlzLmN1YmVzLmZvckVhY2goKGN1YmUpID0+IHtcbiAgICAgICAgICAgIGlmIChjdWJlLmJvZHkucG9zaXRpb24ueSA8IC0wLjggJiYgIWN1YmUuaXNQbGF5ZWQpIHtcbiAgICAgICAgICAgICAgICBjdWJlLmlzUGxheWVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXlTb3VuZChjdWJlLnBpdGNoLCBjdWJlLmR1cmF0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8vIOmfs+OCkumztOOCieOBmVxuICAgIHByaXZhdGUgcGxheVNvdW5kID0gKHBpdGNoOiBudW1iZXIsIGR1cmF0aW9uOiBudW1iZXIpID0+IHtcbiAgICAgICAgdGhpcy5zeW50aC50cmlnZ2VyQXR0YWNrUmVsZWFzZShcbiAgICAgICAgICAgIFRPTkUuRnJlcXVlbmN5KHBpdGNoLCBcIm1pZGlcIikudG9Ob3RlKCksXG4gICAgICAgICAgICBkdXJhdGlvblxuICAgICAgICApO1xuICAgIH07XG5cbiAgICBwcml2YXRlIHN0eWxlU2hlZXQgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICAgICAgICBzdHlsZS5pbm5lckhUTUwgPSBgXG4gICAgICAgICAgICBib2R5IHtcbiAgICAgICAgICAgICAgICBtYXJnaW46IDA7XG4gICAgICAgICAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgYDtcbiAgICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gICAgfTtcbn1cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGluaXQpO1xuXG5mdW5jdGlvbiBpbml0KCkge1xuICAgIGxldCBjb250YWluZXIgPSBuZXcgVGhyZWVKU0NvbnRhaW5lcigpO1xuICAgIGxldCB2aWV3cG9ydCA9IGNvbnRhaW5lci5jcmVhdGVSZW5kZXJlckRPTShuZXcgVEhSRUUuVmVjdG9yMygtMSwgMSwgMSkpO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodmlld3BvcnQpO1xufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBfX3dlYnBhY2tfbW9kdWxlc19fO1xuXG4iLCJ2YXIgZGVmZXJyZWQgPSBbXTtcbl9fd2VicGFja19yZXF1aXJlX18uTyA9IChyZXN1bHQsIGNodW5rSWRzLCBmbiwgcHJpb3JpdHkpID0+IHtcblx0aWYoY2h1bmtJZHMpIHtcblx0XHRwcmlvcml0eSA9IHByaW9yaXR5IHx8IDA7XG5cdFx0Zm9yKHZhciBpID0gZGVmZXJyZWQubGVuZ3RoOyBpID4gMCAmJiBkZWZlcnJlZFtpIC0gMV1bMl0gPiBwcmlvcml0eTsgaS0tKSBkZWZlcnJlZFtpXSA9IGRlZmVycmVkW2kgLSAxXTtcblx0XHRkZWZlcnJlZFtpXSA9IFtjaHVua0lkcywgZm4sIHByaW9yaXR5XTtcblx0XHRyZXR1cm47XG5cdH1cblx0dmFyIG5vdEZ1bGZpbGxlZCA9IEluZmluaXR5O1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGRlZmVycmVkLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIFtjaHVua0lkcywgZm4sIHByaW9yaXR5XSA9IGRlZmVycmVkW2ldO1xuXHRcdHZhciBmdWxmaWxsZWQgPSB0cnVlO1xuXHRcdGZvciAodmFyIGogPSAwOyBqIDwgY2h1bmtJZHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdGlmICgocHJpb3JpdHkgJiAxID09PSAwIHx8IG5vdEZ1bGZpbGxlZCA+PSBwcmlvcml0eSkgJiYgT2JqZWN0LmtleXMoX193ZWJwYWNrX3JlcXVpcmVfXy5PKS5ldmVyeSgoa2V5KSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXy5PW2tleV0oY2h1bmtJZHNbal0pKSkpIHtcblx0XHRcdFx0Y2h1bmtJZHMuc3BsaWNlKGotLSwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmdWxmaWxsZWQgPSBmYWxzZTtcblx0XHRcdFx0aWYocHJpb3JpdHkgPCBub3RGdWxmaWxsZWQpIG5vdEZ1bGZpbGxlZCA9IHByaW9yaXR5O1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihmdWxmaWxsZWQpIHtcblx0XHRcdGRlZmVycmVkLnNwbGljZShpLS0sIDEpXG5cdFx0XHR2YXIgciA9IGZuKCk7XG5cdFx0XHRpZiAociAhPT0gdW5kZWZpbmVkKSByZXN1bHQgPSByO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufTsiLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBubyBiYXNlVVJJXG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8vIFtyZXNvbHZlLCByZWplY3QsIFByb21pc2VdID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJtYWluXCI6IDBcbn07XG5cbi8vIG5vIGNodW5rIG9uIGRlbWFuZCBsb2FkaW5nXG5cbi8vIG5vIHByZWZldGNoaW5nXG5cbi8vIG5vIHByZWxvYWRlZFxuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0XG5cbl9fd2VicGFja19yZXF1aXJlX18uTy5qID0gKGNodW5rSWQpID0+IChpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPT09IDApO1xuXG4vLyBpbnN0YWxsIGEgSlNPTlAgY2FsbGJhY2sgZm9yIGNodW5rIGxvYWRpbmdcbnZhciB3ZWJwYWNrSnNvbnBDYWxsYmFjayA9IChwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbiwgZGF0YSkgPT4ge1xuXHR2YXIgW2NodW5rSWRzLCBtb3JlTW9kdWxlcywgcnVudGltZV0gPSBkYXRhO1xuXHQvLyBhZGQgXCJtb3JlTW9kdWxlc1wiIHRvIHRoZSBtb2R1bGVzIG9iamVjdCxcblx0Ly8gdGhlbiBmbGFnIGFsbCBcImNodW5rSWRzXCIgYXMgbG9hZGVkIGFuZCBmaXJlIGNhbGxiYWNrXG5cdHZhciBtb2R1bGVJZCwgY2h1bmtJZCwgaSA9IDA7XG5cdGlmKGNodW5rSWRzLnNvbWUoKGlkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2lkXSAhPT0gMCkpKSB7XG5cdFx0Zm9yKG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG5cdFx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8obW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLm1bbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihydW50aW1lKSB2YXIgcmVzdWx0ID0gcnVudGltZShfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblx0fVxuXHRpZihwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbikgcGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24oZGF0YSk7XG5cdGZvcig7aSA8IGNodW5rSWRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y2h1bmtJZCA9IGNodW5rSWRzW2ldO1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhpbnN0YWxsZWRDaHVua3MsIGNodW5rSWQpICYmIGluc3RhbGxlZENodW5rc1tjaHVua0lkXSkge1xuXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdWzBdKCk7XG5cdFx0fVxuXHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IDA7XG5cdH1cblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uTyhyZXN1bHQpO1xufVxuXG52YXIgY2h1bmtMb2FkaW5nR2xvYmFsID0gc2VsZltcIndlYnBhY2tDaHVua3NvdW5kX3RocmVlX2pzXCJdID0gc2VsZltcIndlYnBhY2tDaHVua3NvdW5kX3RocmVlX2pzXCJdIHx8IFtdO1xuY2h1bmtMb2FkaW5nR2xvYmFsLmZvckVhY2god2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCAwKSk7XG5jaHVua0xvYWRpbmdHbG9iYWwucHVzaCA9IHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2guYmluZChjaHVua0xvYWRpbmdHbG9iYWwpKTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGRlcGVuZHMgb24gb3RoZXIgbG9hZGVkIGNodW5rcyBhbmQgZXhlY3V0aW9uIG5lZWQgdG8gYmUgZGVsYXllZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8odW5kZWZpbmVkLCBbXCJ2ZW5kb3JzLW5vZGVfbW9kdWxlc190b25lanNfbWlkaV9kaXN0X01pZGlfanMtbm9kZV9tb2R1bGVzX2Nhbm5vbi1lc19kaXN0X2Nhbm5vbi1lc19qcy1ub2RlX20tZWE5MTJjXCJdLCAoKSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2FwcC50c1wiKSkpXG5fX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKF9fd2VicGFja19leHBvcnRzX18pO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9