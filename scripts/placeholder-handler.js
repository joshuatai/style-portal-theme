
const handler = {};

function image (context, segment) {
  let $placeholders = $('.placeholder[data-type=image]', context);

  if (!$placeholders.length) { return; }

  $placeholders.each((i, elem) => {
    let $elem = $(elem);
    let $image = $('<img>');
    let data = $elem.data();
    let width = data.width;
    let height = data.height;
    let src = data.refer === 'theme'
      ? `/themes/${route.current.params.theme}/${route.current.params.version}/images/${data.src}`
      : `/themes/${route.current.params.theme}/${route.current.params.version}/components/${segment.dir}/${data.src}`;

    $elem.css({ width, height });
    $image.on('load', () => $elem.replaceWith($image)).attr({ src }).addClass(data.class);
  });
}

function iframe (context, segment) {
  let $placeholders = $('.placeholder[data-type=iframe]', context);

  if (!$placeholders.length) { return; }

  $placeholders.each((i, elem) => {
    let $elem = $(elem);
    let $iframe = $('<iframe>');
    let data = $elem.data();
    let src = `/themes/${route.current.params.theme}/${route.current.params.version}/components/${segment.dir}/${data.src}`;

    $iframe.attr({ src }).addClass(data.class);
    $elem.replaceWith($iframe);
  });
}

handler.replace = function (context, segment) {
  image(context, segment);
  iframe(context, segment);
};

export default handler;