"use strict";

function setup() {
    // Hide the confirmation and show the interface
    $("#confirm").addClass("d-none");
    $("#interface").removeClass("d-none");
    
    start();
}


$(document).ready(function () {
    if (localStorage.getItem("permission") === "true") {
        setup();
    }
});


$("#continue").click(function () {
    localStorage.setItem("permission", "true");
    setup();
});