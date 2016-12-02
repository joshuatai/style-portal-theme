import Modal from './views/Modal';
import ModalTemplate from './templates/ModalTemplate';
import parse from './parse-css-ref';

$(ModalTemplate({ id: 'show-css-ref' })).appendTo('body');

$(document).on('show.bs.modal', '#show-css-ref', function (e) {
  var $parent = $(e.relatedTarget).parents('.segment-panel');
  var title = $parent.data('title');
  var modal = new Modal(e.target);
  var contents = $parent.find('.css-reference').html();

  modal.empty().title(title).content(contents);
});

portal.on(Portal.EVENT_COMPONENT_LOADED, (e) => {
  parse(e.target);
});
