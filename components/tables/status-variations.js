$(".mCustomScrollbar", this).mCustomScrollbar();

var mouseY;
var mouseX;

var table_cell = $('.table-longtext-truncated').find('tbody > tr').children();

table_cell.mouseover(function(e) {
	$(this).tooltip({
		title: 'wef',
		container: "body",
		placement: 'right',
		trigger: 'hover focus',
		template: "<div class='tooltip' role='tooltip'><div class='tooltip-inner tooltip-inner-light'></div></div>"
	}).on("mouseover", function (e) {
		console.log(mouseY);
		$('.tooltip').css('top', mouseY + 'px')
		$('.tooltip').css('left', mouseX + 'px')
	});
});

$(document).on('mousemove', function(e){
    mouseY = e.pageY;
    mouseX = e.pageX;
})