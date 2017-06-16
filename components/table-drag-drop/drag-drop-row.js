
function getSelectedText () {
	if (window.getSelection) {
		return window.getSelection().toString();
	}

	// IE
	if (document.selection.createRange) {
		return document.selection.createRange().text;
	}
}

var fixHelper = function(e, ui) {
    ui.children().each(function() {
        $(this).width($(this).width());
    });
    return ui;
};

$('.table-row-draggable tbody').sortable({
    placeholder: "table-draggable-placeholder",
    cursor: 'move',
    appendTo: "parent",
    helper: fixHelper,
	start: function (e, ui) {
      var $target = $(ui.item);
      var span = $target.find('td').length;
      var $row = $('<tr class="table-shadow">');
      var $cell = $('<td>').attr('colspan', span).html('&nbsp;');

      $target.prev().addClass('table-draggable-sibling');
      $row.append($cell).height($target.height());
      $target.before($row);
      //$target.insertAfter($('.table tbody tr').last());

	  var $container = $target.parents(".table-draggable-container");
	  var $helper = $container.find(".table-helper");

	  $target.appendTo($helper);

    },
	sort: function(e, ui) {
		var idx = $(ui.placeholder).index();
		$('.table-row-draggable thead tr th').css('border-bottom-width', idx ? '2px' : '1px');
    },
	stop: function () {
      $('.table-row-draggable tbody .table-shadow').remove();
      $('.table-row-draggable tbody .table-draggable-sibling').removeClass('table-draggable-sibling');
    }
});


$('.table-row-draggable').on('click', 'thead > tr > th.gutter > .checkbox', (e) => {
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