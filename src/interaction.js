import * as THREE from 'three';

export class InteractionManager {
  constructor(scene, camera, domElement, cameraRig, onOpenModal, onSwitchWaypoint) {
    this.scene = scene;
    this.camera = camera;
    this.domElement = domElement;
    this.cameraRig = cameraRig;
    this.onOpenModal = onOpenModal;
    this.onSwitchWaypoint = onSwitchWaypoint;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(-999, -999);
    this.interactiveTargets = [];
    this.raycastColliders = [];
    this.hoveredTarget = null;
    this.isOverUI = false;
    this.mouseDirty = false;

    this.tooltipEl = document.getElementById('object-tooltip');
    this.tooltipText = document.getElementById('tooltip-text');

    this.bindEvents();
  }

  registerTarget(object, data) {
    const targetData = { ...object.userData, ...data, isInteractive: true };
    object.userData = targetData;
    
    // If a lightweight proxy collider exists on the object, raycast against it directly
    const collider = object.userData.collider || object;
    collider.userData = targetData;
    
    this.interactiveTargets.push(object);
    this.raycastColliders.push(collider);
  }

  bindEvents() {
    const isPointerOverUI = (e) => {
      const target = e.target;
      if (!target) return false;

      // Efficient check against UI overlay elements without triggering layout reflow
      const element = (target instanceof Element) ? target : target.parentElement;
      if (element && typeof element.closest === 'function') {
        if (element.closest('.bottom-dock, .top-bar, .modal-backdrop, .modal-container, .modal-overlay, .hud-btn, .audio-control-cluster, .audio-volume-panel, .audio-mixer-panel, button, a, input, textarea')) {
          return true;
        }
      }

      return false;
    };

    window.addEventListener('mousemove', (e) => {
      if (isPointerOverUI(e)) {
        this.isOverUI = true;
        this.mouse.set(-999, -999);
        if (this.hoveredTarget) {
          this.hoveredTarget = null;
          this.domElement.style.cursor = 'default';
        }
        if (this.tooltipEl) {
          this.tooltipEl.classList.add('hidden');
        }
        return;
      }

      this.isOverUI = false;
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      if (this.tooltipEl && !this.tooltipEl.classList.contains('hidden')) {
        this.tooltipEl.style.left = `${e.clientX}px`;
        this.tooltipEl.style.top = `${e.clientY}px`;
      }
    });

    window.addEventListener('mouseleave', () => {
      this.isOverUI = true;
      this.mouse.set(-999, -999);
      if (this.hoveredTarget) {
        this.hoveredTarget = null;
        this.domElement.style.cursor = 'default';
      }
      if (this.tooltipEl) {
        this.tooltipEl.classList.add('hidden');
      }
    });

    this.domElement.addEventListener('click', () => {
      if (this.isOverUI || !this.hoveredTarget) return;

      const { waypointIndex, modalId, onClick } = this.hoveredTarget.userData;
      
      if (typeof onClick === 'function') {
        onClick();
      }

      if (typeof waypointIndex === 'number') {
        if (this.onSwitchWaypoint) {
          this.onSwitchWaypoint(waypointIndex);
        } else if (this.cameraRig) {
          this.cameraRig.goToWaypoint(waypointIndex);
        }
      }

      if (modalId && this.onOpenModal) {
        setTimeout(() => {
          this.onOpenModal(modalId);
        }, 350);
      }
    });
  }

  update() {
    if (this.isOverUI || !this.interactiveTargets.length) {
      if (this.hoveredTarget) {
        this.hoveredTarget = null;
        this.domElement.style.cursor = 'default';
        if (this.tooltipEl) {
          this.tooltipEl.classList.add('hidden');
        }
      }
      return;
    }

    this.raycaster.setFromCamera(this.mouse, this.camera);
    // Raycast against proxy colliders or target meshes
    const targetsToTest = this.raycastColliders.length ? this.raycastColliders : this.interactiveTargets;
    const intersects = this.raycaster.intersectObjects(targetsToTest, true);

    if (intersects.length > 0) {
      let targetInteractive = null;

      for (let i = 0; i < intersects.length; i++) {
        let obj = intersects[i].object;
        while (obj && !obj.userData.isInteractive && obj.parent) {
          obj = obj.parent;
        }
        if (obj && obj.userData.isInteractive) {
          // Priority to dedicated sub-features like signalTower over parent cabin
          if (obj.userData.id === 'signalTower') {
            targetInteractive = obj;
            break;
          }
          if (!targetInteractive) {
            targetInteractive = obj;
          }
        }
      }

      if (targetInteractive) {
        if (this.hoveredTarget !== targetInteractive) {
          this.hoveredTarget = targetInteractive;
          this.domElement.style.cursor = 'pointer';
          if (this.tooltipEl && this.tooltipText) {
            this.tooltipText.textContent = targetInteractive.userData.label || 'Click to Inspect';
            this.tooltipEl.classList.remove('hidden');
          }
        }
        return;
      }
    }

    if (this.hoveredTarget) {
      this.hoveredTarget = null;
      this.domElement.style.cursor = 'default';
      if (this.tooltipEl) {
        this.tooltipEl.classList.add('hidden');
      }
    }
  }
}
