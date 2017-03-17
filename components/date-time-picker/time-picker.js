var container = this;
var timePicker = $('[data-time-picker=time-picker]', container);
timePicker.timeEntry({
  show24Hours: true, 
  showSeconds: true,
  spinnerImage: null
})
.on('keydown', function(ev){
	var start = $(this).prop('selectionStart');
	console.log(start);
	//$(this).focus();
    //$(this).select();
});
 
function getSelectedText() {
    if (window.getSelection) { 
        var range = window.getSelection();
        return range.toString();
    } 
    else {
        if (document.selection.createRange) { // IE
            var range = document.selection.createRange();
            return range.text;
        }
    }
}