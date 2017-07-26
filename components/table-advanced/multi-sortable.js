$(".multi-sortable").hover(
    function (){
        var sortdropDown = $(this).find(".table-sort-actions");
        sortdropDown.addClass("show");
    }, function(){
        var sortdropDown = $(this).find(".table-sort-actions");
        if ($(".table-sort-actions.open", $(this)).length == 0) {
            sortdropDown.removeClass("show");
        }
    }
);
$(".table-sort-actions").on("click", function(e){
    var $this = this;
    var sortdropDown = $(".multi-sortable").find(".table-sort-actions");
    sortdropDown.not($this).removeClass("show");
});
$(document).on("click", function(e){
    var sortdropDown = $(".multi-sortable").find(".table-sort-actions");
    if ($(e.target).closest(".multi-sortable").length) {
        var th = $(e.target).closest(".multi-sortable");
        var _this = th.find(".table-sort-actions");
        sortdropDown.not(_this).removeClass("show");
        return;
    }
    sortdropDown.removeClass("show");
});