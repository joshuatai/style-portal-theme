//Add a customize code at original search function.
$.tokenize.prototype.search = function() {
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

$.tokenize.prototype.tokenAdd = function(value, text, first) {
    value = this.escape(value).trim();

    if(value == undefined || value == ''){
        return this;
    }

    text = text || value;
    first = first || false;

    if(this.options.maxElements > 0 && $('li.Token', this.tokensContainer).length >= this.options.maxElements){
        this.resetSearchInput();
        return this;
    }

    var $this = this;
    var close_btn = $('<a />')
        .addClass('Close')
        .html("&#215;")
        .on('click', function(e){
            e.stopImmediatePropagation();
            $this.tokenRemove(value);
        });

    if($('option[value="' + value + '"]', this.select).length){
        if(!first && ($('option[value="' + value + '"]', this.select).attr('selected') === true ||
            $('option[value="' + value + '"]', this.select).prop('selected') === true)){
            this.options.onDuplicateToken(value, text, this);
        }
        $('option[value="' + value + '"]', this.select).attr('selected', true).prop('selected', true);
    } else if(this.options.newElements || (!this.options.newElements && $('li[data-value="' + value + '"]', this.dropdown).length > 0)) {
        var option = $('<option />')
            .attr('selected', true)
            .attr('value', value)
            .attr('data-type', 'custom')
            .prop('selected', true)
            .html(text);
        this.select.append(option);
    } else {
        this.resetSearchInput();
        return this;
    }

    if($('li.Token[data-value="' + value + '"]', this.tokensContainer).length > 0) {
        return this;
    }

    $('<li />')
        .addClass('Token')
        .attr('data-value', value)
        .append('<span>' + text + '</span>')
        .prepend(close_btn)
        .insertBefore(this.searchToken);

    if(!first){
        this.options.onAddToken(value, text, this);
    }
    this.updateOrder();
    this.search();
    this.updatePlaceholder();
    return this;

}

var close_btn = '<span class="icon icon-cancel"></span>';
var token = $('[data-token-field=token]', this);

token.tokenize({
    displayDropdownOnFocus: true,
    placeholder: "Select...",
    newElements: false,
    onAddToken: function(value, text, first) {
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
  $('.Dropdown').addClass('dropdown-menu').hide();


  $('.tag-editor').find(".Token a ").html(close_btn);
  $('.tokenize').prepend(close_btn);

  $('.tokenize > .icon-cancel').on('click', function(e){
    $('#tokenize').tokenize().clear();
    $('#tokenize').tokenize().remap();
    $(this).hide();
  });
});