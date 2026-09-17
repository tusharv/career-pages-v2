import { SCRIMBA_COURSES } from "@/lib/scrimba-courses";
import type { ToolSlug } from "@/lib/tools";
import { V0_PROMPTS } from "@/lib/v0-prompts";
import { SHADCN_CHALLENGES } from "@/lib/shadcn-challenges";

export type PortfolioExample = {
  title: string;
  courseUrl?: string;
  prompt: string;
  twist: string;
  takeaway: string;
  steps: readonly { title: string; body: string }[];
};
const EXAMPLES = {
  cursor: [
    {
      title: "Accessible issue tracker",
      prompt:
        "Build a small issue tracker with labels, search, and an editable status. Use Cursor to help with one feature at a time.",
      steps: [
        {
          title: "Build a focused version",
          body: "Create three sample issues and implement a labelled filter. Ask Cursor to explain the state flow before editing it.",
        },
        {
          title: "Check the important cases",
          body: "Test an empty search, a status change, and keyboard-only navigation. Review the generated diff.",
        },
        {
          title: "Explain what you learned",
          body: "Explain one decision you made yourself, one AI suggestion you changed, and why the final behaviour is correct.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Publish a short walkthrough of the filter, its accessibility checks, and one decision you made.",
    },
    {
      title: "A bug with a regression test",
      prompt:
        "Fix a reproducible bug in your own project and document how you found its cause.",
      steps: [
        {
          title: "Build a focused version",
          body: "Write reproduction steps, ask Cursor for possible causes, and inspect the relevant code before requesting a narrow fix.",
        },
        {
          title: "Check the important cases",
          body: "Create a test that fails on the original bug and passes with the fix. Try a nearby edge case.",
        },
        {
          title: "Explain what you learned",
          body: "Explain one decision you made yourself, one AI suggestion you changed, and why the final behaviour is correct.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Share the bug report, focused diff, and regression test as a debugging case study.",
    },
    {
      title: "A small command-line utility",
      prompt:
        "Create a command-line tool that summarises file sizes in a folder you choose.",
      steps: [
        {
          title: "Build a focused version",
          body: "Use a temporary sample directory. Add a path argument, a readable report, and help text; keep the command read-only.",
        },
        {
          title: "Check the important cases",
          body: "Test an empty folder, spaces in filenames, and a missing path. Check error messages and exit codes.",
        },
        {
          title: "Explain what you learned",
          body: "Explain one decision you made yourself, one AI suggestion you changed, and why the final behaviour is correct.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Publish the utility with installation instructions, sample output, and tests.",
    },
    {
      title: "A safer API client",
      prompt:
        "Build a typed client for a mock book-search API with loading, error, and retry behaviour.",
      steps: [
        {
          title: "Build a focused version",
          body: "Define response types, parse the response, and add a small search interface. Ask Cursor to critique assumptions about missing fields.",
        },
        {
          title: "Check the important cases",
          body: "Simulate invalid JSON, a timeout, and no results. Confirm retries do not duplicate rendered items.",
        },
        {
          title: "Explain what you learned",
          body: "Explain one decision you made yourself, one AI suggestion you changed, and why the final behaviour is correct.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Include a response-handling diagram and failure-case tests in the repository.",
    },
    {
      title: "A measured performance improvement",
      prompt:
        "Improve a slow interaction in a sample project and explain the evidence behind the change.",
      steps: [
        {
          title: "Build a focused version",
          body: "Create a repeatable dataset and measure filtering time. Ask Cursor to suggest a small optimisation with a trade-off.",
        },
        {
          title: "Check the important cases",
          body: "Repeat measurements under the same conditions and confirm results remain correct. Record actual numbers rather than estimated gains.",
        },
        {
          title: "Explain what you learned",
          body: "Explain one decision you made yourself, one AI suggestion you changed, and why the final behaviour is correct.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Write a before-and-after note with the measurement method, results, and limitations.",
    },
    {
      title: "A readable legacy refactor",
      prompt:
        "Refactor one confusing module in your own code while preserving its behaviour.",
      steps: [
        {
          title: "Build a focused version",
          body: "Add characterisation tests, identify responsibilities, and ask Cursor for a refactoring plan before making changes.",
        },
        {
          title: "Check the important cases",
          body: "Run the same tests before and after. Inspect the diff for unintended behaviour changes.",
        },
        {
          title: "Explain what you learned",
          body: "Explain one decision you made yourself, one AI suggestion you changed, and why the final behaviour is correct.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Show the original problem, the smaller interfaces, and the tests that protected behaviour.",
    },
    {
      title: "An offline reading list",
      prompt:
        "Create a browser reading list that saves locally and supports export and import.",
      steps: [
        {
          title: "Build a focused version",
          body: "Implement add, edit, and remove actions. Store fictional entries locally and define a versioned export format.",
        },
        {
          title: "Check the important cases",
          body: "Reload the page and import both valid and malformed files. Confirm invalid input does not erase existing data.",
        },
        {
          title: "Explain what you learned",
          body: "Explain one decision you made yourself, one AI suggestion you changed, and why the final behaviour is correct.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Publish a demo plus notes explaining persistence, import validation, and data ownership.",
    },
    {
      title: "A component test playground",
      prompt:
        "Create a small gallery of form states backed by meaningful interaction tests.",
      steps: [
        {
          title: "Build a focused version",
          body: "Build a labelled signup form with validation and a simulated server response. Ask Cursor to propose tests, then review them.",
        },
        {
          title: "Check the important cases",
          body: "Test submission, correction of errors, and a failed request. Make a test fail intentionally to confirm it detects the problem.",
        },
        {
          title: "Explain what you learned",
          body: "Explain one decision you made yourself, one AI suggestion you changed, and why the final behaviour is correct.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Share the form, tests, and a short explanation of what is and is not covered.",
    },
    {
      title: "An understandable codebase map",
      prompt:
        "Create an interactive map of a small open-source project you have permission to analyse.",
      steps: [
        {
          title: "Build a focused version",
          body: "Trace one user action through the actual files. Use Cursor for explanations, but verify each connection in source.",
        },
        {
          title: "Check the important cases",
          body: "Check every linked file and distinguish confirmed relationships from your assumptions.",
        },
        {
          title: "Explain what you learned",
          body: "Explain one decision you made yourself, one AI suggestion you changed, and why the final behaviour is correct.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Publish an attributed architecture walkthrough with a diagram and links to the version examined.",
    },
    {
      title: "A practical accessibility repair",
      prompt:
        "Improve the keyboard experience of a small interface you maintain.",
      steps: [
        {
          title: "Build a focused version",
          body: "Audit focus order, labels, and dialog behaviour. Ask Cursor to help implement one identified issue at a time.",
        },
        {
          title: "Check the important cases",
          body: "Repeat the keyboard journey and inspect accessible names. Check that the visual layout still works on mobile.",
        },
        {
          title: "Explain what you learned",
          body: "Explain one decision you made yourself, one AI suggestion you changed, and why the final behaviour is correct.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Publish an issue-to-fix case study with a short recording and a clear audit scope.",
    },
  ],
  supabase: [
    {
      title: "Private application notes",
      prompt:
        "Build an application tracker where each signed-in user can access only their own notes.",
      steps: [
        {
          title: "Build a focused version",
          body: "Create applications and notes tables with owner IDs. Implement authentication and explicit row-level access policies.",
        },
        {
          title: "Check the important cases",
          body: "Use two test accounts to attempt reading, editing, and deleting each other’s records through the API.",
        },
        {
          title: "Explain what you learned",
          body: "Draw the relevant data relationships and explain where validation and access rules are enforced.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Share a schema diagram, policy tests, and a demo using fictional applications.",
    },
    {
      title: "A book-lending library",
      prompt:
        "Create a library for a small club with books, members, and loan records.",
      steps: [
        {
          title: "Build a focused version",
          body: "Model book copies and loans with foreign keys. Add borrow and return actions with appropriate access checks.",
        },
        {
          title: "Check the important cases",
          body: "Attempt to lend the same copy twice and return a loan twice. Decide where constraints must be enforced.",
        },
        {
          title: "Explain what you learned",
          body: "Draw the relevant data relationships and explain where validation and access rules are enforced.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Publish the schema and an explanation of how you prevent conflicting loans.",
    },
    {
      title: "A team project board",
      prompt:
        "Build a project board with separate owner, editor, and viewer permissions.",
      steps: [
        {
          title: "Build a focused version",
          body: "Model projects and membership roles. Apply policies to tasks and membership changes rather than relying on hidden UI controls.",
        },
        {
          title: "Check the important cases",
          body: "Test each role against read, update, and invitation operations using separate accounts.",
        },
        {
          title: "Explain what you learned",
          body: "Draw the relevant data relationships and explain where validation and access rules are enforced.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Include a permission matrix and reproducible access-control checks.",
    },
    {
      title: "An image collection with permissions",
      prompt:
        "Create a private photo collection with uploads and captions using sample images.",
      steps: [
        {
          title: "Build a focused version",
          body: "Configure storage access, associate file paths with database records, and validate allowed file sizes and types.",
        },
        {
          title: "Check the important cases",
          body: "Try accessing another user’s file and uploading an unsupported file. Check how deleting an entry handles its stored file.",
        },
        {
          title: "Explain what you learned",
          body: "Draw the relevant data relationships and explain where validation and access rules are enforced.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Share a storage access diagram and a demo with non-personal sample images.",
    },
    {
      title: "A searchable learning log",
      prompt:
        "Build a learning journal that supports tags and text search over your own notes.",
      steps: [
        {
          title: "Build a focused version",
          body: "Model entries and tags, implement a search query, and inspect how the query behaves with a realistic sample dataset.",
        },
        {
          title: "Check the important cases",
          body: "Test no matches, punctuation, pagination, and access boundaries between accounts.",
        },
        {
          title: "Explain what you learned",
          body: "Draw the relevant data relationships and explain where validation and access rules are enforced.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Publish sample queries, indexing choices, and measured query results.",
    },
    {
      title: "An event capacity demo",
      prompt:
        "Create a demo event registration system with a limited number of places.",
      steps: [
        {
          title: "Build a focused version",
          body: "Model events and registrations. Enforce capacity and uniqueness in a database transaction or suitable database function.",
        },
        {
          title: "Check the important cases",
          body: "Simulate concurrent registrations for the final place. Verify the event never exceeds capacity.",
        },
        {
          title: "Explain what you learned",
          body: "Draw the relevant data relationships and explain where validation and access rules are enforced.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Show the concurrency test and explain the database constraint or transaction used.",
    },
    {
      title: "A shared expense ledger",
      prompt:
        "Build an expense ledger for a fictional group, storing amounts in integer minor units.",
      steps: [
        {
          title: "Build a focused version",
          body: "Model group membership, expenses, and shares. Restrict all records to group members.",
        },
        {
          title: "Check the important cases",
          body: "Test rounding, deleted members, and unauthorised edits. Check that shares match each expense total.",
        },
        {
          title: "Explain what you learned",
          body: "Draw the relevant data relationships and explain where validation and access rules are enforced.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Publish the schema, arithmetic tests, and access rules with synthetic records.",
    },
    {
      title: "A moderated feedback board",
      prompt:
        "Create a feedback board with public approved posts and private pending submissions.",
      steps: [
        {
          title: "Build a focused version",
          body: "Model moderation status and separate submitter and moderator permissions. Add a simple review screen.",
        },
        {
          title: "Check the important cases",
          body: "Verify an anonymous visitor cannot read pending posts or approve their own submission.",
        },
        {
          title: "Explain what you learned",
          body: "Draw the relevant data relationships and explain where validation and access rules are enforced.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway: "Share the moderation flow and a role-based test checklist.",
    },
    {
      title: "A reliable database migration",
      prompt:
        "Evolve a small project’s schema without losing existing sample data.",
      steps: [
        {
          title: "Build a focused version",
          body: "Write a migration that adds a field and backfills it deliberately. Work in a local or disposable test database.",
        },
        {
          title: "Check the important cases",
          body: "Apply it to a fresh database and an older sample dataset. Verify record counts and constraints after migration.",
        },
        {
          title: "Explain what you learned",
          body: "Draw the relevant data relationships and explain where validation and access rules are enforced.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Publish the migration, sample fixtures, and your recovery strategy.",
    },
    {
      title: "A personal dashboard with pagination",
      prompt:
        "Build a dashboard over a large synthetic dataset without fetching every row at once.",
      steps: [
        {
          title: "Build a focused version",
          body: "Create dated activity records and implement stable sorting, pagination, and filtered totals.",
        },
        {
          title: "Check the important cases",
          body: "Check duplicate dates, empty pages, and filters changing between requests. Measure response size.",
        },
        {
          title: "Explain what you learned",
          body: "Draw the relevant data relationships and explain where validation and access rules are enforced.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Document pagination decisions, indexes, and measured behaviour on the sample dataset.",
    },
  ],
  vercel: [
    {
      title: "A portfolio people can explore",
      prompt:
        "Publish a focused portfolio with one detailed project case study and a working demo link.",
      steps: [
        {
          title: "Build a focused version",
          body: "Deploy the repository and configure production settings. Explain the project’s purpose and how visitors can try it.",
        },
        {
          title: "Check the important cases",
          body: "Open the URL in a private window and on a phone. Check every project link and refresh a nested route.",
        },
        {
          title: "Explain what you learned",
          body: "Write the deployment steps another developer would need and note one issue you diagnosed along the way.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Use the live portfolio, screenshot, and case study as the finished artifact.",
    },
    {
      title: "A preview-driven review workflow",
      prompt: "Demonstrate how you review a web change before publishing it.",
      steps: [
        {
          title: "Build a focused version",
          body: "Connect a repository, make a small branch change, and inspect its preview deployment before merging.",
        },
        {
          title: "Check the important cases",
          body: "Check the changed interaction, access settings, and environment configuration on both preview and production.",
        },
        {
          title: "Explain what you learned",
          body: "Write the deployment steps another developer would need and note one issue you diagnosed along the way.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Document one real preview review with screenshots and the issue it caught.",
    },
    {
      title: "A fast image gallery",
      prompt:
        "Deploy a responsive gallery and improve its image loading based on measurements.",
      steps: [
        {
          title: "Build a focused version",
          body: "Use licensed sample images, appropriate dimensions, and a responsive layout. Record a baseline loading measurement.",
        },
        {
          title: "Check the important cases",
          body: "Repeat the same test after optimising images. Check layout stability and record the actual results.",
        },
        {
          title: "Explain what you learned",
          body: "Write the deployment steps another developer would need and note one issue you diagnosed along the way.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Publish a performance case study with reproducible conditions and before-and-after measurements.",
    },
    {
      title: "A useful 404 and error experience",
      prompt:
        "Build a small resource site that helps visitors recover from broken links and failed requests.",
      steps: [
        {
          title: "Build a focused version",
          body: "Add a clear not-found page and a recoverable error state for a simulated data request.",
        },
        {
          title: "Check the important cases",
          body: "Open a nonexistent route, refresh a nested route, and trigger the failed request. Verify navigation still works.",
        },
        {
          title: "Explain what you learned",
          body: "Write the deployment steps another developer would need and note one issue you diagnosed along the way.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Share the live recovery flows with a short explanation of the design decisions.",
    },
    {
      title: "A server-backed contact demo",
      prompt:
        "Deploy a contact-form demo with validation and a safe server-side handler.",
      steps: [
        {
          title: "Build a focused version",
          body: "Use synthetic submissions and a test destination. Keep credentials server-side and implement basic abuse controls appropriate to the demo.",
        },
        {
          title: "Check the important cases",
          body: "Test invalid inputs, duplicate clicks, and a simulated downstream failure. Check that logs omit message contents and secrets.",
        },
        {
          title: "Explain what you learned",
          body: "Write the deployment steps another developer would need and note one issue you diagnosed along the way.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Publish the request flow, validation tests, and a clearly labelled demo.",
    },
    {
      title: "An environment setup guide",
      prompt:
        "Create a small deployed app that uses separate demo settings for preview and production.",
      steps: [
        {
          title: "Build a focused version",
          body: "Document required variables and configure each deployment environment. Use non-sensitive sample values for browser-visible settings.",
        },
        {
          title: "Check the important cases",
          body: "Deploy with a missing variable and verify the failure is understandable. Confirm server-only secrets are absent from the client bundle.",
        },
        {
          title: "Explain what you learned",
          body: "Write the deployment steps another developer would need and note one issue you diagnosed along the way.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Publish a setup guide with a redacted configuration example and troubleshooting notes.",
    },
    {
      title: "A documentation site with search",
      prompt:
        "Deploy documentation for a tool or library you built, including examples and simple search.",
      steps: [
        {
          title: "Build a focused version",
          body: "Write a quickstart, usage examples, and common error explanations. Add navigation and search over a small content set.",
        },
        {
          title: "Check the important cases",
          body: "Try an unfamiliar search term, an empty query, and direct links to nested pages on mobile.",
        },
        {
          title: "Explain what you learned",
          body: "Write the deployment steps another developer would need and note one issue you diagnosed along the way.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Share the live docs and a short user journey from installation to first successful use.",
    },
    {
      title: "A deployment recovery drill",
      prompt:
        "Practise recovering from a broken release using a disposable demo app.",
      steps: [
        {
          title: "Build a focused version",
          body: "Record a working deployment, introduce an intentional demo-only failure, and follow the documented recovery workflow available to your project.",
        },
        {
          title: "Check the important cases",
          body: "Confirm the public URL works again and record what was restored, including any configuration caveats.",
        },
        {
          title: "Explain what you learned",
          body: "Write the deployment steps another developer would need and note one issue you diagnosed along the way.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Write an incident-style report with the timeline, checks, and lessons learned.",
    },
    {
      title: "A shareable public-data dashboard",
      prompt:
        "Deploy a dashboard using a public dataset or a checked-in snapshot with clear attribution.",
      steps: [
        {
          title: "Build a focused version",
          body: "Build filters and a chart with text summaries. Display the dataset date and explain any transformation.",
        },
        {
          title: "Check the important cases",
          body: "Test zero results, failed data loading, and small screens. Ensure the demo remains understandable without the chart alone.",
        },
        {
          title: "Explain what you learned",
          body: "Write the deployment steps another developer would need and note one issue you diagnosed along the way.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Publish the dashboard with source attribution, data assumptions, and a screenshot.",
    },
    {
      title: "An accessible project showcase",
      prompt:
        "Publish a showcase with keyboard-friendly navigation and a clear reduced-motion experience.",
      steps: [
        {
          title: "Build a focused version",
          body: "Build a small gallery of your work with meaningful links, headings, and labelled controls.",
        },
        {
          title: "Check the important cases",
          body: "Navigate with a keyboard, check contrast, and test reduced motion and zoom. Record the scope of your checks.",
        },
        {
          title: "Explain what you learned",
          body: "Write the deployment steps another developer would need and note one issue you diagnosed along the way.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Share the live showcase and an accessibility review describing fixes and remaining limitations.",
    },
  ],
  hacktoberfest: [
    {
      title: "A workshop experiment notebook",
      prompt:
        "Use an open-source AI session to investigate one small question with a reproducible notebook.",
      steps: [
        {
          title: "Build a focused version",
          body: "Choose a session-appropriate model and sample task. Record dependencies, settings, and synthetic inputs.",
        },
        {
          title: "Check the important cases",
          body: "Run the notebook from a clean setup and include both successful and unsuccessful examples.",
        },
        {
          title: "Explain what you learned",
          body: "Credit the project and collaborators, describe your actual contribution, and be clear about unfinished work.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Publish the notebook with attribution, limitations, and a concise explanation of your findings.",
    },
    {
      title: "A documentation contribution",
      prompt:
        "Improve a confusing setup step in an open-source project you encounter at an event.",
      steps: [
        {
          title: "Build a focused version",
          body: "Read contribution guidance, reproduce the confusing step, and agree on a small documentation change.",
        },
        {
          title: "Check the important cases",
          body: "Follow the revised instructions in a clean environment and check the project’s documentation checks.",
        },
        {
          title: "Explain what you learned",
          body: "Credit the project and collaborators, describe your actual contribution, and be clear about unfinished work.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Link to the contribution and explain its status honestly, including if it is still under review.",
    },
    {
      title: "A local model demo",
      prompt:
        "Build a small interface around a locally runnable model explored in a workshop.",
      steps: [
        {
          title: "Build a focused version",
          body: "Choose a narrow task and document the model licence, hardware requirements, and setup.",
        },
        {
          title: "Check the important cases",
          body: "Try difficult inputs and measure actual response times on your hardware.",
        },
        {
          title: "Explain what you learned",
          body: "Credit the project and collaborators, describe your actual contribution, and be clear about unfinished work.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Publish the demo with reproducible instructions and clear capability limits.",
    },
    {
      title: "A retrieval experiment",
      prompt:
        "Explore search over a small set of openly licensed documents with a workshop group.",
      steps: [
        {
          title: "Build a focused version",
          body: "Create a tiny dataset, record its provenance, and show source passages alongside retrieved results.",
        },
        {
          title: "Check the important cases",
          body: "Test questions with no supporting answer and inspect incorrect retrievals.",
        },
        {
          title: "Explain what you learned",
          body: "Credit the project and collaborators, describe your actual contribution, and be clear about unfinished work.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Share the dataset attribution, evaluation examples, and what failed.",
    },
    {
      title: "An agent with a safe stopping point",
      prompt:
        "Prototype an agent that organises a synthetic task list without changing external accounts.",
      steps: [
        {
          title: "Build a focused version",
          body: "Keep actions inside a sandbox and show a proposed plan before applying changes to sample data.",
        },
        {
          title: "Check the important cases",
          body: "Test ambiguous requests and invalid tool outputs. Confirm it stops when the next action is unclear.",
        },
        {
          title: "Explain what you learned",
          body: "Credit the project and collaborators, describe your actual contribution, and be clear about unfinished work.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Publish the workflow diagram, test cases, and a recording of the review step.",
    },
    {
      title: "A contributor onboarding checklist",
      prompt:
        "Create a practical first-run guide for a project you explored during a community session.",
      steps: [
        {
          title: "Build a focused version",
          body: "Ask maintainers what newcomers struggle with and reproduce the setup on your own machine.",
        },
        {
          title: "Check the important cases",
          body: "Check every command and record supported versions and known limitations.",
        },
        {
          title: "Explain what you learned",
          body: "Credit the project and collaborators, describe your actual contribution, and be clear about unfinished work.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Share an attributed guide or contribution that reduces a specific setup obstacle.",
    },
    {
      title: "A model comparison report",
      prompt:
        "Compare two permitted models on a small, well-defined task introduced at an event.",
      steps: [
        {
          title: "Build a focused version",
          body: "Use the same sample inputs and document settings and evaluation criteria.",
        },
        {
          title: "Check the important cases",
          body: "Include failures, actual timings, and the limits of a small sample.",
        },
        {
          title: "Explain what you learned",
          body: "Credit the project and collaborators, describe your actual contribution, and be clear about unfinished work.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Publish the evaluation code and a balanced report without broad unsupported claims.",
    },
    {
      title: "A useful bug reproduction",
      prompt:
        "Turn a problem found during a workshop into a minimal reproducible example.",
      steps: [
        {
          title: "Build a focused version",
          body: "Check for an existing issue and isolate the failure with minimal sample code and version information.",
        },
        {
          title: "Check the important cases",
          body: "Confirm the example fails as described in a clean environment and remove unrelated code.",
        },
        {
          title: "Explain what you learned",
          body: "Credit the project and collaborators, describe your actual contribution, and be clear about unfinished work.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Publish the reproduction or issue with its current status and clear attribution.",
    },
    {
      title: "An accessible experiment interface",
      prompt:
        "Improve the interface around an open-source demo with permission from its maintainers.",
      steps: [
        {
          title: "Build a focused version",
          body: "Identify a keyboard, label, or error-message issue and agree on a focused change.",
        },
        {
          title: "Check the important cases",
          body: "Repeat the affected interaction and document the checks you performed.",
        },
        {
          title: "Explain what you learned",
          body: "Credit the project and collaborators, describe your actual contribution, and be clear about unfinished work.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Link the contribution and explain the user problem it addresses.",
    },
    {
      title: "A community build-session kit",
      prompt:
        "Create materials that help a small group try one open-source experiment together.",
      steps: [
        {
          title: "Build a focused version",
          body: "Prepare an agenda, sample repo, prerequisites, and an optional simpler path for newcomers.",
        },
        {
          title: "Check the important cases",
          body: "Ask a willing peer to try the instructions and refine the places they get stuck.",
        },
        {
          title: "Explain what you learned",
          body: "Credit the project and collaborators, describe your actual contribution, and be clear about unfinished work.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Publish the kit with credits and describe your actual organising or teaching contribution.",
    },
  ],
  meetup: [
    {
      title: "A talk-to-prototype project",
      prompt:
        "Attend a relevant local talk and build a tiny example of one technique you learned.",
      steps: [
        {
          title: "Build a focused version",
          body: "Find a session matching your interests, note one concrete idea, and implement a small original example afterwards.",
        },
        {
          title: "Check the important cases",
          body: "Explain the technique without the slides and test an edge case in your implementation.",
        },
        {
          title: "Explain what you learned",
          body: "Separate your own implementation from the ideas and feedback others contributed. Ask before naming collaborators.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Publish the demo with a link to the public talk material and a clear account of your own work.",
    },
    {
      title: "A peer-reviewed portfolio flow",
      prompt:
        "Use a willing meetup peer’s feedback to improve one flow in your portfolio project.",
      steps: [
        {
          title: "Build a focused version",
          body: "Ask them to try a specific task and note where they hesitate. Avoid recording or publishing their details without permission.",
        },
        {
          title: "Check the important cases",
          body: "Make one change and repeat the task to see whether the issue is resolved.",
        },
        {
          title: "Explain what you learned",
          body: "Separate your own implementation from the ideas and feedback others contributed. Ask before naming collaborators.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Write a short usability case study with anonymised observations and before-and-after screens.",
    },
    {
      title: "A study-group exercise set",
      prompt:
        "Create original practice exercises for a skill discussed in a local study group.",
      steps: [
        {
          title: "Build a focused version",
          body: "Choose a narrow topic, write three exercises, and add hints and worked explanations.",
        },
        {
          title: "Check the important cases",
          body: "Ask a willing peer to try them and check that examples run and solutions are correct.",
        },
        {
          title: "Explain what you learned",
          body: "Separate your own implementation from the ideas and feedback others contributed. Ask before naming collaborators.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Publish the exercise repository with credits and an explanation of what you learned from feedback.",
    },
    {
      title: "A paired debugging write-up",
      prompt:
        "Work with a consenting peer on a reproducible bug in a practice project.",
      steps: [
        {
          title: "Build a focused version",
          body: "Agree on roles and scope, reproduce the failure, and compare debugging hypotheses.",
        },
        {
          title: "Check the important cases",
          body: "Fix the cause and add a regression check. Review the explanation together before sharing it.",
        },
        {
          title: "Explain what you learned",
          body: "Separate your own implementation from the ideas and feedback others contributed. Ask before naming collaborators.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Publish a co-credited debugging case study that distinguishes each person’s contribution.",
    },
    {
      title: "A local event finder prototype",
      prompt:
        "Build a small event browser inspired by how you choose sessions near you.",
      steps: [
        {
          title: "Build a focused version",
          body: "Use fictional or explicitly permitted event data. Add city, date, and topic filters without scraping attendee information.",
        },
        {
          title: "Check the important cases",
          body: "Test no matches, timezone labels, and long event titles on mobile.",
        },
        {
          title: "Explain what you learned",
          body: "Separate your own implementation from the ideas and feedback others contributed. Ask before naming collaborators.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Share the demo with data provenance and a description of the discovery problem you addressed.",
    },
    {
      title: "A lightning-talk demo",
      prompt:
        "Prepare a five-minute explanation of a small project for a group that welcomes lightning talks.",
      steps: [
        {
          title: "Build a focused version",
          body: "Check the organiser’s format and build a focused demo with one technical decision to explain.",
        },
        {
          title: "Check the important cases",
          body: "Rehearse within the time limit and prepare screenshots in case the live demo fails.",
        },
        {
          title: "Explain what you learned",
          body: "Separate your own implementation from the ideas and feedback others contributed. Ask before naming collaborators.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Publish your slides and sample code; describe presenting only if you actually did it.",
    },
    {
      title: "A community resource directory",
      prompt:
        "Create a curated list of public learning resources for a recurring group’s topic.",
      steps: [
        {
          title: "Build a focused version",
          body: "Ask what resources would help, collect a small set of public links, and add your own summaries and categories.",
        },
        {
          title: "Check the important cases",
          body: "Check links, attribution, and whether descriptions explain who each resource suits.",
        },
        {
          title: "Explain what you learned",
          body: "Separate your own implementation from the ideas and feedback others contributed. Ask before naming collaborators.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Publish a searchable directory with selection criteria and a maintenance note.",
    },
    {
      title: "An accessibility feedback session",
      prompt:
        "Invite willing peers to review the keyboard flow of your own app.",
      steps: [
        {
          title: "Build a focused version",
          body: "Prepare two tasks and a checklist covering labels, focus, and error recovery. Use fictional data.",
        },
        {
          title: "Check the important cases",
          body: "Reproduce each issue yourself, make focused fixes, and rerun the tasks.",
        },
        {
          title: "Explain what you learned",
          body: "Separate your own implementation from the ideas and feedback others contributed. Ask before naming collaborators.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Share an anonymised audit and a recording of the improved interactions.",
    },
    {
      title: "A small collaborative utility",
      prompt:
        "Build a modest developer utility with someone who wants to collaborate after a meetup.",
      steps: [
        {
          title: "Build a focused version",
          body: "Agree on a concrete problem, contribution scope, and repository ownership. Start with one working feature.",
        },
        {
          title: "Check the important cases",
          body: "Review each other’s changes and test both typical and invalid inputs.",
        },
        {
          title: "Explain what you learned",
          body: "Separate your own implementation from the ideas and feedback others contributed. Ask before naming collaborators.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Publish the utility with shared credits, clear setup instructions, and your specific contribution.",
    },
    {
      title: "A learning comparison article",
      prompt:
        "Turn a discussion of two technical approaches into a small evidence-backed comparison.",
      steps: [
        {
          title: "Build a focused version",
          body: "Build the same tiny feature using each approach and document your assumptions.",
        },
        {
          title: "Check the important cases",
          body: "Compare correctness, complexity, and measured behaviour under the same conditions.",
        },
        {
          title: "Explain what you learned",
          body: "Separate your own implementation from the ideas and feedback others contributed. Ask before naming collaborators.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Publish both examples and a balanced article that credits the discussion without quoting people without consent.",
    },
  ],
  luma: [
    {
      title: "A workshop-to-demo build",
      prompt:
        "Choose a relevant workshop on Luma and extend one concept into your own small demo.",
      steps: [
        {
          title: "Build a focused version",
          body: "Check prerequisites and registration, then choose a narrow feature to implement after the session.",
        },
        {
          title: "Check the important cases",
          body: "Rebuild the feature without the workshop walkthrough and test an edge case.",
        },
        {
          title: "Explain what you learned",
          body: "Describe how the session or conversation influenced your work and identify the part you implemented yourself.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Publish the demo with source attribution and a clear description of your original extension.",
    },
    {
      title: "A public event calendar prototype",
      prompt:
        "Build a calendar interface that makes a small set of sample events easy to compare.",
      steps: [
        {
          title: "Build a focused version",
          body: "Use fictional or permitted public listings with explicit timezones. Add date and topic filters.",
        },
        {
          title: "Check the important cases",
          body: "Test overlapping events, no results, and a change of timezone.",
        },
        {
          title: "Explain what you learned",
          body: "Describe how the session or conversation influenced your work and identify the part you implemented yourself.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Share the calendar with a note on date handling and where the sample data came from.",
    },
    {
      title: "A conference session planner",
      prompt:
        "Create a personal agenda builder inspired by a multi-session event.",
      steps: [
        {
          title: "Build a focused version",
          body: "Model a fictional schedule and let users save sessions. Flag timing conflicts without blocking changes.",
        },
        {
          title: "Check the important cases",
          body: "Try overlapping sessions, cancelled sessions, and mobile navigation.",
        },
        {
          title: "Explain what you learned",
          body: "Describe how the session or conversation influenced your work and identify the part you implemented yourself.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Publish the planner with test cases for scheduling conflicts and clear demo data labels.",
    },
    {
      title: "A demo-day project walkthrough",
      prompt:
        "Prepare a concise interactive walkthrough for a community event that accepts demos.",
      steps: [
        {
          title: "Build a focused version",
          body: "Check the organiser’s format, pick one user problem, and script a short path through your project.",
        },
        {
          title: "Check the important cases",
          body: "Try it with a willing peer and keep a fallback recording of the working flow.",
        },
        {
          title: "Explain what you learned",
          body: "Describe how the session or conversation influenced your work and identify the part you implemented yourself.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Publish the walkthrough and explain any actual presentation or feedback received without overstating it.",
    },
    {
      title: "A workshop setup checker",
      prompt:
        "Build a read-only script that checks prerequisites for a technical session you are attending.",
      steps: [
        {
          title: "Build a focused version",
          body: "Use the published requirements to check installed versions and report missing tools without installing anything.",
        },
        {
          title: "Check the important cases",
          body: "Test missing dependencies and unsupported versions in a disposable environment.",
        },
        {
          title: "Explain what you learned",
          body: "Describe how the session or conversation influenced your work and identify the part you implemented yourself.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Publish the script with sample output, scope, and links to official setup instructions.",
    },
    {
      title: "A session notes explorer",
      prompt: "Turn your own event notes into a searchable learning notebook.",
      steps: [
        {
          title: "Build a focused version",
          body: "Organise notes by topic, add public resource links, and exclude private attendee information or restricted materials.",
        },
        {
          title: "Check the important cases",
          body: "Test search, empty results, and broken links. Check all quoted material is permitted and attributed.",
        },
        {
          title: "Explain what you learned",
          body: "Describe how the session or conversation influenced your work and identify the part you implemented yourself.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Publish the notebook with a short explanation of the search implementation.",
    },
    {
      title: "A community project landing page",
      prompt:
        "Build a fictional project page using insights from a design or product event.",
      steps: [
        {
          title: "Build a focused version",
          body: "Write a clear problem statement, show a real demo screenshot, and add a useful next action.",
        },
        {
          title: "Check the important cases",
          body: "Ask a willing peer what they think the project does and revise confusing wording.",
        },
        {
          title: "Explain what you learned",
          body: "Describe how the session or conversation influenced your work and identify the part you implemented yourself.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Share the page and an anonymised before-and-after content case study.",
    },
    {
      title: "An RSVP flow prototype",
      prompt:
        "Design a fictional event registration flow with clear capacity and confirmation states.",
      steps: [
        {
          title: "Build a focused version",
          body: "Use sample attendees and simulate pending, confirmed, and waitlisted states. Do not submit real registrations.",
        },
        {
          title: "Check the important cases",
          body: "Test duplicate clicks, full capacity, and changing registration details.",
        },
        {
          title: "Explain what you learned",
          body: "Describe how the session or conversation influenced your work and identify the part you implemented yourself.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Publish the prototype with a state diagram explaining what each status means.",
    },
    {
      title: "A feedback-driven feature",
      prompt:
        "Use a conversation at a relevant event to identify a small improvement in your own developer tool.",
      steps: [
        {
          title: "Build a focused version",
          body: "Ask permission to follow up, clarify the problem, and scope one feature without promising a full product.",
        },
        {
          title: "Check the important cases",
          body: "Implement it, test the original problem, and invite feedback if the person is interested.",
        },
        {
          title: "Explain what you learned",
          body: "Describe how the session or conversation influenced your work and identify the part you implemented yourself.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Publish the change with anonymised context and evidence of what it improves.",
    },
    {
      title: "A collaborative mini-workshop",
      prompt:
        "Create an original hands-on exercise with peers interested in a session’s topic.",
      steps: [
        {
          title: "Build a focused version",
          body: "Agree on a learning objective, split contributions, and prepare a sample repository and short instructions.",
        },
        {
          title: "Check the important cases",
          body: "Have a willing newcomer try it and simplify any unclear setup steps.",
        },
        {
          title: "Explain what you learned",
          body: "Describe how the session or conversation influenced your work and identify the part you implemented yourself.",
        },
      ],
      twist:
        "After the first version, ask a willing peer to try it or review the explanation. Record one specific improvement you would make next.",
      takeaway:
        "Publish the exercise kit with co-author credits and your actual contribution.",
    },
  ],
} as const;
export const TOOL_EXAMPLES: Record<ToolSlug, readonly PortfolioExample[]> = {
  ...EXAMPLES,
  scrimba: SCRIMBA_COURSES,
  v0: V0_PROMPTS.map((item) => ({
    ...item,
    takeaway: `Turn your ${item.title.toLowerCase()} into a portfolio case study: show the user flow, explain one design decision, and distinguish working behaviour from simulated features.`,
  })),
  shadcn: SHADCN_CHALLENGES.map((item) => ({
    ...item,
    takeaway: `Add “${item.title}” to a small component showcase with before-and-after screenshots, keyboard checks, and a note explaining your implementation.`,
  })),
};
