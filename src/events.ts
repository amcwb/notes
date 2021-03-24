let editing: Editing;

function start () {
    editing = new Editing();

    $("#notes").on("click", ".note", function () {
        editing.chooseNote($(this).attr("id"));
    });


    $("#subjects").on("click", ".subject", function () {
        editing.chooseSubject($(this).attr("id"));
    })


    $("#delete").on("click", () => {
        editing.deleteNote(() => {
            editing.save()
            editing.destroyEditor();
            editing.displayNotes();
        })
    })

    $("#subjects").on("click", ".delete", function () {
        const id = $(this).data("deletes");
        editing.deleteSubject(id, () => {
            editing.save();

            if (editing.currentSubject === id) {
                editing.currentSubject = null;
                editing.currentSubjectLabel = null;

                editing.displaySubjects();
                editing.destroyEditor()
                editing.displayNotes()
            }

            $(".subject").first().trigger("click");
        })
    })

    $("#new-subject").on("click", () => {
        editing.createSubject((id: string) => {
            editing.save();
            editing.displaySubjects();
            editing.chooseSubject(id);
        })
    })


    $("#new-note").on("click", () => {
        editing.createNote((id: string) => {
            editing.save();
            editing.displayNotes();
            editing.chooseNote(id);
        });
    });

    $("#subjects").on("click", ".edit", function () {
        const id = $(this).data("edits");
        bootbox.prompt("Pick a new name for your subject...", (result: string) => {
            if (result !== null) {
                const name = result;
                editing.data.subjects[editing.currentSubject].name = name;

                editing.save();
                editing.displaySubjects();
                editing.chooseSubject(id);

                if (editing.currentNote !== null) {
                    editing.chooseNote(editing.currentNote);
                }
            }
        });
    });

    $("#notes").on("click", ".edit", function () {
        const id = $(this).data("edits");
        bootbox.prompt("Pick a new name for your note...", (result: string) => {
            if (result !== null) {
                const name = result;
                editing.data.subjects[editing.currentSubject].notes[id].name = name;

                editing.save();
                editing.destroyEditor();
                editing.displaySubjects();
                editing.chooseSubject(editing.currentSubject);
                editing.chooseNote(id);
            }
        });
    });

    // Pick top subject
    $(".subject").first().trigger("click");
    editing.displayNotes();
}