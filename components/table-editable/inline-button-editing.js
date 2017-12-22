// Noraml editable
$.fn.editableform.buttons = 
'<button type="submit" class="btn btn-default btn-border btn-icon-only editable-submit"><span class="icon icon-success"></span></button>' +
'<button type="button" class="btn btn-default btn-border btn-icon-only editable-cancel"><span class="icon icon-cancel"></span></button>';         

$('.table-edit.inline-button .edit-cell > span').editable({
  mode: 'inline',
  clear: false,
  highlight: false,
  inputclass: 'form-control',
  onblur: 'ignore',
  emptytext: '&nbsp;',
  validate: function(value) {
    var $cell = $(this).parent('.edit-cell');
    var $input = $(this).next('.editable-inline').find('.form-control');
    var $checkBtn = $(this).next('.editable-inline').find('.editable-submit');
    var $editable = $cell.find('.editable');
    var opts = $editable.data('editable');
    if($.trim(value) == '') {
      var errorMsg = 'This field is required.';
      var invalidElement = 
        `<div class="popover bottom-right align-left" role="tooltip">
          <div class="arrow"></div>
          <div class="popover-content"></div>
        </div>`;
      $input.popover({
        content: errorMsg, 
        trigger: 'focus',
        placement: 'bottom',
        template: invalidElement
      });
      opts.options.invalid($cell, $input, $checkBtn);
      $input.popover('show');
      return ' ';
    }
    else {
      opts.options.passVerify($cell, $input, $checkBtn);
    }
  },
  invalid: function(cell, input, checkBtn){
    cell.addClass('error-mode');
    input.addClass('form-invalid');
    checkBtn.attr('disabled', 'disabled');
    $('.table-edit.inline-button .error-mode .form-control.form-invalid').on('keydown', function(e) {
      if(e.which != 13){
        cell.removeClass('error-mode');
        checkBtn.removeAttr('disabled');
        input.removeClass('form-invalid').popover('destroy');
      }
    });
  },
  passVerify: function(cell, input, checkBtn){
    cell.removeClass('error-mode');
    input.removeClass('form-invalid');
    checkBtn.removeAttr('disabled');
  }
})
.on('shown', function(e, editable) {
  var $td = editable.$element.parent();
  $td.addClass('edit-mode');
})
.on('hidden', function(e) {
  var $td = $(e.target).parent();
  $td.removeClass('edit-mode');
});