'use client';

import { useEffect, useRef, useState } from 'react';
import { useLotteryStore } from '@/store/lottery-store';
import { Participant } from '@/config/lottery.config';

declare global {
  interface Window {
    THREE: any;
  }
}

interface LotterySceneProps {
  participants: Participant[];
}

export default function LotteryScene({ participants }: LotterySceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [progress, setProgress] = useState('');
  const initializedRef = useRef(false);
  const { status, currentWinners } = useLotteryStore();

  // 动态加载 three.js
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.THREE) {
      const script = document.createElement('script');
      script.src = '/lottery_files/three.min.js';
      script.onload = () => {
        console.log('THREE.js loaded:', !!window.THREE);
        setScriptsLoaded(true);
      };
      script.onerror = (e) => {
        console.error('Failed to load THREE.js', e);
      };
      document.head.appendChild(script);
    } else if (window.THREE) {
      setScriptsLoaded(true);
    }
  }, []);

  // 存储 Three.js 对象的 ref
  const sceneRef = useRef<{
    camera: any;
    scene: any;
    renderer: any;
    geometry: any;
    sprites: any[];
    materials: any[];
    particles: any[];
    picNums: number[];
    sky: any;
    isStart: boolean;
    MoveAble: boolean;
    ChooseAble: boolean;
    mouseX: number;
    mouseY: number;
    windowHalfX: number;
    windowHalfY: number;
    animationId: number | null;
  }>({
    camera: null,
    scene: null,
    renderer: null,
    geometry: null,
    sprites: [],
    materials: [],
    particles: [],
    picNums: [],
    sky: null,
    isStart: false,
    MoveAble: false,
    ChooseAble: true,
    mouseX: 0,
    mouseY: 0,
    windowHalfX: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
    windowHalfY: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
    animationId: null,
  });

  // 监听状态变化，控制 MoveAble
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.MoveAble = status === 'rolling';
    }
  }, [status]);

  // 监听中奖者变化，把所有粒子换成中奖者照片
  useEffect(() => {
    const s = sceneRef.current;
    const THREE = window.THREE;
    
    if (!THREE || !s.particles.length) return;

    if (currentWinners && currentWinners.length > 0) {
      // 有中奖者，加载所有中奖者的照片
      const loader = new THREE.TextureLoader();
      const winnerTextures: any[] = [];
      let loadedCount = 0;

      // 递归加载所有中奖者照片
      const loadWinnerTexture = (index: number) => {
        if (index >= currentWinners.length) {
          // 所有照片加载完成，分配给粒子
          for (let i = 0; i < s.particles.length; i++) {
            // 循环使用中奖者照片
            const textureIndex = i % winnerTextures.length;
            s.particles[i].material = new THREE.PointsMaterial({
              size: 120,
              map: winnerTextures[textureIndex],
              depthTest: true,
              transparent: true,
            });
          }
          return;
        }

        loader.load(
          currentWinners[index].photo,
          (texture: any) => {
            winnerTextures.push(texture);
            loadWinnerTexture(index + 1);
          },
          undefined,
          () => {
            // 加载失败也继续
            loadWinnerTexture(index + 1);
          }
        );
      };

      loadWinnerTexture(0);
    } else if (s.materials.length > 0) {
      // 没有中奖者，恢复原来的材质
      for (let i = 0; i < s.particles.length; i++) {
        s.particles[i].material = s.materials[i];
      }
    }
  }, [currentWinners]);

  // 初始化 Three.js 场景
  useEffect(() => {
    if (!scriptsLoaded || !containerRef.current || participants.length === 0 || initializedRef.current) {
      return;
    }

    const THREE = window.THREE;
    if (!THREE) {
      console.error('THREE not loaded');
      return;
    }

    initializedRef.current = true;
    const s = sceneRef.current;
    const papleNum = participants.length;
    const papleArr = participants;

    // 初始化
    function init() {
      s.windowHalfX = window.innerWidth / 2;
      s.windowHalfY = window.innerHeight / 2;

      s.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 6000);
      s.camera.position.z = 1.4;

      s.scene = new THREE.Scene();
      s.scene.fog = new THREE.FogExp2(0x144c7f, 0.0007);

      s.renderer = new THREE.WebGLRenderer();
      s.renderer.setPixelRatio(window.devicePixelRatio);
      s.renderer.setSize(window.innerWidth, window.innerHeight);
      containerRef.current!.appendChild(s.renderer.domElement);
      s.renderer.setClearColor(0x083054);

      // lights
      s.scene.add(new THREE.AmbientLight(0x444444));
      const light1 = new THREE.DirectionalLight(0xffffff, 1);
      light1.position.set(1, 1, 1);
      s.scene.add(light1);
      const light2 = new THREE.DirectionalLight(0xffffff, 1.5);
      light2.position.set(-1, -1, -1);
      s.scene.add(light2);
      const light3 = new THREE.PointLight(0x3f72cf, 1.5, 6);
      light3.position.set(0, 0, 0);
      s.scene.add(light3);

      // sky
      const skyM = new THREE.MeshPhongMaterial({
        color: 0x999999,
        emissive: 0x444444,
        side: THREE.BackSide,
      });
      s.sky = new THREE.Mesh(new THREE.SphereGeometry(10, 4, 4), skyM);
      s.scene.add(s.sky);

      // 开始加载纹理
      loadTex(0);

      // 事件监听
      document.addEventListener('mousemove', onDocumentMouseMove, false);
      window.addEventListener('resize', onWindowResize, false);

      // 开始动画
      animate();
    }

    // 加载纹理 - 与原始代码一致
    function loadTex(_num: number) {
      const loader = new THREE.TextureLoader();
      loader.load(
        papleArr[_num].photo,
        function (texture: any) {
          s.sprites.push(texture);
          s.picNums.push(_num);

          if (_num < papleNum - 1) {
            const _n = _num + 1;
            loadTex(_n);
            setProgress(Math.floor(_num / papleNum * 100) + '%');
          }

          if (_num === papleNum - 1) {
            setTimeout(initPlans, 100);
            setProgress('');
            // 自动开始
            setTimeout(Choose, 500);
          }
        },
        undefined,
        function () {
          console.error('Error loading texture:', _num);
          // 继续加载下一个
          if (_num < papleNum - 1) {
            loadTex(_num + 1);
          }
        }
      );
    }

    // 初始化粒子 - 与原始代码完全一致
    function initPlans() {
      s.geometry = new THREE.Geometry();
      const len = 7000 / papleNum;
      for (let i = 0; i < len; i++) {
        const vertex = new THREE.Vector3();
        vertex.x = Math.random() * 2000 - 1000;
        vertex.y = Math.random() * 2000 - 1000;
        vertex.z = Math.random() * 2000 - 1000;
        s.geometry.vertices.push(vertex);
      }

      for (let i = 0; i < s.picNums.length; i++) {
        const _m = new THREE.PointsMaterial({
          size: Math.random() * 40 + 40,
          map: s.sprites[s.picNums[i]],
          depthTest: true,
          transparent: true,
        });
        s.materials.push(_m);

        const _p = new THREE.Points(s.geometry, _m);
        _p.rotation.x = Math.random() * 6;
        _p.rotation.y = Math.random() * 6;
        _p.rotation.z = Math.random() * 6;

        s.scene.add(_p);
        s.particles.push(_p);
      }

      setTimeout(function () {
        s.ChooseAble = true;
      }, 100);
    }

    // 开始抽奖 - 与原始代码一致
    function Choose() {
      if (!s.isStart) {
        s.isStart = true;
        if (s.sky) {
          s.scene.remove(s.sky);
          s.sky = null;
        }
        return;
      }
    }

    // 鼠标移动
    function onDocumentMouseMove(event: MouseEvent) {
      s.mouseX = event.clientX - s.windowHalfX;
      s.mouseY = event.clientY - s.windowHalfY;
    }

    // 窗口调整
    function onWindowResize() {
      s.windowHalfX = window.innerWidth / 2;
      s.windowHalfY = window.innerHeight / 2;
      s.camera.aspect = window.innerWidth / window.innerHeight;
      s.camera.updateProjectionMatrix();
      s.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // 动画循环
    function animate() {
      s.animationId = requestAnimationFrame(animate);
      render();
    }

    // 渲染 - 与原始代码完全一致
    function render() {
      let time = Date.now() * 0.000002;

      let _x = s.mouseX * 0.006;
      let _y = s.mouseY * 0.006;

      if (s.isStart) {
        _x = s.mouseX;
        _y = s.mouseY;
      }

      if (!s.MoveAble) {
        s.camera.position.x += (_x - s.camera.position.x) * 0.05;
        s.camera.position.y += (-_y - s.camera.position.y) * 0.05;

        if (s.isStart) s.camera.position.z += (1000 - s.camera.position.z) * 0.05;
      } else {
        time = Date.now() * 0.0002;
        if (s.isStart) s.camera.position.z += (3000 - s.camera.position.z) * 0.05;
      }

      s.camera.lookAt(s.scene.position);

      for (let i = 0; i < s.scene.children.length; i++) {
        const object = s.scene.children[i];
        if (object instanceof THREE.Points) {
          object.rotation.y = time * (i < 4 ? i + 1 : -(i + 1));
        }
      }
      s.renderer.render(s.scene, s.camera);
    }

    // 启动
    init();

    // 清理
    return () => {
      if (s.animationId) {
        cancelAnimationFrame(s.animationId);
      }
      document.removeEventListener('mousemove', onDocumentMouseMove);
      window.removeEventListener('resize', onWindowResize);
      if (s.renderer && containerRef.current) {
        containerRef.current.removeChild(s.renderer.domElement);
      }
    };
  }, [scriptsLoaded, participants]);

  return (
    <div
      style={{
        backgroundColor: '#144c7f',
        margin: 0,
        overflow: 'hidden',
        fontFamily: 'Monospace',
        textAlign: 'center',
        fontWeight: 'bold',
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      {/* 加载进度 */}
      {progress && (
        <div
          style={{
            color: '#ffffff',
            fontSize: '60px',
            position: 'absolute',
            top: '5px',
            width: '100%',
            zIndex: 1,
            padding: '3em 0 0 0',
          }}
        >
          {progress}
        </div>
      )}

      {/* Three.js 容器 */}
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
