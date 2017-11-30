function getSelectedText () {
	if (window.getSelection) {
		return window.getSelection().toString();
	}

	// IE
	if (document.selection.createRange) {
		return document.selection.createRange().text;
	}
}

var $tableContainer = $('.table-col-draggable-container');
var $tableThead = $('.table-col-draggable-container .table-column-draggable thead');
var $tableTbody = $('.table-col-draggable-container .table-column-draggable tbody');
var $draggableItems = $tableThead.find('th.column-sortable');
var highlightTh;
var candidateTh;
var originalIdx;
var newIdx;
var sensorPosition = [];

$draggableItems.draggable({
	cursor: 'move',
  cursorAt: { left: 5 },
  appendTo: ".table-col-draggable-container",
	helper: 'clone',
	start: function(event, ui) {
		originalIdx = $tableThead.find('th').index($(this));
		$(this).addClass('ui-column-highlight');
		$(this).draggable('option').sensorOffset();
	},
	sensorOffset: function(){
		sensorPosition = [];
		$draggableItems.each(function() {
			sensorPosition.push($(this).offset().left);
		});
		sensorPosition.sort(function(a, b){ return a-b });
	},
	change: function(direction, originalIdx, newIdx) {
		highlightTh = $tableThead.find('tr').find('.ui-column-highlight');
		candidateTh = $tableThead.find('tr').find('th:eq(' + newIdx + ')');
		if(direction === 'right') {
			candidateTh.after(highlightTh);
		} else {
			candidateTh.before(highlightTh);
		}
		$tableTbody.find('tr').find('td:eq(' + originalIdx + ')').each(function() {
			var placeholderTd = $(this);
			var placeholderTr = placeholderTd.parent();
			var candidateTd = placeholderTr.find('td:eq(' + newIdx + ')');
			if(direction === 'right') {
				candidateTd.after(placeholderTd);
			} else {
				candidateTd.before(placeholderTd);
			}
		});
		return true;
	},
	drag: function( event, ui ) {
		$tableContainer.find('.table').removeClass('table-hover');
		if(event.pageY > $tableThead.offset().top && event.pageY < ($tableThead.offset().top + $tableContainer.height())){
			if(event.pageX > sensorPosition[originalIdx]) {
				newIdx = originalIdx + 1;
				var hasChanged = $(this).draggable('option').change('right', originalIdx, newIdx);
				if(hasChanged){
					originalIdx = newIdx;
				}
			}
			if(event.pageX < sensorPosition[originalIdx-1] && originalIdx > 1) {
				if(event.pageX > sensorPosition[0]) {
					newIdx = originalIdx - 1;
					var hasChanged = $(this).draggable('option').change('left', originalIdx, newIdx);
					if(hasChanged){
						originalIdx = newIdx;
					}
				}
			}
		}
	},
	stop: function( event, ui ) {
		$tableContainer.find('.table').addClass('table-hover');
		$(this).removeClass('ui-column-highlight');
	}
});

$('.table-col-draggable-container .table-column-draggable').on('click', 'thead > tr > th.gutter > .checkbox', (e) => {
	e.preventDefault();

	var $label = $(e.target);
	var $control = $label.parent('.checkbox').find('.input-checkbox');
	var $table = $label.parents('.table');
	var $rows = $table.find('tbody > tr');
	var $active = $table.find('tbody > tr.active');
	var $checkbox = $rows.find('input.input-checkbox');

	if ($rows.length !== $active.length) {
		$control.addClass('checkbox-partial');
		$control.prop('checked', true);
		$rows.addClass('active');
		$checkbox.prop('checked', true);
		return;
	}

	$control.removeClass('checkbox-partial');
	$control.prop('checked', false);
	$rows.removeClass('active');
	$checkbox.prop('checked', false);
})
.on('click', 'tbody > tr', (e) => {
	e.preventDefault();

	var $row = $(e.target).parents('tr');
	var $table = $row.parents('.table');
	var $rows = $table.find('tbody > tr');
	var $control = $table.find('thead > tr > th.gutter .input-checkbox');
	var data = $table.data();
	var clickTimer = data.clickTimer;
	var dblclickRecoverTimer = data.dblclickRecoverTimer;

	if (data.hasDblclicked) {
		clearTimeout(dblclickRecoverTimer);
		dblclickRecoverTimer = setTimeout(() => $table.data('hasDblclicked', false), 300);
		$table.data('dblclickRecoverTimer', dblclickRecoverTimer);
		return;
	}

	clearTimeout(clickTimer);

	clickTimer = setTimeout(function () {
		if (getSelectedText()) { return; }

		var $checkbox = $row.find('.input-checkbox');

		if ($row.hasClass('active')) {
			$control.prop('checked', false);
			$row.removeClass('active');
			$checkbox.prop('checked', false);

			if ($table.find('tbody input:checkbox:checked').length === 0) {
				$control.removeClass('checkbox-partial');
			}
		}
		else {
			$control.addClass('checkbox-partial');
			$row.addClass('active');
			$checkbox.prop('checked', true);

			if ($table.find('tbody input:checkbox:checked').length === $rows.length) {
				$control.prop('checked', true);
			}
		}
	}, 250);

	$table.data('clickTimer', clickTimer);
})
.on('dbclick', 'tbody > tr', function (e) {
	var $row = $(e.target);
	var $table = $row.parents('.table');
	var data = $table.data();

	clearTimeout(data.clickTimer);
	$table.data('hasDblclicked', true);
})
.on('click', 'tbody > tr a', (e) => {
	e.stopPropagation();
});