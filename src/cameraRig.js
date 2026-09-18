import * as THREE from 'three';
import gsap from 'gsap';

export class CameraRig {
  constructor(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;

    // Initial Establishing Coordinates
    this.currentPos = new THREE.Vector3(14, 11.5, 17);
    this.currentTarget = new THREE.Vector3(-1.5, 7.8, 0);

    // Dynamic offsets for mouse parallax and idle floating drift
    this.mouseTarget = new THREE.Vector2(0, 0);
    this.mouseCurrent = new THREE.Vector2(0, 0);
    this.idleTime = 0;

    // Setup initial camera state
    this.camera.position.copy(this.currentPos);
    this.camera.lookAt(this.currentTarget);

    // Reusable vectors for zero-allocation per-frame camera updates
    this._finalPos = new THREE.Vector3();
    this._finalTarget = new THREE.Vector3();

    // 4 Carefully Tuned Waypoints
    this.waypoints = [
      {
        id: 0,
        tag: 'WAYPOINT 01',
        title: 'The Mountain Summit',
        desc: 'High-altitude overlook above the pine valley. A quiet mountain retreat where creative engineering, AI agents, and local-first software take shape.',
        meta: ['📍 Panoramic Valley View', '✨ Crescent Moon & Stars', '🌲 5,800+ Pines & Alpine Flora'],
        position: new THREE.Vector3(14, 11.5, 17),
        target: new THREE.Vector3(-1.5, 7.8, 0),
        fov: 50
      },
      {
        id: 1,
        tag: 'WAYPOINT 02',
        title: 'The Cabin Workspace',
        desc: 'The cozy timber retreat where projects come to life. Featuring Gemini-Discord-Bot (100+ stars), opendroid_remote (browser WebUSB client), and real-time AI tools.',
        meta: ['☕ Steaming Porch Mug', '💡 Warm Amber Lantern', '🔥 Interlocking Cedar Logs'],
        position: new THREE.Vector3(-0.2, 9.75, 5.8),
        target: new THREE.Vector3(-1.7, 8.85, 0.9),
        fov: 46
      },
      {
        id: 2,
        tag: 'WAYPOINT 03',
        title: 'The Cliffside Campfire',
        desc: 'Crackling fire on the edge of the world. Built by Riddhiman Kundal, 1st year engineering student at Thapar University. Driven by lightweight, privacy-focused, local-first engineering.',
        meta: ['🔥 Stone Fire Pit', '🪵 Split-Log Bench', '✨ Floating Embers', '🏮 Lit Oil Lantern'],
        position: new THREE.Vector3(6.4, 8.7, 4.5),
        target: new THREE.Vector3(2.5, 7.3, 2.3),
        fov: 46
      },
      {
        id: 3,
        tag: 'WAYPOINT 04',
        title: 'The Signal Tower',
        desc: 'Broadcasting from the mountain crest. Connect on GitHub (@hihumanzone), LinkedIn, or reach out directly at riddhiman2372007@gmail.com.',
        meta: ['📡 Beacon Antenna', '📫 Direct Channels', '🌌 Deep Starlight'],
        position: new THREE.Vector3(1.8, 14.2, 5.5),
        target: new THREE.Vector3(-0.8, 13.8, -1.4),
        fov: 50
      }
    ];

    this.activeWaypointIndex = 0;
    this.isTransitioning = false;

    this.bindEvents();
  }

  bindEvents() {
    window.addEventListener('mousemove', (e) => {
      this.mouseTarget.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouseTarget.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        this.mouseTarget.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        this.mouseTarget.y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
      }
    }, { passive: true });
  }

  goToWaypoint(index, onComplete) {
    if (index < 0 || index >= this.waypoints.length) return;
    this.activeWaypointIndex = index;
    const wp = this.waypoints[index];

    this.isTransitioning = true;

    gsap.killTweensOf(this.currentPos);
    gsap.killTweensOf(this.currentTarget);
    gsap.killTweensOf(this.camera);

    const duration = 2.2;
    const ease = 'power3.inOut';

    gsap.to(this.currentPos, {
      x: wp.position.x,
      y: wp.position.y,
      z: wp.position.z,
      duration: duration,
      ease: ease
    });

    gsap.to(this.currentTarget, {
      x: wp.target.x,
      y: wp.target.y,
      z: wp.target.z,
      duration: duration,
      ease: ease
    });

    gsap.to(this.camera, {
      fov: wp.fov,
      duration: duration,
      ease: ease,
      onUpdate: () => this.camera.updateProjectionMatrix(),
      onComplete: () => {
        this.isTransitioning = false;
        if (onComplete) onComplete(wp);
      }
    });
  }

  update(delta) {
    this.idleTime += delta;

    this.mouseCurrent.x += (this.mouseTarget.x - this.mouseCurrent.x) * 0.04;
    this.mouseCurrent.y += (this.mouseTarget.y - this.mouseCurrent.y) * 0.04;

    const driftX = Math.sin(this.idleTime * 0.4) * 0.25;
    const driftY = Math.cos(this.idleTime * 0.3) * 0.18;

    this._finalPos.set(
      this.currentPos.x + this.mouseCurrent.x * 0.6 + driftX,
      this.currentPos.y + this.mouseCurrent.y * 0.4 + driftY,
      this.currentPos.z + this.mouseCurrent.x * 0.3
    );

    this._finalTarget.set(
      this.currentTarget.x + this.mouseCurrent.x * 0.2,
      this.currentTarget.y + this.mouseCurrent.y * 0.15,
      this.currentTarget.z
    );

    this.camera.position.copy(this._finalPos);
    this.camera.lookAt(this._finalTarget);
  }
}
