function getSelectedText () {
	if (window.getSelection) {
		return window.getSelection().toString();
	}

	// IE
	if (document.selection.createRange) {
		return document.selection.createRange().text;
	}
}

var $tableThead = $('.table-col-draggable-container .table-column-draggable thead');
var $tableTbody = $('.table-col-draggable-container .table-column-draggable tbody');
var startIdx;
var originalIdx;

var fixHelper = function(e, ui) {
  var tableAlias = $('.table-col-draggable-container .table-column-draggable').clone().addClass('draggable-table-col-helper').css({"background-color": "#ffffff", "top": "0px"});
  var tableAliasHead = tableAlias.find('thead');
  var tableAliasBody = tableAlias.find('tbody');
  tableAliasHead.html('');
  tableAliasBody.html('');
  tableAliasHead.append(`<tr>${ui.clone().prop('outerHTML')}</tr>`);
  return tableAlias;
};

$tableThead.sortable({
  axis: "x" ,
  items: 'th.column-sortable',
  revert: 300,
  tolerance: "pointer",
  cursor: 'move',
  placeholder: 'ui-column-highlight',
  appendTo: ".table-col-draggable-container",
  helper: fixHelper,
  start: function(event, ui) {
    $('.ui-column-highlight').html(ui.item.prop('innerHTML'));
    startIdx = $tableThead.find('th').index(ui.item);
    originalIdx = startIdx;
  },
  change: function(event, ui) {
    var newIdx = $tableThead.find('th').index($tableThead.find('th.ui-column-highlight'));
    if( newIdx > startIdx ) newIdx--;
    $tableTbody.find('tr').find('td:eq(' + originalIdx + ')').each(function() {
      var placeholderTd = $(this);
      var placeholderTr = placeholderTd.parent();
      var candidateTd = placeholderTr.find('td:eq(' + newIdx + ')');

      if(newIdx > originalIdx) {
        candidateTd.after(placeholderTd);  // Move it the right
      } else {
        candidateTd.before(placeholderTd); 
      }

    });
    originalIdx = newIdx;
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


var $tableThead2 = $('.table-col-draggable-container-2 .table-column-draggable thead');
var $tableTbody2 = $('.table-col-draggable-container-2 .table-column-draggable tbody');
var startIdx2;
var originalIdx2;

var fixHelper2 = function(e, ui) {
  var tableAlias = $('.table-col-draggable-container-2 .table-column-draggable').clone().addClass('draggable-table-col-helper2').css({"background-color": "#ffffff", "top": "799px"});
  var tableAliasHead = tableAlias.find('thead');
  var tableAliasBody = tableAlias.find('tbody');
  tableAliasHead.html('');
  tableAliasBody.html('');
  tableAliasHead.append(`<tr>${ui.clone().prop('outerHTML')}</tr>`);
  // tableAliasHead.find('th').width(ui.outerWidth());
  return tableAlias;
};

$tableThead2.sortable({
  axis: "x" ,
  items: 'th',
  revert: 300,
  tolerance: "pointer",
  cursor: 'move',
  placeholder: 'ui-column-highlight2',
  appendTo: ".table-col-draggable-container-2",
  helper: fixHelper2,
  start: function(event, ui) {
    $('.ui-column-highlight2').html(ui.item.prop('innerHTML'));
    startIdx2 = $tableThead2.find('th').index(ui.item);
    $tableTbody2.find('tr').find('td:eq(' + startIdx2 + ')').each(function() {
      var tdElement = $(this);
      tdElement.addClass('ui-column-highlight2');
    });
    originalIdx2 = startIdx2;
  },
  change: function(event, ui) {
    var newIdx = $tableThead2.find('th').index($tableThead2.find('th.ui-column-highlight2'));
    if( newIdx > startIdx2 ) newIdx--;
    $tableTbody2.find('tr').find('td:eq(' + originalIdx2 + ')').each(function() {
        var tdElement = $(this);
        var tdElementParent = tdElement.parent();
        if(newIdx > originalIdx2) { // Move it the right
          tdElementParent.find('td:eq(' + newIdx + ')').after(tdElement); 
        } else { // Move it the left
          tdElementParent.find('td:eq(' + newIdx + ')').before(tdElement); 
        }
    });
    originalIdx2 = newIdx;
  },
  stop: function( event, ui ) {
    $tableTbody2.find('td').removeClass('ui-column-highlight2');
  }
});