$('.table-edit.validation .edit-cell > span').editable({
  mode: 'inline',
  onblur: 'submit',
  clear: false,
  highlight: false,
  showbuttons: false,
  inputclass: 'form-control',
  emptytext: '&nbsp;',
  validate: function(value) {
    console.log('validate');
    if($.trim(value) == '') {
      var input = $(this).next('.editable-inline').find('.form-control');
      var errorMsg = 'This field is required';
      var invalidElement = 
        `<div class="popover bottom-right align-left" role="tooltip">
          <div class="arrow"></div>
          <div class="popover-content"></div>
        </div>`;
      input.popover({
        content: errorMsg, 
        trigger: 'hover',
        placement: 'bottom',
        html: true, 
        template: invalidElement
      });
      input.addClass('form-invalid');
      input.popover('show');
      $('.editable-error-block').removeClass('help-block');
      return ' ';
    }
  }
})
.on('mousedown', function(e) {
  var invalidInput = $('.edit-cell.edit-mode').find('.form-control.form-invalid');
  if(invalidInput.length) {
    $(this).editable('enable');
  }
})
.on('click', function(e) {
  var invalidInput = $('.edit-cell.edit-mode').find('.form-control.form-invalid');
  if(invalidInput.length) {
    invalidInput.popover('show');
  }
})
.on('save', function(e) {
  var editableCell = $('.edit-cell > .editable');
  editableCell.editable('enable');
})
.on('shown', function(e, editable) {
  var $td = editable.$element.parent();
  $td.addClass('edit-mode');
})
.on('hidden', function(e) {
  var $td = $(e.target).parent();
  $td.removeClass('edit-mode');
});
