
function style (data) {
  if (data.selector) {
    return portal.theme.current.styles.style(data.selector);
  }

  if (data.font) {
    return portal.theme.current.styles.font(data.font);
  }

  if (data.keyframes) {
    return portal.theme.current.styles.keyframes(data.keyframes);
  }

  console.warn('data-* attribute not exists on <style> element.');
}

export default function parse (context) {
  var $ref = $('.css-reference', context);

  $ref.find('h5').addClass('css-reference-title');

  $ref.find('code[data-tag]').each((i, elem) => {
    var $code = $(elem);
    var data = $code.data();

    $code.text(`<${data.tag}>`);
  });

  $ref.find('code[data-selector]').each((i, elem) => {
    var $code = $(elem);
    var data = $code.data();

    $code.text(`${data.selector}`);
  });

  $ref.find('pre').each((i, elem) => {
    var $pre = $(elem);
    var $styles = $pre.find('style');
    var last = $styles.length - 1;
    var title = $pre.data('title');
    var contents = [];

    contents.push(title && `/*== ${title} */`); // Push undefined if title is not assigned

    $styles.each((i, elem) => {
      var $style = $(elem);
      var data = $style.data();
      var comments = $style.text();

      comments.trim().split('\n').map((comment) => {
        return comment.trim();
      })
      .forEach((comment) => {
        contents.push(comment && `/* ${comment} */`); // Push undefined if comment is empty
      });

      contents.push(style(data), i !== last ? ' ' : null); // Push single space for insert one empty line
    });

    contents = contents.filter((content) => {
      return content && content.length; // All undefined or empty string should be ignored
    });

    $pre.wrap('<figure>').addClass('prettyprint lang-css').empty().append(contents.join('\n'));
  });

  prettyPrint();
};