(function($) {
	var _this = this;
    var extensionChangeIcon = {
		iconChange: function(){
			$(".datepicker .prev", _this).find("i").attr('class', 'fa fa-angle-left');
			$(".datepicker .next", _this).find("i").attr('class', 'fa fa-angle-right');
		}
    };
    $.extend(true, $.fn.datepicker.Constructor.prototype, extensionChangeIcon);

})(jQuery);

