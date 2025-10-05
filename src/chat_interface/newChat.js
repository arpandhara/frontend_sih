let new_chat = document.querySelector(".new_chat");
let new_chat_icon = document.querySelector(".new_chat img");

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

    const tl = gsap.timeline({
        // Add a callback to reset the icon's rotation when the animation completes
        onComplete: () => {
            gsap.set(new_chat_icon, { rotation: 0 });
        }
    });

    tl.to(new_chat, {
        scale: 0.95,
        duration: 0.15,
        ease: "power2.inOut"
    })
        .to(new_chat_icon, {
            rotate: "+=180", // Rotate by an additional 180 degrees each time
            duration: 0.3,
            ease: "power2.inOut"
        }, "-=0.1") // Overlap with previous animation
        .to(new_chat, {
            scale: 1,
            duration: 0.15,
            ease: "power2.inOut"
        });

    cameraDiscontinue();
})