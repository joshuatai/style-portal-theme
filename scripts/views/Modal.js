
export default class Modal {
  constructor (target) {
    this.target = target;
    this.$modal = $(target);
    this.$title = $('.modal-title', this.$modal);
    this.$content = $('.modal-body', this.$modal);
  }

  title (title) {
    if (!title) {
      return this.$title.text();
    }

    this.$title.text(title);

    return this;
  }

  content (content) {
    this.$content.html(content);

    return this;
  }

  empty () {
    this.$title.empty();
    this.$content.empty();

    return this;
  }

  ui (name) {
    return this[`$${name}`];
  }
}