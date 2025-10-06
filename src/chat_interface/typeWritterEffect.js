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




function cameraDiscontinue() {
    const imageTl = gsap.timeline({
        onComplete: () => {
            isImageActive = false;
            isImageAnimating = false;
            camera_options.style.display = "none";
        }
    });

    imageTl.to(buttons, {
        scale: 0,
        opacity: 0,
        y: 20,
        duration: 0.2,
        stagger: 0.1,
        ease: "back.in(1.7)",
    });

    imageTl.to(imageBtn, {
        rotation: 0,
        backgroundColor: "transparent",
        color: "#39462C", // Original color
        duration: 0.5,
        ease: "power2.inOut"
    });
}


// microphone animation






// microphone animation

// let micBtn = document.querySelector(".ri-mic-2-line");
// const micOnSound = document.getElementById("micOnSound");
// const micOffSound = document.getElementById("micOffSound");
// let isRecording = false;

// micBtn.addEventListener("mousedown", function () {
//     isRecording = true;
//     micOffSound.pause();
//     micOffSound.currentTime = 0;
//     micOnSound.play();


//     cameraDiscontinue();


//     // Animation to activate the mic
//     const tl = gsap.timeline();

//     tl.to(micBtn, {
//         scale: 1.2,
//         duration: 0.15,
//         ease: "power2.inOut",
//         // yoyo: true,
//         // repeat: 2
//     }).to(micBtn, {
//         scale: 1, // Ensure it returns to normal scale
//         backgroundColor: "#F08080",
//         color: "#FFFFFF",
//         duration: 0.2
//     });
// });

// function recordingOff(){
//     micOnSound.pause();
//     micOnSound.currentTime = 0;
//     micOffSound.play();
//     // Animation to deactivate the mic
//     const tl = gsap.timeline();

//     tl.to(micBtn, {
//         scale: 1.2,
//         duration: 0.15,
//         ease: "power2.inOut"
//     }).to(micBtn, {
//         scale: 1,
//         backgroundColor: "transparent",
//         color: "#39462C",
//         duration: 0.3
//     });
//     isRecording = false;
// }

// micBtn.addEventListener("mouseup", function () {
//     recordingOff();
// });


// micBtn.addEventListener("mouseleave", function () {
//     if(isRecording) recordingOff();
// });












let micBtn = document.querySelector(".ri-mic-2-line");
const micOnSound = document.getElementById("micOnSound");
const micOffSound = document.getElementById("micOffSound");

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  let isRecording = false;
  let lastTranscript = ''; // store last received transcript for troubleshooting
  recognition.maxAlternatives = 5;

  // --- Configuration ---
  recognition.continuous = false; // Stop recognition when the user stops speaking
  recognition.interimResults = true; // Enable interim results to get faster feedback (helps debugging)
  recognition.lang = 'en-US';

  // --- Animation and Recording Functions ---
  const startRecording = () => {
    if (!isRecording) {
      isRecording = true;
      micOffSound.pause();
      micOffSound.currentTime = 0;
      micOnSound.play();

      try {
        recognition.start();
      } catch(e) {
        console.error("Error starting recognition:", e);
        isRecording = false; // Reset state
        return;
      }

      // Start animation
      const tl = gsap.timeline();
      tl.to(micBtn, {
        scale: 1.2,
        duration: 0.15,
        ease: "power2.inOut",
      }).to(micBtn, {
        scale: 1,
        backgroundColor: "#F08080",
        color: "#FFFFFF",
        duration: 0.2,
      });
    }
  };

  const stopRecording = () => {
    if (isRecording) {
      isRecording = false;
      micOnSound.pause();
      micOnSound.currentTime = 0;
      micOffSound.play();
      // Delay stopping slightly to give the recognizer time to deliver the final result
      // (Some browser implementations may not fire onresult if stop() is called too quickly)
      // Increase delay to give recognizer more time to produce final result
      setTimeout(() => {
        try {
          recognition.stop();
        } catch (e) {
          console.warn('Error calling recognition.stop():', e);
        }
      }, 700);

      // Reverse animation
      const tl = gsap.timeline();
      tl.to(micBtn, {
        scale: 1.2,
        duration: 0.15,
        ease: "power2.inOut",
      }).to(micBtn, {
        scale: 1,
        backgroundColor: "transparent",
        color: "#39462C",
        duration: 0.3,
      });
    }
  };

  // --- Event Listeners ---
  micBtn.addEventListener("mousedown", startRecording);
  micBtn.addEventListener("mouseup", stopRecording);
  micBtn.addEventListener("mouseleave", () => {
    if (isRecording) {
      stopRecording();
    }
  });

  // --- Speech Recognition Event Handlers ---
  recognition.onstart = () => {
    console.log("Voice recognition activated. Start speaking.");
  };

  // Additional debug events to trace what's happening with the recognizer
  recognition.onaudiostart = () => console.log('Audio capturing started.');
  recognition.onaudioend = () => console.log('Audio capturing ended.');
  recognition.onspeechstart = () => console.log('Speech has been detected.');
  recognition.onspeechend = () => console.log('Speech has stopped being detected.');
  recognition.onnomatch = (e) => console.warn('No matching speech recognized.', e);

  recognition.onresult = (event) => {
    // dump the full event for debugging
    try { console.log('onresult full event:', event); } catch(e) { /* some browsers can't stringify */ }
    // Combine results (handles interim + final) into a single transcript string
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
      if (event.results[i].isFinal) break; // stop at the first final result
    }

  console.log('onresult event, resultIndex=', event.resultIndex, 'isFinal=', event.results[event.results.length-1].isFinal);
  console.log("Transcript received (combined):", transcript);

  // save for onend logging/debug
  lastTranscript = transcript;

    if (transcript && transcript.trim().length > 0) {
      // Query DOM elements here to avoid relying on variables from other scripts
      const chatInputEl = document.querySelector('.chat_input');
      const sendButtonEl = document.querySelector('.ri-send-plane-fill');

      if (chatInputEl) chatInputEl.value = transcript;
      else console.warn('chat_input element not found when setting transcript.');

      if (sendButtonEl) {
        // Give the UI a tiny moment to update before triggering click
        setTimeout(() => sendButtonEl.click(), 50);
      } else {
        console.warn('sendBtn element not found when trying to click send.');
      }
    }
  };

  recognition.onend = () => {
    // Ensure the UI is always reset when recognition stops
    console.log('recognition.onend fired. lastTranscript:', lastTranscript ? lastTranscript : '<none>');
    // if recognition ended but we still think we're recording, clean up UI
    if (isRecording) {
      stopRecording();
    }
    // clear lastTranscript after a short time to avoid stale values
    setTimeout(() => { lastTranscript = ''; }, 1000);
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    try { console.error('onerror full event:', event); } catch(e) {}
     if (event.error === 'no-speech') {
        console.warn("No speech was detected.");
    } else if (event.error === 'not-allowed') {
        console.error("Microphone access was denied. Please allow microphone access in your browser settings.");
    }
    // Clean up on error
    if (isRecording) {
      stopRecording();
    }
  };

} else {
  console.error("Speech Recognition is not supported by this browser.");
  micBtn.style.display = "none";
}


// --- Image Button Animation ---

let imageBtn = document.querySelector(".ri-image-ai-line");
let isImageActive = false;
let isImageAnimating = false;
let camera_options = document.querySelector(".camera_options");
let buttons = document.querySelectorAll(".camera_options button");


imageBtn.addEventListener("click", function () {
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

        imageTl.set(camera_options, { display: "flex" });
        imageTl.fromTo(
            buttons,
            { scale: 0, opacity: 0, y: 20 },
            {
                scale: 1,
                opacity: 1,
                y: 0,
                duration: 0.3,
                stagger: 0.1,
                ease: "back.out(1.7)",
            },
            "-=0.1" // overlap slightly with previous animation
        );
    } else {
        // Animation to deactivate the image button
        cameraDiscontinue();
    }
});




