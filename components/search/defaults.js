$('[data-clear-field=clearField]', this).on('click', function (event){
	$(this).parent().find("input").val("");
});