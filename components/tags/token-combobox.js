$('#tokenCombobox').token({
	allowEditing: false,
	createTokensOnBlur: false,
	autocomplete: {
		source: ['Japan', 'Korea', 'Malaysia', 'Switzerland', 'Syria', 'Tahiti', 'Taiwan', 'Tajikistan']
	},
	showAutocompleteOnFocus: true,
	placeholder: 'Select ...'
});