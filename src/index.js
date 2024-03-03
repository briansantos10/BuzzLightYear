const OpenAI = require("openai");
const ASSISTANT_ID = "asst_jrOmFZi8nIsCHWIb69jLbPve";
const openai = new OpenAI({
  apiKey: "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",
  dangerouslyAllowBrowser: true,
});

(async () => {
  try {
    const assistant = await openai.beta.assistants.retrieve(ASSISTANT_ID);

    const thread = await openai.beta.threads.create({
      messages: [
        {
          role: "user",
          content: "How many students SKillsUSA",
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
    console.log(`Response: ${latestMessage.content[0].text.value}`);
  } catch (error) {
    console.error("Error:", error.message);
  }
})();
