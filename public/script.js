document.addEventListener("DOMContentLoaded", function () {
  const pulse = document.getElementById("pulse");
  const toggler = document.getElementById("toggler");
  toggler.addEventListener("click", expandCircle);

  function expandCircle() {
    const circle = document.getElementById("circle");
    const rocket = document.getElementById("rocket");
    circle.classList.toggle("expand");
    rocket.classList.toggle("launch");
    pulse.classList.toggle("hide");

    const hiddenContent = document.querySelectorAll(".circle .hidden-content");
    hiddenContent.forEach((element) => {
      element.classList.toggle("show-content-animation");
    });

    const title = document.getElementById("title");
    const suggestions = document.getElementById("suggestions");
    const chatInput = document.getElementById("chat-input");
    title.classList.toggle("animation");
    suggestions.classList.toggle("animation");
    chatInput.classList.toggle("animation");
  }

  const chatInput = document.querySelector(".chat-input textarea");
  const sendChatBtn = document.querySelector(".chat-input i");
  const chatBox = document.querySelector(".chatbox");
  const introSection = document.querySelector(".intro");
  const suggestions = document.querySelectorAll(".suggestion p");
  let userMessage;
  const API_KEY = "placeholder";

  const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    const chatContent =
      className === "outgoing"
        ? `<p>${message}</p>`
        : `<i class="fa-regular fa-comment"></i><p>${message}</p>`;
    chatLi.innerHTML = chatContent;
    return chatLi;
  };

  const generateResponse = (incomingChatLi) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChatLi.querySelector("p");

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: userMessage },
        ],
      }),
    };

    fetch(API_URL, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        messageElement.textContent = data.choices[0].message.content;
      })
      .catch((error) => {
        messageElement.textContent =
          "Sorry, I am not able to process your request at the moment.";
      })
      .finally(() => chatBox.scrollTo(0, chatBox.scrollHeight));
  };

  const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;

    chatBox.appendChild(createChatLi(userMessage, "outgoing"));
    chatBox.scrollTo(0, chatBox.scrollHeight);

    introSection.classList.add("active");
    chatBox.classList.add("active");

    setTimeout(() => {
      const incomingChatLi = createChatLi("Thinking...", "incoming");
      chatBox.appendChild(incomingChatLi);
      chatBox.scrollTo(0, chatBox.scrollHeight);
      generateResponse(incomingChatLi);
    }, 600);

    chatInput.value = "";
  };

  sendChatBtn.addEventListener("click", handleChat);

  suggestions.forEach((suggestion) => {
    suggestion.addEventListener("click", () => {
      const suggestionText = suggestion.textContent.replace(/\s+/g, " ").trim();
      chatInput.value = suggestionText;
    });
  });
});
