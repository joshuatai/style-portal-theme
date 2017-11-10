$('.table-edit.validation .edit-cell').on('focusout', '.editable-input', function(e) {
  var $input = $(this).find('.form-control');
  var $cell = $(this).parents('.edit-cell');
  var $editable = $cell.find('.editable');
  var opts = $editable.data('editable');
  var invalidate = $editable.data('editable').options.validator($input, $input.val());
  $cell.toggleClass('error-mode', !invalidate);
})
.on('keydown', '.form-control', function(e) {
  if (e.which === 13) {
    var $input = $(this);
    var $cell = $(this).parents('.edit-cell');
    var $editable = $cell.find('.editable');
    var opts = $editable.data('editable');
    var invalidate = $editable.data('editable').options.validator($input, $input.val());
    $input.toggleClass('form-invalid', !invalidate);
    if(!invalidate) {
      $input.focus();
      $editable.editable('show');
    } else {
      $editable.editable('setValue', $input.val());
      $editable.editable('hide');
    }
  }
});

$('.table-edit.validation .edit-cell > span').editable({
  mode: 'inline',
  onblur: 'submit',
  clear: false,
  highlight: false,
  showbuttons: false,
  inputclass: 'form-control',
  toggle: 'manual',
  emptytext: '&nbsp;',
  validator: function(input, value) {
    if(/[\?]/.test(value)) {
      var errorMsg = 'This field is required';
      var invalidElement = 
        `<div class="popover bottom-right align-left" role="tooltip">
          <div class="arrow"></div>
          <div class="popover-content"></div>
        </div>`;
      input.popover({
        content: errorMsg, 
        trigger: 'hover focus',
        placement: 'bottom',
        template: invalidElement
      });
      input.addClass('form-invalid');
      $('.editable-error-block').removeClass('help-block');
      return false;
    }
    return true;
  }
})
.on('click', function(e) {
  e.stopPropagation();
  $(this).editable('show');
})
.on('shown', function(e, editable) {
  var $td = editable.$element.parent();
  var input = editable.input.$input;
  $td.addClass('edit-mode');
  editable.options.validator(input, input.val());
  input.keypress(function (e) {
    if (e.which == 13) {
      return false;
    }
  });
})
.on('hidden', function(e, reason) {
  var $td = $(e.target).parent();
  $td.removeClass('edit-mode');
});