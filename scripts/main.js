import Modal from './views/Modal';
import ModalTemplate from './templates/ModalTemplate';

$(ModalTemplate({ id: 'show-css-ref' })).appendTo('body');

$(document).on('show.bs.modal', '#show-css-ref', function (e) {
  var $parent = $(e.relatedTarget).parents('.segment');
  var title = $parent.data('title');
  var modal = new Modal(e.target);
  var contents = $parent.find('.css-reference').html();

  modal.empty().title(title).content(contents);
});
