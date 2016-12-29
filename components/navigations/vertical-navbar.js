var $sidebar = $('.vertical-nav-example .navigation-items');
var object = [
  {
    "id": "1",
    "name": "Getting Home",
    "icon": "getting-home",
    "bower-search":null,
    "segments": [],    
    "components": []
  },
  {
    
    "id": "2",
    "name": "Styles",  
    "icon": "styles",
    "bower-search":null, 
    "segments": [],
    "components": [
      {
        "id":"2-1",
        "name": "Color",
        "keywords":null,
        "bower-search":null,
        "segments": [],
        "parent": "2"
      },
      {
        "id":"2-2",
        "name": "Layout",
        "bower-search": null,      
        "segments": [],
        "parent": "2"
      },
      {
        "id":"2-3",
        "name": "Typography",
        "bower-search": null,        
        "segments": [],
        "parent": "2"
      },
      {        
        "id":"2-4",
        "name": "Icons",
        "bower-search": null,
        "segments": [],
        "parent": "2"        
      }
    ]
  }
];


$sidebar.category({
  type: 'sidebar',
  data: object,
  duration: 100,
  animation: true,
  selectedId: "1",
  writable: false,
  content: '.tab-content',
  dataParent: "#sidebarExample"
});
//$(".page-item a, .cate-item a", $sidebar).attr("href", "javascript:;");


$('.vertical-nav-example .navigation')
  .on('click', '.sidebar-toggle', function (e) {
    var $nav = $(this).parent('.navigation');
    if ($nav.is('.collapsed')) {
      $nav.addClass('expand').removeClass('collapsed');
      $('[data-parent="#sidebarExample"]', $nav).attr('data-toggle', 'collapse');
    } else {
      $nav.addClass('collapsed').removeClass('expand');
      $('[data-parent="#sidebarExample"]', $nav).removeAttr('data-toggle'); 
      $('.sub-nav', $nav).css('height', 'auto');
    }

  })  
  .on('show.bs.collapse', '.sub-nav', function (e) {    
    console.log($subNav);
    var $subNav = $(this);
    var $navItems = $subNav.closest(".navigation-items");
    $('.sub-nav.in', $navItems).collapse('toggle');

  });