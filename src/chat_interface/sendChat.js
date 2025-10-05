// require('dotenv').config()

// take the value from the input field 

let chat_input = document.querySelector(".chat_input");
let sendBtn = document.querySelector(".ri-send-plane-fill");
let welcome_components = document.querySelector(".welcome_components");
let chat_output_box = document.querySelector(".chat_output_box");
let chat_history = document.querySelector(".chat_history");
let chat_image_preview = document.querySelector(".chat_image_preview")


function formatLLMResponse(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')   // bold
    .replace(/\*(.*?)\*/g, '<em>$1</em>')               // italic
    .replace(/\n/g, '<br>');                             // line breaks
}



async function getGemmaCompletion(value) {
  const apiKey = "";
  //   const yourSiteUrl = "<YOUR_SITE_URL>"; // Optional
  //   const yourSiteName = "<YOUR_SITE_NAME>"; // Optional

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        // "HTTP-Referer": yourSiteUrl,
        // "X-Title": yourSiteName,
      },
      body: JSON.stringify({
        "model": "google/gemma-3-12b-it:free",
        "messages": [
          {
            "role": "user",
            "content": `Provide me the answer in one line \n ${value}`,
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // console.log(data.choices[0].message.content);
    let response_from_llm = formatLLMResponse(data.choices[0].message.content)
    return response_from_llm;

  } catch (error) {
    console.error("Error fetching completion:", error);
    return "I could not fetch the answer";
  }
}



sendBtn.addEventListener("click", async function (e) {
  e.preventDefault();
  let value = chat_input.value.trim();
  if(!isImage) if (value === "") return; // skip empty messages
  chat_input.value = "";

  let chat_historyValue;

  if(value === "") chat_historyValue = "a photo or recording was uploaded";
  else chat_historyValue = value;

  cameraDiscontinue();

  if (window.getComputedStyle(welcome_components).display == "flex") {
    gsap.to(welcome_components, {
      duration: 0.3,
      opacity: 0,
      onComplete: () => {
        welcome_components.style.display = "none";
      }
    });
    chat_history.insertAdjacentHTML("beforeend", `
      <div class="chat_history_component">
          <img src="assets/Vector.svg" alt="" />
              <p>${chat_historyValue}</p>
      </div>
    `)
  }
  
  // Add user message immediately
  if (isImage) {
    chat_output_box.insertAdjacentHTML("beforeend", `
      <div class="inputAndResponse">
      <div class="inputAndResponse_input">
      <div class="user_input">
      <img class="chat_image_preview" src="${actualImage}">
      <p>${value}</p>
      </div>
      <div class="user_profile_pic"></div>
      </div>
      </div>
      `);
    
    imagePreviewCoverer.style.display = "none";
    isImage = false;
    
    } else {
      chat_output_box.insertAdjacentHTML("beforeend", `
        <div class="inputAndResponse">
        <div class="inputAndResponse_input">
        <div class="user_input"><p>${value}</p></div>
        <div class="user_profile_pic"></div>
        </div>
        </div>
        `);
      }
      
  // Add AI thinking placeholder
  chat_output_box.insertAdjacentHTML("beforeend", `
        <div class="inputAndResponse">
            <div class="inputAndResponse_response">
                <div class="logo"></div>
                <div class="ai_response thinking"><p>AI is thinking...</p></div>
            </div>
        </div>
    `);

  // chat_output_box.scrollTop = chat_output_box.scrollHeight;

  //  Fetch actual AI response
  const thinkingDiv = chat_output_box.querySelector(".ai_response.thinking");
  const aiResponse = await getGemmaCompletion(value);

  // Replace placeholder with real response
  thinkingDiv.innerHTML = `
        <p>${aiResponse}</p>
        <div class="farmer_feedback">
            <i class="ri-thumb-up-fill"></i>
            <i class="ri-thumb-down-fill"></i>
        </div>
    `;
  thinkingDiv.classList.remove("thinking");
  chat_output_box.scrollTop = chat_output_box.scrollHeight;
});


chat_input.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {  // ignore Shift+Enter (for new lines)
    cameraDiscontinue();
    e.preventDefault(); // prevent default form submission / new line
    sendBtn.click();    // trigger the send button click
  }
});
