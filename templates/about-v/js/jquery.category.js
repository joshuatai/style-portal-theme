/*
 * Dashboard UI Library: category.js v0.0.1
 * Copyright 2015-2015 Trend Micro
 * Licensed under the MIT license
 */
+(function (root, factory) {
  var define = root.define;

  if (typeof define === 'function' && define.amd) {
    root.define('category', ['jquery', 'uuid'], factory);
  } else {
    root.Category = factory(root.$ || root.jQuery, root.uuid);
  }

}(window, function ($, uuid, undefined) {
  function Category(el, options) {
    /*Initial Data*/
    var data = Category.storage.get('data');

    this.options = options;
    this.data = $.extend(true, [], this.options.data);

    if (data) {
      this.data = data;
    }
    if (this.data.length > 0) {
      if (this.options.selectedId) {
        var selectedTab = $.map(this.data, $.proxy(function (tab) {
          if (this.options.selectedId === tab.id) {
            return tab;
          } else if (tab.components && tab.components.length > 0) {
            var selectedPage;
            for (var p = 0; p < tab.components.length; p++) {
              if (this.options.selectedId === tab.components[p].id) {
                selectedPage = tab.components[p];
              }
            }
            if (selectedPage) {
              return selectedPage;
            } else {
              return [];
            }
          }
        }, this));

        if (selectedTab.length === 0) {
          this.options.selectedId = this.data[0].id;
        }
      } else {
        this.options.selectedId = this.data[0].id;
      }
    } else {
      this.options.selectedId = null;
    }

    this.selectedId = this.options.selectedId;
    /*Prepare DOM of Category*/
    if (this.options.type === 'sidebar') {

      this.$tabContainer = this.$el = $(el).addClass('sidebar');
      this.$content = $(this.options.content).exists() || $('<div class="tab-content"></div>');
      this.$tabs = {};
      this.$links = {};
      this.$linkSpans = {};
      this.$shownTab = {};
    } else {
      this.$el = $(el).addClass('categories');
      this.$scrollerLeft = ($('> .scroller-button-left', this.$el).exists() || $('<div class="scroller-button-left disabled"></div>')).attr('data-toggle', 'scroll-left').data('category', this);
      this.$scrollerRight = ($('> .scroller-button-right', this.$el).exists() || $('<div class="scroller-button-right disabled"></div>')).attr('data-toggle', 'scroll-right').data('category', this);
      this.$tabOutter = $('> .nav-tab-outter', this.$el).exists() || $('<div class="nav-tab-outter"></div>');
      this.$tabContainer = $('.nav.nav-tabs', this.$tabOutter).exists() || $('<ul class="nav nav-tabs"></ul>');
      this.$tabActivedHint = $('> .nav-tabs-actived-hint', this.$tabOutter).exists() || $('<div class="nav-tabs-actived-hint"></div>');
      this.$innerAddTab = ($('> .add-tab', this.$tabOutter).exists() || this.options.writable === true ? $('<div class="add-tab"></div>').append($(Category.getAddTabIcon()).data('category', this)) : $(null));
      this.$addTab = ($('> .add-tab', this.$el).exists() || this.options.writable === true ? $('<div class="add-tab"></div>').append($(Category.getAddTabIcon()).data('category', this)) : $(null));
      this.$content = $(this.options.content).exists() || $('<div class="tab-content"></div>');
      this.$linksDropdown = $('<ul class="dropdown-menu edit-tab" role="tab-editor"><li><a href="javascript:;" data-toggle="rename-tab">Rename</a></li><li><a href="javascript:;" data-toggle="delete-tab">Delete</a></li></ul>').data('category', this).insertAfter(this.$el);
      this.$tabs = {};
      this.$shownTab = {};
      this.$links = {};
      this.$linkSpans = {};
      this.$Inputs = {};
      this.$editors = {};
      this.$contents = {};
      this.$scrollerLeft
        .append(Category.getArrowLeftIcon())
        .add(this.$tabOutter.append(this.$tabContainer).append(this.$innerAddTab.addClass('hidden')).append(this.$tabActivedHint.addClass('hidden')))
        .add(this.$scrollerRight.append(Category.getArrowRightIcon()))
        .add(this.$addTab)
        .prependTo(this.$el);

      if (!$(this.options.content).exists()) this.$content.insertAfter(this.$el);
    }

    if (this.options.link === undefined) {
      this.options.link = function () {
        return '#';
      };
    }

    this.init();

  }

  // CATEGORY STATIC  PROPERTIES
  // ==================================
  Category.VERSION = '0.1.1';

  Category.$window = $(window);

  Category.$document = $(document);

  Category.DEFAULTS = {
    type: 'tabs',
    data: [],
    selected: null,
    animation: true,
    duration: 300,
    writable: true,
    dataParent: '#navigation-items'
  };

  Category.storage = $.initNamespaceStorage('category').localStorage;

  // CATEGORY STATIC  METHODS
  // ==================================
  Category.disable = function (elements) {
    elements.attr('disabled', true).addClass('disabled');
  }

  Category.enable = function (elements) {
    elements.removeAttr('disabled').removeClass('disabled');
  }

  Category.getAddTabIcon = function () {

    return '<a href="javascript:;" role="add-tab" data-toggle="add-tab">' +
             '<svg width="16" height="16" viewBox="0 0 16 16">' +
             '<polygon points="9,6.9 9,0.9 7,0.9 7,6.9 1,6.9 1,8.9 7,8.9 7,14.9 9,14.9 9,8.9 15,8.9 15,6.9 "/>' +
             '</svg>' +
           '</a>';

  };

  Category.getArrowRightIcon = function () {

    return '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.2" baseProfile="tiny" id="Layer_2" x="0px" y="0px" width="16" height="16" viewBox="0 0 16 16" xml:space="preserve">' +
             '<path d="M4.9,14c0.2,0,0.5-0.1,0.6-0.2l6.1-5.2C11.9,8.4,12,8.1,12,7.8s-0.1-0.6-0.4-0.8L5.5,1.9C5.1,1.5,4.5,1.6,4.1,2  C3.8,2.4,3.8,3,4.2,3.4l5.2,4.4l-5.2,4.4c-0.4,0.4-0.5,1-0.1,1.4C4.3,13.9,4.6,14,4.9,14z"/>' +
           '</svg>';

  };

  Category.getArrowLeftIcon = function () {

    return '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.2" baseProfile="tiny" id="Layer_1" x="0px" y="0px" width="16" height="16" viewBox="0 0 16 16" xml:space="preserve">' +
             '<path d="M11,14c-0.2,0-0.5-0.1-0.6-0.2L4.2,8.6C4,8.4,3.9,8.1,3.9,7.8S4,7.3,4.2,7.1l6.1-5.2c0.4-0.4,1.1-0.3,1.4,0.1  c0.4,0.4,0.3,1.1-0.1,1.4L6.4,7.8l5.2,4.4c0.4,0.4,0.5,1,0.1,1.4C11.6,13.9,11.3,14,11,14z"/>' +
           '</svg>';

  };

  // CATEGORY PRIVATE METHODS
  // ==================================
  Category.prototype = {

    init: function () {
      var options = this.options;
      this.render();

      if (options.type === 'sidebar') {
        this.$tabOutter;
      } else {
        this.$tabOutter
          .mCustomScrollbar({
            axis: 'x',
            theme: 'dashboard-theme',
            scrollInertia: 500,
            autoExpandScrollbar: true,
            advanced: {
              updateOnContentResize: false,
              autoExpandHorizontalScroll: true
            },
            contentTouchScroll: true,
            callbacks: {
              whileScrolling: $.proxy(function () {

                this.$scrollerLeft.removeClass('disabled');
                this.$scrollerRight.removeClass('disabled');

              }, this),
              onTotalScroll: $.proxy(function () {

                this.$scrollerRight.addClass('disabled');

              }, this),
              onTotalScrollBack: $.proxy(function () {

                this.$scrollerLeft.addClass('disabled');

              }, this)
            }
          });
      }
      setTimeout($.proxy(function () {

        this.$el.trigger($.Event('complete.bs.category'), [this]);

      }, this), 0);

    },

    render: function () {
      var options = this.options;
      var showEvent;

      $.each(this.data, $.proxy(function (index, item) {

        this.createTab(item);

      }, this));

      showEvent = $.Event('show.bs.tab');
      showEvent.relatedTarget = null;
      showEvent.target = this.$links[this.selectedId][0];
      this.$tabContainer.trigger(showEvent);

      if (options.type === 'sidebar') {
        this.$tabContainer.children().each($.proxy(function (index, tab) {
          var $tab = $(tab);
          this.$shownTab[index] = $tab;
          this.show($tab, index, options.duration / this.data.length);
        }, this));
      } else {
        this.$tabContainer.children().add(this.$innerAddTab).each($.proxy(function (index, tab) {
          var $tab = $(tab);
          this.$shownTab[index] = $tab;
          this.show($tab, index, options.duration / (this.data.length + 1));
        }, this));
        this.sortable();
        this.update();
      }
    },

    createTab: function (data) {
      var _this =  this;
      var options = _this.options;
      var newTab;
      if (options.type === 'sidebar') {
        newTab = this.$tabs[data.id] = $('<li class="cate-item"></li>');
        newTab
          .data('category', _this)
          .prepend(
            _this.$links[data.id] =
            $($.map($('<a href="javascript:;"></a>'), function (link) {
              var catename = data.icon.toLowerCase();
              var $icon = $('<i class="nav-icon-' + catename + '"></i>');
              var $link = $(link)
                .data('data', data)
                .append($icon)
                .append(_this.$linkSpans = $('<span>' + data.name + '</span>'));
              var $subNav;

              data.breadcrumbs = [data.name];
              if (data.components && data.components.length > 0) {
                $link
                  .attr({
                    'data-parent': options.dataParent,
                    'data-target': '#sub-nav-' + catename
                  });

                newTab.append(
                  $subNav = $('<ul id="sub-nav-' + catename + '" class="sub-nav collapse"></ul>')
                    .append('<li><h4>' + data.name + '</h4></li>')
                );
                for (var p = 0; p < data.components.length; p++) {
                  var page = data.components[p];
                  page.breadcrumbs = [data.name, page.name];
                  $subNav
                    .append(
                      _this.$tabs[page.id] = $('<li class="page-item"></li>').data('category', _this).append(_this.$links[page.id] = $('<a>').text(page.name).attr('href', options.link(page)).data('data', page))
                    );
                  if (_this.selectedId === page.id) {
                    newTab.add(_this.$tabs[page.id]).addClass('selected');
                    $subNav.addClass('in');
                  }
                }
              } else {
                $icon.attr('title', data.name);
                $link.attr('href', options.link(data));
                if (_this.selectedId === data.id) {
                  newTab.addClass('selected');
                }
              }
              return link;
            }))
          )
          .addClass('hidden')
          .appendTo(this.$tabContainer);

      } else {
        newTab = this.$tabs[data.id] = $('<li role="presentation"></li>')
          .data('category', this)
          .append(
            this.$links[data.id] =
            $('<a data-target="#' + data.id + '" aria-controls="' + data.id + '" role="tab" data-toggle="tab" draggable="false"></a>')
              .data('category', this)
              .append(
                this.$linkSpans[data.id] = $('<span></span>').text((data.name || ''))
              )
              .append(
                this.$Inputs[data.id] = $('<input type="text" data-toggle="tab-input" role="input"/>').data('category', this).val((data.name || ''))
              )
              .append(
                this.$editors[data.id] = $('<div class="more" data-toggle="dropdown" data-target=".edit-tab" role="editor"></div>').data('category', this)
              )
          )
          .addClass('hidden')
          .appendTo(this.$tabContainer);

        this.$contents[data.id] = $('<div role="tabpanel" class="tab-pane fade" id="' + data.id + '"></div>').appendTo(this.$content);
        if (this.selectedId === data.id) {
          newTab.add(this.$contents[data.id].addClass('in')).addClass('active');
        }
      }
      return newTab;

    },

    addTab: function () {

      var pages;
      var current;
      var newData;
      var newTab;
      var scrollable;
      var addEvent = $.Event('add.bs.category');

      pages = $.map($('[role="tab"] span:contains("Page ")', this.$tabContainer), function (item) {

        var number = Number($(item).text().split(' ')[1]);

        if ($.isNumeric(number) === true) return Number(number);

      });

      if (pages.length > 0) {
        current = Math.max.apply(Math, pages) + 1;
      } else {
        current = 1;
      }

      newData = {
        id: uuid(),
        name: 'Page ' + current
      };
      this.data.push(newData);
      newTab = this.createTab(newData);

      this.$shownTab[1] = newTab;
      this.show(newTab, 1, 1);

      this.sortable();
      if (this.$el.is('.scrollable') === false) {
        scrollable = false;
      } else {
        scrollable = true;
      }
      this.update();
      newTab.children().trigger('click');

      addEvent.info = $.extend({}, newData);
      addEvent.relatedTarget = newTab;
      addEvent.target = newTab[0];
      this.$el.trigger(addEvent);

      // if (scrollable === true) this.$tabOutter.mCustomScrollbar('scrollTo', 'right');

      setTimeout($.proxy(function () {

        if (scrollable === false) this.$tabOutter.mCustomScrollbar('scrollTo', 'right');
        newTab.addClass('adding-tab').trigger('edit');

      }, this), 300);

    },

    delTab: function (tab) {

      var link = tab.is('[role="presentation"]') === true ? tab.children() : tab;
      var tabId = link.data('target').replace('#', '');
      var $tab = this.$tabs[tabId];
      var content = this.$contents[tabId];
      var replacedActiveLink = $tab.prev().length > 0 ? $tab.prev().children() : $tab.next().children();
      var removeTab = function () {

        var deleteEvent = $.Event('delete.bs.category', {
          info: {
            tab: $tab,
            content: content
          }
        });

        this.data = $.grep(this.data, function (item) {

          if (item.id !== tabId) {
            return true;
          } else {
            deleteEvent.info.data = item;
            return false;
          }

        });

        delete this.$linkSpans[tabId];
        delete this.$Inputs[tabId];
        delete this.$editors[tabId];
        delete this.$links[tabId];
        delete this.$tabs[tabId];
        delete this.$contents[tabId];

        this.$el.trigger(deleteEvent);

        $tab.remove();
        content.remove();

        this.$tabActivedHint.css({
          width: replacedActiveLink.parent().width(),
          left: replacedActiveLink.parent().position().left
        });

        this.$el.trigger(
          $.Event('deleted.bs.category', {
            info: {
              data: deleteEvent.info.data
            }
          })
        );

      };

      replacedActiveLink.trigger($.Event('click'));
      setTimeout($.proxy(function () {

        tab.removeClass('show');

        if (this.options.animation === true && tab.hasClass('hidden')) {
          tab.one($.support.transition.end, $.proxy(removeTab, this));
        } else {
          removeTab.apply(this);
        }

      }, this), 300);

    },

    show: function (tab, index, duration) {
      var options = this.options;      
      if (options.animation === false) {
        tab.addClass('show');
        delete this.$shownTab[index];
        if (Object.keys(this.$shownTab).length === 0) {
          if (options.type !== 'sidebar') {
            this.$tabActivedHint.addClass('show');
          }
          this.$links[this.selectedId].trigger('shown.bs.tab', [this]);
        }
      } else {
        setTimeout($.proxy(function () {
          tab.addClass('show');
          delete this.$shownTab[index];
          if (options.type !== 'sidebar') {
            if (tab.is('.active') === true) this.$tabActivedHint.addClass('show');
          }
          if (Object.keys(this.$shownTab).length === 0) {
            setTimeout($.proxy(function () {              
              this.$links[this.selectedId].trigger('shown.bs.tab', [this]);
            }, this), 20);
          }
        }, this), index * duration);
      }
    },

    sortable: function () {

      if (this.$tabContainer.data('ui-sortable')) {
        this.$tabContainer.sortable('destroy');
      }

      this.$tabContainer
        .sortable({
          axis: 'x',
          revert: true,
          helper: 'clone',
          cursor: 'move',
          distance: 10,
          tolerance: 'pointer',
          items: '> [role="presentation"]',
          opacity: 0.7,
          placeholder: 'sortable-placeholder',
          containment: '.mCSB_container'
        })
        .disableSelection();

    },

    disortable: function () {

      if (this.$tabContainer.data('ui-sortable')) {
        this.$tabContainer.sortable('destroy').enableSelection();
      }

    },

    checkExpandable: function () {

      var totalWidth = $.map(this.$tabs, function (item) {

        return $(item).width();

      }).reduce(function (a, b) {

        return a + b;

      });

      if (this.options.writable === true) {
        totalWidth += (this.$innerAddTab.outerWidth() + 1);
      }

      if ((this.$el.width() - (20 + 110)) < totalWidth) {
        totalWidth -= this.$innerAddTab.outerWidth();
        this.$el.addClass('scrollable');
      } else {
        this.$el.removeClass('scrollable');
      }

      return totalWidth;

    },

    update: function () {

      this.checkExpandable();
      this.$tabOutter.mCustomScrollbar('update');

    }

  };

  // CATEGORY PLUGIN DEFINITION
  // ===========================
  function Plugin(option, _relatedTarget) {

    return this.each(function () {

      var $this = $(this);
      var data = $this.data('category');
      var options = $.extend(true, {}, Category.DEFAULTS, $this.data(), typeof option == 'object' && option);

      if (!data) {
        $this.data('category', (data = new Category(this, options)));
      }

      if (typeof option == 'string') data[option](_relatedTarget);

    });

  }

  // CATEGORY NO CONFLICT
  // =====================
  var old = $.fn.category;
  $.fn.category = Plugin;
  $.fn.category.Constructor = Category;
  $.fn.category.noConflict = function () {

    $.fn.category = old;
    return this;

  }


  // CATEGORY DATA-API
  // ============
  $(document)
    .on('click.bs.tab', '.navigation-items a, .portal-navigation-items a', function () {
      var $this = $(this);      
      var data = $this.data('data');
      var category = $this.parent().data('category');
      var hasPages = data.components && data.components.length > 0;
      var $parent = $this.parent();
      var $navItems = $parent.closest('.navigation-items, .portal-navigation-items');
      var $cate = $this.closest('.cate-item');
      var $subNav = $cate.children('ul')
      var $existCate = $navItems.find('.collapse.in');

      if (hasPages === true) return;
      if ($parent.is('.selected')) return;

      $('li.selected', $navItems).removeClass('selected');
      $parent.add($cate).addClass('selected');
      
      if (!$existCate.is($subNav)) {
        $existCate.prev().addClass('collapsed').attr('aria-expanded', 'false');
        $existCate.removeClass('in');
        $subNav.addClass('in');
      }

      if ($parent.is('.cate-item') === true) {
        $('[aria-expanded="true"]', $navItems).collapse('hide');
        $('.navigation.collapsed .sub-nav, .portal-navigation.collapsed .portal-sub-nav', $navItems).css('height', '');
      }
      category.preSelectedId = category.selectedId;
      category.selectedId = data.id;
      category.$links[data.id].trigger('shown.bs.tab', [category]);
    })
    .on('show.bs.tab', '.sidebar', function (event) {
      var data = $(event.target).parent().data('category');      
      data.$el.trigger($.Event('show.bs.sidebar', {
        instance: data
      }));
    })
    .on('shown.bs.tab', '.sidebar', function (event) {
      var data = $(event.target).parent().data('category');
      setTimeout(function () {
        data.$el.trigger($.Event('shown.bs.sidebar', {
          instance: data
        }));

      }, 0);
    })

    .on('show.bs.tab', '.categories .nav-tabs', function (event) {
      var target = $(event.target).addClass('switch-tab');
      var data = target.data('category');
      data.preSelectedId = data.selectedId;
      data.selectedId = target.data('target').replace('#', '');
      data.$el.trigger($.Event('show.bs.category', {
        instance: data
      }));
      data.$tabActivedHint.css({
        width: target.parent().width(),
        left: target.parent().position().left
      });

    })
    .on('shown.bs.tab', '.categories .nav-tabs', function (event) {

      var data = $(event.target).data('category');
      setTimeout(function () {
        data.$el.addClass('initialed');
        data.$links[data.selectedId].removeClass('switch-tab');
        data.$el.trigger($.Event('shown.bs.category', {
          instance: data
        }));

      }, 0);

    })
    .on('sortstart', '.categories .ui-sortable', function (event, ui) {

      var $tab = $(ui.item);
      var data = $tab.data('category');

      data.$tabContainer.addClass('sorting');
      $('.sortable-placeholder').width($tab.width());

      if ($tab.is(data.$tabs[data.selectedId]) === true) {
        data.$tabActivedHint.appendTo(ui.helper);
      } else {
        data.$tabActivedHint.appendTo(data.$tabs[data.selectedId]);
      }

    })
    .on('sortstop', '.categories .ui-sortable', function (event, ui) {

      var $tab = $(ui.item);
      var data = $tab.data('category');

      data.$tabContainer.removeClass('sorting');
      data.$tabActivedHint
        .css('left', data.$tabs[data.selectedId].position().left)
        .insertAfter(data.options.writable === true ? data.$innerAddTab : data.$tabContainer);

      data.$el.trigger($.Event('sorten.bs.category', {
        instance: data
      }));

    })
    .on('click', '.categories .scroller-button-left', function () {

      $(this).data('category').$tabOutter.mCustomScrollbar('scrollTo', '+=200', { scrollEasing: 'easeInOut' });

    })
    .on('click', '.categories .scroller-button-right', function () {

      $(this).data('category').$tabOutter.mCustomScrollbar('scrollTo', '-=200', { scrollEasing: 'easeInOut' });

    })
    .on('click.bs.tab', '[data-toggle="add-tab"]', function () {

      $(this).data('category').addTab();

    })
    .on('show.bs.dropdown', '[role="tab-editor"]', function () {
      // console.log('gegew');
      /*var $dropdown = $(this);
      var data = $dropdown.data('category');

      data.$editors[data.selectedId].addClass('expanded');

      $dropdown.css({
        left: data.$editors[data.selectedId].offset().left - 6,
        top: data.$editors[data.selectedId].offset().top + data.$editors[data.selectedId].height() + 2
      });*/

    })
    .on('hide.bs.dropdown', '[role="tab-editor"]', function () {

      var data = $(this).data('category');

      data.$editors[data.preSelectedId].add(data.$editors[data.selectedId]).removeClass('expanded');

    })
    .on('edit', '.categories [role="presentation"]', function () {

      var $tab = $(this);
      var data = $tab.data('category');
      var $linkSpans = $(data.$linkSpans[data.selectedId]);
      var tabInput = data.$Inputs[data.selectedId].css('width', $linkSpans.width());

      $tab.addClass('editting');
      data.disortable();
      tabInput.trigger($.Event('focus'));
      tabInput.select();

    })
    .on('click', '.categories [data-toggle="tab-input"]', function () {
      // event.stopPropagation();
      // event.preventDefault();
    })
    .on('input', '.categories [data-toggle="tab-input"]', function () {

      var $input = $(this);
      var data = $input.data('category');
      var tab = data.$tabs[data.selectedId];

      data.$linkSpans[data.selectedId].text($input.val());

      if (data.$linkSpans[data.selectedId].width() > 156) {
        $input.val($input.data('orgVal'));
        data.$linkSpans[data.selectedId].text($input.val());
      } else {
        $input.css('width', data.$linkSpans[data.selectedId].width());
        data.$tabActivedHint.css('width', data.$tabs[data.selectedId].outerWidth());
        data.$tabContainer.parent().css('width', data.checkExpandable());
      }

      if (data.$el.is('.scrollable') === false) {
        data.$tabContainer.parent().css('left', 0);
      }
      if (tab.is('.adding-tab') === true) data.$tabOutter.mCustomScrollbar('scrollTo', 'right');

    })
    .on('keydown', '.categories [data-toggle="tab-input"]', function () {

      var $input = $(this);
      $input.data('orgVal', $input.val());

    })
    .on('keyup', '.categories [data-toggle="tab-input"]', function (event) {

      if (event.keyCode === 13 || event.keyCode === 27) {
        $(this).trigger($.Event('blur'));
      }

    })
    .on('paste', '.categories [data-toggle="tab-input"]', function () {

      var $input = $(this);
      $input.data('orgVal', $input.val());

    })
    .on('blur', '.categories [data-toggle="tab-input"]', function () {

      var $input = $(this);
      var data = $input.data('category');
      var tabData;
      tabData = $.map(data.data, function (cate) {

        if (cate.id === data.selectedId) {
          cate.name = $input.val();
          return cate;
        }

      })[0];
      var renameEvent = $.Event('rename.bs.category', {
        info: tabData
      });

      data.$tabs[data.selectedId].removeClass('adding-tab editting');
      data.$tabActivedHint.css('width', data.$tabs[data.selectedId].outerWidth());
      data.sortable();
      data.$el.trigger(renameEvent);

    })
    .on('click.bs.tab', '[data-toggle="rename-tab"]', function () {

      var data = $(this).parent().parent().data('category');

      data.$tabs[data.selectedId].trigger($.Event('edit'));

    })
    .on('click.bs.tab', '[data-toggle="delete-tab"]', function () {

      var data = $(this).parent().parent().data('category');

      data.delTab.apply(data, [data.$tabs[data.selectedId]]);

    });

  return Category;
}));
