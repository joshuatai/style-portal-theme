//Add a customize code at original search function.
$.tokenize.prototype.search = function(){
    var $this = this;
    var count = 1;

    if((this.options.maxElements > 0 && $('li.Token', this.tokensContainer).length >= this.options.maxElements) ||
        this.searchInput.val().length < this.options.searchMinLength){
        return false;
    }

    if(this.options.datas == 'select'){

        var found = false, regexp = new RegExp(this.searchInput.val().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'i');
        this.dropdownReset();

        $('option', this.select).not(':selected, :disabled').each(function(){
            if(count <= $this.options.nbDropdownElements){
                if(regexp.test($(this).html())){
                    $this.dropdownAddItem($(this).attr('value'), $(this).html());
                    found = true;
                    count++;
                }
            } else {
                return false;
            }
        });

        if(found){
            $('li:first', this.dropdown).addClass('Hover');
            this.dropdownShow();
        } else {
            this.dropdownHide();
            this.options.onSearchNotFound(this);//customize to call not found function.
        }

    } else {
        this.debounce(function(){
            if(this.ajax()){
                this.ajax.abort();
            }
            this.ajax = $.ajax({
                url: $this.options.datas,
                data: $this.options.searchParam + "=" + encodeURIComponent($this.searchInput.val()),
                dataType: $this.options.dataType,
                success: function(data){
                    if(data){
                        $this.dropdownReset();
                        $.each(data, function(key, val){
                            if(count <= $this.options.nbDropdownElements){
                                var html;
                                if(val[$this.options.htmlField]){
                                    html = val[$this.options.htmlField];
                                }
                                $this.dropdownAddItem(val[$this.options.valueField], val[$this.options.textField], html);
                                count++;
                            } else {
                                return false;
                            }
                        });
                        if($('li', $this.dropdown).length){
                            $('li:first', $this.dropdown).addClass('Hover');
                            $this.dropdownShow();
                            return true;
                        }
                    }
                    $this.dropdownHide();
                },
                error: function(xhr, text_status) {
                    $this.options.onAjaxError($this, xhr, text_status);
                }
            });
        }, this.options.debounce);
    }
}

var close_btn = '<span class="icon icon-cancel"></span>';
var token = $('[data-token-field=token]', this);
token.tokenize({
    displayDropdownOnFocus: true,
    placeholder: "Select...",
    newElements: false,
    onAddToken: function(value, text, first){
      $('.tokenize > .icon-cancel').show();
      $('.tag-editor').find(".Token a ").html(close_btn);
    },
    onRemoveToken: function(value, e){
      if ($('.Token').length == 0) {
        $('.tokenize > .icon-cancel').hide();
      }
    },
    onSearchNotFound: function(o){
      o.dropdown.append("<li class=\"no-matches\">No matches found.</li>").show();
    }
});
if (token.length > 0) {
  $(this).parent().addClass("overflow");
}

$('[data-token-field=initialize]', this).each(function() {
  $('.Placeholder').addClass('placeholder');
  $('.Tokenize').addClass('tokenize');
  $('.TokensContainer').addClass('tag-editor');
  $('.Dropdown').addClass('dropdown-menu');


  $('.tag-editor').find(".Token a ").html(close_btn);
  $('.tokenize').prepend(close_btn);

  $('.tokenize > .icon-cancel').on('click', function(e){
    $('#tokenize').tokenize().clear();
    $('#tokenize').tokenize().remap();
    $(this).hide();
  });
});