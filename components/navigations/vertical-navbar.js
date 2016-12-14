var $sidebar = $('.col-example .navigation-items');
var object = [
  {
    "bower-search":null,
    "id": "1",
    "items": [],
    "name": "Getting Home",
    "pages": []
  },
  {
    "bower-search":null,
    "id": "2",
    "items": [],
    "name": "Styles",   
    "pages": [
      {
        "bower-search":null,
        "id":"2-1",
        "items": [],
        "name": "Color"
      },
      {
        "bower-search":null,
        "id":"2-2",
        "items": [],
        "name": "Layout"
      },
      {
        "bower-search":null,
        "id":"2-3",
        "items": [],
        "name": "Typography"
      },
      {
        "bower-search":null,
        "id":"2-4",
        "items": [],
        "name": "Icons"
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
$(".page-item a, .cate-item a", $sidebar).attr("href", "javascript:;");
