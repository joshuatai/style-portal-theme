
const collapses = 'panel-collapse-show panel-collapse-shown panel-collapse-hide panel-collapse-hidden';

$('.panel-collapse', this).on('show.bs.collapse', function (e) {
  $(e.target).parents('.panel').removeClass(collapses).addClass('panel-collapse-show');
})
.on('shown.bs.collapse', function (e) {
  $(e.target).parents('.panel').removeClass(collapses).addClass('panel-collapse-shown');
})
.on('hide.bs.collapse', this, function (e) {
  $(e.target).parents('.panel').removeClass(collapses).addClass('panel-collapse-hide');
})
.on('hidden.bs.collapse', this, function (e) {
  $(e.target).parents('.panel').removeClass(collapses).addClass('panel-collapse-hidden');
});