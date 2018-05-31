
export default function ModalTemplate (options) {
  return [
    `<div id="${options.id}" class="modal fade" tabindex="-1" role="dialog">`,
      '<div class="modal-dialog">',
        '<div class="modal-content">',
          '<div class="modal-header">',
            '<button type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true" class="tmicon tmicon-close tmicon-visible-low tmicon-hoverable"></span></button>',
            '<h4 class="modal-title"></h4>',
          '</div>',
          '<div class="modal-body"></div>',
          '<div class="modal-footer">',
            '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>',
          '</div>',
        '</div>',
      '</div>',
    '</div>'
  ].join('\n');
};
