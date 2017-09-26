var container = this;
$(container).children().css('z-index', 2);

$(".fixed-header-example .table-with-scrollbar.sb-v .table-scrollable").mCustomScrollbar();

$(".fixed-header-example .table-with-scrollbar.sb-h .table-horizontal-scrollable").mCustomScrollbar({
    axis:"x"
}); 
$(".fixed-header-example .table-with-scrollbar.sb-h .table-horizontal-scrollable .mCSB_container").on("mousewheel", function(e){     
    if(!e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
    }
});

$('.fixed-header-example .table-with-scrollbar.sb-h .table-horizontal-scrollable .table > tbody > tr').each(function() {
    var index = $(this).index();
    var fixedTable = $('.fixed-header-example .table-with-scrollbar.sb-h .table-horizontal-scrollable.fixed-column .table > tbody > tr');
    var scrollTable = $('.fixed-header-example .table-with-scrollbar.sb-h .table-horizontal-scrollable .table > tbody > tr');
    $(this).hover(function () {
        fixedTable.eq(index).addClass("hover");
        scrollTable.eq(index).addClass("hover");
    },function () {
        fixedTable.eq(index).removeClass("hover");
        scrollTable.eq(index).removeClass("hover");
    });
});