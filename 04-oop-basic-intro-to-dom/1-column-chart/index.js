export default class ColumnChart {
  /** @type {HTMLElement} */
  element = null;
  chartHeight = 50;

  tpl = `
  <div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
      <div class="column-chart__title">
        Total ${this.label}
        ${this.getLink()}
      </div>
      <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">
          ${this.value}
        </div>
        <div data-element="body" class="column-chart__chart">
          ${this.getColumnBody(this.data)}
        </div>
      </div>
   </div>
`;

  /**
   * Column Chart
   * @param props {Object}
   * @param props.label {string} - chart label
   * @param props.value {string} - chart value
   * @param props.data {Number[]} - data to be presented
   * @param props.link {string} - link to more info
   */
  constructor(props = {}) {
    this.props = props;
    this.render();
  }

  render() {
    const {label = '', value = '', data = [], link = ''} = this.props;
    this.element = elem({
      tag: 'div', classNames: ['column-chart', 'column-chart_loading'],
      styleCssText: '--chart-height: ' + this.chartHeight
    });
    this.title = elem({
      tag: 'div', classNames: 'column-chart__title',
      textContent: label ? label[0].toLocaleUpperCase() + label.slice(1) : '',
    });
    this.container = elem({tag: 'div', classNames: 'column-chart__container'});
    this.chartHeader = elem({tag: 'div', classNames: 'column-chart__header', textContent: value});
    this.chart = elem({tag: 'div', classNames: 'column-chart__chart'});
    this.link = elem({
      tag: 'a', classNames: 'column-chart__link',
      attributes: {href: link, rel: 'noopener noreferrer'},
      textContent: 'View all',
    });
    if (link) {
      this.title.append(this.link);
    }
    this.buildBars(data);

    this.element.append(this.title);
    this.element.append(this.container);
    this.container.append(this.chartHeader);
    this.container.append(this.chart);
  }

  buildBars(data) {
    if (!data.length) return;
    this.element.classList.remove('column-chart_loading');
    const maxVal = Math.max(...data);
    const scale = this.chartHeight / maxVal;
    data.forEach((val, i) => {
      let bar = this.chart.children[i];
      if (!bar) {
        bar = document.createElement('div');
        this.chart.append(bar);
      }
      bar.style.cssText = '--value: ' + Math.floor(val * scale);
      bar.dataset['tooltip'] = (val / maxVal * 100).toFixed(0) + '%';
    });
    let diff = Math.abs(data.length - this.chart.children.length);
    if (diff !== 0) {
      [].slice.call(this.chart.children, -diff).forEach(c => c.remove());
    }
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

  update(data) {
    this.buildBars(data);
  }
}

/**
 * Create element with given class names
 * @param stag {String}
 * @param classNames {String|String[]}
 * @return {HTMLElement}
 */
function elem({
                tag = '', classNames = [], textContent = '',
                attributes = {}, styleCssText = ''
              }) {
  if (!Array.isArray(classNames)) classNames = [classNames];
  const elem = document.createElement(tag);
  elem.classList.add(...classNames);
  for (const [key, val] of Object.entries(attributes)) {
    elem.setAttribute(key, val);
  }
  elem.textContent = textContent;
  elem.style.cssText = styleCssText;
  return elem;
}
