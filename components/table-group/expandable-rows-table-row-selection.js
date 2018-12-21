
function getSelectedText () {
	if (window.getSelection) {
		return window.getSelection().toString();
	}

	// IE
	if (document.selection.createRange) {
		return document.selection.createRange().text;
	}
}

$('.table-selectable', this).on('click', 'thead .head-checkbox', e => {
	const $label = $(e.target);
	const $control = $label.parent('.head-checkbox').find(':checkbox');
	const $table = $label.closest('.table');
	const $rows = $table.find('tbody > tr').not('.table-row-unselectable');
	const $active = $rows.filter('.active');
  const $checkboxes = $rows.find(':checkbox');
  const isAllSelected = $rows.length === $active.length;
  e.preventDefault();
  $control.prop('checked', !isAllSelected).toggleClass('checkbox-partial', false);
	$rows.toggleClass('active', !isAllSelected);
	$checkboxes.prop('checked', !isAllSelected).toggleClass('checkbox-partial', false);
})
.on('click', 'tbody > tr', e => {
  const $target = $(e.target);
  const $row = $target.closest('tr');
  const $checkbox = $row.find(':checkbox');
	const $table = $row.parents('.table');
  const $siblings = $row.siblings('tr').not('.table-row-unselectable');
  const $expandable = $row.closest('table').closest('tr').prev('.table-row-expandable');
  const $control = $table.find('thead .head-checkbox :checkbox');
  const expandable = $row.hasClass('table-row-expandable');
  const nested = $row.closest('.table-cell-child-table-container').length === 1;
  const data = $table.data();
  const isActive = $row.hasClass('active');
	let clickTimer = data.clickTimer;
  let dblclickRecoverTimer = data.dblclickRecoverTimer;

  if ($target.is('button,.btn,[type=button]')) return;
  if ($target.parent('button,.btn,[type=button]').length) return;

	e.preventDefault();

	if (data.hasDblclicked) {
		clearTimeout(data.dblclickRecoverTimer);
		dblclickRecoverTimer = setTimeout(() => $table.data('hasDblclicked', false), 300);
		$table.data('dblclickRecoverTimer', dblclickRecoverTimer);
		return;
	}

	clearTimeout(clickTimer);

	clickTimer = setTimeout(() => {
    if (getSelectedText()) { return; }

    $row.toggleClass('active', !isActive);
    $checkbox.prop('checked', !isActive);

    if (expandable) {
      $checkbox.toggleClass('checkbox-partial', !isActive);
      $($row.data('source')).find(':checkbox').prop('checked', !isActive).closest('tr').toggleClass('active', !isActive);
    }

    let $rows = $siblings.add($row);
    let $active = $rows.filter('.active');
    let isPartialSelected = $rows.length !== $active.length && $active.length > 0;
    let isAllSelected = !isActive && !isPartialSelected;

    if (nested) {
      $expandable.toggleClass('active', isAllSelected);
      $expandable.find(':checkbox').toggleClass('checkbox-partial', isPartialSelected).prop('checked', isAllSelected);
    }

    $rows = $table.find('tbody > tr').not('.table-row-unselectable');
    $active = $rows.filter('.active');
    isPartialSelected = $rows.length !== $active.length && $active.length > 0;
    isAllSelected = $rows.length === $active.length;

    $control.toggleClass('checkbox-partial', isPartialSelected).prop('checked', isAllSelected);
	}, 250);

	$table.data('clickTimer', clickTimer);
})
.on('dblclick', 'tbody > tr', e => {
	const $row = $(e.target);
	const $table = $row.parents('.table');
	const data = $table.data();
	clearTimeout(data.clickTimer);
	$table.data('hasDblclicked', true);
});
