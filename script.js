const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input i");
const chatBox = document.querySelector(".chatbox");
let userMessage;
API_KEY = "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";

const createChatLi = (message, className) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  let chatContent =
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
        // Include the SkillsUSA prompt here
        {
          role: "system",
          content:
            "SkillsUSA is America’s proud champion of the skilled trades. Representing nearly 400,000 career and technical education students and teachers nationwide, SkillsUSA chapters thrive in middle schools, high schools, and college/postsecondary institutions. Our mission is to empower students to become skilled professionals, career-ready leaders, and responsible community members. Overview: SkillsUSA chapters operate through the SkillsUSA Framework of Personal Skills, Workplace Skills, and Technical Skills Grounded in Academics. With over 130 occupational areas, from 3-D Animation to Welding, students hone their hands-on skills against industry standards while developing career-readiness skills like teamwork, communication, and leadership. Mission: SkillsUSA empowers students to become skilled professionals, career-ready leaders, and responsible community members. Vision: SkillsUSA envisions producing the most highly skilled workforce in the world, providing every member the opportunity for career success. Values: - Integrity: Consistency and authenticity in word and action. - Respect: Valuing unique experiences and engaging in respectful relationships. - Responsibility: Accountability to the organization's vision, removing barriers to opportunity and access. - Community: Striving for continuous reflection and growth in service to a diverse community. - Service: Empowering members and communities through willing service and partnership. SkillsUSA Framework: The SkillsUSA Framework consists of Personal Skills, Workplace Skills, and Technical Skills Grounded in Academics, with 17 'Essential Elements' crucial to success, identified by industry partners. Diversity, Equity, and Inclusion: SkillsUSA fosters inclusive participation and strives to create a welcoming environment for all members, partners, and employees. It's committed to serving diverse communities within career and technical education, removing barriers to equitable access, and promoting critical reflection and continuous learning. Statement of Non-Discrimination: SkillsUSA is committed to a discrimination-free learning and working environment, prohibiting discrimination based on various factors as required by law. Retaliation against individuals reporting discrimination or harassment is strictly prohibited.",
        },
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
const handeChat = () => {
  userMessage = chatInput.value.trim();
  if (!userMessage) return;

  chatBox.appendChild(createChatLi(userMessage, "outgoing"));
  chatBox.scrollTo(0, chatBox.scrollHeight);

  setTimeout(() => {
    const incomingChatLi = createChatLi("Thinking...", "incoming");
    chatBox.appendChild(incomingChatLi);
    chatBox.scrollTo(0, chatBox.scrollHeight);
    generateResponse(incomingChatLi);
  }, 600);
};

sendChatBtn.addEventListener("click", handeChat);
