var container = this;
var scrollbarExample = $('.fixed-header-example', container);
var tableHorizontalScrollbar = $('.table-with-scrollbar.sb-h .table-horizontal-scrollable', scrollbarExample);

$(container).children().css('z-index', 2);

tableHorizontalScrollbar.mCustomScrollbar({ axis: 'x' });

$('.table-with-scrollbar.sb-h .table-horizontal-scrollable .mCSB_container', scrollbarExample).on('mousewheel', function (e) {
  if (!e.shiftKey) {
    e.preventDefault();
    e.stopPropagation();
  }
});

$('.table-with-scrollbar.sb-h .table > tbody > tr', scrollbarExample).each(function () {
  var index = $(this).index();
  var fixedTableRow = $('.table-with-scrollbar.sb-h .fixed-column .table > tbody > tr', scrollbarExample);
  var scrollTableRow = $('.table-with-scrollbar.sb-h .table-horizontal-scrollable .table > tbody > tr', scrollbarExample);
  tableSbHover($(this), index, fixedTableRow, scrollTableRow)
});

function tableSbHover($this, index, fixedRow, scrollRow) {
  $this.hover(function () {
    fixedRow.eq(index).addClass("hover");
    scrollRow.eq(index).addClass("hover");
  }, function () {
    fixedRow.eq(index).removeClass("hover");
    scrollRow.eq(index).removeClass("hover");
  });
}