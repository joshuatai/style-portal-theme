var modalLg = $('[data-template="modal-lg"]').modal('show');
var modalLgBody = modalLg.find('modal-body');

modalLgBody.mCustomScrollbar({
    autoHideScrollbar: true,
    callbacks:{
        whileScrolling:function(){
            $('.modal-header').toggleClass('fixedTop', this.mcs.top < 0);
        }
    }
});

$(document).on('hidden.bs.modal', '.modal', function () {
    window.top.close();
})

$(window).on('resize', function () {
    var styleTag = $('[data-modal-size="adjust"]');
    var head = $('head');
    var noScrollbar = $('.modal-lg .mCS_no_scrollbar');
    var modalHeader = $('.modal-lg .modal-header');
    
    if (styleTag.length === 1) styleTag.remove();
    styleTag = $(
    '<style data-modal-size="adjust">\n' +
    '.modal-lg .modal-body, .modal-md .modal-body { max-height: calc(' + ($(window).height() * 0.8) + 'px - 145px); }' + 
    '</style>').appendTo(head);

    if(noScrollbar) modalHeader.removeClass('fixedTop');
    modalLgBody.mCustomScrollbar('update');
})
.trigger('resize');