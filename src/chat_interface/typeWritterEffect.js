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
