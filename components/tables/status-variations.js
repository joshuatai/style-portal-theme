var mouseY;
var mouseX;
var timer;
var table_longtext_toggle = $("<div class='longtext_toggle tooltip-inner fade tooltip-inner-light'></div>");
var table_cell = $('.table-longtext-truncated').find('tr').children();

// FIXED HEADER
// =================
$(".mCustomScrollbar", this).mCustomScrollbar();

// LONG TEXT TRUNCATED
// =================
table_cell
	.mouseenter(function () {
		if($('.calSpace')) {
			$('.calSpace').remove();
		}
		var cell_text = $(this).text();
		var cell_width = $(this).width();
		var wrapper = $('<div />');
		var div_table = $('<div />');
		var div_table_row = $('<div />');
		var span = $('<span />');

		wrapper.addClass('calSpace')
			   .css("position", "absolute")
			   .css("top", "-999999px");
		div_table.css("display", "table")
				 .css("border-collapse", "collapse");
		div_table_row.css("display", "table-row");
		span.addClass('calSpace')
			.css("display", "table-cell")
			.css("font-family", $(this).css('font-family'))
			.css("font-size", $(this).css('font-size'))
			.css("white-space", $(this).css('white-space'))
			.css("border", "1px solid #444")
			.css("padding", "8px 12px")
			.html(cell_text);

		//Add this script to set cell_text_length if the hover element is 'th'
		if($(this).is( "th" )) {
			span.css("font-weight", "bold");
		}

		span.appendTo(div_table_row);
		div_table_row.appendTo(div_table);
		div_table.appendTo(wrapper);
		wrapper.appendTo($('body'));
		var cell_text_length = $('.calSpace span').width();

		if(cell_width < cell_text_length) {
			table_longtext_toggle.html(cell_text);			
			$(this).css("cursor", "default");
			timer = setTimeout(function(){
				table_longtext_toggle.appendTo('body').css({top: mouseY, left: mouseX});
				setTimeout(function(){
					table_longtext_toggle.addClass("in");
				}, 50);
			}, 500);
		}
	})
	.mouseleave(function () {
		clearTimeout(timer);
		$(this).css("cursor", "auto");
		table_longtext_toggle.removeClass("in").remove();		
	});

$(document).on('mousemove', function(e){
    mouseY = e.pageY;
    mouseX = e.pageX;
})

// RESIZABLE
// =================
$("#resize").colResizable({
	liveDrag: true,
	headerOnly: true,
	dragCursor: "col-resize",
	hoverCursor: "col-resize",
	minWidth: 56,
	onDrag: setDragLineHeight,
	onResize: setDragLineHeight
});
$(".JCLRgrip").hover(function() {
	setDragLineHeight();
},function(){
	resetDragLineHeight();
})

function setDragLineHeight(){
	var table_height = $("#resize").outerHeight();
	$(".JCLRgrip").css({height: table_height});
}
function resetDragLineHeight(){
	var thead_height = $("#resize > thead").outerHeight();
	$(".JCLRgrip").css({height: thead_height});
}

// TOOL BAR
// =================

var $table_selected = $('#table-selected');

$table_selected.on('click', "tbody > tr", function (e) {
	var select_text;
	var checkbox = $(this).children().find("input.input-checkbox");

	select_text = getSelectedText()
    console.log(select_text);

    if($(this).hasClass('active')) {
  
    	checkbox.prop("checked", false);
		$(this).removeClass('active');
    
	}
	else {
		checkbox.prop("checked", true);
		$(this).addClass('active');
	}
	
	
});

$table_selected.on('click', "thead > tr > th.gutter", function (e) {

	var partial_checkbox = $(this).find("input.input-checkbox");
	var tbody_row = $table_selected.find("tbody > tr");
	var tbody_checkbox = tbody_row.find("input.input-checkbox");
	if(tbody_row.hasClass('active')) {
		tbody_row.removeClass('active');
		partial_checkbox.prop("checked", false);
		tbody_checkbox.prop("checked", false);
	}
	else {
		tbody_row.addClass('active');
		partial_checkbox.prop("checked", true);
		tbody_checkbox.prop("checked", true);
	}
	
});

function getSelectedText() {
    if (window.getSelection) { 
        var range = window.getSelection ();
        return range.toString();
    } 
    else {
        if (document.selection.createRange) { // IR
            var range = document.selection.createRange ();
            return range.text;
        }
    }
}