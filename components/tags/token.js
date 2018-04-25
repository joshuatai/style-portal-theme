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

$('#autocompleteToken').token({
  allowEditing: false,
  createTokensOnBlur: false,
  autocomplete: {
      source: ['1.2.1.1', '2.1.4.2', '3.2.4.3','2.2.2.2', '2.2.2.3'],
      allowNewTag: true
  },
  showAutocompleteOnFocus: true,
  placeholder: 'Select ...'
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