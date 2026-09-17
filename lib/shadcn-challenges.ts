export const SHADCN_CHALLENGES = [
  {
    title: "A form that helps you recover",
    steps: [
      {
        title: "Build the small form",
        body: "Add labelled company and role inputs with a submit button. Keep both values in state.",
      },
      {
        title: "Guide someone through an error",
        body: "Submit without a role. Show a specific message connected to that input while preserving the company value.",
      },
      {
        title: "Try it without a mouse",
        body: "Use the keyboard to find and correct the error. Check that colour is not the only way to recognise the invalid field.",
      },
    ],
    prompt:
      "Build a small application form with company and role inputs using Label, Input, and Button. Submit it with a missing role. Write an error that explains how to fix it, connect the message to the input, and keep the other field’s value.",
    twist:
      "Complete the form using only the keyboard. Can you find the invalid field and understand its error without relying on red text?",
  },
  {
    title: "An empty state with a next step",
    steps: [
      {
        title: "Start with an empty list",
        body: "Create a saved-jobs Card with a short explanation and one clear action to add the first job.",
      },
      {
        title: "Add the first item",
        body: "Make the action reveal or add a sample job. Check that the empty message disappears and the card still feels balanced.",
      },
      {
        title: "Separate empty from no matches",
        body: "Apply a filter that hides every item. Offer Clear filters instead of asking the person to create another job.",
      },
    ],
    prompt:
      "Design a Card for an empty saved-jobs list. Include a short explanation and one clear action to add the first job. Use your own wording and make the same space work when a job has been saved.",
    twist:
      "Now show a filtered list with no matches. Give it a different message and an action to clear filters rather than add a job.",
  },
  {
    title: "A dialog that remembers your place",
    steps: [
      {
        title: "Open an editing dialog",
        body: "Use Dialog with a visible title, a labelled project-name input, and Save and Cancel actions.",
      },
      {
        title: "Keep edits predictable",
        body: "Save a new name and verify it outside the dialog. Reopen, change it, and cancel; the saved name should remain.",
      },
      {
        title: "Follow keyboard focus",
        body: "Open with the keyboard and close with Escape. Confirm focus returns to the opening button.",
      },
    ],
    prompt:
      "Use Dialog to edit a project name. Add a visible title, a labelled input, Save, and Cancel. Keep the original name when cancelled and show the updated name after saving.",
    twist:
      "Open it with the keyboard, close it with Escape, and check that focus returns to the button that opened it.",
  },
  {
    title: "Filters you can understand at a glance",
    steps: [
      {
        title: "Prepare a few sample jobs",
        body: "Include different locations and work arrangements. Add a labelled Select for each filter.",
      },
      {
        title: "Show the result of each choice",
        body: "Filter the list, display the matching count, and keep selected values visible. Make Clear filters restore all jobs.",
      },
      {
        title: "Try a combination with no matches",
        body: "Show a helpful message without removing the controls. Test changing one filter to get results again.",
      },
    ],
    prompt:
      "Create a small list of sample jobs with Select controls for location and work arrangement. Show how many results match and add a Clear filters button. Make the active selections visible without reopening each control.",
    twist:
      "Try a combination with zero results. Keep the filters available and explain how to broaden the search.",
  },
  {
    title: "A card that survives real content",
    steps: [
      {
        title: "Build one project card",
        body: "Add a title, description, technology badges, and a View project link. Give the text a clear hierarchy.",
      },
      {
        title: "Swap in awkward content",
        body: "Try a long title, a short description, and no image. Let the content wrap instead of clipping.",
      },
      {
        title: "Compare across screen sizes",
        body: "Place two cards side by side, then narrow the screen. Check that each link remains visible and easy to reach.",
      },
    ],
    prompt:
      "Build a project Card with a title, description, two technology badges, and a View project link. Test a one-word title, a long title, and a missing image. Keep the hierarchy readable in each version.",
    twist:
      "View two cards side by side and then at phone width. Can long text wrap without pushing the link outside the card?",
  },
  {
    title: "A loading state with a soft landing",
    steps: [
      {
        title: "Match the loading layout",
        body: "Create three Skeleton cards with roughly the same dimensions as the finished job cards. Include an accessible loading message.",
      },
      {
        title: "Show the loaded results",
        body: "Simulate a request, then replace placeholders with sample jobs. Watch for distracting shifts in layout.",
      },
      {
        title: "Make failure recoverable",
        body: "Simulate an error and show Retry. Confirm retrying returns to loading and then displays results.",
      },
    ],
    prompt:
      "Use Skeleton to create a loading state for three job cards. Match the loaded cards’ general dimensions, add a short accessible loading message, and switch to sample results after a simulated request.",
    twist:
      "Make the request fail. Replace the skeletons with a clear error and a Retry button instead of leaving the page loading forever.",
  },
  {
    title: "Tabs that keep your work",
    steps: [
      {
        title: "Set up two clear tabs",
        body: "Create Overview and Notes tabs for a project. Give the selected tab a visible state.",
      },
      {
        title: "Preserve the note",
        body: "Type into Notes, visit Overview, and return. Store the draft so switching tabs does not erase it.",
      },
      {
        title: "Navigate with the keyboard",
        body: "Use keyboard controls to switch tabs. Check visible focus and a selected indicator that works without colour alone.",
      },
    ],
    prompt:
      "Build Tabs for a project’s Overview and Notes. Put an editable note in the second tab and preserve its value when switching tabs. Use clear tab names and a visible selected state.",
    twist:
      "Move between tabs with the keyboard. Is focus visible, and can you distinguish the selected tab without colour alone?",
  },
  {
    title: "A considerate delete confirmation",
    steps: [
      {
        title: "Name what will be deleted",
        body: "Open an AlertDialog from a sample application. Include its name and clear Cancel and Delete actions.",
      },
      {
        title: "Make confirmation matter",
        body: "Cancel and verify the item remains. Confirm deletion and check that only the chosen application disappears.",
      },
      {
        title: "Test the last item",
        body: "Use a long company name, then delete the final application. Show a useful empty state and keep focus somewhere meaningful.",
      },
    ],
    prompt:
      "Use AlertDialog before deleting a saved application. Name the item in the message, label the destructive action clearly, and make Cancel easy to find. Update the sample list only after confirmation.",
    twist:
      "Test a very long company name and a list with only one application. What should the person see after deleting the last item?",
  },
  {
    title: "A table that works on a phone",
    steps: [
      {
        title: "Lay out five applications",
        body: "Build a Table with a caption and headers for company, role, status, and follow-up date. Use text for each status.",
      },
      {
        title: "Try imperfect sample data",
        body: "Add a long role name and a missing follow-up date. Keep the cells readable and make missing information clear.",
      },
      {
        title: "Shrink to phone width",
        body: "Choose a readable narrow layout. If horizontal scrolling is needed, contain it within the table and keep it keyboard accessible.",
      },
    ],
    prompt:
      "Use Table to show five fictional applications with company, role, status, and follow-up date. Give the table a descriptive caption and use text labels for status. Choose how to handle the columns on a narrow screen.",
    twist:
      "Test a long role title and a missing follow-up date. If the table scrolls horizontally, keep that scroll inside the table area rather than the whole page.",
  },
  {
    title: "A theme with readable details",
    steps: [
      {
        title: "Choose a small theme palette",
        body: "Style a profile Card, Button, Input, and Badge through theme variables. Start with one restrained accent.",
      },
      {
        title: "Inspect the details in both themes",
        body: "Check text, borders, disabled controls, and focus visibility in light and dark modes.",
      },
      {
        title: "Give the button a loading state",
        body: "Add visible progress text and preserve the button width. Make sure the state is understandable without relying on animation.",
      },
    ],
    prompt:
      "Style a small profile Card with a Button, Input, and Badge using your theme variables. Choose a restrained accent colour and check text, borders, disabled controls, and focus indicators in light and dark themes.",
    twist:
      "Give the button a loading state. Keep its width steady and include visible text so progress does not depend on a spinning icon.",
  },
] as const;
