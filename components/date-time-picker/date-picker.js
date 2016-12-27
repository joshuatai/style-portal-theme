var container = this;
var datePicker = $('[data-date-picker=date-picker]', container);

datePicker.datepicker({
  todayHighlight: true
}).on('show', function(ev){
  console.log("show");
  datePicker.datepicker('iconChange');
}).on('changeDate', function(ev){
  datePicker.focus();
});
