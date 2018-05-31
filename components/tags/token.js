$('#tags').token({
  allowEditing: false
});

$('#editTags').token({
  rules: [{
    name: 'ipv4',
    message: 'Invalid IP address'
  }, {
    name: 'duplicate',
    message: 'Entry already exists'
  }],
  validators: {
    ipv4: function (value) {
      return /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/i.test(value);
    }
  }
});

// For display tooltip of validation example
$('.validation-example .tokenfield .token-duplicate').tooltip({
  title: 'Entry already exists',
  container: 'body',
  template:
  `<div class="tooltip" role="tooltip">
    <div class="tooltip-inner tooltip-inner-light"></div>
  </div>`
}).on('mouseenter', function(e) {
  var top = $(this).offset().top + $(this).height() + 5;
  var left = e.clientX;
  $('.tooltip').css({top: top + 5, left: left });
});
