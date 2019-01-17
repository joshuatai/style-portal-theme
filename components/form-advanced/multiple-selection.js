$('[data-multi-selection=multipleSelection]', this).multiSelect();
$('[data-opt-multi-selection=optMultipleSelection]', this).multiSelect({ selectableOptgroup: true });

const multipleSelectionOptions = {
  buttonClass: 'btn btn-border btn-icon-only',
  buttonIcons: {
    addAll: '<span class="tmicon tmicon-collapse-right"></span>',
    add: '<span class="tmicon tmicon-angle-right"></span>',
    removeAll: '<span class="tmicon tmicon-collapse-left"></span>',
    remove: '<span class="tmicon tmicon-angle-left"></span>'
  },
};

$('[data-multi-selection=advanced]', this).multipleSelection(multipleSelectionOptions);
$('[data-opt-multi-selection=advanced]', this).multipleSelection(multipleSelectionOptions);