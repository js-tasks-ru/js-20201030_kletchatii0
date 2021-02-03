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
          ${data.map((data) => `<div style="--value: ${data._value}" data-tooltip="${data.tooltip}"></div>`).join('')}
        </div>
      </div>
   </div>
`;

// api/dashboard/orders?from=2020-10-31T16%3A20%3A06.093Z&to=2020-11-30T16%3A20%3A06.093Z
const API_URL = 'https://course-js.javascript.ru/';

export default class ColumnChart {
  /** @type {HTMLElement} */
  element = null;
  chartHeight = 50;
  subElements = {};
  log = () => {
  };

  /**
   * Column Chart
   * @param props {Object}
   * @param props.label {string} - chart label
   * @param props.url {string} - api url
   * @param props.value {string} - chart value
   * @param props.link {string} - link to more info
   * @param props.range {Object} - date range
   * @param props.range.from {string} - date string
   * @param props.range.to {string} - date string
   */
  constructor(props = {}) {
    if (props.range) {
      this.from = props.range.from;
      this.to = props.range.to;
    }
    this.url = props.url;
    this.label = props.label;
    this.link = props.link;
    this.render();
    this.loadData();
  }

  render() {
    const {label = '', value = '', data = [], link = ''} = this;
    let cntr = document.createElement('div');
    let prepData = this.buildBarsData(data);
    cntr.innerHTML = getTpl({label, value, data: prepData, link, chartHeight: this.chartHeight})
    let element = cntr.firstElementChild;
    if (this.element) {
      let parent = this.element.parentElement;
      parent.innerHTML = '';
      parent.append(cntr.firstElementChild);
    }
    this.element = element;
    this.element.querySelectorAll('[data-element]').forEach((elem) => {
      this.subElements[elem.dataset['element']] = elem;
    })
  }

  buildBarsData(data) {
    if (!data.length) return [];
    const maxVal = Math.max(...data.map((d) => d.value));
    const scale = this.chartHeight / maxVal;
    return data.map(({value, tooltip}) => {
      return {
        _value: Math.floor(value * scale),
        value: value,
        tooltip: tooltip,
      }
    });
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

  async loadData() {
    try {
      let url = new URL(API_URL + this.url);
      if (this.from) url.searchParams.append('from', this.from.toJSON());
      if (this.to) url.searchParams.append('to', this.to.toJSON());
      const res = await fetch(url.toString());
      const resData = await res.json();
      const data = [];
      for (const [key, val] of Object.entries(resData)) {
        data.push({tooltip: key, value: Number(val)});
      }
      this.data = data;
      this.render();
    } catch (e) {
      this.log(e);
    }
  }

  async update(from, to) {
    this.from = from;
    this.to = to;
    await this.loadData();
  }
}
