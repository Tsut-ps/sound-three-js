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
        // MIDIデータがない場合は処理しない
        if (!this.midiData)
            return;
        // トラックごとに処理
        this.midiData.tracks.forEach((track) => {
            // ノートごとに処理
            track.notes.forEach((note) => {
                const velocity = note.velocity;
                const pitch = note.midi;
                const duration = note.duration;
                // ノートをもとに立方体を作成
                this.fallingCube(velocity, pitch, duration);
            });
        });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLE1BQU0scUJBQXFCO1dBQzNCO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBOzs7OztVRWhEQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc291bmQtdGhyZWUtanMvLi9zcmMvYXBwLnRzIiwid2VicGFjazovL3NvdW5kLXRocmVlLWpzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3NvdW5kLXRocmVlLWpzL3dlYnBhY2svcnVudGltZS9jaHVuayBsb2FkZWQiLCJ3ZWJwYWNrOi8vc291bmQtdGhyZWUtanMvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vc291bmQtdGhyZWUtanMvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3NvdW5kLXRocmVlLWpzL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vc291bmQtdGhyZWUtanMvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9zb3VuZC10aHJlZS1qcy93ZWJwYWNrL3J1bnRpbWUvanNvbnAgY2h1bmsgbG9hZGluZyIsIndlYnBhY2s6Ly9zb3VuZC10aHJlZS1qcy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL3NvdW5kLXRocmVlLWpzL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9zb3VuZC10aHJlZS1qcy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBPcmJpdENvbnRyb2xzIH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS9jb250cm9scy9PcmJpdENvbnRyb2xzXCI7XG5pbXBvcnQgeyBFZmZlY3RDb21wb3NlciB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vcG9zdHByb2Nlc3NpbmcvRWZmZWN0Q29tcG9zZXJcIjtcbmltcG9ydCB7IFJlbmRlclBhc3MgfSBmcm9tIFwidGhyZWUvZXhhbXBsZXMvanNtL3Bvc3Rwcm9jZXNzaW5nL1JlbmRlclBhc3NcIjtcbmltcG9ydCB7IFVucmVhbEJsb29tUGFzcyB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vcG9zdHByb2Nlc3NpbmcvVW5yZWFsQmxvb21QYXNzXCI7XG5cbmltcG9ydCAqIGFzIENBTk5PTiBmcm9tIFwiY2Fubm9uLWVzXCI7XG5pbXBvcnQgKiBhcyBUV0VFTiBmcm9tIFwiQHR3ZWVuanMvdHdlZW4uanNcIjtcbmltcG9ydCAqIGFzIFRPTkUgZnJvbSBcInRvbmVcIjtcbmltcG9ydCB7IE1pZGkgfSBmcm9tIFwiQHRvbmVqcy9taWRpXCI7XG5cbmludGVyZmFjZSBDdWJlSW5mbyB7XG4gICAgbWVzaDogVEhSRUUuTWVzaDtcbiAgICBib2R5OiBDQU5OT04uQm9keTtcbiAgICBjcmVhdGVkVGltZTogbnVtYmVyO1xuICAgIGlzUGxheWVkOiBib29sZWFuO1xuICAgIHZlbG9jaXR5OiBudW1iZXI7XG4gICAgcGl0Y2g6IG51bWJlcjtcbiAgICBkdXJhdGlvbjogbnVtYmVyO1xufVxuXG5jbGFzcyBUaHJlZUpTQ29udGFpbmVyIHtcbiAgICBwcml2YXRlIHNjZW5lOiBUSFJFRS5TY2VuZTtcbiAgICBwcml2YXRlIGxpZ2h0OiBUSFJFRS5MaWdodDtcbiAgICBwcml2YXRlIGN1YmVzOiBDdWJlSW5mb1tdID0gW107XG4gICAgcHJpdmF0ZSB3b3JsZDogQ0FOTk9OLldvcmxkO1xuICAgIHByaXZhdGUgbWF4Q3ViZXMgPSAyNTtcbiAgICBwcml2YXRlIHN5bnRoOiBUT05FLlN5bnRoO1xuICAgIHByaXZhdGUgbWlkaURhdGE6IE1pZGkgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgLy8g5Yid5pyf6Kit5a6a5pmC44Gr44K544K/44Kk44Or44K344O844OI44KS6Kqt44G/6L6844KAXG4gICAgICAgIHRoaXMuc3R5bGVTaGVldCgpO1xuXG4gICAgICAgIC8vIOmfs+WjsOOBruioreWumiAo44Oe44K544K/44O8KVxuICAgICAgICB0aGlzLnN5bnRoID0gbmV3IFRPTkUuU3ludGgoKS50b0Rlc3RpbmF0aW9uKCk7XG5cbiAgICAgICAgLy8gTUlESeODh+ODvOOCv+OBruiqreOBv+i+vOOBv1xuICAgICAgICB0aGlzLmxvYWRNSURJKFwiQS5taWRcIik7XG4gICAgfVxuXG4gICAgLy8gTUlESeODh+ODvOOCv+OBruiqreOBv+i+vOOBv1xuICAgIHByaXZhdGUgbG9hZE1JREkgPSBhc3luYyAocGF0aDogc3RyaW5nKSA9PiB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBNaWRpLmZyb21VcmwocGF0aCk7XG4gICAgICAgIHRoaXMubWlkaURhdGEgPSBkYXRhO1xuICAgIH07XG5cbiAgICAvLyBNSURJ44OH44O844K/44Gu5Yem55CGXG4gICAgcHJpdmF0ZSBwcm9jZXNzTWlkaSA9ICgpID0+IHtcbiAgICAgICAgLy8gTUlESeODh+ODvOOCv+OBjOOBquOBhOWgtOWQiOOBr+WHpueQhuOBl+OBquOBhFxuICAgICAgICBpZiAoIXRoaXMubWlkaURhdGEpIHJldHVybjtcblxuICAgICAgICAvLyDjg4jjg6njg4Pjgq/jgZTjgajjgavlh6bnkIZcbiAgICAgICAgdGhpcy5taWRpRGF0YS50cmFja3MuZm9yRWFjaCgodHJhY2spID0+IHtcbiAgICAgICAgICAgIC8vIOODjuODvOODiOOBlOOBqOOBq+WHpueQhlxuICAgICAgICAgICAgdHJhY2subm90ZXMuZm9yRWFjaCgobm90ZSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHZlbG9jaXR5ID0gbm90ZS52ZWxvY2l0eTtcbiAgICAgICAgICAgICAgICBjb25zdCBwaXRjaCA9IG5vdGUubWlkaTtcbiAgICAgICAgICAgICAgICBjb25zdCBkdXJhdGlvbiA9IG5vdGUuZHVyYXRpb247XG5cbiAgICAgICAgICAgICAgICAvLyDjg47jg7zjg4jjgpLjgoLjgajjgavnq4vmlrnkvZPjgpLkvZzmiJBcbiAgICAgICAgICAgICAgICB0aGlzLmZhbGxpbmdDdWJlKHZlbG9jaXR5LCBwaXRjaCwgZHVyYXRpb24pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvLyDnlLvpnaLpg6jliIbjga7kvZzmiJAo6KGo56S644GZ44KL5p6g44GU44Go44GrKVxuICAgIHB1YmxpYyBjcmVhdGVSZW5kZXJlckRPTSA9IChjYW1lcmFQb3M6IFRIUkVFLlZlY3RvcjMpID0+IHtcbiAgICAgICAgbGV0IHJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoKTtcbiAgICAgICAgcmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgICAgICAgcmVuZGVyZXIuc2V0Q2xlYXJDb2xvcihuZXcgVEhSRUUuQ29sb3IoMHgxZTFlMWUpKTtcbiAgICAgICAgcmVuZGVyZXIuc2hhZG93TWFwLmVuYWJsZWQgPSB0cnVlOyAvLyDjgrfjg6Pjg4njgqbmnInlirlcblxuICAgICAgICAvL+OCq+ODoeODqeOBruioreWumlxuICAgICAgICBsZXQgY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKFxuICAgICAgICAgICAgNzUsXG4gICAgICAgICAgICB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCxcbiAgICAgICAgICAgIDAuMSxcbiAgICAgICAgICAgIDEwMDBcbiAgICAgICAgKTtcbiAgICAgICAgY2FtZXJhLnBvc2l0aW9uLmNvcHkoY2FtZXJhUG9zKTtcbiAgICAgICAgY2FtZXJhLmxvb2tBdChuZXcgVEhSRUUuVmVjdG9yMygwLCAwLCAwKSk7XG5cbiAgICAgICAgLy8g44Kr44Oh44Op5pON5L2c44Gu6Kit5a6aXG4gICAgICAgIGxldCBvcmJpdENvbnRyb2xzID0gbmV3IE9yYml0Q29udHJvbHMoY2FtZXJhLCByZW5kZXJlci5kb21FbGVtZW50KTtcblxuICAgICAgICAvLyDjgrfjg7zjg7Pjga7kvZzmiJBcbiAgICAgICAgdGhpcy5jcmVhdGVTY2VuZSgpO1xuXG4gICAgICAgIC8vIOODrOODs+ODgOODquODs+OCsOOBruioreWumlxuICAgICAgICBjb25zdCByZW5kZXJQYXNzID0gbmV3IFJlbmRlclBhc3ModGhpcy5zY2VuZSwgY2FtZXJhKTtcblxuICAgICAgICAvLyDnmbrlhYnjgqjjg5Xjgqfjgq/jg4jjga7oqK3lrppcbiAgICAgICAgY29uc3QgYmxvb21QYXNzID0gbmV3IFVucmVhbEJsb29tUGFzcyhcbiAgICAgICAgICAgIG5ldyBUSFJFRS5WZWN0b3IyKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpLFxuICAgICAgICAgICAgMC40LCAvLyDjgbzjgYvjgZfjga7lvLfjgZVcbiAgICAgICAgICAgIDEuMiwgLy8g44G844GL44GX44Gu5Y2K5b6EXG4gICAgICAgICAgICAwLjAgLy8g44GX44GN44GE5YCkXG4gICAgICAgICk7XG5cbiAgICAgICAgLy8g44Od44K544OI44OX44Ot44K744OD44K344Oz44Kw44Gu6Kit5a6aXG4gICAgICAgIGNvbnN0IGNvbXBvc2VyID0gbmV3IEVmZmVjdENvbXBvc2VyKHJlbmRlcmVyKTtcbiAgICAgICAgY29tcG9zZXIuYWRkUGFzcyhyZW5kZXJQYXNzKTtcbiAgICAgICAgY29tcG9zZXIuYWRkUGFzcyhibG9vbVBhc3MpO1xuICAgICAgICBjb21wb3Nlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuXG4gICAgICAgIC8vIOavjuODleODrOODvOODoOOBrnVwZGF0ZeOCkuWRvOOCk+OBp3JlbmRlclxuICAgICAgICAvLyByZXF1ZXN0QW5pbWF0aW9uRnJhbWUg44Gr44KI44KK5qyh44OV44Os44O844Og44KS5ZG844G2XG4gICAgICAgIGxldCByZW5kZXI6IEZyYW1lUmVxdWVzdENhbGxiYWNrID0gKHRpbWUpID0+IHtcbiAgICAgICAgICAgIG9yYml0Q29udHJvbHMudXBkYXRlKCk7XG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVuZGVyKTtcbiAgICAgICAgICAgIGNvbXBvc2VyLnJlbmRlcigpO1xuICAgICAgICB9O1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVuZGVyKTtcblxuICAgICAgICAvLyDlv7Xjga7ngrrliJ3mnJ/mmYLjgavjgoLjg6rjgrXjgqTjgrpcbiAgICAgICAgb25SZXNpemUoKTtcblxuICAgICAgICAvLyDjgqbjgqPjg7Pjg4njgqbjga7jg6rjgrXjgqTjgrrjgpLmpJznn6VcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgb25SZXNpemUpO1xuXG4gICAgICAgIGZ1bmN0aW9uIG9uUmVzaXplKCkge1xuICAgICAgICAgICAgLy8g44K144Kk44K65Y+W5b6XXG4gICAgICAgICAgICBjb25zdCB3aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgICAgICAgY29uc3QgaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuXG4gICAgICAgICAgICAvLyDjg6zjg7Pjg4Djg6njg7zjga7jgrXjgqTjgrrjgpLoqr/mlbRcbiAgICAgICAgICAgIHJlbmRlcmVyLnNldFBpeGVsUmF0aW8od2luZG93LmRldmljZVBpeGVsUmF0aW8pO1xuICAgICAgICAgICAgcmVuZGVyZXIuc2V0U2l6ZSh3aWR0aCwgaGVpZ2h0KTtcblxuICAgICAgICAgICAgLy8g44Kr44Oh44Op44KS6Kq/5pW0XG4gICAgICAgICAgICBjYW1lcmEuYXNwZWN0ID0gd2lkdGggLyBoZWlnaHQ7XG4gICAgICAgICAgICBjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlbmRlcmVyLmRvbUVsZW1lbnQ7XG4gICAgfTtcblxuICAgIC8vIOW5s+mdouOBruS9nOaIkFxuICAgIHByaXZhdGUgY3JlYXRlUGxhbmUgPSAoKSA9PiB7XG4gICAgICAgIC8vIOW5s+mdouOBruS9nOaIkFxuICAgICAgICBjb25zdCBnZW9tZXRyeSA9IG5ldyBUSFJFRS5QbGFuZUdlb21ldHJ5KDEwLCAxMCk7XG4gICAgICAgIGNvbnN0IG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsKHsgY29sb3I6IDB4MWUxZTFlIH0pO1xuICAgICAgICBjb25zdCBwbGFuZSA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbCk7XG4gICAgICAgIHBsYW5lLnJvdGF0aW9uLnggPSAtMC41ICogTWF0aC5QSTtcbiAgICAgICAgcGxhbmUucG9zaXRpb24uc2V0KDAsIC0xLCAwKTtcbiAgICAgICAgLy8g6YCP5piO44Gr44GZ44KLXG4gICAgICAgIHBsYW5lLm1hdGVyaWFsLnRyYW5zcGFyZW50ID0gdHJ1ZTtcbiAgICAgICAgcGxhbmUubWF0ZXJpYWwub3BhY2l0eSA9IDA7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKHBsYW5lKTtcblxuICAgICAgICAvLyDlubPpnaLjga7niannkIbmvJTnrpdcbiAgICAgICAgY29uc3Qgc2hhcGUgPSBuZXcgQ0FOTk9OLlBsYW5lKCk7XG4gICAgICAgIGNvbnN0IGJvZHkgPSBuZXcgQ0FOTk9OLkJvZHkoeyBtYXNzOiAwIH0pO1xuICAgICAgICBib2R5LmFkZFNoYXBlKHNoYXBlKTtcbiAgICAgICAgYm9keS5wb3NpdGlvbi5zZXQocGxhbmUucG9zaXRpb24ueCwgcGxhbmUucG9zaXRpb24ueSwgcGxhbmUucG9zaXRpb24ueik7XG4gICAgICAgIGJvZHkucXVhdGVybmlvbi5zZXQoXG4gICAgICAgICAgICBwbGFuZS5xdWF0ZXJuaW9uLngsXG4gICAgICAgICAgICBwbGFuZS5xdWF0ZXJuaW9uLnksXG4gICAgICAgICAgICBwbGFuZS5xdWF0ZXJuaW9uLnosXG4gICAgICAgICAgICBwbGFuZS5xdWF0ZXJuaW9uLndcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy53b3JsZC5hZGRCb2R5KGJvZHkpO1xuICAgIH07XG5cbiAgICAvLyDokL3kuIvjgZnjgovnq4vmlrnkvZPjga7kvZzmiJBcbiAgICBwcml2YXRlIGZhbGxpbmdDdWJlID0gKFxuICAgICAgICB2ZWxvY2l0eTogbnVtYmVyLFxuICAgICAgICBwaXRjaDogbnVtYmVyLFxuICAgICAgICBkdXJhdGlvbjogbnVtYmVyXG4gICAgKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmN1YmVzLmxlbmd0aCA+PSB0aGlzLm1heEN1YmVzKSB7XG4gICAgICAgICAgICAvLyDnq4vmlrnkvZPjgYzmnIDlpKfmlbDjgavpgZTjgZfjgabjgYTjgovloLTlkIjjga/kuIDnlarlj6TjgYTjgoLjga7jgpLliYrpmaRcbiAgICAgICAgICAgIGNvbnN0IG9sZEN1YmUgPSB0aGlzLmN1YmVzLnNoaWZ0KCk7IC8vIOS4gOeVquWPpOOBhOeri+aWueS9k+OCkuWPluW+lyArIOWJiumZpFxuICAgICAgICAgICAgb2xkQ3ViZSAmJiB0aGlzLnJlbW92ZUN1YmUob2xkQ3ViZSk7IC8vICjnq4vmlrnkvZPjgYzlrZjlnKjjgZfjgabjgYTjgZ/jgonliYrpmaQpXG4gICAgICAgIH1cbiAgICAgICAgLy8g56uL5pa55L2T44Gu5L2c5oiQXG4gICAgICAgIHRoaXMuY3JlYXRlQ3ViZSh2ZWxvY2l0eSwgcGl0Y2gsIGR1cmF0aW9uKTtcbiAgICB9O1xuXG4gICAgcHJpdmF0ZSBjcmVhdGVDdWJlID0gKFxuICAgICAgICB2ZWxvY2l0eTogbnVtYmVyLCAvLyDpn7Pjga7lpKfjgY3jgZVcbiAgICAgICAgcGl0Y2g6IG51bWJlciwgLy8g6Z+z44Gu6auY44GVXG4gICAgICAgIGR1cmF0aW9uOiBudW1iZXIgLy8g6Z+z44Gu6ZW344GVXG4gICAgKSA9PiB7XG4gICAgICAgIC8vIOmfs+OBruWkp+OBjeOBleOCkuW5heOBq1xuICAgICAgICBjb25zdCB3aWR0aCA9IHZlbG9jaXR5IC8gNTtcblxuICAgICAgICAvLyDpn7Pjga7pq5jjgZXjgpLoibLjgatcbiAgICAgICAgY29uc3QgY29sb3IgPSBuZXcgVEhSRUUuQ29sb3IoKS5zZXRIU0wocGl0Y2ggLyA0MCwgMS4wLCAwLjUpO1xuXG4gICAgICAgIC8vIOmfs+OBrumVt+OBleOCkumrmOOBleOBq1xuICAgICAgICBjb25zdCBoZWlnaHQgPSBkdXJhdGlvbiAqIDAuMTtcblxuICAgICAgICAvLyDnq4vmlrnkvZPjga7kvZzmiJAgKOODjeOCquODs+iqv+OBq+WFieOCiylcbiAgICAgICAgbGV0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KHdpZHRoLCBoZWlnaHQsIHdpZHRoKTtcbiAgICAgICAgbGV0IG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hUb29uTWF0ZXJpYWwoe1xuICAgICAgICAgICAgY29sb3I6IGNvbG9yLFxuICAgICAgICAgICAgZW1pc3NpdmU6IGNvbG9yLFxuICAgICAgICAgICAgZW1pc3NpdmVJbnRlbnNpdHk6IDAuNSxcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IGN1YmUgPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICAgICAgICBjdWJlLmNhc3RTaGFkb3cgPSB0cnVlO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZChjdWJlKTtcblxuICAgICAgICAvLyDniannkIbjgqjjg7Pjgrjjg7Pjga7oqK3lrppcbiAgICAgICAgY29uc3Qgc2hhcGUgPSBuZXcgQ0FOTk9OLkJveChcbiAgICAgICAgICAgIG5ldyBDQU5OT04uVmVjMyh3aWR0aCAvIDIsIGhlaWdodCAvIDIsIHdpZHRoIC8gMilcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgYm9keSA9IG5ldyBDQU5OT04uQm9keSh7IG1hc3M6IDEgfSk7XG4gICAgICAgIGJvZHkuYWRkU2hhcGUoc2hhcGUpO1xuICAgICAgICB0aGlzLndvcmxkLmFkZEJvZHkoYm9keSk7XG5cbiAgICAgICAgLy8g56uL5pa55L2T44Gu5Yid5pyf5L2N572uXG4gICAgICAgIGNvbnN0IHggPSAoMiAtIE1hdGguZmxvb3IodGhpcy5jdWJlcy5sZW5ndGggLyA1KSkgLyAyO1xuICAgICAgICBjb25zdCB6ID0gKC0yICsgKHRoaXMuY3ViZXMubGVuZ3RoICUgNSkpIC8gMjtcbiAgICAgICAgY3ViZS5wb3NpdGlvbi5zZXQoeCwgMSwgeik7XG4gICAgICAgIGJvZHkucG9zaXRpb24uc2V0KHgsIDEsIHopO1xuXG4gICAgICAgIC8vIOeri+aWueS9k+OBruaDheWgseOCkuS/neWtmFxuICAgICAgICB0aGlzLmN1YmVzLnB1c2goe1xuICAgICAgICAgICAgbWVzaDogY3ViZSxcbiAgICAgICAgICAgIGJvZHk6IGJvZHksXG4gICAgICAgICAgICBjcmVhdGVkVGltZTogRGF0ZS5ub3coKSxcbiAgICAgICAgICAgIGlzUGxheWVkOiBmYWxzZSxcbiAgICAgICAgICAgIHZlbG9jaXR5OiB2ZWxvY2l0eSxcbiAgICAgICAgICAgIHBpdGNoOiBwaXRjaCxcbiAgICAgICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbixcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8vIOeri+aWueS9k+OBruWJiumZpFxuICAgIHByaXZhdGUgcmVtb3ZlQ3ViZSA9IChjdWJlSW5mbzogQ3ViZUluZm8pID0+IHtcbiAgICAgICAgdGhpcy5zY2VuZS5yZW1vdmUoY3ViZUluZm8ubWVzaCk7XG4gICAgICAgIHRoaXMud29ybGQucmVtb3ZlQm9keShjdWJlSW5mby5ib2R5KTtcbiAgICAgICAgdGhpcy5jdWJlcyA9IHRoaXMuY3ViZXMuZmlsdGVyKChjdWJlKSA9PiBjdWJlICE9PSBjdWJlSW5mbyk7XG5cbiAgICAgICAgLy8g5LuW44Gu56uL5pa55L2T44KS56e75YuVXG4gICAgICAgIHRoaXMuY3ViZXMuZm9yRWFjaCgoY3ViZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGlmIChjdWJlLmNyZWF0ZWRUaW1lID4gY3ViZUluZm8uY3JlYXRlZFRpbWUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB4ID0gKDIgLSBNYXRoLmZsb29yKGluZGV4IC8gNSkpIC8gMjtcbiAgICAgICAgICAgICAgICBjb25zdCB5ID0gY3ViZS5tZXNoLnBvc2l0aW9uLnk7XG4gICAgICAgICAgICAgICAgY29uc3QgeiA9ICgtMiArIChpbmRleCAlIDUpKSAvIDI7XG4gICAgICAgICAgICAgICAgY3ViZS5tZXNoLnBvc2l0aW9uLnNldCh4LCB5LCB6KTtcbiAgICAgICAgICAgICAgICBjdWJlLmJvZHkucG9zaXRpb24uc2V0KHgsIHksIHopO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLy8g44K344O844Oz44Gu5L2c5oiQKOWFqOS9k+OBpzHlm54pXG4gICAgcHJpdmF0ZSBjcmVhdGVTY2VuZSA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5zY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xuXG4gICAgICAgIGNvbnN0IGF4ZXNIZWxwZXIgPSBuZXcgVEhSRUUuQXhlc0hlbHBlcig1KTtcbiAgICAgICAgYXhlc0hlbHBlci5wb3NpdGlvbi5zZXQoMCwgLTEsIDApO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZChheGVzSGVscGVyKTtcblxuICAgICAgICAvLyDniannkIbjgqjjg7Pjgrjjg7Pjga7oqK3lrppcbiAgICAgICAgdGhpcy53b3JsZCA9IG5ldyBDQU5OT04uV29ybGQoe1xuICAgICAgICAgICAgZ3Jhdml0eTogbmV3IENBTk5PTi5WZWMzKDAsIC05LjgyLCAwKSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8g5bmz6Z2i44Gu5L2c5oiQXG4gICAgICAgIHRoaXMuY3JlYXRlUGxhbmUoKTtcblxuICAgICAgICAvLyBNSURJ44OH44O844K/44Gu5Yem55CGICjjgq/jg6rjg4Pjgq/jgZXjgozjgZ/jgokpXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLnByb2Nlc3NNaWRpKTtcblxuICAgICAgICAvL+ODqeOCpOODiOOBruioreWumlxuICAgICAgICB0aGlzLmxpZ2h0ID0gbmV3IFRIUkVFLkRpcmVjdGlvbmFsTGlnaHQoMHhmZmZmZmYpO1xuICAgICAgICBsZXQgbHZlYyA9IG5ldyBUSFJFRS5WZWN0b3IzKDgsIDEwLCAxKS5ub3JtYWxpemUoKTtcbiAgICAgICAgdGhpcy5saWdodC5wb3NpdGlvbi5zZXQobHZlYy54LCBsdmVjLnksIGx2ZWMueik7XG4gICAgICAgIHRoaXMubGlnaHQuaW50ZW5zaXR5ID0gMC41O1xuICAgICAgICB0aGlzLnNjZW5lLmFkZCh0aGlzLmxpZ2h0KTtcblxuICAgICAgICBjb25zdCBhbWJpZW50TGlnaHQgPSBuZXcgVEhSRUUuQW1iaWVudExpZ2h0KDB4ZmZmZmZmLCAwLjEpO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZChhbWJpZW50TGlnaHQpO1xuXG4gICAgICAgIC8vIOihneeqgeaknOefpSAo44K344Of44Ol44Os44O844K344On44Oz44GX44Gf44Go44GNKVxuICAgICAgICB0aGlzLndvcmxkLmFkZEV2ZW50TGlzdGVuZXIoXCJwb3N0U3RlcFwiLCB0aGlzLm9uQ29sbGlzaW9uKTtcblxuICAgICAgICAvLyDmr47jg5Xjg6zjg7zjg6Djga51cGRhdGXjgpLlkbzjgpPjgafmm7TmlrBcbiAgICAgICAgLy8gcmVxdWVzdEFuaW1hdGlvbkZyYW1lIOOBq+OCiOOCiuasoeODleODrOODvOODoOOCkuWRvOOBtlxuICAgICAgICBsZXQgdXBkYXRlOiBGcmFtZVJlcXVlc3RDYWxsYmFjayA9ICh0aW1lKSA9PiB7XG4gICAgICAgICAgICAvLyDniannkIbjgqjjg7Pjgrjjg7Pjga7mm7TmlrAgKOmAsuOCk+OBoOaZgumWk+OBoOOBkSlcbiAgICAgICAgICAgIHRoaXMud29ybGQuZml4ZWRTdGVwKCk7XG5cbiAgICAgICAgICAgIC8vIOeJqeeQhuOCqOODs+OCuOODs+OBruabtOaWsFxuICAgICAgICAgICAgdGhpcy5jdWJlcy5mb3JFYWNoKChjdWJlKSA9PiB7XG4gICAgICAgICAgICAgICAgY3ViZS5tZXNoLnBvc2l0aW9uLmNvcHkoY3ViZS5ib2R5LnBvc2l0aW9uIGFzIGFueSk7XG4gICAgICAgICAgICAgICAgY3ViZS5tZXNoLnF1YXRlcm5pb24uY29weShjdWJlLmJvZHkucXVhdGVybmlvbiBhcyBhbnkpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGUpO1xuICAgICAgICB9O1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodXBkYXRlKTtcbiAgICB9O1xuXG4gICAgLy8g6KGd56qB5qSc55+lXG4gICAgcHJpdmF0ZSBvbkNvbGxpc2lvbiA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5jdWJlcy5mb3JFYWNoKChjdWJlKSA9PiB7XG4gICAgICAgICAgICBpZiAoY3ViZS5ib2R5LnBvc2l0aW9uLnkgPCAtMC44ICYmICFjdWJlLmlzUGxheWVkKSB7XG4gICAgICAgICAgICAgICAgY3ViZS5pc1BsYXllZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5U291bmQoY3ViZS5waXRjaCwgY3ViZS5kdXJhdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvLyDpn7PjgpLps7TjgonjgZlcbiAgICBwcml2YXRlIHBsYXlTb3VuZCA9IChwaXRjaDogbnVtYmVyLCBkdXJhdGlvbjogbnVtYmVyKSA9PiB7XG4gICAgICAgIHRoaXMuc3ludGgudHJpZ2dlckF0dGFja1JlbGVhc2UoXG4gICAgICAgICAgICBUT05FLkZyZXF1ZW5jeShwaXRjaCwgXCJtaWRpXCIpLnRvTm90ZSgpLFxuICAgICAgICAgICAgZHVyYXRpb25cbiAgICAgICAgKTtcbiAgICB9O1xuXG4gICAgcHJpdmF0ZSBzdHlsZVNoZWV0ID0gKCkgPT4ge1xuICAgICAgICBjb25zdCBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgICAgICAgc3R5bGUuaW5uZXJIVE1MID0gYFxuICAgICAgICAgICAgYm9keSB7XG4gICAgICAgICAgICAgICAgbWFyZ2luOiAwO1xuICAgICAgICAgICAgICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgICAgICAgICB9XG4gICAgICAgIGA7XG4gICAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICAgIH07XG59XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBpbml0KTtcblxuZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBsZXQgY29udGFpbmVyID0gbmV3IFRocmVlSlNDb250YWluZXIoKTtcbiAgICBsZXQgdmlld3BvcnQgPSBjb250YWluZXIuY3JlYXRlUmVuZGVyZXJET00obmV3IFRIUkVFLlZlY3RvcjMoLTEsIDEsIDEpKTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHZpZXdwb3J0KTtcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwidmFyIGRlZmVycmVkID0gW107XG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8gPSAocmVzdWx0LCBjaHVua0lkcywgZm4sIHByaW9yaXR5KSA9PiB7XG5cdGlmKGNodW5rSWRzKSB7XG5cdFx0cHJpb3JpdHkgPSBwcmlvcml0eSB8fCAwO1xuXHRcdGZvcih2YXIgaSA9IGRlZmVycmVkLmxlbmd0aDsgaSA+IDAgJiYgZGVmZXJyZWRbaSAtIDFdWzJdID4gcHJpb3JpdHk7IGktLSkgZGVmZXJyZWRbaV0gPSBkZWZlcnJlZFtpIC0gMV07XG5cdFx0ZGVmZXJyZWRbaV0gPSBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHZhciBub3RGdWxmaWxsZWQgPSBJbmZpbml0eTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV0gPSBkZWZlcnJlZFtpXTtcblx0XHR2YXIgZnVsZmlsbGVkID0gdHJ1ZTtcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNodW5rSWRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRpZiAoKHByaW9yaXR5ICYgMSA9PT0gMCB8fCBub3RGdWxmaWxsZWQgPj0gcHJpb3JpdHkpICYmIE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uTykuZXZlcnkoKGtleSkgPT4gKF9fd2VicGFja19yZXF1aXJlX18uT1trZXldKGNodW5rSWRzW2pdKSkpKSB7XG5cdFx0XHRcdGNodW5rSWRzLnNwbGljZShqLS0sIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZnVsZmlsbGVkID0gZmFsc2U7XG5cdFx0XHRcdGlmKHByaW9yaXR5IDwgbm90RnVsZmlsbGVkKSBub3RGdWxmaWxsZWQgPSBwcmlvcml0eTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoZnVsZmlsbGVkKSB7XG5cdFx0XHRkZWZlcnJlZC5zcGxpY2UoaS0tLCAxKVxuXHRcdFx0dmFyIHIgPSBmbigpO1xuXHRcdFx0aWYgKHIgIT09IHVuZGVmaW5lZCkgcmVzdWx0ID0gcjtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn07IiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gbm8gYmFzZVVSSVxuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuLy8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4vLyBbcmVzb2x2ZSwgcmVqZWN0LCBQcm9taXNlXSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbnZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG5cdFwibWFpblwiOiAwXG59O1xuXG4vLyBubyBjaHVuayBvbiBkZW1hbmQgbG9hZGluZ1xuXG4vLyBubyBwcmVmZXRjaGluZ1xuXG4vLyBubyBwcmVsb2FkZWRcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdFxuXG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8uaiA9IChjaHVua0lkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID09PSAwKTtcblxuLy8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG52YXIgd2VicGFja0pzb25wQ2FsbGJhY2sgPSAocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24sIGRhdGEpID0+IHtcblx0dmFyIFtjaHVua0lkcywgbW9yZU1vZHVsZXMsIHJ1bnRpbWVdID0gZGF0YTtcblx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG5cdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuXHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwO1xuXHRpZihjaHVua0lkcy5zb21lKChpZCkgPT4gKGluc3RhbGxlZENodW5rc1tpZF0gIT09IDApKSkge1xuXHRcdGZvcihtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuXHRcdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcblx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYocnVudGltZSkgdmFyIHJlc3VsdCA9IHJ1bnRpbWUoX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cdH1cblx0aWYocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24pIHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKGRhdGEpO1xuXHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuXHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oaW5zdGFsbGVkQ2h1bmtzLCBjaHVua0lkKSAmJiBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcblx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXVswXSgpO1xuXHRcdH1cblx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSAwO1xuXHR9XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLk8ocmVzdWx0KTtcbn1cblxudmFyIGNodW5rTG9hZGluZ0dsb2JhbCA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtzb3VuZF90aHJlZV9qc1wiXSA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtzb3VuZF90aHJlZV9qc1wiXSB8fCBbXTtcbmNodW5rTG9hZGluZ0dsb2JhbC5mb3JFYWNoKHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgMCkpO1xuY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2ggPSB3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIGNodW5rTG9hZGluZ0dsb2JhbC5wdXNoLmJpbmQoY2h1bmtMb2FkaW5nR2xvYmFsKSk7IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBkZXBlbmRzIG9uIG90aGVyIGxvYWRlZCBjaHVua3MgYW5kIGV4ZWN1dGlvbiBuZWVkIHRvIGJlIGRlbGF5ZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHVuZGVmaW5lZCwgW1widmVuZG9ycy1ub2RlX21vZHVsZXNfdG9uZWpzX21pZGlfZGlzdF9NaWRpX2pzLW5vZGVfbW9kdWxlc19jYW5ub24tZXNfZGlzdF9jYW5ub24tZXNfanMtbm9kZV9tLWVhOTEyY1wiXSwgKCkgPT4gKF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9hcHAudHNcIikpKVxuX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyhfX3dlYnBhY2tfZXhwb3J0c19fKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==