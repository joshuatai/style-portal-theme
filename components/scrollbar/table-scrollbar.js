
var tableScrollbar = $(".table-scrollbar-example .table-scrollable.mCustomScrollbar");
var horizontalScrollbar = $(".table-scrollbar-example .mCustomHorizontalScrollbar");

tableScrollbar.mCustomScrollbar();

horizontalScrollbar.mCustomScrollbar({
    axis:"x"
});
$(".mCustomHorizontalScrollbar .mCSB_container").on("mousewheel", function(e){     
    if(!e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
    }
});

$('.table-scrollbar-example .table-horizontal-scrollable .table > tbody > tr').each(function() {
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