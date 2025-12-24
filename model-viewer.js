import * as THREE from 'https://cdn.jsdelivr.net/npm/three@r128/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@r128/examples/jsm/loaders/GLTFLoader.js';

class LocalModelViewer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        // Initialize Three.js scene
        this.initScene();
        this.setupLighting();
        this.loadModel();
        this.setupEventListeners();
        this.animate();
    }

    initScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf5f5f5);
        
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.container.clientWidth / this.container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.z = 3;

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.container.appendChild(this.renderer.domElement);

        this.isDragging = false;
        this.previousMousePosition = { x: 0, y: 0 };
        this.rotation = { x: 0, y: 0 };
        this.model = null;
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        this.scene.add(ambientLight);

        // Directional light - main light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
        directionalLight.position.set(5, 10, 7);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);

        // Point light for fill - warm light
        const pointLight = new THREE.PointLight(0xffaa88, 0.5);
        pointLight.position.set(-8, 5, 5);
        this.scene.add(pointLight);

        // Back light for separation
        const backLight = new THREE.PointLight(0x88ccff, 0.4);
        backLight.position.set(0, 5, -8);
        this.scene.add(backLight);
    }

    loadModel() {
        const loader = new GLTFLoader();
        loader.load(
            './model/base.glb',
            (gltf) => {
                this.model = gltf.scene;
                
                // Center and scale the model
                const box = new THREE.Box3().setFromObject(this.model);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());
                
                // Center the model
                this.model.position.sub(center);
                
                // Scale to fit in view
                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = maxDim > 0 ? 2 / maxDim : 1;
                this.model.scale.multiplyScalar(scale);
                
                // Traverse and fix materials for better lighting
                this.model.traverse((node) => {
                    if (node.isMesh) {
                        node.castShadow = true;
                        node.receiveShadow = true;
                    }
                });
                
                this.scene.add(this.model);
                console.log('Model loaded successfully (offline mode)');
            },
            (progress) => {
                const percent = progress.total > 0 
                    ? (progress.loaded / progress.total * 100).toFixed(2) 
                    : 0;
                console.log('Loading progress:', percent + '%');
            },
            (error) => {
                console.error('Error loading model:', error);
                this.createFallbackMannequin();
            }
        );
    }

    createFallbackMannequin() {
        const group = new THREE.Group();

        // Head
        const headGeometry = new THREE.SphereGeometry(0.3, 32, 32);
        const skinMaterial = new THREE.MeshPhongMaterial({ color: 0xf0d8c8 });
        const head = new THREE.Mesh(headGeometry, skinMaterial);
        head.position.y = 1.6;
        head.castShadow = true;
        head.receiveShadow = true;
        group.add(head);

        // Body/Torso
        const bodyGeometry = new THREE.CylinderGeometry(0.25, 0.2, 0.8, 32);
        const body = new THREE.Mesh(bodyGeometry, skinMaterial);
        body.position.y = 0.8;
        body.castShadow = true;
        body.receiveShadow = true;
        group.add(body);

        // Left Arm
        const armGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.7, 16);
        const leftArm = new THREE.Mesh(armGeometry, skinMaterial);
        leftArm.position.set(-0.4, 1.1, 0);
        leftArm.rotation.z = Math.PI / 6;
        leftArm.castShadow = true;
        leftArm.receiveShadow = true;
        group.add(leftArm);

        // Right Arm
        const rightArm = new THREE.Mesh(armGeometry, skinMaterial);
        rightArm.position.set(0.4, 1.1, 0);
        rightArm.rotation.z = -Math.PI / 6;
        rightArm.castShadow = true;
        rightArm.receiveShadow = true;
        group.add(rightArm);

        // Left Leg
        const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 16);
        const leftLeg = new THREE.Mesh(legGeometry, skinMaterial);
        leftLeg.position.set(-0.15, 0, 0);
        leftLeg.castShadow = true;
        leftLeg.receiveShadow = true;
        group.add(leftLeg);

        // Right Leg
        const rightLeg = new THREE.Mesh(legGeometry, skinMaterial);
        rightLeg.position.set(0.15, 0, 0);
        rightLeg.castShadow = true;
        rightLeg.receiveShadow = true;
        group.add(rightLeg);

        // Dress/Clothing
        const dressGeometry = new THREE.ConeGeometry(0.3, 0.6, 32);
        const dressMaterial = new THREE.MeshPhongMaterial({ color: 0x2ecc71 });
        const dress = new THREE.Mesh(dressGeometry, dressMaterial);
        dress.position.y = 0.5;
        dress.castShadow = true;
        dress.receiveShadow = true;
        group.add(dress);

        this.model = group;
        this.scene.add(this.model);
        console.log('Fallback mannequin created');
    }

    setupEventListeners() {
        // Mouse events
        this.container.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.container.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.container.addEventListener('mouseup', (e) => this.onMouseUp(e));
        this.container.addEventListener('mouseleave', (e) => this.onMouseLeave(e));

        // Touch events
        this.container.addEventListener('touchstart', (e) => this.onTouchStart(e));
        this.container.addEventListener('touchmove', (e) => this.onTouchMove(e));
        this.container.addEventListener('touchend', (e) => this.onTouchEnd(e));

        // Window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }

    onMouseDown(e) {
        this.isDragging = true;
        this.previousMousePosition = { x: e.clientX, y: e.clientY };
    }

    onMouseMove(e) {
        if (!this.isDragging) return;

        const deltaX = e.clientX - this.previousMousePosition.x;
        const deltaY = e.clientY - this.previousMousePosition.y;

        this.rotation.y += deltaX * 0.005;
        this.rotation.x += deltaY * 0.005;

        this.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.rotation.x));
        this.previousMousePosition = { x: e.clientX, y: e.clientY };
    }

    onMouseUp(e) {
        this.isDragging = false;
    }

    onMouseLeave(e) {
        this.isDragging = false;
    }

    onTouchStart(e) {
        this.isDragging = true;
        this.previousMousePosition = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
    }

    onTouchMove(e) {
        if (!this.isDragging) return;
        e.preventDefault();

        const deltaX = e.touches[0].clientX - this.previousMousePosition.x;
        const deltaY = e.touches[0].clientY - this.previousMousePosition.y;

        this.rotation.y += deltaX * 0.005;
        this.rotation.x += deltaY * 0.005;

        this.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.rotation.x));
        this.previousMousePosition = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
    }

    onTouchEnd(e) {
        this.isDragging = false;
    }

    onWindowResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    animate = () => {
        requestAnimationFrame(this.animate);

        if (this.model) {
            // Auto-rotate when not dragging
            if (!this.isDragging) {
                this.rotation.y += 0.003;
            }

            // Apply rotation
            this.model.rotation.x = this.rotation.x;
            this.model.rotation.y = this.rotation.y;
        }

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if Google Model Viewer is available
    const googleModelViewer = document.getElementById('googleModelViewer');
    if (!customElements.get('model-viewer')) {
        // Google Model Viewer not available, use local viewer
        console.log('Using local Three.js viewer');
        const localViewer = document.querySelector('.model-viewer-wrapper');
        if (localViewer) {
            googleModelViewer.style.display = 'none';
            document.getElementById('modelViewer').style.display = 'block';
        }
        new LocalModelViewer('modelViewer');
    } else {
        console.log('Using Google Model Viewer');
        googleModelViewer.style.display = 'block';
        const fallback = document.getElementById('modelViewer');
        if (fallback) fallback.style.display = 'none';
    }
});
