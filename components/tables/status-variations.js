var mouseY;
var mouseX;
var timer;
var table_longtext_toggle = $("<div class='longtext-toggle tooltip-inner fade tooltip-inner-light'></div>");
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

// TOOLBAR
// =================
toolbarSelection('#table-selected');
toolbarSelection('#plain-table-selected'); 

function toolbarSelection(selector) {
	var select_text;
	var click_timer;
	var table_selected = $(selector);
	var table = $('table', table_selected);
	var functional_block = $('.functional-block', table_selected);
	var text_of_selected = $('.selected-block .count', functional_block);
	var tbody_row = $("tbody > tr", table);
	var partial_checkbox = $("thead > tr > th.gutter input.input-checkbox", table);
	var tbody_checkbox = $("input.input-checkbox", tbody_row);

	table.on('click', "tbody > tr", function (e) {
		var _this = $(this);
		click_timer = setTimeout(function(){
			var each_checkbox = _this.children().find("input.input-checkbox");
			
			select_text = getSelectedText();

		    if(select_text == "") {
		    	if(_this.hasClass('active')) {
			    	each_checkbox.prop("checked", false);
			    	partial_checkbox.prop("checked", false);
					_this.removeClass('active');
					var number_of_checked = table.find('tbody input:checkbox:checked');
					text_of_selected.html(number_of_checked.length);
					if(number_of_checked.length == 0){
						partial_checkbox.removeClass("checkbox-partial");
						functional_block.removeClass("show");
					}
				}
				else {
					each_checkbox.prop("checked", true);
					_this.addClass('active');
					partial_checkbox.addClass("checkbox-partial");
					var number_of_checked = table.find('tbody input:checkbox:checked');
					text_of_selected.html(number_of_checked.length);
					functional_block.addClass("show");
					if(number_of_checked.length == tbody_row.length) {
						partial_checkbox.prop("checked", true);
					}
				}
		    }
	    }, 250)
	  
	});

	table.on('dbclick', "tbody > tr", function (e) { 
		clearTimeout(click_timer);
	});

	table.on('click', "thead > tr > th.gutter", function (e) {
		var tbody_row_active = table.find("tbody > tr.active");

		if(tbody_row.hasClass('active') || tbody_row_active.length == 0) {
			// checked all row
			tbody_row.addClass('active');
			partial_checkbox.addClass("checkbox-partial");
			partial_checkbox.prop("checked", true);
			tbody_checkbox.prop("checked", true);
			text_of_selected.html(tbody_row.length);
			functional_block.addClass("show");

			// unchecked all row
			if(tbody_row_active.length == tbody_row.length) {
				tbody_row.removeClass('active');
				partial_checkbox.removeClass("checkbox-partial");
				partial_checkbox.prop("checked", false);
				tbody_checkbox.prop("checked", false);
				text_of_selected.html("");
				functional_block.removeClass("show");
			}
		}
		
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
}