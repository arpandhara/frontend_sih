// take the value from the input field 

let chat_input = document.querySelector(".chat_input");
let sendBtn = document.querySelector(".ri-send-plane-fill");
let welcome_components = document.querySelector(".welcome_components");
let chat_output_box = document.querySelector(".chat_output_box");


async function getGemmaCompletion(value) {
  const apiKey = "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";
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
            "content": value,
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;

  } catch (error) {
    console.error("Error fetching completion:", error);
    return "I could not fetch the answer";
  }
}



sendBtn.addEventListener("click", async function (e) {
    e.preventDefault();
    let value = chat_input.value.trim();
    if (value === "") return; // skip empty messages
    chat_input.value = "";

    if (window.getComputedStyle(welcome_components).display == "flex") {
        welcome_components.style.display = "none";
    }

    // 1️⃣ Add user message immediately
    chat_output_box.insertAdjacentHTML("beforeend", `
        <div class="inputAndResponse">
            <div class="inputAndResponse_input">
                <div class="user_input"><p>${value}</p></div>
                <div class="user_profile_pic"></div>
            </div>
        </div>
    `);

    // 2️⃣ Add AI thinking placeholder
    chat_output_box.insertAdjacentHTML("beforeend", `
        <div class="inputAndResponse">
            <div class="inputAndResponse_response">
                <div class="logo"></div>
                <div class="ai_response thinking"><p>AI is thinking...</p></div>
            </div>
        </div>
    `);

    chat_output_box.scrollTop = chat_output_box.scrollHeight;

    // 3️⃣ Fetch actual AI response
    const thinkingDiv = chat_output_box.querySelector(".ai_response.thinking");
    const aiResponse = await getGemmaCompletion(value);

    // 4️⃣ Replace placeholder with real response
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


chat_input.addEventListener("keydown", function(e) {
    if (e.key === "Enter" && !e.shiftKey) {  // ignore Shift+Enter (for new lines)
        e.preventDefault(); // prevent default form submission / new line
        sendBtn.click();    // trigger the send button click
    }
});
