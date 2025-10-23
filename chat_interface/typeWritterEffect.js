// Make sure to register the TextPlugin first
gsap.registerPlugin(TextPlugin);

// --- CONFIGURATION ---
const words = ["How can I help you today?", "How are your crops growing?", "Any Question in Mind - Just Ask!"];
const masterTimeline = gsap.timeline({ repeat: -1, delay: 0.5 });
const cursor = document.querySelector('.cursor');

// --- CURSOR BLINKING ---
// Create a blinking animation for the cursor
if (cursor) {
    gsap.to(cursor, {
        opacity: 0,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true, // Makes the animation reverse, creating the blink
        duration: 0.4
    });
}


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


let micBtn = document.querySelector(".ri-mic-2-line");
const micOnSound = document.getElementById("micOnSound");
const micOffSound = document.getElementById("micOffSound");
const chatInput = document.querySelector(".chat_input");
const visualizer = document.querySelector(".voice-visualizer");
const visualizerBars = document.querySelectorAll(".voice-visualizer .bar");
let audioUrl;

let mediaRecorder;
let audioChunks = [];
let isRecording = false;

// For visualizer
let audioContext;
let analyser;
let dataArray;
let source;
let animationFrameId;

micBtn.addEventListener("mousedown", async function () {
    if (!isRecording) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);

            // --- Visualizer Setup ---
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
            const bufferLength = analyser.frequencyBinCount;
            dataArray = new Uint8Array(bufferLength);
            // --- End Visualizer Setup ---


            audioChunks = []; // Reset chunks for a new recording
            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };

            // ✅ FIX: The logic to send the chat is moved here
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                audioUrl = URL.createObjectURL(audioBlob);

                const welcome_components = document.querySelector(".welcome_components");
                if (window.getComputedStyle(welcome_components).display === "flex") {
                    gsap.to(welcome_components, {
                        duration: 0.3,
                        opacity: 0,
                        onComplete: () => {
                            welcome_components.style.display = "none";
                        }
                    });
                }
                
                // ✅ Trigger the send button click AFTER the audioUrl is created
                sendBtn.click();

                 // Clean up audio context
                stream.getTracks().forEach(track => track.stop());
                if (audioContext.state !== 'closed') {
                    audioContext.close();
                }
            };

            mediaRecorder.start();
            isRecording = true;

            // Show visualizer and hide input
            chatInput.classList.add("recording");
            visualizer.style.display = "flex";
            drawVisualizer();


            micOffSound.pause();
            micOffSound.currentTime = 0;
            micOnSound.play();

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

        } catch (err) {
            console.error("Error accessing microphone:", err);
        }
    }
});

function stopRecordingAndSend() {
    if (isRecording) {
        mediaRecorder.stop();  

        // Hide visualizer and show input
        chatInput.classList.remove("recording");
        visualizer.style.display = "none";
        cancelAnimationFrame(animationFrameId);


        micOnSound.pause();
        micOnSound.currentTime = 0;
        micOffSound.play();
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
}
function cancelRecording() {
    if (isRecording) {
        mediaRecorder.stop();
        isRecording = false;

        // Hide visualizer and show input
        chatInput.classList.remove("recording");
        visualizer.style.display = "none";
        cancelAnimationFrame(animationFrameId);


        micOnSound.pause();
        micOnSound.currentTime = 0;
        micOffSound.play();
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
}


function drawVisualizer() {
    animationFrameId = requestAnimationFrame(drawVisualizer);
    analyser.getByteFrequencyData(dataArray);

    const barCount = visualizerBars.length;
    const step = Math.floor(dataArray.length / barCount);

    for (let i = 0; i < barCount; i++) {
        let barHeight = dataArray[i * step];
        const heightPercentage = (barHeight / 255) * 100;
        visualizerBars[i].style.height = `${Math.max(10, heightPercentage)}%`; // Ensure a minimum height
    }
}


micBtn.addEventListener("mouseup", stopRecordingAndSend);
micBtn.addEventListener("mouseleave", cancelRecording);



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