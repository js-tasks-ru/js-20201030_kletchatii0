const BACKEND_URL = 'https://course-js.javascript.ru';

/**
 * @interface Header
 * @property id {string}
 * @property title {string}
 * @property sortable {boolean}
 * @property sortType {String<number|string>}
 * @property template {function<string>}
 */

/**
 * @interface Product
 * @property id {string}
 * @property title {string}
 * @property description {string}
 * @property quantity {number}
 * @property subcategory {object}
 *
 * @property status {number}
 * @property images {string[]}
 * @property price {number}
 * @property discount {number}
 * @property sales {number}
 */

/**
 *
 * @param headers {Header[]}
 * @param products {Product[]}
 * @return {string}
 */
const getTableTpl = (headers, products) => `
<div class="sortable-table">
    <div data-element="header" class="sortable-table__header sortable-table__row">
      ${headers.map((h) => `
        <div class="sortable-table__cell" data-id="${h.id}" data-sortable="${h.sortable}" data-order="${h.order ? h.order : ''}">
          <span>${h.title}</span>
          ${(h.sortable && ` <span data-element="arrow" class="sortable-table__sort-arrow">
            <span class="sort-arrow"></span>
          </span>`) || ''}
        </div>
      `).join('')}
    </div>
    <div data-element="body" class="sortable-table__body">
${products.map((product, i) => {
  return `<a href="/products/${product.id}" class="sortable-table__row">` +
    headers.map((header) => {
      if (header.template) return header.template(product[header.id]);
      return `<div class="sortable-table__cell">${product[header.id]}</div>`
    }).join('') +
    `</a>`;
}).join('')}
    </div>
</div>
`
export default class SortableTable {
  subElements = {};

  /**
   * @param headers {Header[]}
   * @param options {Object}
   * @param options.data {Product[]}
   * @param options.url {string}
   */
  constructor(headers, options= {}) {
    this.url = options.url;
    this.headers = headers;
    this.data = options.data || [];
    this.start = 0;
    this.end = 0;
    this.limit = 30;
    this.render();
    if (this.url) this.sortOnServer().then(() => this.render());
  }

  async sortOnServer(field, sortType) {
    const url = new URL(BACKEND_URL + '/' + this.url);
    if (field) url.searchParams.append('_sort', field);
    if (sortType) url.searchParams.append('_order', sortType);
    this.start = this.end;
    this.end += this.limit;
    url.searchParams.append("_start", this.start);
    url.searchParams.append("_end", this.end);
    const res = await fetch(url.toString());
    this.data = [...this.data, ...await res.json()];
  }

  sortData(field, sortType) {
    const header = this.headers.find((elm) => elm.id === field);
    if (!header || !header.sortable) return;
    this.headers.forEach(header => header.id === field ? header.order = sortType : header.order = null);
    const direction = ({'asc': 1, 'desc': -1})[sortType];
    switch (header.sortType) {
      case 'number':
        this.data = [...this.data].sort((el1, el2) => direction * (el1[field] - el2[field]));
        break;
      case 'string':
        this.data = [...this.data].sort((s1, s2) => direction * s1[field].localeCompare(s2[field], 'ru'));
        break;
    }
  }

  async sort(field, sortType) {
    if (this.url) await this.sortOnServer(field, sortType)
    else this.sortData(field, sortType);
    this.render();
  }

  onSort(event) {
    const col = event.target.closest('[data-sortable=true]');
    if (!col) return;
    const reverseSortMap = {'asc': 'desc', 'desc': 'asc'};
    this.sort(col.dataset.id, reverseSortMap[col.dataset.order] || 'desc');
  }

  initEventsListeners() {
    this.subElements.header.addEventListener('pointerdown', (event) => this.onSort(event));
  }

  render() {
    if (!this.element) this.element = document.createElement('div');
    const {headers = [], data = []} = this;
    this.element.innerHTML = getTableTpl(headers, data);
    [].slice.call(this.element.querySelectorAll('[data-element]')).forEach((elem) => {
      this.subElements[elem.dataset.element] = elem;
    })
    this.initEventsListeners();
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
