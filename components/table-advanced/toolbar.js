toolbarSelection('#table-selected');
toolbarSelection('#plain-table-selected');

function toolbarSelection(selector) {
	var selectText;
	var tableSelected = $(selector);
	var table = $('table', tableSelected);
	var functionalBlock = $('.controls', tableSelected);
	var textOfSelected = $('.selected-records .count', functionalBlock);
	var tbodyRow = $("tbody > tr", table);
	var partialCheckbox = $('thead > tr > th.gutter input[type="checkbox"]', table);
	var tbodyCheckbox = $('input[type="checkbox"]', tbodyRow);
	var hasDblclicked = false;
	var clickTimer;
	var dblclickRecoverTimer;

	table.on('click', "tbody > tr", function (e) {
		var _this = $(this);

		if (hasDblclicked) {
			clearTimeout(dblclickRecoverTimer);
			dblclickRecoverTimer = setTimeout(() => hasDblclicked = false, 300);
			return;
		}

		clearTimeout(clickTimer);
		clickTimer = setTimeout(function () {
			var eachCheckbox = _this.find('input[type="checkbox"]');
			selectText = getSelectedText();

			if (selectText == "") {
				if (_this.hasClass('active')) {
					eachCheckbox.prop("checked", false);
					partialCheckbox.prop("checked", false);
					_this.removeClass('active');
					var numberOfChecked = table.find('tbody input[type="checkbox"]:checked');
					textOfSelected.html(numberOfChecked.length);
					if (numberOfChecked.length == 0) {
						partialCheckbox.removeClass("checkbox-partial");
						functionalBlock.removeClass("show");
					}
				} else {
					eachCheckbox.prop("checked", true);
					_this.addClass('active');
					partialCheckbox.addClass("checkbox-partial");
					var numberOfChecked = table.find('tbody input[type="checkbox"]:checked');
					textOfSelected.html(numberOfChecked.length);
					functionalBlock.addClass("show");
					if (numberOfChecked.length == tbodyRow.length) {
						partialCheckbox.prop("checked", true);
					}
				}
			}
		}, 250);

		e.preventDefault();
	});

	table.on('dblclick', "tbody > tr", function (e) {
		clearTimeout(clickTimer);
		hasDblclicked = true;
	});

	table.on('click', "thead > tr > th.gutter > .form-check", function (e) {
		var tbodyRowActive = table.find("tbody > tr.active");

		if (tbodyRow.hasClass('active') || tbodyRowActive.length == 0) {
			// checked all row
			tbodyRow.addClass('active');
			partialCheckbox.addClass("checkbox-partial");
			partialCheckbox.prop("checked", true);
			tbodyCheckbox.prop("checked", true);
			textOfSelected.html(tbodyRow.length);
			functionalBlock.addClass("show");

			// unchecked all row
			if (tbodyRowActive.length == tbodyRow.length) {
				tbodyRow.removeClass('active');
				partialCheckbox.removeClass("checkbox-partial");
				partialCheckbox.prop("checked", false);
				tbodyCheckbox.prop("checked", false);
				textOfSelected.html("");
				functionalBlock.removeClass("show");
			}
		}
		e.preventDefault();
	});

	function getSelectedText() {
		if (window.getSelection) {
			var range = window.getSelection();
			return range.toString();
		}
		else {
			if (document.selection.createRange) { // IE
				var range = document.selection.createRange();
				return range.text;
			}
		}
	}
}