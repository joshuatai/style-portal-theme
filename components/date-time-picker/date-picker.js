var container = this;
var datePicker = $('[data-date-picker=date-picker]', container);

datePicker.datepicker({
  todayHighlight: true,
  autoclose: true
}).on('show', function(ev){
  datePicker.datepicker('iconChange');
});
