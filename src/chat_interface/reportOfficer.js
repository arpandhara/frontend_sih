let reach_an_officer_button = document.querySelector(".reach_an_officer_button");
let complain_box = document.querySelector(".complain_box");
let complaint_submit = document.querySelector(".complaint_submit")

reach_an_officer_button.addEventListener("click", function() {
    // This one line handles everything!
    complain_box.classList.toggle("hidden");
});

complaint_submit.addEventListener("click" , function(e){
    complain_box.classList.toggle("hidden")
});