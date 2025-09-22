submitBtn = document.querySelector(".forms_submit");

submitBtn.addEventListener('click' , (e)=>{
    e.preventDefault();

    window.location.href = '../chat_interface/chat_interface.html'
})
