$(".toolbar-button").trigger("click", function () {
    editing.editor.execAction($(this).data("action"))
})