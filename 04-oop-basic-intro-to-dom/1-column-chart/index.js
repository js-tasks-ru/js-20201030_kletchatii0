const getTpl = ({chartHeight, label, link, value, data = []}) => `
  <div class="column-chart ${data.length ? '' : 'column-chart_loading'}" style="--chart-height: ${chartHeight}">
      <div class="column-chart__title">
        Total ${label}
        ${link ?
        `<a class="column-chart__link" href="${link}">View all</a>` :
        ''}
      </div>
      <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">
          ${value}
        </div>
        <div data-element="body" class="column-chart__chart">
          ${data.map((data) => `<div style="--value: ${data.value}" data-tooltip="${data.tooltip}"></div>`).join('')}
        </div>
      </div>
   </div>
`;

export default class ColumnChart {
  /** @type {HTMLElement} */
  element = null;
  chartHeight = 50;

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
    const cntr = document.createElement('div');
    cntr.innerHTML = getTpl({label, value, data: this.buildBarsData(data), link, chartHeight: this.chartHeight});
    this.element = cntr.firstElementChild;
  }

  buildBarsData(data) {
    if (!data.length) return [];
    const maxVal = Math.max(...data);
    const scale = this.chartHeight / maxVal;
    return data.map((val) => {
      return {
        value: Math.floor(val * scale),
        tooltip: (val / maxVal * 100).toFixed(0) + '%',
      }
    });
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

  update(data) {
    this.props.data = data;
    this.render();
  }
}
