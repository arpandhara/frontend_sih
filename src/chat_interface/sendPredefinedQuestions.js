let preDefQuestions = document.querySelectorAll(".q");
let isPredefined = false;
let question
preDefQuestions.forEach((questions) => {
    questions.addEventListener("click" , function(){
        isPredefined = true;
        question = questions.childNodes[1].textContent ;
        sendBtn.click();
    })
})