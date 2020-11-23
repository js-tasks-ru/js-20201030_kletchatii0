const getTpl = (text = '') => `<div class="tooltip">${text}</div>`;

class Tooltip {
  listenersRemovers = [];
  render(text) {
    const ctnr = document.createElement('div');
    ctnr.innerHTML = getTpl(text);
    this.element = ctnr.firstElementChild;
  }

  initialize() {
    const onPointerOut = (event) => {
      const tooltipTarget = event.target.closest('[data-tooltip]');
      if (tooltipTarget)
        this.element.remove();
    };
    document.body.addEventListener('pointerout', onPointerOut, true);
    this.listenersRemovers.push(() => document.body.removeEventListener('pointerout', onPointerOut));

    const onMouseMove = (event) => {
      const tooltipTarget = event.target.closest('[data-tooltip]');
      if (!tooltipTarget) return;
      this.element.style.top = event.clientY + 5 + 'px';
      this.element.style.left = event.clientX + 5 + 'px';
    };
    document.body.addEventListener('mousemove', onMouseMove);
    this.listenersRemovers.push(() => document.body.removeEventListener('mousemove', onMouseMove));

    const onPointerOver = (event) => {
      const tooltipTarget = event.target.closest('[data-tooltip]');
      if (!tooltipTarget) return;
      this.render(tooltipTarget.dataset.tooltip);
      document.body.append(this.element);
    };
    document.body.addEventListener('pointerover', onPointerOver);
    this.listenersRemovers.push(() => document.body.removeEventListener('pointerover', onPointerOver));
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.listenersRemovers.forEach((rm) => rm());
    this.remove();
  }
}

const tooltip = new Tooltip();

export default tooltip;
