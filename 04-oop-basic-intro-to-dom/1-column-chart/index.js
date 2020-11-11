export default class ColumnChart {
  element = null;

  constructor({data = [], label = '', link = '', value = null}) {
    const element = document.createElement('div');
    element.classList.add('column-chart');
    const title = document.createElement('div');
    title.classList.add('column-chart__title');
    const container = document.createElement('div');
    container.classList.add('column-chart__container');
    const chartHeader = document.createElement('div');
    chartHeader.classList.add('column-chart__header');
    const chart = document.createElement('div');
    chart.classList.add('column-chart__chart');
    this.chart = chart;
    this.element = element;

    if (label) title.textContent = label;
    if (value) chartHeader.textContent = value;
    this.buildBars(data);

    element.append(title)
    element.append(container);
    container.append(chartHeader);
    container.append(chart);
  }

  buildBars(data) {
    [].slice.call(this.chart.children).forEach(elem => elem.remove());
    const bar = document.createElement('div');
    bar.style.cssText = '--value: 0';
    bar.dataset['tooltip'] = '0%';
    const coef = 50 / Math.max(...data);
    data.forEach((val) => {
      let nextBar = bar.cloneNode();
      nextBar.style.cssText = '--value: ' + (val * coef);
      nextBar.dataset['tooltip'] = val + '%';
      this.chart.append(nextBar);
    });
  }

  remove() {
    this.element.remove();
  }

  destroy() {

  }

  update(data) {
    this.buildBars(data);
  }
}
/*
<div class="column-chart">
      <div class="column-chart__title">
        Total orders
        <a href="/sales" class="column-chart__link">View all</a>
      </div>
      <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">344</div>
        <div data-element="body" class="column-chart__chart">
          <div style="--value: 2" data-tooltip="6%"></div>
          <div style="--value: 22" data-tooltip="44%"></div>
          <div style="--value: 5" data-tooltip="11%"></div>
          <div style="--value: 50" data-tooltip="100%"></div>
          <div style="--value: 12" data-tooltip="25%"></div>
          <div style="--value: 4" data-tooltip="8%"></div>
          <div style="--value: 13" data-tooltip="28%"></div>
          <div style="--value: 5" data-tooltip="11%"></div>
          <div style="--value: 23" data-tooltip="47%"></div>
          <div style="--value: 12" data-tooltip="25%"></div>
          <div style="--value: 34" data-tooltip="69%"></div>
          <div style="--value: 1" data-tooltip="3%"></div>
          <div style="--value: 23" data-tooltip="47%"></div>
          <div style="--value: 27" data-tooltip="56%"></div>
          <div style="--value: 2" data-tooltip="6%"></div>
          <div style="--value: 1" data-tooltip="3%"></div>
        </div>
     </div>
</div>
    */
