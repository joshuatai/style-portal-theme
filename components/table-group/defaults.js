
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