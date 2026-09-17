import type { ToolSlug } from "@/lib/tools";

// Small, tool-specific experiments give each guide a different starting point.
export const TOOL_SPARKS: Record<
  ToolSlug,
  {
    note: string;
    label: string;
    starter: string;
    twist: string;
  }
> = {
  v0: {
    note: "Your slightly odd app idea is welcome here.",
    label: "A prompt to play with",
    starter:
      "Build a saved-jobs screen for someone applying to their first role. Show three fictional applications, the next action for each, and a friendly empty state. Keep it usable on a phone.",
    twist:
      "What if there are 50 saved jobs? Try the same screen with longer company names and no logos. Which part becomes hard to scan?",
  },
  shadcn: {
    note: "Yes, the empty state deserves some love too.",
    label: "A tiny design challenge",
    starter:
      "Make a form that feels helpful when someone gets it wrong. Leave the role blank, submit it, and write the error message you would want to see.",
    twist:
      "Put your mouse aside. Can you complete the form, find the error, and fix it using only the keyboard?",
  },
  cursor: {
    note: "Get curious. Ask the code a better question.",
    label: "Ask for a hint",
    starter:
      "Help me investigate this bug. Ask me for the steps to reproduce it, then give me one hint at a time. Let me propose a fix before you write any code.",
    twist:
      "Close the chat and explain the fix in three sentences: what broke, why it broke, and what changed. Where do you still get stuck?",
  },
  supabase: {
    note: "Two imaginary users. One very useful experiment.",
    label: "Meet Alex and Sam",
    starter:
      "Alex saves a private application note. Sam signs in on a different account. Before checking the result, predict exactly what Sam should be able to read and change.",
    twist:
      "Try updating Alex’s note through the app API while signed in as Sam. Hiding a button is useful UI, but the access policy must also reject the request.",
  },
  vercel: {
    note: "Time to let your project leave your laptop.",
    label: "The first-visitor test",
    starter:
      "Open your deployed link in a private window and pretend you have never seen the app. Can you tell what it does and try its main action without any help?",
    twist:
      "Send the link to a willing friend with no instructions. Ask where they hesitated. That is a useful place to improve next.",
  },
  scrimba: {
    note: "Pause. Tinker. See what happens.",
    label: "Change the example",
    starter:
      "Take a lesson’s list of items and turn it into a list of jobs you might like. Add a filter for location. Predict the result before running your code.",
    twist:
      "Close the lesson and rebuild just the filter from memory. Looking something up is fine; write down which part needed a reminder.",
  },
  hacktoberfest: {
    note: "Bring a question. You don’t need a grand plan.",
    label: "A conversation opener",
    starter:
      "“I’m new to this topic and trying to understand how people use it. What are you experimenting with today?”",
    twist:
      "Before leaving, jot down one thing you learned from another participant and one thing you want to try. A useful question counts as progress too.",
  },
  meetup: {
    note: "Going solo? You already have a topic in common.",
    label: "Skip the elevator pitch",
    starter:
      "“What brought you to this session? I’m learning a bit of [topic] and wanted to hear how other people approach it.”",
    twist:
      "If you enjoy the group, try attending a second session. Recognising one familiar face can make the next hello much easier.",
  },
  luma: {
    note: "One good conversation is a lovely place to start.",
    label: "Make the follow-up easy",
    starter:
      "“Good meeting you at [event]. Your point about [topic] stayed with me. Here’s the resource we talked about—hope it’s useful!”",
    twist:
      "Before registering, pick one question the session could help you answer. Afterward, compare what you expected with what you actually learned.",
  },
};
