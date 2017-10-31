$('.edit-cell > span').editable({
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
