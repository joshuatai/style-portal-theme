$('[data-input-tag=tags]', this).tagEditor({
    initialTags: ['Hello', 'World', 'Example', 'Tags'],
    delimiter: ', ', /* space and comma */
    placeholder: 'Enter tags ...',
    animateDelete: 0,
    beforeTagSave: function (field, editor, tags, val) {
      editor.find(".tag-editor-tag").scrollLeft(0);
    }
});
$('[data-input-tag=editTags]', this).tagEditor({
    initialTags: ['1.10.2.11', '1.10.2.12', '10.19.148.12'],
    delimiter: ', ', /* space and comma */
    clickEdit: true,
    placeholder: 'Enter tags ...',
    animateDelete: 0,
    beforeTagSave: function (field, editor, tags, val) {
      editor.find(".tag-editor-tag").scrollLeft(0);           
    }
});