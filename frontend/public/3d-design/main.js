import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DragControls } from 'three/addons/controls/DragControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
console.log("JS Connected!");
// --- 1. CONFIGURATION ---
const modelData = {
    chair: [
        { id: 'plastic_chair', name: 'เก้าอี้พลาสติก', file: 'model/plastic_chair.glb', thumb: 'image/plastic_chair.png', price: '100' },
        { id: 'wooden_chair', name: 'เก้าอี้ไม้', file: 'model/wooden_chair.glb', thumb: 'image/wooden_chair.png', price: '250' },
        { id: 'chair_modern', name: 'เก้าอี้โมเดิร์น', file: 'model/chair_modern.glb', thumb: 'image/modern_chair.png', price: '500' },
        { id: 'bar_chair', name: 'เก้าอี้บาร์', file: 'model/bar_chair.glb', thumb: 'image/bar_chair.png', price: '600' },
        { id: 'cozy_swivel_chair', name: 'เก้าอี้รับแขก', file: 'model/cozy_swivel_chair.glb', thumb: 'image/cozy_swivel_chair.png', price: '700' },
        { id: 'cozy_swivel_chair2', name: 'เก้าอี้รับแขกใหญ่', file: 'model/cozy_swivel_chair2.glb', thumb: 'image/cozy_swivel_chair2.png', price: '900' },
        { id: 'long_sofa_modern', name: 'โซฟายาวโมเดิร์น', file: 'model/long_sofa_modern.glb', thumb: 'image/long_sofa_modern.png', price: '1,000' },
        { id: 'sofa_pinkset', name: 'ชุดโซฟาสีชมพู', file: 'model/sofa_pinkset.glb', thumb: 'image/sofa_pinkset.png', price: '1,200' },
    ],
    table: [
        { id: 'folding_table', name: 'โต๊ะพับเหล็ก', file: 'model/folding_table.glb', thumb: 'image/folding_table.png', price: '300' },
        { id: 'table', name: 'โต๊ะกลม', file: 'model/table.glb', thumb: 'image/table.png', price: '500' },
        { id: 'round_table', name: 'ชุดโต๊ะกลม', file: 'model/round_table.glb', thumb: 'image/round_table.png', price: '1,200' },
        { id: 'meeting_table', name: 'ชุดโต๊ะประชุม', file: 'model/meeting_table.glb', thumb: 'image/meeting_table.png', price: '2,000' },
        { id: 'dining_table', name: 'ชุดโต๊ะทานอาหารโมเดิร์น', file: 'model/dining_table.glb', thumb: 'image/dining_table.png', price: '2,200' },
        { id: 'simple_dining_table', name: 'ชุดโต๊ะทานอาหาร', file: 'model/simple_dining_table.glb', thumb: 'image/simple_dining_table.png', price: '2,700' },
        { id: 'modern_dining_table', name: 'ชุดโต๊ะจัดเลี้ยงโมเดิร์น', file: 'model/modern_dining_table.glb', thumb: 'image/modern_dining_table.png', price: '3,000' },
        { id: 'catering_table', name: 'ชุดโต๊ะจัดเลี้ยง', file: 'model/catering_table.glb', thumb: 'image/catering_table.png', price: '4,500' },
    ],
    decor: [
        { id: 'fruit_cake', name: 'เค้กผลไม้วันเกิด', file: 'model/fruit_cake.glb', thumb: 'image/fruit_cake.png', price: '800' },
        { id: 'wedding_cake', name: 'เค้กแต่งงาน', file: 'model/wedding_cake.glb', thumb: 'image/wedding_cake.png', price: '1,500' },
        { id: 'flower_stand', name: 'แท่นวางดอกไม้', file: 'model/flower_stand.glb', thumb: 'image/flower_stand.png', price: '5,000' },
    ],
    audio: [
        { id: 'audio_speaker', name: 'ลำโพง', file: 'model/logitech_audio_speaker.glb', thumb: 'image/logitech_audio_speaker.png', price: '1,500' },
        { id: 'standing_speaker', name: 'ลำโพงตั้งพื้น', file: 'model/standing_speaker.glb', thumb: 'image/standing_speaker.png', price: '2,000' },
        { id: 'microphone_stand', name: 'ไมโครโฟน', file: 'model/microphone_stand.glb', thumb: 'image/microphone_stand.png', price: '1,200' },
        { id: 'mixer', name: 'มิกเซอร์', file: 'model/mixer.glb', thumb: 'image/mixer.png', price: '1,200' }
    ],
    lighting: [
        { id: 'stage_light', name: 'ไฟเวที', file: 'model/stage_lighting.glb', thumb: 'image/stage_lighting.png', price: '2,000' },
        { id: 'studio_light', name: 'ไฟสตูดิโอ', file: 'model/studio_light.glb', thumb: 'image/studio_light.png', price: '1,800' }
    ],
    funeral: [
        { id: 'funeral_flower', name: 'พวงหรีดดอกไม้', file: 'model/funeral_flower.glb', thumb: 'image/funeral_flower.png', price: '1,000' },
        { id: 'casket_normal', name: 'โลงศพธรรมดา', file: 'model/casket_normal.glb', thumb: 'image/casket_normal.png', price: '2,500' },
        { id: 'casket1', name: 'โลงศพมารตรฐาน', file: 'model/casket1.glb', thumb: 'image/casket1.png', price: '2,500' },
        { id: 'casket2', name: 'โลงเย็น', file: 'model/casket2.glb', thumb: 'image/casket2.png', price: '2,500' },
    ],
    make_merit: [
        { id: 'buddha', name: 'พระพุทธรูป', file: 'model/buddha.glb', thumb: 'image/buddha.png', price: '1,500' },
        { id: 'gold_buddha', name: 'พระพุทธรูปทอง', file: 'model/gold_buddha.glb', thumb: 'image/gold_buddha.png', price: '2,000' }
    ],
    wedding: [
        { id: 'backdrop_wedding', name: 'ฉากหลังแต่งงาน', file: 'model/backdrop_wedding.glb', thumb: 'image/backdrop_wedding.png', price: '850' },
        { id: 'backdrop_wedding_gate', name: 'ฉากหลังประตูแต่งงาน', file: 'model/backdrop_wedding_gate.glb', thumb: 'image/backdrop_wedding_gate.png', price: '700' },
        { id: 'backdrop_wedding_chinese', name: 'ฉากหลังแต่งงานจีน', file: 'model/backdrop_wedding_chinese.glb', thumb: 'image/backdrop_wedding_chinese.png', price: '600' },
    ],
    party: [
        { id: 'bar', name: 'ซุ้มบาร์', file: 'model/bar.glb', thumb: 'image/bar.png', price: '8,000' },
    ]
};

// --- 2. GLOBAL STATE ---
let objectsInRoom = [];
let selectedObjects = [];
let selectionBox = null;
let startPoint = new THREE.Vector2();
let transformControls, dControls, controls;
let ambientLight, dirLight;
let historyStack = []; // สำหรับ Undo
let redoStack = [];    // สำหรับ Redo (เพิ่มใหม่)

// --- 3. SCENE INITIALIZATION ---
window.scene = new THREE.Scene();
const scene = window.scene;
scene.background = new THREE.Color(0x2B2B2B);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5, 5, 8);

const container = document.getElementById('canvas-container');
const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true,powerPreference: "high-performance" });
renderer.setPixelRatio(window.devicePixelRatio > 1.2 ? 1.2 : 1);
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

ambientLight = new THREE.AmbientLight(0xffffff, 0.8); 
scene.add(ambientLight);

dirLight = new THREE.DirectionalLight(0xffffff, 1); 
dirLight.position.set(5, 10, 7);
dirLight.castShadow = true; 
scene.add(dirLight);
scene.add(new THREE.GridHelper(20, 20, 0x444444, 0x333333));

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const loader = new GLTFLoader();

// --- 4. CONTROLS SETUP ---
controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// 4.1 Transform Controls (For Scale/Rotate/Translate Gizmo)
transformControls = new TransformControls(camera, renderer.domElement);
scene.add(transformControls);

transformControls.addEventListener('dragging-changed', (e) => {
    controls.enabled = !e.value;
    if (dControls) dControls.enabled = !e.value;
});

// 4.2 Drag Controls
dControls = new DragControls(objectsInRoom, camera, renderer.domElement);

dControls.addEventListener('dragstart', (e) => {
    const root = getModelRoot(e.object);
    if (root) {
        controls.enabled = false;
        if (!selectedObjects.includes(root)) selectMultiple([root]);
        selectedObjects.forEach(obj => {
            obj._startOffset = obj.position.clone().sub(root.position);
        });
    }
});

dControls.addEventListener('drag', (e) => {
    const root = getModelRoot(e.object);
    if (!root) return;
    selectedObjects.forEach(obj => {
        if (obj !== root) {
            obj.position.copy(root.position.clone().add(obj._startOffset));
        }
        if (!obj.userData.isStructure) adjustToFloor(obj);
    });
});

dControls.addEventListener('dragend', () => {
    controls.enabled = true;
    captureState();
});

// --- 5. STRUCTURE CREATION (Wall & Floor) ---

window.createStructure = function(type) {
    let geometry, material, name, modelId;
    if (type === 'wall') {
        geometry = new THREE.BoxGeometry(4, 2.5, 0.2);
        material = new THREE.MeshStandardMaterial({ color: 0xcccccc });
        name = 'ผนัง';
        modelId = 'custom_wall';
    } else {
        geometry = new THREE.BoxGeometry(5, 0.1, 5);
        material = new THREE.MeshStandardMaterial({ color: 0x444444 });
        name = 'พื้น';
        modelId = 'custom_floor';
    }

    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData = { 
        name: name, 
        modelId: modelId, 
        isRoot: true,
        isStructure: true,
        thumb: type === 'wall' ? 'image/brick_wall.png' : 'image/floor.png'
    };

    mesh.position.set(0, type === 'wall' ? 1.25 : 0.05, 0);
    scene.add(mesh);
    objectsInRoom.push(mesh);
    dControls.objects = objectsInRoom;
    
    selectMultiple([mesh]);
    updateInventoryUI();
    captureState();
};

function initLights() {
    // แสงสว่างรอบทิศทาง
    ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // แสงสว่างแบบมีทิศทาง
    dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true; 
    scene.add(dirLight);
    
}

// ฟังก์ชันบันทึกสถานะ (เรียกใช้เมื่อมีการขยับ/เพิ่ม/ลบ ของ)
window.captureState = function() {
    const state = objectsInRoom.map(obj => ({
        id: obj.userData.modelId,
        name: obj.userData.name,
        thumb: obj.userData.thumb,
        pos: obj.position.clone(),
        rot: obj.rotation.y,
        scale: obj.scale.clone(),
        isStructure: obj.userData.isStructure || false
    }));
    
    historyStack.push(JSON.stringify(state));
    redoStack = []; // ล้าง Redo ทุกครั้งที่มีการกระทำใหม่
    
    if (historyStack.length > 30) historyStack.shift(); 
};

// เรียกใช้งาน
initLights();

// --- 2. เชื่อมต่อกับ UI ---
document.getElementById('input-ambient-intensity')?.addEventListener('input', (e) => {
    ambientLight.intensity = parseFloat(e.target.value);
});

document.getElementById('input-dir-intensity')?.addEventListener('input', (e) => {
    dirLight.intensity = parseFloat(e.target.value);
});

document.getElementById('input-light-pos')?.addEventListener('input', (e) => {
    const angle = parseFloat(e.target.value);
    const radius = 10;
    // หมุนตำแหน่งไฟรอบๆ จุดศูนย์กลาง
    dirLight.position.x = Math.cos(angle) * radius;
    dirLight.position.z = Math.sin(angle) * radius;
});


// --- 6. MODEL HELPERS ---

function getModelRoot(target) {
    let curr = target;
    while (curr) {
        if (curr.userData?.isRoot) return curr;
        curr = curr.parent;
    }
    return null;
}

function adjustToFloor(model) {
    const box = new THREE.Box3().setFromObject(model);
    model.position.y -= (box.min.y - 0);
}

function normalizeModelSize(model, targetSize = 2.5) {
    const box = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 0) {
        const scale = targetSize / maxDim;
        model.scale.set(scale, scale, scale);
    }
}

function setHighlight(obj, colorHex) {
    obj.traverse(c => {
        if (c.isMesh && c.material) {
            if (!c.material._isCloned) {
                c.material = c.material.clone();
                c.material._isCloned = true;
            }
            if (c.material.emissive) {
                c.material.emissive.setHex(colorHex);
                c.material.emissiveIntensity = colorHex === 0 ? 0 : 0.5;
            }
        }
    });
}

function selectMultiple(targets) {
    selectedObjects.forEach(obj => setHighlight(obj, 0x000000));
    selectedObjects = targets.filter(t => t !== null);
    selectedObjects.forEach(obj => setHighlight(obj, 0x444444));

    if (selectedObjects.length === 1) {
        transformControls.attach(selectedObjects[0]);
        // ถ้าเป็นผนัง/พื้น ให้เข้าโหมด Scale ทันทีเพื่อความสะดวก
        if (selectedObjects[0].userData.isStructure) {
            transformControls.setMode('scale');
        } else {
            transformControls.setMode('translate');
        }
    } else {
        transformControls.detach();
    }
}

// --- 7. INTERACTION (CLICK & BOX SELECT) ---

renderer.domElement.addEventListener('pointerdown', (e) => {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(objectsInRoom, true);

    if (intersects.length > 0) {
        const root = getModelRoot(intersects[0].object);
        if (root) {
            if (e.shiftKey) {
                if (!selectedObjects.includes(root)) selectMultiple([...selectedObjects, root]);
            } else {
                if (!selectedObjects.includes(root)) selectMultiple([root]);
            }
        }
    } else {
        if (!transformControls.dragging) {
            selectMultiple([]);
            startBoxSelection(e, rect);
        }
    }
});

function startBoxSelection(e, rect) {
    startPoint.set(e.clientX, e.clientY);
    selectionBox = document.createElement('div');
    selectionBox.className = 'selection-box';
    Object.assign(selectionBox.style, {
        position: 'absolute', border: '1px solid #a855f7', backgroundColor: 'rgba(168, 85, 247, 0.2)', pointerEvents: 'none'
    });
    document.body.appendChild(selectionBox);

    const onMove = (me) => {
        const left = Math.min(startPoint.x, me.clientX);
        const top = Math.min(startPoint.y, me.clientY);
        selectionBox.style.left = left + 'px';
        selectionBox.style.top = top + 'px';
        selectionBox.style.width = Math.abs(startPoint.x - me.clientX) + 'px';
        selectionBox.style.height = Math.abs(startPoint.y - me.clientY) + 'px';
    };

    const onUp = (ue) => {
        const found = [];
        objectsInRoom.forEach(obj => {
            const vector = obj.position.clone().project(camera);
            const x = (vector.x + 1) * rect.width / 2 + rect.left;
            const y = -(vector.y - 1) * rect.height / 2 + rect.top;
            const minX = Math.min(startPoint.x, ue.clientX), maxX = Math.max(startPoint.x, ue.clientX);
            const minY = Math.min(startPoint.y, ue.clientY), maxY = Math.max(startPoint.y, ue.clientY);
            if (x >= minX && x <= maxX && y >= minY && y <= maxY) found.push(obj);
        });
        selectMultiple(found);
        selectionBox.remove();
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
}

// --- 8. UI UPDATES ---

// เพิ่มพารามิเตอร์ savedRot และ savedScale เข้าไปในฟังก์ชัน
window.addModel = function(modelId, savedPos = null, savedRot = 0, savedScale = null) {
    let targetInfo = null;
    Object.values(modelData).find(cat => {
        targetInfo = cat.find(m => m.id === modelId);
        return targetInfo;
    });

    if (!targetInfo) return;

    loader.load(targetInfo.file, (gltf) => {
        const model = gltf.scene;
        
        // ถ้าไม่มี savedScale (เป็นการเพิ่มใหม่) ให้ใช้การ Normalize ปกติ
        if (!savedScale) {
            normalizeModelSize(model, 2.5); 
        }

        model.userData = { 
            name: targetInfo.name, 
            modelId: modelId, 
            thumb: targetInfo.thumb, 
            isRoot: true 
        };
        if (savedPos) {
            model.position.copy(savedPos);   // กู้คืนตำแหน่ง
            model.rotation.y = savedRot;      // กู้คืนการหมุน
            if (savedScale) model.scale.copy(savedScale); // กู้คืนขนาด
        } else {
            // กรณีเพิ่มใหม่ปกติ
            model.position.set((Math.random() - 0.5) * 4, 0, (Math.random() - 0.5) * 4);
        }

        scene.add(model);
        objectsInRoom.push(model); 
        dControls.objects = objectsInRoom; 
        
        if (!savedPos) adjustToFloor(model);

        updateInventoryUI();
        selectMultiple([model]);
        
        // บันทึกลง History Stack
        captureState(); 
    });
};
function deleteObject(obj) {
    if (!obj) return;
    const index = objectsInRoom.indexOf(obj);
    if (index > -1) {
        objectsInRoom.splice(index, 1);
        scene.remove(obj);
        selectedObjects = selectedObjects.filter(item => item !== obj);
        transformControls.detach();
        updateInventoryUI();
        captureState();
    }
}

function updateInventoryUI() {
    const listContainer = document.getElementById('list-items');
    if (!listContainer) return;

    // 1. เคลียร์รายการเก่าออกก่อน
    listContainer.innerHTML = '';

    // 2. เช็คว่าถ้าไม่มีวัตถุ ให้แสดงข้อความแจ้งเตือนแล้วหยุดทำงานฟังก์ชัน
    if (objectsInRoom.length === 0) {
        listContainer.innerHTML = '<p id="empty-msg" style="text-align: center; color: #666; margin-top: 20px;">ยังไม่มีเฟอร์นิเจอร์ในห้อง</p>';
        return; 
    }

    // 3. ถ้ามีวัตถุ (โค้ดส่วนเดิมของคุณจะทำงานต่อ)
    const counts = {};
    let totalAll = 0;

    objectsInRoom.forEach(obj => {
        const id = obj.userData.modelId;
        let priceNum = 0;
        Object.values(modelData).forEach(cat => {
            const found = cat.find(m => m.id === id);
            if (found) priceNum = parseFloat(found.price.replace(/,/g, ''));
        });

        if (!counts[id]) {
            counts[id] = { name: obj.userData.name, count: 0, thumb: obj.userData.thumb, price: priceNum };
        }
        counts[id].count++;
        totalAll += priceNum;
    });

    // --- ส่วนการสร้าง HTML แสดงผลรายการ (ต่อจากด้านบน) ---
    Object.keys(counts).forEach(id => {
        const item = counts[id];
        const itemRow = document.createElement('div');
        itemRow.className = 'inventory-item-row';
        itemRow.innerHTML = `
            <div class="inventory-item-thumb"><img src="${item.thumb}" onerror="this.src='image/placeholder.png'"></div>
            <div class="inventory-item-info">
                <span class="item-name">${item.name}</span>
                <div class="item-price-each">฿${(item.price * item.count).toLocaleString()}</div> 
                <div class="item-controls-group">
                    <div class="qty-control-box">
                        <button class="qty-action-btn" onclick="window.handleQtyChange('${id}', -1)">-</button>
                        <span class="qty-display-badge">${item.count}</span>
                        <button class="qty-action-btn" onclick="window.handleQtyChange('${id}', 1)">+</button>
                    </div>
                    <button class="trash-action-btn" onclick="window.removeModelById('${id}')"><i class="fi fi-rr-trash"></i></button>
                </div>
            </div>
        `;
        listContainer.appendChild(itemRow);
    });

    // แสดงราคารวม
    const totalRow = document.createElement('div');
    totalRow.className = 'inventory-total-row';
    totalRow.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px 5px; border-top: 1px solid rgba(255,255,255,0.1); margin-top: 10px;">
            <span style="font-weight: bold; color: #a855f7;">ราคารวมทั้งหมด</span>
            <span style="font-size: 1.2em; font-weight: bold; color: #fff;">฿${totalAll.toLocaleString()}</span>
        </div>
    `;
    listContainer.appendChild(totalRow);
}

// Global UI Handles
window.handleQtyChange = (id, change) => change > 0 ? window.addModel(id) : window.removeModelById(id);
window.removeModelById = (modelId) => {
    const targetObj = [...objectsInRoom].reverse().find(obj => obj.userData.modelId === modelId);
    if (targetObj) deleteObject(targetObj);
};

window.updateModelCatalog = () => {
    const catalogContainer = document.getElementById('model-catalog-container');
    const category = document.getElementById('category-select')?.value;
    const model = modelData[category] || [];
    if (!catalogContainer) return;
    catalogContainer.innerHTML = model.map(m => `
        <div class="model-card" onclick="${m.file ? `window.addModel('${m.id}')` : `window.createStructure('${m.id.includes('wall') ? 'wall' : 'floor'}')`}">
            <div class="card-image"><img src="${m.thumb}"></div>
            <div class="card-info">
                <h4>${m.name}</h4>
                <p>฿${m.price}</p>
            </div>
        </div>
    `).join('');
};

// --- 9. KEYBOARD & UI LISTENERS ---

function setupUIListeners() {
    document.getElementById('category-select')?.addEventListener('change', window.updateModelCatalog);
    
    // Shortcuts
    window.addEventListener('keydown', (e) => {
        if (selectedObjects.length > 0) {
            switch(e.key.toLowerCase()) {
                case 'w': transformControls.setMode('translate'); break;
                case 'e': transformControls.setMode('rotate'); break;
                case 'r': transformControls.setMode('scale'); break;
                case 'delete':
                case 'backspace':
                    [...selectedObjects].forEach(obj => deleteObject(obj));
                    break;
            }
        }
    });

    // Panel Toggles
    const menus = [
        { btn: 'btn-home-toggle', panel: 'home-panel' },
        { btn: 'menu-design-item', panel: 'layout-panel' },
        { btn: 'btn-list', panel: 'ui-panel' },
        { btn: 'btn-open-catalog', panel: 'catalog-panel' }
    ];

    menus.forEach(menu => {
        const btn = document.getElementById(menu.btn);
        const panel = document.getElementById(menu.panel);
        if (btn && panel) {
            btn.onclick = (e) => {
                e.stopPropagation();
                const isShow = panel.classList.contains('show');
                document.querySelectorAll('.home-panel, .floating-panel, .floating-panel-right').forEach(p => p.classList.remove('show'));
                if (!isShow) panel.classList.add('show');
            };
        }
    });
    // เชื่อมปิดปุ่มปิดทุกแผง
    document.querySelectorAll('.close-btn-minimal').forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            btn.closest('.show').classList.remove('show');
        };
    });
    // เชื่อมปุ่มรีเซ็ตมุมมอง
    document.getElementById('btn-reset-view').onclick = () => {
        controls.reset();
        camera.position.set(5, 5, 8);
    };
    // เชื่อมปุ่มสร้างผนัง
    document.getElementById('btn-create-wall')?.addEventListener('click', () => {
        window.createStructure('wall');
    });

    // เชื่อมปุ่มสร้างพื้น
    document.getElementById('btn-create-room')?.addEventListener('click', () => {
        window.createStructure('floor');
    });
    // เชื่อมปุ่ม Undo
    document.getElementById('btn-undo')?.addEventListener('click', () => {
        window.undoAction();
    });

    // เชื่อมปุ่ม Redo
    document.getElementById('btn-redo')?.addEventListener('click', () => {
        window.redoAction();
    });
    // เพิ่มปุ่มลัด Keyboard สำหรับ Undo (Ctrl+Z) และ Redo (Ctrl+Y)
    window.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key.toLowerCase() === 'z') {
            e.preventDefault();
            window.undoAction();
        }
        if (e.ctrlKey && e.key.toLowerCase() === 'y') {
            e.preventDefault();
            window.redoAction();
        }
    });
    // เชื่อมปุ่มลบวัตถุที่เลือก
    const deleteToolBtn = document.getElementById('btn-delete-tool');
    if (deleteToolBtn) {
        deleteToolBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (selectedObjects.length > 0) {
                // ลบทุกวัตถุที่ถูกเลือกอยู่
                [...selectedObjects].forEach(obj => {
                    deleteObject(obj);
                });
                console.log("ลบวัตถุที่เลือกแล้ว");
            } else {
                alert("กรุณาเลือกวัตถุที่ต้องการลบ");
            }
        };
    }
}

// --- ส่วนบังคับเชื่อมต่อ UI (วางไว้ล่างสุดของไฟล์) ---

// 1. ฟังก์ชันบันทึกงาน
const saveBtn = document.getElementById('btn-save-project');
if (saveBtn) {
    saveBtn.onclick = () => {
        if (objectsInRoom.length === 0) {
            alert("ไม่มีโมเดลในห้องให้บันทึกครับ");
            return;
        }

        const projectName = prompt("กรุณาตั้งชื่อโปรเจกต์ของคุณ:", "My Design");
        if (!projectName) return;

        // ดึงสถานะปัจจุบันมาทำเป็น JSON
        const currentState = objectsInRoom.map(obj => ({
            id: obj.userData.modelId,
            name: obj.userData.name,
            thumb: obj.userData.thumb,
            pos: obj.position.clone(),
            rot: obj.rotation.y,
            scale: obj.scale.clone(),
            isStructure: obj.userData.isStructure || false
        }));

        // Get API URL from parent iframe parameters
        const queryParams = new URLSearchParams(window.location.search);
        const API_BASE_URL = queryParams.get('apiUrl') || 'http://localhost:8080/api';

        fetch(`${API_BASE_URL}/design3d/save-project`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: projectName,
                layout: JSON.stringify(currentState)
            })
        })
        .then(res => res.json())
        .then(data => alert("บันทึกสำเร็จลง MySQL แล้ว!"))
        .catch(err => alert("บันทึกไม่ได้: เช็คว่ารัน Node.js หรือยัง? (localhost:3000)"));
    };
}

// จัดการการคลิกปุ่ม เปิด/ปิด Modal
const modal = document.getElementById('project-modal');
const btnOpen = document.getElementById('btn-open-projects');
const btnClose = document.querySelector('.close-modal');

if (btnOpen) {
    btnOpen.onclick = (e) => {
        e.preventDefault();
        if (modal) {
            modal.style.setProperty("display", "flex", "important"); // บังคับเปิด
            window.fetchProjects(); // เรียกฟังก์ชันที่เราสร้างไว้ข้างบน
        }
    };
}

if (btnClose) {
    btnClose.onclick = () => {
        if (modal) modal.style.display = 'none';
    };
}

// --- 10. SYSTEM ---

function captureState() {
    const state = objectsInRoom.map(obj => ({
        id: obj.userData.modelId,
        pos: obj.position.clone(),
        rot: obj.rotation.y,
        scale: obj.scale.clone()
    }));
    historyStack.push(JSON.stringify(state));
    if (historyStack.length > 20) historyStack.shift();
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ฟังก์ชันบันทึกสถานะ (เรียกใช้เมื่อมีการขยับ/เพิ่ม/ลบ ของ)
window.captureState = function() {
    const state = objectsInRoom.map(obj => ({
        id: obj.userData.modelId,
        name: obj.userData.name,
        thumb: obj.userData.thumb,
        pos: obj.position.clone(),
        rot: obj.rotation.y,
        scale: obj.scale.clone(),
        isStructure: obj.userData.isStructure || false
    }));
    
    historyStack.push(JSON.stringify(state));
    redoStack = []; // ล้าง Redo ทุกครั้งที่มีการกระทำใหม่
    
    if (historyStack.length > 30) historyStack.shift(); 
};

// ฟังก์ชัน Undo
window.undoAction = function() {
    if (historyStack.length <= 1) return;
    const currentState = historyStack.pop();
    redoStack.push(currentState);
    const prevState = historyStack[historyStack.length - 1];
    window.restoreState(prevState);
};

// ฟังก์ชัน Redo
window.redoAction = function() {
    if (redoStack.length === 0) return;
    const nextState = redoStack.pop();
    historyStack.push(nextState);
    window.restoreState(nextState);
};

// --- ฟังก์ชันสำหรับโหลด Layout กลับเข้า Scene ---
window.restoreState = function(jsonState) {
    if (!jsonState) return;
    const state = JSON.parse(jsonState);

    // ลบวัตถุปัจจุบันทั้งหมด (ใช้ window.scene เพื่อความชัวร์)
    [...objectsInRoom].forEach(obj => {
        window.scene.remove(obj);
    });
    objectsInRoom = [];

    // สร้างวัตถุกลับคืนมา
    state.forEach(item => {
        if (item.isStructure) {
            let geometry, material;
            if (item.id === 'custom_wall') {
                geometry = new THREE.BoxGeometry(4, 2.5, 0.2);
                material = new THREE.MeshStandardMaterial({ color: 0xcccccc });
            } else {
                geometry = new THREE.BoxGeometry(5, 0.1, 5);
                material = new THREE.MeshStandardMaterial({ color: 0x444444 });
            }
            const mesh = new THREE.Mesh(geometry, material);
            mesh.userData = { 
                name: item.name, 
                modelId: item.id, 
                isRoot: true, 
                isStructure: true, 
                thumb: item.thumb 
            };
            mesh.position.copy(item.pos);
            mesh.rotation.y = item.rot;
            mesh.scale.copy(item.scale);
            window.scene.add(mesh);
            objectsInRoom.push(mesh);
        } else {
            // เรียก addModel โดยตรง (ต้องแน่ใจว่า addModel ถูกประกาศไว้ก่อนหน้านี้)
            if (typeof window.addModel === 'function') {
                window.addModel(item.id, item.pos, item.rot, item.scale);
                if (typeof historyStack !== 'undefined') historyStack.pop(); 
            }
        }
    });

    // อัปเดตสถานะ UI และ Controls
    if (typeof dControls !== 'undefined') dControls.objects = objectsInRoom;
    if (typeof transformControls !== 'undefined') transformControls.detach();
    if (typeof updateInventoryUI === 'function') updateInventoryUI();
};

// --- 2. ส่วนจัดการ UI และ Modal ---
window.addEventListener('load', () => {
    console.log("DOM Loaded - Starting UI Bindings...");
    const btnOpen = document.getElementById('btn-open-projects');
    const modal = document.getElementById('project-modal');
    const saveBtn = document.getElementById('btn-save-project');

    if (btnOpen && modal) {
        btnOpen.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.setProperty("display", "flex", "important");
            if (typeof window.fetchProjects === "function") window.fetchProjects();
        });
    }

    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            console.log("บันทึกโปรเจกต์...");
            // ใส่โค้ดบันทึกงานของหนูที่นี่จ้ะ
        });
    }

    const closeBtn = document.querySelector('.close-modal');
    if (closeBtn && modal) {
        closeBtn.onclick = () => modal.style.display = 'none';
    }
});

// --- 3. ส่วนจัดการโปรเจกต์ (Database) ---
window.fetchProjects = function() {
    const container = document.getElementById('project-list-container');
    if (!container) return;
    
    container.innerHTML = '<div style="text-align:center; color:#71717a; padding:20px;">กำลังดึงข้อมูล...</div>';
    
    // Get API URL from parent iframe parameters
    const queryParams = new URLSearchParams(window.location.search);
    const API_BASE_URL = queryParams.get('apiUrl') || 'http://localhost:8080/api';
    
    fetch(`${API_BASE_URL}/design3d/projects`)
        .then(res => res.json())
        .then(projects => {
            console.log("Projects loaded:", projects); // เช็กข้อมูลที่ได้จาก DB
            if (!projects || projects.length === 0) {
                container.innerHTML = '<p style="text-align:center; color:#71717a; padding:20px;">ไม่พบรายการโปรเจกต์</p>';
                return;
            }
            container.innerHTML = projects.map(p => `
                <div class="project-card" style="background: rgba(39, 39, 42, 0.6); backdrop-filter: blur(5px); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 14px 18px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; transition: all 0.3s ease;">
                    <div class="project-info">
                        <strong style="color: white; display: block; font-size: 14px; margin-bottom: 4px;">${p.project_name}</strong>
                        <small style="color: #71717a; font-size: 11px;">${new Date(p.created_at).toLocaleString('th-TH')}</small>
                    </div>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <!-- ตรวจสอบว่า p.id มีค่าจริงไหม -->
                        <button onclick="window.loadProject(${p.id})" 
                                style="background: #a855f7; color: white; border: none; width: 70px; height: 34px; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 500;">
                            โหลด
                        </button>
                        <button onclick="window.deleteProject(${p.id})" 
                                style="background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); width: 60px; height: 34px; border-radius: 8px; cursor: pointer; font-size: 13px;">
                            ลบ
                        </button>
                    </div>
                </div>
            `).join('');
        })
        .catch(err => {
            console.error("Fetch Error:", err);
            container.innerHTML = '<p style="color:#ef4444; text-align:center;">เชื่อมต่อ Database ไม่ได้</p>';
        });
};

window.loadProject = function(id) {
    console.log("กำลังโหลดโปรเจกต์ ID:", id);
    
    // Get API URL from parent iframe parameters
    const queryParams = new URLSearchParams(window.location.search);
    const API_BASE_URL = queryParams.get('apiUrl') || 'http://localhost:8080/api';

    fetch(`${API_BASE_URL}/design3d/projects/${id}`)
        .then(res => res.json())
        .then(project => {
            if (project && project.layout_data) {
                // ข้อมูลที่ดึงมาจาก Database คือ project.layout_data
                // ส่งต่อไปให้ฟังก์ชัน restoreState ทำงาน
                if (typeof window.restoreState === "function") {
                    
                    // --- จุดสำคัญ ---
                    // ถ้าใน database เก็บเป็น String (JSON) ให้ส่งเข้าไปเลย
                    // เพราะใน restoreState ของคุณมี JSON.parse(jsonState) อยู่แล้ว
                    window.restoreState(project.layout_data); 
                    
                    console.log("โหลด Layout สำเร็จ!");
                    
                    // ปิด Modal รายชื่อโปรเจกต์ (ถ้ามี)
                    const modal = document.getElementById('project-modal');
                    if(modal) modal.style.display = 'none';
                    
                } else {
                    console.error("หาฟังก์ชัน window.restoreState ไม่เจอ!");
                }
            }
        })
        .catch(err => {
            console.error("Error loading project detail:", err);
            alert("เกิดข้อผิดพลาดในการดึงข้อมูลจาก Server");
        });
};

window.deleteProject = async function(id) {
    // Get API URL from parent iframe parameters
    const queryParams = new URLSearchParams(window.location.search);
    const API_BASE_URL = queryParams.get('apiUrl') || 'http://localhost:8080/api';

    if (confirm("ต้องการลบโปรเจกต์นี้ใช่ไหม?")) {
        try {
            const res = await fetch(`${API_BASE_URL}/design3d/projects/${id}`, { method: 'DELETE' });
            if (res.ok) { alert("ลบสำเร็จ!"); window.fetchProjects(); }
        } catch (e) { alert("ลบไม่สำเร็จจ้ะ"); }
    }
};
window.loadModelFromWeb = function(modelPath) {
    console.log("กำลังโหลดโมเดล:", modelPath);
    if (!window.scene) return;

    const loader = new GLTFLoader();
    loader.load(modelPath, function (gltf) {
        const model = gltf.scene;

        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        console.log("ขนาดก่อนปรับ:", size);
        
        // --- การปรับขนาด (Scale) แยกตามประเภท ---
        let targetScale = 0.5; // สเกลเริ่มต้น (สำหรับประตู)
        let posY = 0;

        // ถ้าชื่อไฟล์มีคำว่า window ให้ปรับให้เล็กลงอีก
        if (modelPath.toLowerCase().includes('window')) {
            targetScale = 0.1; // ปรับหน้าต่างให้เล็กลงกว่าประตู
        }

        model.scale.set(targetScale, targetScale, targetScale); 

        // --- ตั้งค่าพื้นฐานและตำแหน่ง ---
        model.position.set(0, 1, 0); // ยกขึ้นจากพื้น 1 เมตร (สำหรับหน้าต่าง)
        

        if (modelPath.toLowerCase().includes('door')) {
            model.position.y = 0; 
        }

        model.userData.isRoot = true; 
        model.userData.modelId = modelPath;
        model.name = "WebLoadedModel_" + Date.now(); 

        window.scene.add(model);

        // --- 3. เชื่อมกับระบบขยับ (Drag & Transform) ---
        if (typeof objectsInRoom !== 'undefined') {
            objectsInRoom.push(model); 
            if (typeof dControls !== 'undefined') {
                dControls.objects = objectsInRoom; 
            }
        }

        // --- 4. บันทึกประวัติ ---
        if (typeof captureState === 'function') captureState();

        console.log(`โหลด ${modelPath.includes('window') ? 'หน้าต่าง' : 'ประตู'} สำเร็จ! สเกล: ${targetScale}`);
// --- 4. ฟังก์ชันโหลดโมเดลประตู/หน้าต่าง ---

    }, 
    undefined, 
    function (error) {
        console.error("เกิดข้อผิดพลาดในการโหลดโมเดล:", error);

function clearScene(obj) {
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) {
        if (Array.isArray(obj.material)) {
            obj.material.forEach(m => m.dispose());
        } else {
            obj.material.dispose();
        }
    }
    scene.remove(obj);
}
    }, undefined, function (error) {
        console.error("โหลดไม่สำเร็จ:", error);
    });
};


// --- 5. เริ่มรันระบบ ---
if (typeof setupUIListeners === 'function') setupUIListeners();
if (typeof window.updateModelCatalog === 'function') window.updateModelCatalog();
if (typeof animate === 'function') animate();