const OpenAI = require("openai");
const ASSISTANT_ID = "asst_jrOmFZi8nIsCHWIb69jLbPve";
const openai = new OpenAI({
  apiKey: "placeholder",
  dangerouslyAllowBrowser: true,
});

(async () => {
  try {
    const assistant = await openai.beta.assistants.retrieve(ASSISTANT_ID);

    const thread = await openai.beta.threads.create({
      messages: [
        {
          role: "user",
          content: "How many student members are in SKillsUSA?",
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

    const messageResponse = await openai.beta.threads.messages.list(thread.id);

    const messages = messageResponse.data;
    const latestMessage = messages[0];
    const responseText = latestMessage.content[0].text.value;

    // Use regex to remove the source tags and their contents
    const cleanedText = responseText.replace(/【\d+†source】/g, "");

    console.log(`Response: ${cleanedText}`);
  } catch (error) {
    console.error("Error:", error.message);
  }
})();
