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
    this._tooltipHidden = true;
    this._lastTooltipX = 0;
    this._lastTooltipY = 0;
    this._pendingMouseX = 0;
    this._pendingMouseY = 0;
    this._hasPendingMouse = false;

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
        this.mouseDirty = true;
        if (this.hoveredTarget) {
          this.hoveredTarget = null;
          this.domElement.style.cursor = 'default';
        }
        if (this.tooltipEl && !this._tooltipHidden) {
          this.tooltipEl.classList.add('hidden');
          this._tooltipHidden = true;
        }
        return;
      }

      this.isOverUI = false;
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      this.mouseDirty = true;

      // Defer tooltip positioning to update() via transform (no layout thrash)
      this._pendingMouseX = e.clientX;
      this._pendingMouseY = e.clientY;
      this._hasPendingMouse = true;
    }, { passive: true });

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
    // Coalesce tooltip positioning to one style write per frame (was per-mousemove)
    if (this.tooltipEl && !this._tooltipHidden && this._hasPendingMouse) {
      this._hasPendingMouse = false;
      if (this._pendingMouseX !== this._lastTooltipX || this._pendingMouseY !== this._lastTooltipY) {
        this._lastTooltipX = this._pendingMouseX;
        this._lastTooltipY = this._pendingMouseY;
        this.tooltipEl.style.left = `${this._lastTooltipX}px`;
        this.tooltipEl.style.top = `${this._lastTooltipY}px`;
      }
    }

    // Skip raycast when pointer hasn't moved and hover state is settled
    if (!this.mouseDirty) return;
    this.mouseDirty = false;

    if (this.isOverUI || !this.interactiveTargets.length) {
      if (this.hoveredTarget) {
        this.hoveredTarget = null;
        this.domElement.style.cursor = 'default';
        if (this.tooltipEl && !this._tooltipHidden) {
          this.tooltipEl.classList.add('hidden');
          this._tooltipHidden = true;
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
            if (this._tooltipHidden) {
              this.tooltipEl.classList.remove('hidden');
              this._tooltipHidden = false;
            }
          }
        }
        return;
      }
    }

    if (this.hoveredTarget) {
      this.hoveredTarget = null;
      this.domElement.style.cursor = 'default';
      if (this.tooltipEl && !this._tooltipHidden) {
        this.tooltipEl.classList.add('hidden');
        this._tooltipHidden = true;
      }
    }
  }
}
