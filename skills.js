import OpenAI from "openai";

const apiKey = "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";
const openai = new OpenAI({ apiKey });

// Create assistant
const assistant = await openai.beta.assistants.retrieve(
  "asst_jrOmFZi8nIsCHWIb69jLbPve"
);

// Threads
// const thread = await openai.beta.threads.create();

// Create message
// const message = await openai.beta.threads.messages.create(thread.id, {
//   role: "user",
//   content: "How many student members does SkillsUSA have?",
// });

// const run = await openai.beta.threads.runs.create(thread.id, {
//   assistant_id: assistant.id,
//   instructions: "Address the user as Human.",
// });

// const run = await openai.beta.threads.runs.retrieve(
//   "thread_0GAh1a0xjHJgKJWn3e1Tcjjd",
//   "run_n9ZRfEmaJvFbyXPVgWUuTkQ6"
// );
// console.log(run);

const messages = await openai.beta.threads.messages.list(
  "thread_0GAh1a0xjHJgKJWn3e1Tcjjd"
);

console.log(messages.body.data[0].content[0].text.value);

// messages.body.data.forEach((message) => {
//   console.log(message.content);
// });
