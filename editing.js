// https://stackoverflow.com/a/890829
function keys(obj) {
    var keys = [];

    for(var key in obj) {
        if(obj.hasOwnProperty(key)) {
            keys.push(key);
        }
    }

    return keys;
}

class Editing {
    constructor () {
        this.currentSubject = null;
        this.currentNote = null;
        this.currentSubjectLabel = null;
        this.currentNoteLabel = null;
        
        this.editor = null;
        
        this.load();
        this.displaySubjects();
    }
    
    
    load () {
        this.data = JSON.parse(localStorage.getItem("data") || `{"subjects": {}}`);
    }
    
    
    save () {
        localStorage.setItem("data", JSON.stringify(this.data));
    }
    
    
    displaySubjects () {
        $(".subject").remove();
        let k = keys(this.data.subjects).sort();
        for (var i = 0; i < k.length; i++) {
            let key = k[i];
            let subject = this.data.subjects[key];
            $("#new-subject").before(`
                <li class="subject list-group-item list-group-item-action d-flex justify-content-between align-items-center" id="${key}">
                    ${subject.name}
                    <div>
                        <i class="edit material-icons btn" data-edits="${key}">edit</i>
                        <i class="delete material-icons btn btn-danger" data-deletes="${key}">delete</i>
                    </div>
                </li>`);
        }
    }
    
    
    displayNotes () {
        $(".note").remove();
        if (this.currentSubject === null) {
            $("#no-subject").removeClass("d-none");
            $("#new-note").removeClass("d-flex").addClass("d-none");
        } else {
            $("#no-subject").addClass("d-none");
            $("#new-note").addClass("d-flex").removeClass("d-none");
            let k = keys(this.data.subjects[this.currentSubject].notes).sort();
            for (var i = 0; i < k.length; i++) {
                let key = k[i];
                let note = this.data.subjects[this.currentSubject].notes[key];
                $("#new-note").before(`
                    <li class="note list-group-item list-group-item-action d-flex justify-content-between align-items-center" id="${key}">
                        ${note.name}
                        <i class="edit material-icons btn" data-edits="${key}">edit</i>
                    </li>`);
            }
        }
        
    }
    
    
    chooseSubject (id) {
        if (this.currentSubjectLabel !== null) {
            this.currentSubjectLabel.removeClass("active");
            this.destroyEditor();
        }
        
        this.displaySubjects();
        this.currentSubject = id;
        this.currentSubjectLabel = $("#" + id)
        this.currentSubjectLabel.addClass("active");
        
        this.displayNotes();
        
        if (this.data.subjects[this.currentSubject].notes.length !== 0) {
            $(".note").first().click();
        }
    }
    
    
    chooseNote (id) {
        if (this.currentNoteLabel !== null) {
            this.currentNoteLabel.removeClass("active");
            this.destroyEditor();
        }
        
        this.currentNote = id;
        this.currentNoteLabel = $("#" + id);
        this.currentNoteLabel.addClass("active");
        
        this.createEditor();
    }
    
    
    createSubject (name, callback) {
        let that = this;
        bootbox.prompt("Pick a name for your subject...", function (result) {
            if (result !== null) {
                let name = result;
                let id = result.toLowerCase().replace(/\W/g, '-') + "-" + Math.round(Math.random() * 99999).toString();

                that.data.subjects[id] = {
                    name: name,
                    notes: {}
                };

                if (callback) callback(id)
            }
        });
    }
    
    
    createNote (name, callback) {
        let that = this;
        bootbox.prompt("Pick a name for your note...", function (result) {
            if (result !== null) {
                let name = result;
                let id = that.currentSubject + "-" + result.toLowerCase().replace(/\W/g, '-') + "-" + Math.round(Math.random() * 99999).toString();

                that.data.subjects[that.currentSubject].notes[id] = {
                    name: name
                }

                if (callback) callback(id)
            }
        });
    }
    
    
    deleteSubject (id, callback) {
        let that = this;
        bootbox.confirm(`Are you sure you want to delete ${that.data.subjects[id].name}`, function(result){ 
            if (result) {
                for (var key in that.data.subjects[id]) {
                    delete that.data.subjects[id].notes[key];
                    localStorage.removeItem("content-" + key);
                }

                delete that.data.subjects[id];
                
                if (callback) callback()
            }
        });
    }
    
    
    deleteNote (callback) {
        let that = this;
        bootbox.confirm(`Are you sure you want to delete ${that.data.subjects[that.currentSubject].notes[that.currentNote].name}`, function(result){ 
            if (result) {
                delete that.data.subjects[that.currentSubject].notes[that.currentNote];
                
                localStorage.removeItem("content-" + that.currentNote)
                
                if (callback) callback()
            }
        });
    }
    
    
    createEditor () {
        $("#target").removeClass("d-none");
        $("#toolbar").removeClass("d-none");
        $("#control").removeClass("d-none").addClass("d-flex");
        
        this.editor = new MediumEditor('#target', {
            toolbar: false, /* {
                buttons: [
                    'bold',
                    'italic',
                    'underline',
                    'subscript',
                    'superscript',
                    'orderedlist',
                    'unorderedlist',
                    'anchor',
                    'h1',
                    'h2',
                    'h3',
                    'quote',
                    'table'
                ],
            }, */
            keyboardCommands: {
                /* This example includes the default options for keyboardCommands,
                   if nothing is passed this is what it used */
                commands: [
                    {
                        command: 'bold',
                        key: 'B',
                        meta: true,
                        shift: false,
                        alt: false
                    },
                    {
                        command: 'italic',
                        key: 'I',
                        meta: true,
                        shift: false,
                        alt: false
                    },
                    {
                        command: 'underline',
                        key: 'U',
                        meta: true,
                        shift: false,
                        alt: false
                    }
                ],
            },
            extensions: {
              table: new MediumEditorTable()
            },
            placeholder: false,
            autoLink: true
        });
        
        let content = localStorage.getItem("content-" + this.currentNote);
        
        if (content !== null) {
            // Load previous data
            $("#target").html(content)
        } else {
            // Default data
            $("#target").html("<p>Get started by writing here!</p>")
        }
        
        let that = this;
        this.editor.subscribe('editableInput', function (event, editable) {
            // Display last saved.
            let date = new Date();

            $("#last-saved").text("(last saved: " + date.toLocaleString() + ")");
            localStorage.setItem("content-" + that.currentNote, $("#target").html());
        });
        
        $("#not-editing").hide();
    }
    
    destroyEditor() {
        if (this.currentNoteLabel !== null) {
            this.currentNote = null;
            this.currentNoteLabel.removeClass("active");
            this.currentNoteLabel = null;
        }

        if (this.editor !== null) {
            $("#last-saved").text("");
            $("#target").html("")
            $("#target").addClass("d-none");
            $("#toolbar").addClass("d-none");
            $("#control").removeClass("d-flex").addClass("d-none");
        
            
            this.editor.destroy();
            this.editor = null;
        }

        $("#not-editing").show();
    }
}