export class Input {
  constructor(container) {
    this.container = container;
    this.keys = new Set();
    this.pointer = { x: 480, y: 270 };
    this.queued = {
      light: false,
      heavy: false,
      q: false,
      dodge: false,
      heal: false,
    };

    window.addEventListener('keydown', (event) => this.handleKeyDown(event));
    window.addEventListener('keyup', (event) => this.keys.delete(event.code));
    container.addEventListener('pointermove', (event) => this.updatePointer(event));
    container.addEventListener('pointerdown', (event) => this.handlePointerDown(event));
    container.addEventListener('contextmenu', (event) => event.preventDefault());
  }

  getMovement() {
    const x = (this.keys.has('KeyD') ? 1 : 0) - (this.keys.has('KeyA') ? 1 : 0);
    const y = (this.keys.has('KeyS') ? 1 : 0) - (this.keys.has('KeyW') ? 1 : 0);
    const length = Math.hypot(x, y);
    return length > 0 ? { x: x / length, y: y / length } : { x: 0, y: 0 };
  }

  consume(action) {
    const active = this.queued[action];
    this.queued[action] = false;
    return active;
  }

  updatePointer(event) {
    const rect = this.container.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 960;
    this.pointer.y = ((event.clientY - rect.top) / rect.height) * 540;
  }

  handlePointerDown(event) {
    this.updatePointer(event);
    if (event.button === 0) this.queued.light = true;
    if (event.button === 2) this.queued.heavy = true;
  }

  handleKeyDown(event) {
    this.keys.add(event.code);
    if (event.repeat) return;

    if (event.code === 'KeyQ') this.queued.q = true;
    if (event.code === 'Space') {
      event.preventDefault();
      this.queued.dodge = true;
    }
    if (event.code === 'KeyR') this.queued.heal = true;
  }
}
