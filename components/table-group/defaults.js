
$('.table-row-expand-btn', this).on('click', e => {
  const $target = $(e.target);
  const $row = $target.parents('.table-row-expandable');
  const collapsed = $row.hasClass('table-row-collapse');
  const source = $row.data('source');
  const $source = $(source);
  $row.removeClass(collapsed ? 'table-row-collapse' : 'table-row-expand');
  $row.addClass(collapsed ? 'table-row-expand' : 'table-row-collapse');
  $source.removeClass(collapsed ? 'table-row-source-collapse' : 'table-row-source-expand');
  $source.addClass(collapsed ? 'table-row-source-expand' : 'table-row-source-collapse');
});

var mouseY;
var mouseX;
var timer;
var tableLongtextToggle = $("<div class='longtext-toggle tooltip-inner fade tooltip-inner-light'></div>");
var tableCell = $('.table-longtext-truncated', this).find('tr').children();

tableCell
	.mouseenter(function () {
		if($('.calSpace')) {
			$('.calSpace').remove();
		}
		var cellText = $(this).text();
		var cellWidth = $(this).width();
		var wrapper = $('<div />');
		var divtable = $('<div />');
		var divtableRow = $('<div />');
		var span = $('<span />');

		wrapper.addClass('calSpace')
			   .css("position", "absolute")
			   .css("top", "-999999px");
		divtable.css("display", "table")
				 .css("border-collapse", "collapse");
		divtableRow.css("display", "table-row");
		span.addClass('calSpace')
			.css("display", "table-cell")
			.css("font-family", $(this).css('font-family'))
			.css("font-size", $(this).css('font-size'))
			.css("white-space", $(this).css('white-space'))
			.css("border", "1px solid #444")
			.css("padding", "8px 12px")
			.html(cellText);

		//Add this script to set cellTextLength if the hover element is 'th'
		if($(this).is( "th" )) {
			span.css("font-weight", "bold");
		}

		span.appendTo(divtableRow);
		divtableRow.appendTo(divtable);
		divtable.appendTo(wrapper);
		wrapper.appendTo($('body'));
		var cellTextLength = $('.calSpace span').width();

		if(cellWidth < cellTextLength) {
			tableLongtextToggle.html(cellText);			
			$(this).css("cursor", "default");
			timer = setTimeout(function(){
				tableLongtextToggle.appendTo('body').css({top: mouseY, left: mouseX});
				setTimeout(function(){
					tableLongtextToggle.addClass("in");
				}, 50);
			}, 500);
		}
	})
	.mouseleave(function () {
		clearTimeout(timer);
		$(this).css("cursor", "auto");
		tableLongtextToggle.removeClass("in").remove();		
	});

$(document).on('mousemove', function(e){
    mouseY = e.pageY + 10;
    mouseX = e.pageX;
})