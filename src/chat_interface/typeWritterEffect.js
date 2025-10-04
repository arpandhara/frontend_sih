// Make sure to register the TextPlugin first
gsap.registerPlugin(TextPlugin);

// --- CONFIGURATION ---
const words = ["How can I help you today?", "How are your crops growing?", "Any Question in Mind - Just Ask!"];
const masterTimeline = gsap.timeline({ repeat: -1, delay: 0.5 });
const cursor = document.querySelector('.cursor');

// --- CURSOR BLINKING ---
// Create a blinking animation for the cursor
gsap.to(cursor, {
    opacity: 0,
    ease: "power2.inOut",
    repeat: -1,
    yoyo: true, // Makes the animation reverse, creating the blink
    duration: 0.4
});

// --- TYPEWRITER LOGIC ---
// Loop through each word in the array and create a typing/deleting animation for it
words.forEach(word => {
    // Create a timeline for each word
    let wordTimeline = gsap.timeline({
        defaults: { ease: "none" },
        // Add a slight pause before the next word animation starts
        repeat: 1, 
        yoyo: true, // Play the timeline forward, then backward
        repeatDelay: 2 // How long to pause with the word fully typed
    });

    // Animate the text property of the target element
    wordTimeline.to("#typewriter", {
        text: word,
        duration: word.length * 0.1, // Typing speed: 0.1s per character
    });

    // Add this word's timeline to the master timeline
    masterTimeline.add(wordTimeline);
});


// let new_chat = document.querySelector(".new_chat");
let new_chat_icon = document.querySelector(".new_chat img");
// let chat_output_box = document.querySelector(".chat_output_box");
// let chat_input = document.querySelector(".chat_input");
// let welcome_components = document.querySelector(".welcome_components");


new_chat.addEventListener("click", function (e) {
    // GSAP Animation Timeline
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


    // const chatMessages = chat_output_box.querySelectorAll('.inputAndResponse');
    // chatMessages.forEach(message => message.remove());
    // chat_input.value = "";

    // welcome_components.style.display = "flex";
    // welcome_components.style.opacity = 0;
    // gsap.to(welcome_components, {
    //     duration: 0.3,
    //     opacity: 1
    // });
});


// microphone animation

let micBtn = document.querySelector(".ri-mic-2-line");
const micOnSound = document.getElementById("micOnSound");
const micOffSound = document.getElementById("micOffSound");

micBtn.addEventListener("mousedown", function() {
    micOnSound.play();
    // Animation to activate the mic
    const tl = gsap.timeline();

    tl.to(micBtn, {
        scale: 1.2,
        duration: 0.15,
        ease: "power2.inOut",
        yoyo: true,
        repeat: 2
    }).to(micBtn, {
        scale: 1, // Ensure it returns to normal scale
        backgroundColor: "#F08080",
        color: "#FFFFFF",
        duration: 0.2
    });
});

micBtn.addEventListener("mouseup", function() {
    micOffSound.play();
    // Animation to deactivate the mic
    const tl = gsap.timeline();

    tl.to(micBtn, {
        scale: 1.2,
        duration: 0.15,
        ease: "power2.inOut"
    }).to(micBtn, {
        scale: 1,
        backgroundColor: "transparent",
        color: "#39462C",
        duration: 0.3
    });
});





// --- Image Button Animation ---

let imageBtn = document.querySelector(".ri-image-ai-line");
let isImageActive = false;
let isImageAnimating = false;

imageBtn.addEventListener("click", function() {
    if (isImageAnimating) {
        return; // Don't allow animation to be re-triggered
    }

    isImageAnimating = true;

    if (!isImageActive) {
        // Animation to activate the image button
        const imageTl = gsap.timeline({
            onComplete: () => {
                isImageActive = true;
                isImageAnimating = false;
            }
        });

        imageTl.to(imageBtn, {
            rotation: 360,
            backgroundColor: "#39462C", // Orange background
            color: "#FFFFFF", // White icon
            duration: 0.5,
            ease: "power2.inOut"
        });
    } else {
        // Animation to deactivate the image button
        const imageTl = gsap.timeline({
            onComplete: () => {
                isImageActive = false;
                isImageAnimating = false;
            }
        });

        imageTl.to(imageBtn, {
            rotation: 0,
            backgroundColor: "transparent",
            color: "#39462C", // Original color
            duration: 0.5,
            ease: "power2.inOut"
        });
    }
});




