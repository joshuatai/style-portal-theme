
const ClipboardButtonTemplate = function (text, data) {
  return `<button type="button"
    class="btn btn-default btn-xs btn-copy-color"
    data-clipboard-text="${data}">${text}
    </button>`;
};

$('[data-palette]', this).each((i, elem) => {
  let $list = $(elem);
  let palette = $list.data('palette');
  let styles = portal.theme.current.styles;
  let $item, $index, $color;
  let selector, css, matches, color, dark;
  let index = 1;

  while (index <= 10) {
    $item = $('<li>').addClass('color-bar');
    $index = $('<span>').addClass('color-index').data({ index: 11 - index }).text(11 - index);
    $color = $('<span>').addClass('color-code').attr({
      'data-toggle': 'popover',
      'data-placement': 'left',
      'data-trigger': 'manual',
      'data-html': true
    });

    selector = `.colors-palette-container .${palette} li:nth-child(${index})`;
    css = styles.style(selector);
    matches = /background-color: (#\w+);/.exec(css);
    color = tinycolor(matches[1]);
    dark = color.isDark();

    $color.attr('data-content', [  
      '<p style="color: #222;">Copy color code</p>',
      ClipboardButtonTemplate('HEX', color.toHexString()),
      ClipboardButtonTemplate('RGB', color.toRgbString())
    ].join(' '));

    $item.attr('data-color', color.toHexString());

    $color.popover().text(color.toHexString().toUpperCase());
    $item.data({ color }).append($index, $color).addClass(dark ? 'colors-dark' : null);
    $list.append($item);

    index++;
  }
});

$('.colors-palette-container').on('click', '.color-bar', (e) => {
  if (e.ctrlKey) { return; }

  $('.colors-palette-container').find('.popover').popover('hide');
  $(e.currentTarget).find('.color-code').popover('show');
})
.on('mouseenter', '.color-bar', (e) => {
  // $(e.currentTarget).css('background-color', $(e.currentTarget).data('color').lighten(3).toHexString());
})
.on('mouseleave', '.color-bar', (e) => {
  // $(e.currentTarget).css('background-color', $(e.currentTarget).data('color').darken(3).toHexString());
})
.on('click', '.color-code', (e) => {
  $('.colors-palette-container').find('.popover').popover('hide');
  $(e.currentTarget).popover('show');

  e.stopPropagation();
})
.on('click', '.btn-copy-color', (e) => {
  $(e.currentTarget).parents('.popover').popover('hide');
});

$(document).on('click', (e) => {
  if ($(e.target).parents('.popover').length) { return; }
  if ($(e.target).is('.color-bar')) { return; }

  $('.colors-palette-container').find('.popover').popover('hide');
})
.on('keydown keyup', (e) => {
  window.ctrlKey = e.ctrlKey;
});

new Clipboard('.color-bar', {
  text: function (trigger) {
    return window.ctrlKey ? trigger.getAttribute('data-color') : null;
  }
});

new Clipboard('.btn-copy-color');