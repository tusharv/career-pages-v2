import { RandomPracticePicker } from "@/components/RandomPracticePicker";
import { V0_PROMPTS } from "@/lib/v0-prompts";

export function V0PromptPicker() {
  return (
    <RandomPracticePicker
      items={V0_PROMPTS}
      label="10 app ideas to explore"
      buttonLabel="Try another prompt"
    />
  );
}
