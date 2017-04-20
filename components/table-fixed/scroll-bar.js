$(".mCustomScrollbar").mCustomScrollbar();

$(".mCustomHorizontalScrollbar").mCustomScrollbar({
	axis:"x"
});  


$('.table-horizontal-scrollable .table > tbody > tr').each(function() {
    var index = $(this).index();
    var fixedTable = $('.table-horizontal-scrollable.fixed-column .table > tbody > tr');
    var scrollTable = $('.table-horizontal-scrollable.mCustomHorizontalScrollbar .table > tbody > tr');
    $(this).hover(function () {
        fixedTable.eq(index).addClass("hover");
        scrollTable.eq(index).addClass("hover");
    },function () {
        fixedTable.eq(index).removeClass("hover");
        scrollTable.eq(index).removeClass("hover");
    });
});