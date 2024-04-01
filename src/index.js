document.addEventListener("DOMContentLoaded", () => {
  const OpenAI = require("openai");
  const ASSISTANT_ID = "";
  const openai = new OpenAI({
    apiKey: "",
    dangerouslyAllowBrowser: true,
  });

  const chatInput = document.querySelector(".chat-input textarea");
  const sendChatBtn = document.querySelector(".chat-input i");
  const chatBox = document.querySelector(".chatbox");
  const introSection = document.querySelector(".intro");
  const suggestions = document.querySelectorAll(".suggestion p");
  let userMessage;

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

  const generateResponse = async (incomingChatLi) => {
    try {
      const assistant = await openai.beta.assistants.retrieve(ASSISTANT_ID);

      const thread = await openai.beta.threads.create({
        messages: [
          {
            role: "user",
            content: userMessage,
          },
        ],
      });

      console.log(`Thread created: ${thread.id}`);

      let run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: assistant.id,
      });

      console.log(`Run created: ${run.id}`);

      while (run.status !== "completed") {
        run = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        console.log(`Run status: ${run.status}`);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Sleep for 1 second
      }

      console.log(`Run completed!`);

      const messageResponse = await openai.beta.threads.messages.list(
        thread.id
      );

      const messages = messageResponse.data;
      const latestMessage = messages[0];
      const responseText = latestMessage.content[0].text.value;

      // Use regex to remove the source tags and their contents
      const cleanedText = responseText.replace(/【\d+†source】/g, "");

      incomingChatLi.querySelector("p").textContent = cleanedText;
    } catch (error) {
      console.error("Error:", error.message);
      incomingChatLi.querySelector("p").textContent =
        "Sorry, I am not able to process your request at the moment.";
    } finally {
      chatBox.scrollTo(0, chatBox.scrollHeight);
    }
  };

  const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;

    chatBox.appendChild(createChatLi(userMessage, "outgoing"));
    chatBox.scrollTo(0, chatBox.scrollHeight);

    introSection.classList.add("active");
    chatBox.classList.add("active");
    document.getElementById("info_page").classList.remove("active");

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
