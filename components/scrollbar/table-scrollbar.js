
var tableScrollbar = $(".table-scrollbar-example .table-with-scrollbar.sb-v .table-scrollable");
var tableHorizontalScrollbar = $(".table-scrollbar-example .table-with-scrollbar.sb-h .table-horizontal-scrollable");

tableScrollbar.mCustomScrollbar();

tableHorizontalScrollbar.mCustomScrollbar({
    axis:"x"
});
$(".table-with-scrollbar.sb-h .table-horizontal-scrollable .mCSB_container").on("mousewheel", function(e){     
    if(!e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
    }
});

$('.table-scrollbar-example .table-with-scrollbar.sb-h .table-horizontal-scrollable .table > tbody > tr').each(function() {
    var index = $(this).index();
    var fixedTable = $('.table-with-scrollbar.sb-h .table-horizontal-scrollable.fixed-column .table > tbody > tr');
    var scrollTable = $('.table-with-scrollbar.sb-h .table-horizontal-scrollable .table > tbody > tr');
    $(this).hover(function () {
        fixedTable.eq(index).addClass("hover");
        scrollTable.eq(index).addClass("hover");
    },function () {
        fixedTable.eq(index).removeClass("hover");
        scrollTable.eq(index).removeClass("hover");
    });
});

var sbVerticalHidden = $(".table-scrollbar-example .table-with-scrollbar.sb-vh .table-v-scrollbar-hidden");
var sbHorizontalHidden = $(".table-scrollbar-example .table-with-scrollbar.sb-vh .table-h-scrollbar-hidden");
var sbVH = $(".table-scrollbar-example .table-with-scrollbar.sb-vh .table-vh-scrollbar");

sbVerticalHidden.mCustomScrollbar();
sbHorizontalHidden.mCustomScrollbar({
    axis:"x"
});
sbVH.mCustomScrollbar({
    axis:"yx"
});