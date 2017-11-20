// Noraml editable
$('.table-edit.single-field .edit-cell > span').editable({
  mode: 'inline',
  onblur: 'submit',
  clear: false,
  highlight: false,
  showbuttons: false,
  inputclass: 'form-control',
  emptytext: '&nbsp;'
})
.on('shown', function(e, editable) {
  var $td = editable.$element.parent();
  $td.addClass('edit-mode');
})
.on('hidden', function(e) {
  var $td = $(e.target).parent();
  $td.removeClass('edit-mode');
});

// Validation editable input event control
$('.table-edit.validation .edit-cell').on('focusout', '.editable-input', function(e) {
  var $input = $(this).find('.form-control');
  var $cell = $(this).parents('.edit-cell');
  var $editable = $cell.find('.editable');
  var opts = $editable.data('editable');
  var invalidate = opts.options.validator($input, $input.val());
  $cell.toggleClass('error-mode', !invalidate);
})
.on('keydown', '.form-control', function(e) {
  var $input = $(this);
  var $cell = $(this).parents('.edit-cell');
  var $editable = $cell.find('.editable');
  if (e.which === 13) {
    var opts = $editable.data('editable');
    var invalidate = opts.options.validator($input, $input.val());
    $input.toggleClass('form-invalid', !invalidate);
    if(!invalidate) {
      $input.focus();
      $editable.editable('show');
    } else {
      $editable.editable('setValue', $input.val());
      $editable.editable('hide');
    }
  }
  if (e.which === 27) {
    $editable.editable('setValue', $editable.editable('getValue', true));
    $editable.editable('hide');
  }
});

// Validation editable
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
    if($.trim(value) == '') {
      var errorMsg = 'This field is required.';
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
  
  // Prevent enter and esc event for manual control
  input.keypress(function (e) {
    if (e.which === 13) {
      return false;
    }
  }).keyup(function (e) {
    if (e.which === 27) {
      return false;
    }
  });
})
.on('hidden', function(e, reason) {
  var $td = $(e.target).parent();
  $td.removeClass('edit-mode');
});

// For display when page load.
$('.table-edit.validation .edit-cell.default-error > span').editable('show');