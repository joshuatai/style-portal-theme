var maxFiles = 2;

function formatFileSize(bytes) {
    if (typeof bytes !== 'number') {
        return '';
    }
    if (bytes >= 1000000000) {
        return (bytes / 1000000000).toFixed(2) + ' GB';
    }
    if (bytes >= 1000000) {
        return (bytes / 1000000).toFixed(2) + ' MB';
    }
    return (bytes / 1000).toFixed(2) + ' KB';
};

$('[data-file-upload=singleFile]', this).fileupload({
  url: window.location.hostname,
  dataType: 'json',
  autoUpload: false,
  acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
  maxFileSize: 999000
}).on('fileuploadadd', function (e, data) {
    $('#fileInfo').html("");
    $('#fileInfo').append('<span>' + data.files[0].name + ' ' + '</span>' + '<span class=\'file-size\'>' + '(' + formatFileSize(data.files[0].size) + ')' + '</span>' + '<span class=\'tmicon tmicon-close-s tmicon-visible-low tmicon-hoverable\'></span>');
    $('#fileInfo').find('.tmicon-close-s').on('click', function (event){
        $('#fileInfo').html("");
    });
})

$('[data-file-upload=multiFile]', this).fileupload({
  url: window.location.hostname,
  dataType: 'json',
  autoUpload: false,
  acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
  maxFileSize: 999000
}).on('fileuploadadd', function (e, data) {
    var count = $('#multifileInfo > li').length;
    if( count < maxFiles){
      $.each(data.files, function (index, file) {
        $('#multifileInfo').append('<li>' + '<span class=\'file-name\'>' + file.name + ' ' + '</span>' + '<span class=\'file-size\'>' + '(' + formatFileSize(file.size) + ')' + '</span>' + '<span class=\'tmicon tmicon-close-s tmicon-visible-low tmicon-hoverable\'></span>' + '</li>');
      });
    }
    else{
      return false;
    }
    $('#multifileInfo').find('li .tmicon-close-s').on('click', function (event){
        $(this).parent('li').remove();
    });
});