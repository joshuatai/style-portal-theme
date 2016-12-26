var container = this;
var datePickerPaneStart = $('[data-date-picker=date-pane-date-start]', container);
var datePickerPaneEnd = $('[data-date-picker=date-pane-date-end]', container);
var timePickerPaneStart = $('[data-time-picker=pane-time-start]', container);
var timePickerPaneEnd = $('[data-time-picker=pane-time-end]', container);
function dateFormat(date) {
	var thisDate = new Date(date);
	var dd = thisDate.getDate();
	var mm = thisDate.getMonth()+1; //January is 0
	var yyyy = thisDate.getFullYear();
	if(dd<10) {
	    dd='0'+dd;
	} 
	if(mm<10) {
	    mm='0'+mm;
	} 
	var thisDate = dd+'/'+mm+'/'+yyyy;
	return thisDate;
}
datePickerPaneStart
	.datepicker({
		format: 'dd/mm/yyyy',
		todayHighlight: true
	})
	.on('changeDate', function(ev){
		var dateText = dateFormat(ev.date.valueOf());
		$("#pane-date-start").val(dateText);
		datePickerPaneEnd.datepicker('setStartDate', dateText);
	});
datePickerPaneStart.datepicker("iconChange");

datePickerPaneEnd
	.datepicker({
		format: 'dd/mm/yyyy',
		todayHighlight: true
	})
	.on('changeDate', function(ev){
		var dateText = dateFormat(ev.date.valueOf());
		$("#pane-date-end").val(dateText);
		datePickerPaneStart.datepicker('setEndDate', dateText);
	});
	
datePickerPaneEnd.datepicker("iconChange");
timePickerPaneStart.timeEntry({
	show24Hours: true, 
	showSeconds: true,
	spinnerImage: null
});
timePickerPaneEnd.timeEntry({
	show24Hours: true, 
	showSeconds: true,
	spinnerImage: null
});
$(".custom-range").on("click", function(e){
	e.stopPropagation();
	$(".date-picker-pane").addClass("show");
});
$(".dropdown").on("hidden.bs.dropdown", function(event){
	$(".date-picker-pane").removeClass("show");
});
$(".predefine-range").on("click", function(event){
	var caret = '<span class="caret"></span>';
	var text = $(this).text();
	$('button.dropdown-toggle').html(caret+text);
});