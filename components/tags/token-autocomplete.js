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