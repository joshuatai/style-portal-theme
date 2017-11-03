var $tableThead = $('.table-column-draggable thead');
var $tableTbody = $('.table-column-draggable tbody');
var startIdx;
var originalIdx;

var fixHelper = function(e, ui) {
  var tableAlias = $('.table-column-draggable').clone().addClass('draggable-table-col-helper').css({"background-color": "#ffffff", "top": "0px"});
  var tableAliasHead = tableAlias.find('thead');
  var tableAliasBody = tableAlias.find('tbody');
  tableAliasHead.html('');
  tableAliasBody.html('');
  tableAliasHead.append(`<tr>${ui.clone().prop('outerHTML')}</tr>`);
  $tableTbody.find('tr').find('td:eq(' + ui.index() + ')').each(function() {
    var tdElement = $(this);
    tableAliasBody.append(`<tr>${tdElement.prop('outerHTML')}</tr>`);
  });
  tableAliasHead.find('th').width(ui.outerWidth());
  return tableAlias;
};

$tableThead.sortable({
  axis: "x" ,
  items: 'th',
  revert: 300,
  tolerance: "pointer",
  cursor: 'move',
  placeholder: 'ui-column-highlight',
  appendTo: ".table-col-draggable-container",
  helper: fixHelper,
  start: function(event, ui) {
    startIdx = $tableThead.find('th').index(ui.item);
    // Add highlight class on all row element in tbody
    $tableTbody.find('tr').find('td:eq(' + startIdx + ')').each(function() {
        var tdElement = $(this);
        tdElement.addClass('ui-column-highlight');
    });
    originalIdx = startIdx;
  },
  change: function(event, ui) {
    // Get td index of the placeholder
    var newIdx = $tableThead.find('th').index($tableThead.find('th.ui-column-highlight'));

    // If the position is right of the original position, substract it by one in cause of the 'hidden th'
    if( newIdx > startIdx ) newIdx--;

    // Move all the row elements in tbody
    $tableTbody.find('tr').find('td:eq(' + originalIdx + ')').each(function() {
        var tdElement = $(this);
        var tdElementParent = tdElement.parent();
        if(newIdx > originalIdx) { // Move it the right
          tdElementParent.find('td:eq(' + newIdx + ')').after(tdElement); 
        } else { // Move it the left
          tdElementParent.find('td:eq(' + newIdx + ')').before(tdElement); 
        }
    });
    originalIdx = newIdx;
  },
  stop: function( event, ui ) {
    $tableTbody.find('td').removeClass('ui-column-highlight');
  }
});