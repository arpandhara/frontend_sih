let new_chat = document.querySelector(".new_chat");

new_chat.addEventListener("click", function (e) {
    const chatMessages = chat_output_box.querySelectorAll('.inputAndResponse');
    chatMessages.forEach(message => message.remove());
    chat_input.value = "";

    welcome_components.style.display = "flex";
    welcome_components.style.opacity = 0; 
    gsap.to(welcome_components, {
        duration: 0.3,
        opacity: 1
    });
})