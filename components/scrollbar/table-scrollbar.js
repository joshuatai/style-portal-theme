var scrollbarExample = $('.table-scrollbar-example');
var tableScrollbar = $('.table-with-scrollbar.sb-v .table-scrollable', scrollbarExample);
var tableHorizontalScrollbar = $('.table-with-scrollbar.sb-h .table-horizontal-scrollable', scrollbarExample);
var sbVerticalHidden = $('.table-with-scrollbar.sb-vh .table-v-scrollbar-hidden', scrollbarExample);
var sbHorizontalHidden = $('.table-with-scrollbar.sb-vh .table-h-scrollbar-hidden', scrollbarExample);
var sbVH = $('.table-with-scrollbar.sb-vh .table-vh-scrollbar', scrollbarExample);
tableScrollbar.mCustomScrollbar();

tableHorizontalScrollbar.mCustomScrollbar({
    axis:"x"
});

sbVerticalHidden.mCustomScrollbar({
    callbacks:{
        whileScrolling: function(){
            var root = $(this).parents('.table-with-scrollbar.sb-vh');
            $('.table-vh-scrollbar .mCSB_container', root).css("top", this.mcs.top);
            sbVH.mCustomScrollbar('update');
        }
    }
});

sbHorizontalHidden.mCustomScrollbar({
    axis:"x",
    mouseWheel:{ enable: false }
});

sbVH.mCustomScrollbar({
    axis:"yx",
    setHeight: "255px",
    callbacks:{
        whileScrolling: function() {
            var root = $(this).parents('.table-with-scrollbar.sb-vh');
            if (this.mcs.direction == "y") {
                $('.table-v-scrollbar-hidden .mCSB_container', root).css("top", this.mcs.top);
            }
            else {
                $('.table-h-scrollbar-hidden .mCSB_container', root).css("left", this.mcs.left);
            }
        }
    }
});
sbVH.find('#mCSB_8_container_wrapper').on('mousewheel', function (e) {
    if (e.shiftKey) {
        var sbH = $('.mCSB_container_wrapper .mCSB_container', sbVH);
        var sbHHidden = $('.table-with-scrollbar.sb-vh .table-vh-scrollable .table-h-scrollbar-hidden .mCSB_container');
        var left = parseInt(sbH.css("left"), 10);

        sbH.css("left", left + e.deltaY);
        sbHHidden.css("left", left + e.deltaY);
        if (parseInt(sbH.css("left"), 10) > 0) {
            sbH.css("left", 0);
            sbHHidden.css("left", 0);
        }
        
        sbVH.mCustomScrollbar("update");
        
        e.preventDefault();
        e.stopPropagation();
    }
});
$('.table-with-scrollbar.sb-h .table-horizontal-scrollable .mCSB_container', scrollbarExample).on('mousewheel', function(e){     
    if(!e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
    }
});

$('.table-with-scrollbar.sb-h .table > tbody > tr', scrollbarExample).each(function() {
    var index = $(this).index();
    var fixedTableRow = $('.table-with-scrollbar.sb-h .fixed-column .table > tbody > tr', scrollbarExample);
    var scrollTableRow = $('.table-with-scrollbar.sb-h .table-horizontal-scrollable .table > tbody > tr', scrollbarExample);
    tableSbHover ($(this), index, fixedTableRow, scrollTableRow)
});

$('.table-with-scrollbar.sb-vh .table > tbody > tr', scrollbarExample).each(function() {
    var index = $(this).index();
    var fixedTableRow = $('.table-with-scrollbar.sb-vh .table-v-scrollbar-hidden .table > tbody > tr', scrollbarExample);
    var scrollTableRow = $('.table-with-scrollbar.sb-vh .table-vh-scrollbar .table > tbody > tr', scrollbarExample);
    tableSbHover ($(this), index, fixedTableRow, scrollTableRow)
});
function tableSbHover ($this, index, fixedRow, scrollRow) {
    $this.hover(function () {
        fixedRow.eq(index).addClass("hover");
        scrollRow.eq(index).addClass("hover");
    },function () {
        fixedRow.eq(index).removeClass("hover");
        scrollRow.eq(index).removeClass("hover");
    });
}