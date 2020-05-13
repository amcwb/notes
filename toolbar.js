$(".toolbar-button").click(function () {
    editing.editor.execAction($(this).data("action"))
})