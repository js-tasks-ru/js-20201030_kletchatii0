const getTpl = ({message, duration = '20', type = 'success'}) => `
 <div class="notification ${type}" style="--value:${duration}s">
    <div class="timer"></div>
    <div class="inner-wrapper">
      <div class="notification-header">${type}</div>
      <div class="notification-body">
        ${message}
      </div>
    </div>
  </div>
`;

export default class NotificationMessage {
  /** @type {NotificationMessage} */
  activeNotification = null;

  constructor(message, options = {}) {
    this.message = message;
    this.duration = options.duration;
    this.type = options.type;
    if (NotificationMessage.activeNotification) {
      NotificationMessage.activeNotification.remove();
    }
    this.render();
  }

  render() {
    let ctnr = document.createElement('div');
    ctnr.innerHTML = getTpl({
      message: this.message,
      duration: this.duration / 1000,
      type: this.type
    });
    this.element = ctnr.children[0];
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    NotificationMessage.activeNotification = null;
  }

  show(parent = document.body) {
    parent.append(this.element);
    setTimeout(() => {
      this.remove();
    }, this.duration);
  }

}
