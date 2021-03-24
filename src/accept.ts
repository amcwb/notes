"use strict";

function setup() {
    // Hide the confirmation and show the interface
    $("#confirm").addClass("d-none");
    $("#interface").removeClass("d-none");

    start();
}


$(() => {
    if (localStorage.getItem("permission") === "true") {
        setup();
    }
});


$("#continue").on("click", () => {
    localStorage.setItem("permission", "true");
    setup();
});