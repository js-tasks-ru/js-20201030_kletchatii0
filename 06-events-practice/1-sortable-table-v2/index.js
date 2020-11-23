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
  subElements = {
    body: null,
    header: null,
  };

  /**
   *
   * @param headers {Header[]}
   * @param data {Product[]}
   */
  constructor(headers, {data}) {
    this.headers = headers;
    this.data = data;
    const colToSortBy = headers.find((h) => h.sortable);
    if (colToSortBy) {
      this.sortData(colToSortBy.id, 'asc');
    }
    this.render();
  }

  sortData(field, sortType) {
    const header = this.headers.find((elm) => elm.id === field);
    if (!header || !header.sortable) return;
    this.headers.forEach(header => header.id === field ? header.order = sortType : header.order = null);
    const order = sortType === 'asc' ? 1 : -1;
    switch (header.sortType) {
      case 'number':
        this.data = [...this.data].sort((el1, el2) => order * (el1[field] - el2[field]));
        break;
      case 'string':
        this.data = [...this.data].sort((s1, s2) => -order * s1[field].localeCompare(s2[field], 'ru', {'caseFirst': 'upper'}));
        break;
    }
  }

  sort(field, sortType) {
    this.sortData(field, sortType);
    this.render();
  }

  onSort(event) {
    const col = event.target.closest('[data-sortable=true]');
    if (!col) return;
    const reverseSortMap = {'asc': 'desc', 'desc': 'asc'};
    this.sort(col.dataset.id, reverseSortMap[col.dataset.order] || 'desc');
  }

  initEventsListeners() {
    this.subElements.header.addEventListener('click', (event) => this.onSort(event));
  }

  render() {
    if (!this.element) this.element = document.createElement('div');
    this.element.innerHTML = getTableTpl(this.headers, this.data);
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
