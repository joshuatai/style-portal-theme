var $tableThead = $('.table-col-draggable-container .table-column-draggable thead');
var $tableTbody = $('.table-col-draggable-container .table-column-draggable tbody');
var startIdx;
var originalIdx;

var fixHelper = function(e, ui) {
  var tableAlias = $('.table-col-draggable-container .table-column-draggable').clone().addClass('draggable-table-col-helper').css({"background-color": "#ffffff", "top": "0px"});
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
    $tableTbody.find('tr').find('td:eq(' + startIdx + ')').each(function() {
        var tdElement = $(this);
        tdElement.addClass('ui-column-highlight');
    });
    originalIdx = startIdx;
  },
  change: function(event, ui) {
    var newIdx = $tableThead.find('th').index($tableThead.find('th.ui-column-highlight'));
    if( newIdx > startIdx ) newIdx--;
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



var $tableThead2 = $('.table-col-draggable-container-2 .table-column-draggable thead');
var $tableTbody2 = $('.table-col-draggable-container-2 .table-column-draggable tbody');
var startIdx2;
var originalIdx2;

var fixHelper2 = function(e, ui) {
  var tableAlias = $('.table-col-draggable-container-2 .table-column-draggable').clone().addClass('draggable-table-col-helper2').css({"background-color": "#ffffff", "top": "799px"});
  var tableAliasHead = tableAlias.find('thead');
  var tableAliasBody = tableAlias.find('tbody');
  tableAliasHead.html('');
  tableAliasBody.html('');
  tableAliasHead.append(`<tr>${ui.clone().prop('outerHTML')}</tr>`);
  // tableAliasHead.find('th').width(ui.outerWidth());
  return tableAlias;
};

$tableThead2.sortable({
  axis: "x" ,
  items: 'th',
  revert: 300,
  tolerance: "pointer",
  cursor: 'move',
  placeholder: 'ui-column-highlight2',
  appendTo: ".table-col-draggable-container-2",
  helper: fixHelper2,
  start: function(event, ui) {
    $('.ui-column-highlight2').html(ui.item.prop('innerHTML'));
    startIdx2 = $tableThead2.find('th').index(ui.item);
    $tableTbody2.find('tr').find('td:eq(' + startIdx2 + ')').each(function() {
      var tdElement = $(this);
      tdElement.addClass('ui-column-highlight2');
    });
    originalIdx2 = startIdx2;
  },
  change: function(event, ui) {
    var newIdx = $tableThead2.find('th').index($tableThead2.find('th.ui-column-highlight2'));
    if( newIdx > startIdx2 ) newIdx--;
    $tableTbody2.find('tr').find('td:eq(' + originalIdx2 + ')').each(function() {
        var tdElement = $(this);
        var tdElementParent = tdElement.parent();
        if(newIdx > originalIdx2) { // Move it the right
          tdElementParent.find('td:eq(' + newIdx + ')').after(tdElement); 
        } else { // Move it the left
          tdElementParent.find('td:eq(' + newIdx + ')').before(tdElement); 
        }
    });
    originalIdx2 = newIdx;
  },
  stop: function( event, ui ) {
    $tableTbody2.find('td').removeClass('ui-column-highlight2');
  }
});