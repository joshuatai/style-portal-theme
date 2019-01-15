;(function (factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define([
      'jquery',
      'jquery.ui.widget'
    ], factory);
  } else if (typeof exports === 'object') {
    factory(
      require('jquery'),
    );
  } else {
    factory(window.jQuery);
  }
})(function ($) {
  'use strict';

  class Key {
    constructor (key) {
      this.key = key;
    }

    is (v) { return this.key === v; }
    get isTab () { return this.key === 'Tab'; }
    get isHome () { return this.key === 'Home'; }
    get isEnd () { return this.key === 'End'; }
    get isPageUp () { return this.key === 'PageUp'; }
    get isPageDown () { return this.key === 'PageDown'; }
    get isArrowUp () { return this.key === 'ArrowUp'; }
    get isArrowDown () { return this.key === 'ArrowDown'; }
    get isSpace () { return this.key === ' '; }
  }

  $.widget('hie.multipleSelection', {
    options: {
      selectableOptgroup: true,
      doubleClickToMove: true,
      recursiveActive: true,
      buttonClass: '',
      buttonIcons: {
        addAll: '>>',
        add: '>',
        removeAll: '<<',
        remove: '<'
      }
    },
    values: function () {
      return this.element.find('option').toArray().filter(v => v.selected).map(v => v.value);
    },
    enable: function () {
      this.element.attr('disabled', false);
      this._$btnSelectAll.attr('disabled', false);
      this._$btnSelect.attr('disabled', false);
      this._$btnDeselectAll.attr('disabled', false);
      this._$btnDeselect.attr('disabled', false);
      this._$container.removeClass('disabled');
      this._disabled = false;
    },
    disable: function () {
      this.element.attr('disabled', true);
      this._$btnSelectAll.attr('disabled', true);
      this._$btnSelect.attr('disabled', true);
      this._$btnDeselectAll.attr('disabled', true);
      this._$btnDeselect.attr('disabled', true);
      this._$container.addClass('disabled');
      this._disabled = true;
    },
    _create: function () {
      this._super();
      this._disabled = this.options.disabled;
      this._items = [];
      this._groups = [];
      this._retrieveElemId();
      this._updateSelectStyles();
      this._renderContainer();
      this._renderItems();
      this._renderButtons();
      this._updateItemVisibility();
      this._disabled && this.disable();
    },
    _init: function () {
      const { selectableOptgroup, doubleClickToMove } = this.options;
      this._$container.on('mouseover', '.ms-elem-selectable,.ms-elem-selection', this._onMouseOverItem.bind(this));
      this._$container.on('mouseout', '.ms-elem-selectable,.ms-elem-selection', this._onMouseOutItem.bind(this));
      this._$container.on('mousedown', '.ms-elem-selectable,.ms-elem-selection', this._onSelectItem.bind(this));
      this._$container.on('keydown', '.ms-list-item', this._onKeydownItem.bind(this));
      this._$container.on('keydown', '.ms-select-root', this._onKeydownSelect.bind(this));
      this._$container.on('focusin', '.ms-select-root', this._onFocusSelect.bind(this));
      this._$container.on('focusout', '.ms-select-root', this._onBlurSelect.bind(this));
      this._$container.on('focusin', '.ms-list-item', this._onFocusItem.bind(this));
      this._$btnSelectAll.on('click', this._onSelectAllSelectable.bind(this));
      this._$btnSelect.on('click', this._onSelectActiveSelectable.bind(this));
      this._$btnDeselectAll.on('click', this._onDeselectAllSelection.bind(this));
      this._$btnDeselect.on('click', this._onDeselectActiveSelection.bind(this));
      selectableOptgroup && this._$container.on('mousedown', '.ms-optgroup-label', this._onSelectGroupLabel.bind(this));
      doubleClickToMove && this._$container.on('dblclick', '.ms-elem-selectable,.ms-elem-selection', this._onDoubleClickItem.bind(this));
      doubleClickToMove && this._$container.on('dblclick', '.ms-optgroup-label', this._onDoubleClickGroupLabel.bind(this));
    },
    _retrieveElemId: function () {
      this._id = this.element.attr('id') || this._generateElemId('ms-');
      this.element.attr('id', this._id);
    },
    _generateElemId: function (prefix) {
      return (prefix || '') + new Date().getTime().toString(16);
    },
    _makeSelectData: function () {
      return {
        activeItems: [],
        lastFocusItem: null,
        lastSelectedItem: null,
      };
    },
    _updateSelectStyles: function () {
      this.element.css({
        'position': 'absolute',
        'visibility': 'hidden',
      });
    },
    _scrollSelect: function ($select, $item, clientY) {
      const list = this._findSelectList($select).get(0);
      const scrollTop = list.scrollTop;
      const selectRect = $select.get(0).getBoundingClientRect();
      const itemHeight = $item.outerHeight() + 8;
      const isMouseYNearTop = (clientY - selectRect.top) <= itemHeight;
      const isMouseYNearBottom = (selectRect.top + selectRect.height - clientY) <= itemHeight;
      isMouseYNearTop && list.scrollTo({ top: scrollTop - itemHeight, behavior: 'smooth' });
      isMouseYNearBottom && list.scrollTo({ top: scrollTop + itemHeight, behavior: 'smooth' });
    },
    _renderContainer: function () {
      this._$container = $('<div class="ms-container ms-advanced-container" tabindex="-1">');
      this._$selectable = $('<div class="ms-selectable ms-select-root" tabindex="0">').data(this._makeSelectData());
      this._$selection = $('<div class="ms-selection ms-select-root" tabindex="0">').data(this._makeSelectData());
      this._$container.append(this._$selectable, this._$selection);
      this.element.after(this._$container);
    },
    _renderItems: function () {
      this._$selectable.append(this._renderList('ms-elem-selectable', false));
      this._$selection.append(this._renderList('ms-elem-selection', true));
    },
    _renderList: function (itemClass, showSelected) {
      const $options = this.element.find('> optgroup, > option');
      const $items = $options.toArray().map(option => {
        if (option.nodeName === 'OPTGROUP') {
          return this._renderGroupItems(option, $(option).find('option'), itemClass, showSelected);
        }
        return this._renderItem(option, itemClass, showSelected);
      });
      const $list = $('<ul class="ms-list">').append($items);
      return $list;
    },
    _renderItem: function (option, itemClass, showSelected) {
      const { label } = option;
      const $text = $('<span>').text(label);
      const $item = $('<li class="ms-list-item" tabindex="-1">').addClass(itemClass).append($text).data({ option });
      this._items.push({ option, $item, showSelected });
      return $item;
    },
    _renderGroupItems: function (group, $options, itemClass, showSelected) {
      const options = $options.toArray();
      const $items = options.map(option => this._renderItem(option, itemClass, showSelected));
      const $label = $('<li class="ms-optgroup-label">').text(group.label);
      const $group = $('<ul class="ms-optgroup">').append($label, $items).data({ options });
      const $container = $('<li class="ms-optgroup-container">').append($group);
      this._groups.push({ group, $group, $items });
      return $container;
    },
    _renderButtons: function () {
      const { buttonClass, buttonIcons } = this.options;
      const { addAll, add, removeAll, remove } = buttonIcons;
      const $btn = $('<button>').addClass(buttonClass);
      this._$btnSelectAll = $btn.clone().addClass('action-add-all').html(addAll);
      this._$btnSelect = $btn.clone().addClass('action-add').html(add);
      this._$btnDeselectAll = $btn.clone().addClass('action-remove-all').html(removeAll);
      this._$btnDeselect = $btn.clone().addClass('action-remove').html(remove);
      this._$btns = $('<div class="ms-buttons">');
      this._$btns.append(this._$btnSelectAll, this._$btnSelect, this._$btnDeselect, this._$btnDeselectAll);
      this._$selectable.after(this._$btns);
    },
    _saveLastSelectedItem: function ($select, lastSelectedItem) {
      $($select).data({ lastSelectedItem });
    },
    _saveLastFocusItem: function ($select, lastFocusItem) {
      $($select).data({ lastFocusItem });
    },
    _updateOptionSelectedOfActiveItems: function (parent, state) {
      this._findActiveItems(parent).toArray().forEach(item => {
        $(item).data('option').selected = state;
      });
    },
    _updateItemVisibility: function () {
      this._items.forEach(item => {
        const { option, $item, showSelected } = item;
        const visible = !(option.selected ^ showSelected);
        $item.prop('hidden', !visible);
      });
      this._groups.forEach(group => {
        const { $group, $items } = group;
        const visible = $items.filter($item => !$item.prop('hidden')).length > 0;
        $group.prop('hidden', !visible);
      });
    },
    _isSelectRoot: function (target) {
      return $(target).is('.ms-select-root');
    },
    _isSelectableSelect: function (target) {
      return $(target).is('.ms-selectable');
    },
    _isGroup: function (target) {
      return $(target).is('.ms-optgroup');
    },
    _isGroupLabel: function (target) {
      return $(target).is('.ms-optgroup-label');
    },
    _findSelectRoot: function (child) {
      return $(child).parents('.ms-select-root');
    },
    _findSelectList: function (parent) {
      return $(parent).find('.ms-list');
    },
    _findGroup: function (child) {
      return $(child).parent('.ms-optgroup');
    },
    _findGroups: function (parent) {
      return $(parent).find('.ms-optgroup');
    },
    _findGroupLabel: function (parent) {
      return $(parent).find('.ms-optgroup-label');
    },
    _findActivatingGroupLabel: function (parent) {
      return $(parent).find('.ms-optgroup-label.ms-activating');
    },
    _findVisibleItems: function (parent) {
      return $(parent).find('.ms-list-item:visible');
    },
    _findVisibleSiblingItems: function (target) {
      return $(target).siblings('.ms-list-item:visible');
    },
    _findActiveItems: function (parent) {
      return $(parent).find('.ms-list-item').filter('.ms-activating,.ms-active');
    },
    _findActivatingItems: function (parent) {
      return $(parent).find('.ms-list-item.ms-activating');
    },
    _confirmActivatingItems: function ($select) {
      const $labels = this._findActivatingGroupLabel($select);
      const $items = this._findActivatingItems($select);
      $labels.removeClass('ms-activating').addClass('ms-active');
      $items.removeClass('ms-activating').addClass('ms-active');
    },
    _deactivateAllActiveItems: function ($select) {
      const $labels = this._findGroupLabel($select);
      const $items = this._findVisibleItems($select);
      $labels.add($items).removeClass('ms-active ms-activating');
    },
    _deactivateAllActivatingItems: function ($select) {
      const $labels = this._findGroupLabel($select);
      const $items = this._findVisibleItems($select);
      $labels.add($items).removeClass('ms-activating');
    },
    _deactivateGroupActiveItems: function ($group) {
      const $label = this._findGroupLabel($group);
      const $items = this._findVisibleItems($group);
      $label.add($items).removeClass('ms-active ms-activating');
    },
    _deactivateActivatingItem: function (item) {
      $(item).removeClass('ms-activating');
    },
    _deactivateActiveItem: function (item) {
      $(item).removeClass('ms-active');
    },
    _activateSelect: function (item) {
      const $select = this._findSelectRoot(item);
      const $items = this._findVisibleItems($select);
      this._deactivateAllActiveItems($select);
      this._activateItems($select, $items.first(), $items.last());
    },
    _activateItemsBefore: function (item) {
      const $select = this._findSelectRoot(item);
      const $items = this._findVisibleItems($select);
      const { lastSelectedItem } = $select.data();
      const first = $items.first().focus();
      this._deactivateAllActivatingItems($select);
      this._activateItems($select, first, lastSelectedItem);
    },
    _activateItemsAfter: function (item) {
      const $select = this._findSelectRoot(item);
      const $items = this._findVisibleItems($select);
      const { lastSelectedItem } = $select.data();
      const last = $items.last().focus();
      this._deactivateAllActivatingItems($select);
      this._activateItems($select, last, lastSelectedItem);
    },
    _activateMoreItemsBefore: function (currentItem) {
      const $currentItem = $(currentItem);
      const $select = this._findSelectRoot(currentItem);
      const $items = this._findVisibleItems($select);
      const { lastSelectedItem } = $select.data();
      const $lastSelected = $(lastSelectedItem);
      const lastSelectedIndex = $items.index($lastSelected);
      const $nextActiveItems = $items.slice(lastSelectedIndex + 1).filter('.ms-activating');
      const lastActive = $nextActiveItems.last().get(0);
      const secondLastActive = $nextActiveItems.get(-2) || lastSelectedItem;
      const currentIndex = $items.index($currentItem);
      const previousIndex = currentIndex - 1;
      const hasNextActive = $nextActiveItems.length > 0;
      const hasPrev = !hasNextActive && previousIndex > -1;
      hasNextActive && this._deactivateActivatingItem(lastActive);
      hasNextActive && secondLastActive.focus();
      hasPrev && this._activateItems($select, lastSelectedItem, $items.eq(previousIndex).focus());
    },
    _activateMoreItemsAfter: function (currentItem) {
      const $currentItem = $(currentItem);
      const $select = this._findSelectRoot(currentItem);
      const $items = this._findVisibleItems($select);
      const { lastSelectedItem } = $select.data();
      const $lastSelected = $(lastSelectedItem);
      const lastSelectedIndex = $items.index($lastSelected);
      const $prevActiveItems = $items.slice(0, lastSelectedIndex).filter('.ms-activating');
      const lastActive = $prevActiveItems.first().get(0);
      const secondLastActive = $prevActiveItems.get(1) || lastSelectedItem;
      const currentIndex = $items.index($currentItem);
      const nextIndex = currentIndex + 1;
      const hasPrevActive = $prevActiveItems.length > 0;
      const hasNext = !hasPrevActive && nextIndex < $items.length;
      hasPrevActive && this._deactivateActivatingItem(lastActive);
      hasPrevActive && secondLastActive.focus();
      hasNext && this._activateItems($select, lastSelectedItem, $items.eq(nextIndex).focus());
    },
    _activatePreviousItem: function (currentItem) {
      const { recursiveActive } = this.options;
      const $select = this._findSelectRoot(currentItem);
      const $items = this._findVisibleItems($select);
      const currentIndex = $items.index(currentItem);
      const previousIndex = (currentIndex - 1 + $items.length) % $items.length;
      const prevItem = $items.get(previousIndex);
      if (!prevItem && recursiveActive) { return this._activateLastItem(currentItem); }
      if (!prevItem) { return; }
      this._deactivateAllActiveItems($select);
      this._activateItem(prevItem, true);
      this._confirmActivatingItems($select);
      this._saveLastSelectedItem($select, prevItem);
    },
    _activateNextItem: function (currentItem) {
      const { recursiveActive } = this.options;
      const $select = this._findSelectRoot(currentItem);
      const $items = this._findVisibleItems($select);
      const currentIndex = $items.index(currentItem);
      const nextIndex = (currentIndex + 1 + $items.length) % $items.length;
      const nextItem = $items.get(nextIndex);
      if (!nextItem && recursiveActive) { return this._activateFirstItem(currentItem); }
      if (!nextItem) { return; }
      this._deactivateAllActiveItems($select);
      this._activateItem(nextItem, true);
      this._confirmActivatingItems($select);
      this._saveLastSelectedItem($select, nextItem);
    },
    _activateFirstItem: function (target) {
      const $target = $(target);
      const $select = this._isSelectRoot($target) ? $target : this._findSelectRoot(target);
      const $items = this._findVisibleItems($select);
      const first = $items.first().get(0);
      if (first === target) { return; }
      this._deactivateAllActiveItems($select);
      this._activateItem(first, true);
      this._confirmActivatingItems($select);
      this._saveLastSelectedItem($select, first);
    },
    _activateLastItem: function (target) {
      const $target = $(target);
      const $select = this._isSelectRoot($target) ? $target : this._findSelectRoot(target);
      const $items = this._findVisibleItems($select);
      const last = $items.last().get(0);
      if (last === target) { return; }
      this._deactivateAllActiveItems($select);
      this._activateItem(last, true);
      this._confirmActivatingItems($select);
      this._saveLastSelectedItem($select, last);
    },
    _activateItems: function ($select, item1, item2) {
      const $item1 = $(item1);
      const $item2 = $(item2);
      const $items = this._findVisibleItems($select);
      const items = [].concat(
        (this._isGroupLabel($item1) ? this._findVisibleSiblingItems($item1) : $item1).toArray(),
        (this._isGroupLabel($item2) ? this._findVisibleSiblingItems($item2) : $item2).toArray(),
      );
      const indexes = items.map(item => $items.index(item));
      const start = Math.min(...indexes);
      const end = Math.max(...indexes) + 1;
      const $groups = this._findGroups($select);
      $items.slice(start, end).toArray().forEach(this._activateItem.bind(this));
      $groups.toArray().forEach(this._activateGroupLabel.bind(this));
    },
    _activateItem: function (item, focus) {
      const $item = $(item);
      $item.not('.ms-activating').addClass('ms-activating');
      focus === true && $item.focus();
    },
    _activateGroupLabel: function (group) {
      const $group = $(group);
      const $label = this._findGroupLabel($group).removeClass('ms-active');
      const $items = this._findVisibleItems($group);
      const $actvie = $items.filter('.ms-activating,.ms-active');
      $label.toggleClass('ms-activating', $items.length && $items.length === $actvie.length);
    },
    _focusLastFocusItem: function (select) {
      const $select = $(select);
      const $list = this._findSelectList($select);
      const scrollTop = $list.scrollTop();
      const { lastFocusItem } = $select.data();
      lastFocusItem && lastFocusItem.focus();
      $list.scrollTop(scrollTop);
    },
    _moveItems: function (item) {
      const $select = this._findSelectRoot(item);
      const selectable = this._isSelectableSelect($select);
      selectable ? this._onSelectActiveSelectable() : this._onDeselectActiveSelection();
      $select.focus();
    },
    _onMouseOverItem: function (e) {
      const { clientY, which, currentTarget } = e;
      const $currentItem = $(currentTarget).addClass('ms-hover');
      const $select = this._findSelectRoot($currentItem);
      const focus = $select.is('.ms-select-focus');
      if (!focus || which === 0) { return; }
      const { lastSelectedItem } = $select.data();
      const $lastSelectedItem = $(lastSelectedItem);
      const isLastActive = $lastSelectedItem.is('.ms-activating,.ms-active');
      this._deactivateAllActivatingItems($select);
      !isLastActive && this._deactivateActiveItem(currentTarget);
      isLastActive && this._activateItems($select, lastSelectedItem, $currentItem.focus());
      this._scrollSelect($select, $currentItem, clientY);
    },
    _onMouseOutItem: function (e) {
      $(e.currentTarget).removeClass('ms-hover');
    },
    _onSelectItem: function (e) {
      if (e.which !== 1) { return; }
      const { ctrlKey, shiftKey } = e;
      const currentItem = e.currentTarget;
      const $currentItem = $(currentItem);
      const $parent = $currentItem.parent();
      const $select = this._findSelectRoot(currentItem);
      const hasGroupParent = $parent.is('.ms-optgroup');
      const { lastSelectedItem } = $select.data();
      const active = $currentItem.is('.ms-activating,.ms-active');
      !shiftKey && this._confirmActivatingItems($select);
      !ctrlKey && this._deactivateAllActiveItems($select);
      ctrlKey && active && this._deactivateActiveItem(currentItem);
      !shiftKey && (!ctrlKey || !active) && this._activateItem(currentItem, true);
      shiftKey && this._activateItems($select, lastSelectedItem, currentItem);
      hasGroupParent && this._activateGroupLabel($parent);
      !shiftKey && this._saveLastSelectedItem($select, $currentItem.is('.ms-activating') ? currentItem : null);
    },
    _onSelectGroupLabel: function (e) {
      if (e.which !== 1) { return; }
      const { ctrlKey, shiftKey } = e;
      const label = e.currentTarget;
      const $label = $(label);
      const $select = this._findSelectRoot($label);
      const $group = this._findGroup($label);
      const $items = this._findVisibleItems($group);
      const { lastSelectedItem } = $select.data();
      const active = $label.is('.ms-activating,.ms-active');
      this._saveLastFocusItem($select, $items.first().get(0));
      !shiftKey && this._confirmActivatingItems($select);
      !ctrlKey && this._deactivateAllActiveItems($select);
      ctrlKey && active && this._deactivateGroupActiveItems($group);
      !shiftKey && (!ctrlKey || !active) && this._activateItems($select, $items.first(), $items.last());
      shiftKey && this._activateItems($select, lastSelectedItem, label);
      !shiftKey && this._saveLastSelectedItem($select, label);
    },
    _onDoubleClickItem: function (e) {
      const $item = $(e.currentTarget);
      const $select = this._findSelectRoot($item);
      const $parent = $item.parent();
      const hasGroupParent = $parent.is('.ms-optgroup');
      const selectable = this._isSelectableSelect($select);
      const { option } = $item.data();
      option.selected = selectable;
      hasGroupParent && this._activateGroupLabel($parent);
      this._deactivateAllActivatingItems($select);
      this._deactivateAllActiveItems($select);
      this._updateItemVisibility();
      $select.focus();
    },
    _onDoubleClickGroupLabel: function (e) {
      const $group = this._findGroup(e.currentTarget);
      const $select = this._findSelectRoot($group);
      const selectable = this._isSelectableSelect($select);
      this._updateOptionSelectedOfActiveItems($group, selectable);
      this._deactivateAllActivatingItems($select);
      this._deactivateAllActiveItems($select);
      this._updateItemVisibility();
      $select.focus();
    },
    _onSelectAllSelectable: function () {
      const $options = this.element.find('option');
      $options.toArray().forEach(v => v.selected = true);
      this._deactivateAllActiveItems(this._$selectable);
      this._updateItemVisibility();
    },
    _onSelectActiveSelectable: function () {
      this._confirmActivatingItems(this._$selectable);
      this._updateOptionSelectedOfActiveItems(this._$selectable, true);
      this._deactivateAllActiveItems(this._$selectable);
      this._updateItemVisibility();
    },
    _onDeselectAllSelection: function () {
      const $options = this.element.find('option');
      $options.toArray().forEach(v => v.selected = false);
      this._deactivateAllActiveItems(this._$selection);
      this._updateItemVisibility();
    },
    _onDeselectActiveSelection: function () {
      this._confirmActivatingItems(this._$selection);
      this._updateOptionSelectedOfActiveItems(this._$selection, false);
      this._deactivateAllActiveItems(this._$selection);
      this._updateItemVisibility();
    },
    _onKeydownItem: function (e) {
      const { ctrlKey, shiftKey, target } = e;
      const key = new Key(e.key);
      if (ctrlKey && key.is('a')) {
        e.preventDefault();
        return this._activateSelect(target);
      }
      if (shiftKey && key.isHome) {
        return this._activateItemsBefore(target);
      }
      if (shiftKey && key.isEnd) {
        return this._activateItemsAfter(target);
      }
      if (key.isHome || key.isPageUp) {
        e.preventDefault();
        return this._activateFirstItem(target);
      }
      if (key.isEnd || key.isPageDown) {
        e.preventDefault();
        return this._activateLastItem(target);
      }
      if (shiftKey && key.isArrowUp) {
        e.stopPropagation();
        return this._activateMoreItemsBefore(target);
      }
      if (shiftKey && key.isArrowDown) {
        e.stopPropagation();
        return this._activateMoreItemsAfter(target);
      }
      if (key.isArrowUp) {
        e.preventDefault();
        e.stopPropagation();
        return this._activatePreviousItem(target);
      }
      if (key.isArrowDown) {
        e.preventDefault();
        e.stopPropagation();
        return this._activateNextItem(target);
      }
      if (key.isSpace) {
        e.preventDefault();
        return this._moveItems(target);
      }
      if (shiftKey && key.isTab) {
        return this._disableSelectFocusTemporarily(target);
      }
    },
    _onKeydownSelect: function (e) {
      const { target } = e;
      const key = new Key(e.key);
      if (key.isArrowUp) {
        e.preventDefault();
        return this._activateLastItem(target);
      }
      if (key.isArrowDown) {
        e.preventDefault();
        return this._activateFirstItem(target);
      }
    },
    _onFocusSelect: function (e) {
      this._isSelectRoot(e.target) && this._focusLastFocusItem(e.target);
      $(e.currentTarget).addClass('ms-select-focus').attr('tabindex', '-1');
    },
    _onBlurSelect: function (e) {
      $(e.currentTarget).removeClass('ms-select-focus').attr('tabindex', '0');
    },
    _onFocusItem: function (e) {
      this._findSelectRoot(e.currentTarget).data({ lastFocusItem: e.currentTarget });
    },
  });
});