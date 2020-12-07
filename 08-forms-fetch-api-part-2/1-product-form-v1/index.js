import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

const tplImage = (img = {}) => `
<li class="products-edit__imagelist-item sortable-list__item" style="">
  <input type="hidden" name="url" value="${escapeHtml(img.url)}">
  <input type="hidden" name="source" value="${escapeHtml(img.source)}">
  <span>
    <img src="icon-grab.svg" data-grab-handle="" alt="grab">
    <img class="sortable-table__cell-img" alt="Image" src="${escapeHtml(img.url)}">
    <span>${escapeHtml(img.source)}</span>
  </span>
  <button type="button">
    <img src="icon-trash.svg" data-delete-handle="" alt="delete">
  </button>
</li>
`

const tpl = (product = {}, categories = []) => `
<div class="product-form">
    <form data-element="productForm" class="form-grid">
      <div class="form-group form-group__half_left">
        <fieldset>
          <label class="form-label">Название товара</label>
          <input required="" type="text" id="title" name="title" class="form-control" placeholder="Название товара" value="${escapeHtml(product.title)}">
        </fieldset>
      </div>
      <div class="form-group form-group__wide">
        <label class="form-label">Описание</label>
        <textarea required="" id="description" class="form-control" name="description" data-element="productDescription" placeholder="Описание товара">${escapeHtml(product.description)}</textarea>
      </div>
      <div class="form-group form-group__wide" data-element="sortable-list-container">
        <label class="form-label">Фото</label>
        <div data-element="imageListContainer">
          <ul class="sortable-list">
            ${product.images?.map((img) => `
                ${tplImage(img)}
            `).join('')}
           </ul>
        </div>
        <label class="button-primary-outline fit-content">
          <span>Загрузить</span>
          <input name="uploadImage" id="uploadImage" type="file" style="display: none" accept="image/jpeg">
        </label>
      </div>
      <div class="form-group form-group__half_left">
        <label class="form-label">Категория</label>
        <select class="form-control" name="subcategory" id="subcategory">
          ${categories.map((cat) => `
              <option value="${escapeHtml(cat.id)}">${escapeHtml(cat.title)}</option>
          `).join()}
        </select>
      </div>
      <div class="form-group form-group__half_left form-group__two-col">
        <fieldset>
          <label class="form-label">Цена ($)</label>
          <input required="" id="price" type="number" name="price" class="form-control" placeholder="100" value="${escapeHtml(product.price.toString())}">
        </fieldset>
        <fieldset>
          <label class="form-label">Скидка ($)</label>
          <input required="" id="discount" type="number" name="discount" class="form-control" placeholder="0" value="${escapeHtml(product.discount.toString())}">
        </fieldset>
      </div>
      <div class="form-group form-group__part-half">
        <label class="form-label">Количество</label>
        <input required="" type="number" class="form-control" name="quantity" id="quantity" placeholder="1" value="${escapeHtml(product.quantity.toString())}">
      </div>
      <div class="form-group form-group__part-half">
        <label class="form-label">Статус</label>
        <select class="form-control" id="status" name="status">
          <option value="1" ${product.status === 1 ? 'selected' : ''}>Активен</option>
          <option value="0" ${product.status === 0 ? 'selected' : ''}>Неактивен</option>
        </select>
      </div>
      <div class="form-buttons">
        <button type="submit" name="save" class="button-primary-outline">
          Сохранить товар
        </button>
      </div>
    </form>
  </div>
`;

export default class ProductForm {
  constructor(productId) {
    this.productId = productId;
  }

  async loadProduct() {
    if (!this.productId) return [];
    const data = await fetchJson('https://course-js.javascript.ru/api/rest/products?id=' + this.productId);
    return data.shift();
  }

  async loadCategories() {
    const data = await fetchJson('https://course-js.javascript.ru/api/rest/categories?_sort=weight&_refs=subcategory');
    const categories = [];
    data.forEach((cat) => {
      if (cat.subcategories) {
        cat.subcategories.forEach((subcat) => {
          categories.push({id: subcat.id, title: cat.title + ' > ' + subcat.title});
        })
        return;
      }
      categories.push({...cat});
    })
    return categories;
  }

  initListeners() {
    this.subElements.productForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.save();
    })

    this.element.querySelector('[name=uploadImage]').addEventListener('change', async (e) => {
      const [image] = e.target.files;
      const body = new FormData;
      body.append('image', image);
      const res = await fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        body: body,
        headers: {authorization: 'Client-ID ' + IMGUR_CLIENT_ID},
      });
      const data = await res.json();
      const c = document.createElement('li');
      c.innerHTML = tplImage({url: data.data.link, source: image.name});
      this.subElements.imageListContainer.querySelector('ul').append(...c.children);
      e.target.value = '';
    });
    this.subElements.imageListContainer.addEventListener('click', (e) => {
      if (!e.target.closest('[data-delete-handle]')) return;
      const li = e.target.closest('li.products-edit__imagelist-item');
      if (li) li.remove();
    })
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

  async save() {
    const values = {
      title: '',
      description: '',
      quantity: 0,
      subcategory: '',
      status: 0,
      price: 0,
      discount: 0,
    };
    for (const field of Object.keys(values)) {
      let val = this.subElements.productForm.querySelector(`#${field}`).value;
      if (typeof values[field] === 'number') val = parseInt(val);
      values[field] = val;
    }
    values.images = [];
    Array.from(this.subElements.imageListContainer.querySelectorAll('.products-edit__imagelist-item')).forEach((item) => {
      values.images.push(Array.from(item.querySelectorAll('input')).reduce((data, input) => {
        if (input.name === 'url' || input.name === 'source') data[input.name] = input.value;
        return data;
      }, {}));
    })
    if (this.productId) values.id = this.productId;
    await fetch('https://course-js.javascript.ru/api/rest/products', {
      method: this.productId ? 'PATCH' : 'PUT',
      body: JSON.stringify(values),
    })
    this.element.dispatchEvent(this.productId ? new Event('product-updated') : new Event('product-saved'));
  }

  async render() {
    let [categories, product] = await Promise.all([this.loadCategories(), this.loadProduct()]);
    const c = document.createElement('div');
    c.innerHTML = tpl(product, categories);
    this.subElements = Array.from(c.querySelectorAll('[data-element]')).reduce((res, elem) => {
      res[elem.dataset.element] = elem;
      return res;
    }, {});
    this.element = c.firstElementChild;
    this.initListeners();
    return this.element;
  }
}

