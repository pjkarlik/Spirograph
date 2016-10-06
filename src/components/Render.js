// Render Class //
export default class Render {
  constructor(element) {
    // var setup
    this.element = element;
    this.canvas = this.createCanvas('canvas');
    this.operation = ['xor', 'lighter', 'darken', 'multiply', 'screen', 'overlay', 'difference',
      'exclusion', 'source-over', 'destination-out', 'color-dodge', 'soft-light', 'none'];
    // bind Functions
    this.renderLoop = this.renderLoop.bind(this);
    this.resetCircle = this.resetCircle.bind(this);
    this.setViewport = this.setViewport.bind(this);
    this.resetCanvas = this.resetCanvas.bind(this);
    // window resize listener
    window.addEventListener('resize', this.resetCanvas);
    // Set Origin Circle and start to renderLoop
    this.resetCircle();
  }

  setViewport(element) {
    const canvasElement = element;
    const width = ~~(document.documentElement.clientWidth, window.innerWidth || 0);
    const height = ~~(document.documentElement.clientHeight, window.innerHeight || 0);
    this.width = width;
    this.height = height;
    canvasElement.width = this.width;
    canvasElement.height = this.height;
    this.viewport = {
      x: this.width / 2,
      y: this.height / 2,
    };
  }

  createCanvas(name) {
    const canvasElement = document.createElement('canvas');
    canvasElement.id = name;
    this.setViewport(canvasElement);
    this.element.appendChild(canvasElement);
    this.surface = canvasElement.getContext('2d');
    this.surface.lineCap = 'round';
    this.surface.scale(1, 1);
    return canvasElement;
  }

  resetCanvas() {
    window.cancelAnimationFrame(this.animation);
    this.setViewport(this.canvas);
    this.surface.clearRect(0, 0, this.width, this.height);
    this.resetCircle();
  }

  resetCircle() {
    this.lastPosition = null;
    this.parentRadius = ~~(Math.min(this.width, this.height) / 2) - 250;
    this.baseSub = 15;
    this.subRadius = -this.baseSub;
    this.drawArm = 100;
    this.arc = this.parentRadius + this.drawArm;
    this.delta = 4 / this.arc;
    this.theta = 0;
    this.phi = 0;
    this.renderLoop();
  }

  renderLoop() {
    const position = [
      this.viewport.x - (this.arc * Math.cos(this.theta) + this.drawArm * Math.cos(this.phi)),
      this.viewport.y - (this.arc * Math.sin(this.theta) + this.drawArm * Math.sin(this.phi)),
    ];

    if (this.lastPosition) {
      const color = `hsl(${this.theta / Math.PI * 180},50%,50%)`;
      this.surface.beginPath();
      this.surface.moveTo(...this.lastPosition);
      this.surface.lineTo(...position);
      this.surface.strokeStyle = color;
      this.surface.stroke();
    }

    this.lastPosition = position;
    this.theta += this.delta;
    this.theta %= 12 * Math.PI;
    this.phi += (this.parentRadius / this.subRadius) * this.delta;
    // this.phi %= 2 * Math.PI;

    this.animation = window.requestAnimationFrame(this.renderLoop);
  }
}
