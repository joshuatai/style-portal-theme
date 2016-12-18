//Add customize codes at original filter function.
EditableSelect.prototype.filter = function () {
  var hiddens = 0;
  var search  = this.$input.val().toLowerCase().trim();
  
  this.$list.find('li').addClass('es-visible').show();
  this.$list.find('li.no-matches').remove();//customize to remove <li> element at the begin of filter event.
  if (this.options.filter) {
    hiddens = this.$list.find('li').filter(function (i, li) { return $(li).text().toLowerCase().indexOf(search) < 0; }).hide().removeClass('es-visible').length;
    if (this.$list.find('li').length == hiddens) {
      //this.hide();
      this.onSearchNotFound();//customize to call onSearchNotFound function.
    }
  }
};
//Customize onSearchNotFound function
EditableSelect.prototype.onSearchNotFound = function () {
  if(!this.$list.find('li').hasClass("no-matches")) {
    this.$list.append("<li class=\"no-matches\">No matches found.</li>");
  }
};
var container = this;
var combobox = $('[data-combobox=combobox]', container);
combobox.editableSelect({
    effects: 'fade'
});
combobox.on('show.editable-select', function (e) {
    //make drop-down-mwnu always open
    $('.es-list').css("top", "auto");
    $('.es-list').find('li').addClass("es-visible");
    $('.es-list').find('li').show();
});
combobox.on('select.editable-select', function (e) {
    //when drop-down-mwnu list seleted will have background
    $('.icon-cancel').show();
    $(this).addClass("selected");  
});
if (combobox.length === 1) {        
  $(container).parent().addClass("overflow");
}
$('[data-combobox=initialize]', container).each(function() {
  var $combobox =  $('.combobox');
  var input = $('.combobox').find(".es-input");
  var list = $('.combobox').find(".es-list");
  var list_item = $('.combobox').find(".es-list li");
  var close_btn = $('<span />').addClass('icon icon-cancel');

  input.addClass("form-control");
  list.addClass("dropdown-menu");
  input.attr("placeholder", "Select...");
  close_btn.appendTo($combobox);
  close_btn.hide();

  input.on('input keydown', function (e) {
      if(input.val() == "" || e.keyCode=='46') {
        $('.es-list').css("top", "auto");
        close_btn.hide();
      }
      else {
        $('.es-list').css("top", "auto");
        close_btn.show();
      }
  });
  //console.log($._data(input.data("editableSelect").$input, "events"))
  $combobox.on('click', function (event) {
    if (!list.is(":visible")) {
      input.trigger("focus");  
    } else {
      event.preventDefault();
    }
    //if (!list.is(":visible"))         
  });
  close_btn.on('click', function (e) {
      input.val("");
      $('.es-list').find('li.no-matches').remove();
      $('.es-list').find('li').addClass("es-visible");
      $('.es-list').find('li').show();
      close_btn.hide();
  });        
});
