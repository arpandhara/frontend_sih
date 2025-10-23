// require('dotenv').config()

// take the value from the input field 

let chat_input = document.querySelector(".chat_input");
let sendBtn = document.querySelector(".ri-send-plane-fill");
let welcome_components = document.querySelector(".welcome_components");
let chat_output_box = document.querySelector(".chat_output_box");
let chat_history = document.querySelector(".chat_history");
let chat_image_preview = document.querySelector(".chat_image_preview");
let onGoingResponse = false;


function formatLLMResponse(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')   // bold
    .replace(/\*(.*?)\*/g, '<em>$1</em>')               // italic
    .replace(/\n/g, '<br>');                             // line breaks
}



async function getGemmaCompletion(value) {
  const apiKey = ""; 

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "model": "google/gemma-3-12b-it:free",
        "messages": [
          {
            "role": "user",
            "content": ` \n ${value}`,
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    let response_from_llm = formatLLMResponse(data.choices[0].message.content);
    onGoingResponse = false;
    return response_from_llm;

  } catch (error) {
    console.error("Error fetching completion:", error);
    onGoingResponse = false;
    return "Sorry, I couldn't fetch a response. Please try again.";
  }
}



sendBtn.addEventListener("click", async function (e) {
  e.preventDefault();

  if (onGoingResponse) {
    console.log("Wait for the current response to finish.");
    return;
  }

  onGoingResponse = true;


  let value;
  let userInputHtml;
  let chat_historyValue;

  if (isPredefined) {
    value = question;
    userInputHtml = `<div class="user_input"><p>${value}</p></div>`;
    chat_historyValue = value;
    isPredefined = false;
  } else if (isImage) {
    value = chat_input.value.trim();
    userInputHtml = `
        <div class="user_input">
            <img class="chat_image_preview" src="${actualImage}">
            <p>${value}</p>
        </div>`;
    chat_historyValue = value || "Sent an image";
    isImage = false;
    imagePreviewCoverer.style.display = "none";
  } else if (isRecording) {
    value = audioUrl; // The value sent to the AI will be the audio URL
    userInputHtml = `<div class="user_input"><audio src="${value}" controls></audio></div>`;
    chat_historyValue = "Sent a voice message";
    // isRecording is set to false in the mouseup/mouseleave event
  } else {
    value = chat_input.value.trim();
    if (value === "") return;
    userInputHtml = `<div class="user_input"><p>${value}</p></div>`;
    chat_historyValue = value;
  }

  chat_input.value = "";
  cameraDiscontinue();

  if (window.getComputedStyle(welcome_components).display === "flex") {
    gsap.to(welcome_components, {
      duration: 0.3,
      opacity: 0,
      onComplete: () => {
        welcome_components.style.display = "none";
      }
    });
  }
  
  // Add to chat history
  if(isNewChat){
    chat_history.insertAdjacentHTML("beforeend", `
      <div class="chat_history_component">
          <img src="assets/Vector.svg" alt="" />
          <p>${chat_historyValue}</p>
      </div>
    `);
    isNewChat = false;
  }

  // Add user message and thinking placeholder to chat
  chat_output_box.insertAdjacentHTML("beforeend", `
    <div class="inputAndResponse">
        <div class="inputAndResponse_input">
            ${userInputHtml}
            <div class="user_profile_pic"></div>
        </div>
        <div class="inputAndResponse_response">
            <div class="logo"></div>
            <div class="ai_response thinking"><p>AI is thinking...</p></div>
        </div>
    </div>
  `);

  // ✨ Scroll to the bottom immediately
  chat_output_box.scrollTop = chat_output_box.scrollHeight;

  // Fetch actual AI response
  const thinkingDiv = chat_output_box.querySelector(".ai_response.thinking");
  // For audio, we still expect a text response from the LLM
  const aiResponse = await getGemmaCompletion(isRecording ? "Transcribe the following audio" : value);

  // Replace placeholder with real response
  thinkingDiv.innerHTML = `
      <p>${aiResponse}</p>
      <div class="farmer_feedback">
          <i class="ri-thumb-up-fill"></i>
          <i class="ri-thumb-down-fill"></i>
      </div>
  `;
  thinkingDiv.classList.remove("thinking");
  
  // Scroll to the bottom again to show the full AI response
  chat_output_box.scrollTop = chat_output_box.scrollHeight;
  
  if (isRecording) {
      isRecording = false; // Ensure state is reset
  }
});


chat_input.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {  // ignore Shift+Enter (for new lines)
    e.preventDefault(); // prevent default form submission / new line
    if (!onGoingResponse) {
        sendBtn.click();    // trigger the send button click
    }
  }
});

// stop messaging again on ongoing process


