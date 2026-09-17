export const TOOL_SLUGS = [
  "v0",
  "shadcn",
  "cursor",
  "supabase",
  "vercel",
  "scrimba",
  "hacktoberfest",
  "meetup",
  "luma",
] as const;
export type ToolSlug = (typeof TOOL_SLUGS)[number];
export type ToolLogo =
  | { type: "image"; src: string; alt: string; fill?: boolean }
  | { type: "cursor" }
  | { type: "supabase" };
export type ToolCopyItem = { title: string; body: string };
export type ToolGuide = {
  slug: ToolSlug;
  name: string;
  logo: ToolLogo;
  kind: "stack" | "learn" | "event" | "community";
  purpose: string;
  tagline: string;
  description: string;
  bestFor: string;
  skipIf: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  features: readonly ToolCopyItem[];
  uses: readonly ToolCopyItem[];
  activity: string;
  playbook: readonly ToolCopyItem[];
  tips: readonly ToolCopyItem[];
  cost: string;
  resources: readonly { title: string; url: string }[];
  relatedSlugs: readonly ToolSlug[];
};
export const TOOLS: readonly ToolGuide[] = [
  {
    slug: "v0",
    name: "v0",
    kind: "stack",
    purpose: "Prototype an idea",
    tagline: "Turn an idea into an interactive interface you can refine.",
    description:
      "v0 is an AI tool for creating interfaces and web apps from a description. It can help you explore a portfolio idea before spending time building it in detail.",
    bestFor:
      "Developers and designers who want to explore a web interface and are comfortable reviewing the result.",
    skipIf:
      "You already have a working design, or your main goal is to practise writing UI code unaided.",
    features: [
      {
        title: "Describe a screen",
        body: "Generate an interface from a written brief, then adjust it through follow-up instructions.",
      },
      {
        title: "Preview and refine",
        body: "Explore the result in a preview and make focused changes to layout, content, and interactions.",
      },
      {
        title: "Work with the code",
        body: "Inspect and edit the generated code as your idea develops beyond the first draft.",
      },
    ],
    uses: [
      {
        title: "Explore a portfolio concept",
        body: "Try a small flow, such as saving an interesting job or comparing two courses. Use the prototype to decide what is worth building next.",
      },
      {
        title: "Explain a design choice",
        body: "Keep an early version and a revised version. In a case study, explain which problem you noticed and how your change helps the user.",
      },
    ],
    activity: "Try this: prototype a saved-jobs screen",
    tips: [
      {
        title: "Be specific about the user",
        body: "“Show applications awaiting a reply, with the oldest first” gives more direction than “make a beautiful dashboard.”",
      },
      {
        title: "Check what really works",
        body: "A convincing screen may still use sample data or inactive buttons. Label it as a prototype until you have implemented and tested the behaviour.",
      },
      {
        title: "Keep the scope small",
        body: "A single useful screen is enough for an experiment. Add accounts or a database only when the idea needs them.",
      },
    ],
    cost: "Check the current plan and generation limits before starting a long session. You do not need to buy hosting or a domain just to explore an idea.",
    resources: [
      {
        title: "v0 documentation",
        url: "https://v0.app/docs",
      },
      {
        title: "Plans and usage",
        url: "https://v0.app/pricing",
      },
    ],
    logo: {
      type: "image",
      src: "/logo-cache/v0.webp",
      alt: "",
    },
    playbook: [
      {
        title: "Write a small brief",
        body: "Describe a job seeker who needs to remember where they applied. Ask for a list with company, role, status, and a next action. Use fictional data.",
      },
      {
        title: "Change one thing at a time",
        body: "Ask for a useful empty state, then check the layout at phone width. Click every action and note which ones are still placeholders.",
      },
      {
        title: "Review the result",
        body: "Read the code for one interaction and explain how it works. Save a screenshot and a short note about what you would improve next.",
      },
    ],
    relatedSlugs: ["shadcn", "cursor"],
    metaTitle: "v0: prototype an idea",
    metaDescription:
      "v0 is an AI tool for creating interfaces and web apps from a description. It can help you explore a portfolio idea before spending time building it in detail.",
    keywords: ["v0", "Prototype an idea", "developer job search"],
  },
  {
    slug: "shadcn",
    name: "shadcn/ui",
    kind: "stack",
    purpose: "Build a consistent interface",
    tagline:
      "Adapt UI components in your own project, with access to their source.",
    description:
      "shadcn/ui provides UI components you can add to a project and customise. It is useful when you want to spend more time on how a portfolio project works while still learning how its interface is built.",
    bestFor:
      "Developers with some React and CSS experience building forms, dashboards, or other interactive pages.",
    skipIf:
      "You only need a simple static page, or are still learning the HTML and CSS behind basic controls.",
    features: [
      {
        title: "Editable component source",
        body: "Components live in your project, so you can read and change their implementation.",
      },
      {
        title: "Shared styling",
        body: "Theme variables and component variants help keep colours, spacing, and controls consistent.",
      },
      {
        title: "Interaction patterns",
        body: "Components provide a starting point for patterns such as dialogs and menus. Your labels, composition, and changes still need accessibility checks.",
      },
    ],
    uses: [
      {
        title: "Improve an existing portfolio project",
        body: "Replace inconsistent form controls and make errors easier to understand. This gives you a focused improvement to describe in a project walkthrough.",
      },
      {
        title: "Practise reading UI code",
        body: "Follow how a component handles its props, styles, and interactions. Change a small part and check what it affects.",
      },
    ],
    activity: "Try this: make a usable application form",
    tips: [
      {
        title: "Read before customising",
        body: "Open the component file before adding another wrapper. An existing variant may already cover what you need.",
      },
      {
        title: "Test your own colours",
        body: "Changing theme values can reduce text or focus contrast. Check the result in every theme your project supports.",
      },
      {
        title: "Keep components up to date deliberately",
        body: "Because you own the copied source, review upstream fixes and decide how to incorporate them into your modified components.",
      },
    ],
    cost: "The component code is open source. Hosting and any external services you add have their own costs.",
    resources: [
      {
        title: "Documentation and installation",
        url: "https://ui.shadcn.com/docs",
      },
      {
        title: "Components",
        url: "https://ui.shadcn.com/docs/components",
      },
    ],
    logo: {
      type: "image",
      src: "/logo-cache/ui.shadcn.com.webp",
      alt: "",
    },
    playbook: [
      {
        title: "Choose a small form",
        body: "Add company and role fields to an existing practice app. Use the installation instructions for your framework and add only the components you need.",
      },
      {
        title: "Handle missing information",
        body: "Give each input a visible label. Show a helpful error when a required field is empty, and a confirmation when the form succeeds.",
      },
      {
        title: "Use it without a mouse",
        body: "Tab through the form, submit it with the keyboard, and check that focus remains visible. If you use a dialog, check opening, closing, and returning focus.",
      },
    ],
    relatedSlugs: ["v0", "cursor"],
    metaTitle: "shadcn/ui: build a consistent interface",
    metaDescription:
      "shadcn/ui provides UI components you can add to a project and customise. It is useful when you want to spend more time on how a portfolio project works while still learning how its interface is built.",
    keywords: [
      "shadcn/ui",
      "Build a consistent interface",
      "developer job search",
    ],
  },
  {
    slug: "cursor",
    name: "Cursor",
    kind: "stack",
    purpose: "Build and understand code",
    tagline:
      "Get coding help inside your project, from explanations to small changes.",
    description:
      "Cursor is an AI coding editor and agent. You can use it to understand unfamiliar code, work through a bug, or build part of a practice project with feedback along the way.",
    bestFor:
      "Developers who want help with an existing codebase and can run and review the suggested changes.",
    skipIf:
      "Your immediate goal is unaided coding practice. A regular editor may be a better fit for that session.",
    features: [
      {
        title: "Codebase questions",
        body: "Ask how files fit together or where a behaviour is implemented, using the project as context.",
      },
      {
        title: "Agent changes",
        body: "Ask the agent to make a scoped change across files, then review and test the result.",
      },
      {
        title: "Project rules",
        body: "Record conventions and project instructions so you do not have to repeat them with every request.",
      },
    ],
    uses: [
      {
        title: "Get unstuck on a project",
        body: "Bring a reproducible bug and the behaviour you expected. Use the explanation and proposed change to learn a debugging approach you can repeat.",
      },
      {
        title: "Prepare to discuss your own work",
        body: "Ask questions about a project you built, then answer them without assistance. Revisit the parts you find difficult to explain.",
      },
    ],
    activity: "Try this: fix one reproducible bug",
    tips: [
      {
        title: "Ask for hints when learning",
        body: "Try “Give me one hint without writing the solution” when you want to practise solving the problem yourself.",
      },
      {
        title: "Save a working checkpoint",
        body: "Commit working code before a larger change so you can compare versions or undo an unhelpful edit.",
      },
      {
        title: "Treat suggestions as proposals",
        body: "Run the code and check unfamiliar APIs in their documentation. For assessments, follow the employer’s rules on AI assistance.",
      },
    ],
    cost: "Review current usage limits and paid plans. Start with a small task to see whether the workflow helps you before committing to a subscription.",
    resources: [
      {
        title: "Cursor documentation",
        url: "https://cursor.com/docs",
      },
      {
        title: "Plans and pricing",
        url: "https://cursor.com/pricing",
      },
    ],
    logo: {
      type: "cursor",
    },
    playbook: [
      {
        title: "Describe the failure",
        body: "Write down the steps, expected result, and actual result. Ask Cursor to identify the likely cause before editing anything.",
      },
      {
        title: "Request a narrow fix",
        body: "Ask it to change only the relevant behaviour and explain the diff. Read the edited files and question anything you do not understand.",
      },
      {
        title: "Check the explanation",
        body: "Repeat the original steps and try a nearby edge case. Summarise why the fix works in your own words.",
      },
    ],
    relatedSlugs: ["v0", "supabase"],
    metaTitle: "Cursor: build and understand code",
    metaDescription:
      "Cursor is an AI coding editor and agent. You can use it to understand unfamiliar code, work through a bug, or build part of a practice project with feedback along the way.",
    keywords: ["Cursor", "Build and understand code", "developer job search"],
  },
  {
    slug: "supabase",
    name: "Supabase",
    kind: "stack",
    purpose: "Practise backend development",
    tagline:
      "Add a database, sign-in, and file storage when your project needs them.",
    description:
      "Supabase is a backend platform built around Postgres. It can help you learn how an application stores data and controls access without setting up every service yourself.",
    bestFor:
      "Developers practising SQL, authentication, or a project that needs data shared across sessions or devices.",
    skipIf:
      "Your portfolio is mostly text and images, or local sample data is enough to demonstrate your idea.",
    features: [
      {
        title: "Postgres database",
        body: "Store related records and query them with SQL.",
      },
      {
        title: "Authentication and access policies",
        body: "Add sign-in and use row-level security policies to control which records a user can access.",
      },
      {
        title: "File storage",
        body: "Store uploaded files with access rules appropriate to the application.",
      },
    ],
    uses: [
      {
        title: "Learn with a personal application tracker",
        body: "Model companies and applications, then practise creating, updating, and filtering records. Use fictional entries while developing.",
      },
      {
        title: "Explore access control",
        body: "Test what two different users can see. Document how your policies protect their records and what you checked.",
      },
    ],
    activity: "Try this: save a private application note",
    tips: [
      {
        title: "Test policies through the app",
        body: "An administrator view can have broader access. Seeing rows in the dashboard does not prove what a normal user can access.",
      },
      {
        title: "Understand each key",
        body: "Publishable keys are intended for clients with correct access policies. Secret and service-role keys must stay on the server; putting them in a public environment variable does not protect them.",
      },
      {
        title: "Plan for an empty database",
        body: "Show a useful starting message with no rows and a recoverable error if a request fails.",
      },
    ],
    cost: "Check current project limits, inactivity behaviour, and storage usage before relying on a hosted demo. Keep a screenshot or short recording as another way to explain the project.",
    resources: [
      {
        title: "Supabase documentation",
        url: "https://supabase.com/docs",
      },
      {
        title: "Row-level security guide",
        url: "https://supabase.com/docs/guides/database/postgres/row-level-security",
      },
      {
        title: "Pricing",
        url: "https://supabase.com/pricing",
      },
    ],
    logo: {
      type: "supabase",
    },
    playbook: [
      {
        title: "Create a small data model",
        body: "Make a practice table with a note, an owner ID, and a creation time. Use the official framework quickstart to connect your app.",
      },
      {
        title: "Restrict access",
        body: "Enable row-level security and define read and write policies for the owner. Use test accounts and sample notes.",
      },
      {
        title: "Test two users",
        body: "Save a note as user A. Confirm user B cannot read, change, or delete it through the application API, then confirm A still can.",
      },
    ],
    relatedSlugs: ["cursor", "vercel"],
    metaTitle: "Supabase: practise backend development",
    metaDescription:
      "Supabase is a backend platform built around Postgres. It can help you learn how an application stores data and controls access without setting up every service yourself.",
    keywords: [
      "Supabase",
      "Practise backend development",
      "developer job search",
    ],
  },
  {
    slug: "vercel",
    name: "Vercel",
    kind: "stack",
    purpose: "Share a web project",
    tagline: "Publish a web project and preview changes before sharing them.",
    description:
      "Vercel hosts web applications and connects deployments to your code repository. It is one option for making a portfolio or practice project available through a link.",
    bestFor:
      "Developers with a web project ready to share, especially one using a supported framework such as Next.js.",
    skipIf:
      "Your project is already hosted reliably elsewhere, or a repository and recording explain a project that is not a web app.",
    features: [
      {
        title: "Repository deployments",
        body: "Connect a repository and build a deployed version of your application.",
      },
      {
        title: "Preview deployments",
        body: "Review changes at a separate URL before promoting them to your main site.",
      },
      {
        title: "Environment settings",
        body: "Configure values for different deployment environments, such as an API URL or server-side credential.",
      },
    ],
    uses: [
      {
        title: "Make a project easy to explore",
        body: "Include the deployed link alongside the repository. Add a short explanation of what visitors can try and use sample data where possible.",
      },
      {
        title: "Practise releasing a change",
        body: "Preview an update, check it, and publish it. Keep notes on any deployment issue and how you resolved it.",
      },
    ],
    activity: "Try this: share one working project",
    tips: [
      {
        title: "Check more than the home page",
        body: "Refresh a nested route and test form submission. A successful build does not guarantee every interaction works.",
      },
      {
        title: "Debug with the error message",
        body: "If a feature only fails after deployment, inspect logs, environment settings, and any authentication redirect URLs.",
      },
      {
        title: "A custom domain is optional",
        body: "A working hosted URL is enough to share a project. Buy a domain only if you want one.",
      },
    ],
    cost: "Check plan eligibility and usage limits for your project. Hosting, analytics, and domains may have separate limits or charges.",
    resources: [
      {
        title: "Vercel documentation",
        url: "https://vercel.com/docs",
      },
      {
        title: "Plans and pricing",
        url: "https://vercel.com/pricing",
      },
    ],
    logo: {
      type: "image",
      src: "/logo-cache/vercel.webp",
      alt: "",
    },
    playbook: [
      {
        title: "Deploy an existing repository",
        body: "Follow the guide for your framework. Check the build command and add any required environment settings.",
      },
      {
        title: "Open it as a visitor",
        body: "Use a private browser window. Check whether deployment protection or sign-in prevents access, and try the main action on a phone.",
      },
      {
        title: "Add context to the link",
        body: "Put the URL in your project README with a screenshot, a short description, and any demo instructions. Use the stable production link when sharing it.",
      },
    ],
    relatedSlugs: ["supabase", "cursor"],
    metaTitle: "Vercel: share a web project",
    metaDescription:
      "Vercel hosts web applications and connects deployments to your code repository. It is one option for making a portfolio or practice project available through a link.",
    keywords: ["Vercel", "Share a web project", "developer job search"],
  },
  {
    slug: "scrimba",
    name: "Scrimba",
    kind: "learn",
    purpose: "Learn and practise",
    tagline: "Practise web development inside interactive coding lessons.",
    description:
      "Scrimba combines coding lessons with an editor you can interact with. It can be useful if you learn best by changing examples and practising a concept while it is still fresh.",
    bestFor:
      "People learning web development or revisiting a specific topic such as JavaScript, CSS, or React.",
    skipIf:
      "You already understand the topic and mostly need independent practice, or prefer written references to guided lessons.",
    features: [
      {
        title: "Interactive lessons",
        body: "Pause a lesson and experiment with its code to see how a change affects the result.",
      },
      {
        title: "Structured courses",
        body: "Follow a sequence of topics instead of deciding what to study next after every lesson.",
      },
      {
        title: "Coding practice",
        body: "Use exercises and projects to apply what you have learned and identify where you need more practice.",
      },
    ],
    uses: [
      {
        title: "Work on a specific skill gap",
        body: "Compare a few roles you are interested in and identify one recurring skill to practise. Choose a relevant lesson rather than starting an entire course by default.",
      },
      {
        title: "Build confidence working independently",
        body: "After a guided exercise, recreate a small part without the lesson. The parts you need to look up give you a useful revision list.",
      },
    ],
    activity: "Try this: turn a lesson into practice",
    tips: [
      {
        title: "Pause before the solution",
        body: "Attempt the exercise first, even if you only get partway. Use the solution to compare approaches.",
      },
      {
        title: "Make project work your own",
        body: "Add a useful variation and credit the course starting point in your README. Explain which parts you changed.",
      },
      {
        title: "Choose a manageable schedule",
        body: "A short lesson followed by independent practice can be easier to sustain alongside applications than a large completion target.",
      },
    ],
    cost: "Compare the current free and paid content before subscribing. Check the final checkout total, billing period, renewal terms, and any eligible regional offer. Discount availability and whether offers combine can change.",
    resources: [
      {
        title: "Courses and lessons",
        url: "https://scrimba.com",
      },
      {
        title: "Current plans",
        url: "https://scrimba.com/our-pricing",
      },
    ],
    logo: {
      type: "image",
      src: "/logo-cache/scrimba.png",
      alt: "",
      fill: true,
    },
    playbook: [
      {
        title: "Pick one concept",
        body: "Choose a lesson on something specific, such as array filtering or form state. Try available free content to see whether the format suits you.",
      },
      {
        title: "Change the example",
        body: "Before running the code, predict what your change will do. Compare the result with your prediction and investigate any difference.",
      },
      {
        title: "Rebuild a small version",
        body: "Close the lesson and recreate the core behaviour with different sample data. Write down one thing you can now do and one question to revisit.",
      },
    ],
    relatedSlugs: ["shadcn", "cursor"],
    metaTitle: "Scrimba: learn and practise",
    metaDescription:
      "Scrimba combines coding lessons with an editor you can interact with. It can be useful if you learn best by changing examples and practising a concept while it is still fresh.",
    keywords: ["Scrimba", "Learn and practise", "developer job search"],
  },
  {
    slug: "hacktoberfest",
    name: "Hacktoberfest",
    kind: "event",
    purpose: "Learn with other developers",
    tagline: "Join a developer event to learn, build, and meet people.",
    description:
      "Hacktoberfest is an October open-source community programme. In 2026, its focus is local and online events for learning and experimenting with open-source AI. It is an event, rather than a software tool.",
    bestFor:
      "People who want a shared learning session and are curious about open-source AI.",
    skipIf:
      "The available events do not match your interests, experience, or schedule. A local developer group or another open-source project may suit you better.",
    features: [
      {
        title: "Local and online events",
        body: "Find a session whose topic and format suit how you want to participate.",
      },
      {
        title: "Hands-on learning",
        body: "The 2026 programme focuses on experimenting with open-source AI, including open-weight models and agents.",
      },
      {
        title: "Community participation",
        body: "Join other learners or explore hosting a session through the official organiser resources.",
      },
    ],
    uses: [
      {
        title: "Learn alongside other people",
        body: "Bring a question you have been struggling with and compare approaches. You can learn from the session even without finishing a project.",
      },
      {
        title: "Build professional relationships gradually",
        body: "Talk about what others are making, share something useful, and follow up if you both want to stay in touch. An event is an opportunity to meet peers, not a guarantee of referrals.",
      },
    ],
    activity: "Try this: plan one learning session",
    tips: [
      {
        title: "Check this year’s format",
        body: "Older guides describe a pull-request challenge. Read the current official programme before planning your participation.",
      },
      {
        title: "Contribute with context",
        body: "If you choose to contribute to a repository, read its contribution guide and discuss the scope with maintainers before starting a substantial change.",
      },
      {
        title: "Describe your actual contribution",
        body: "If you mention the experience in an application, explain what you learned, built, or helped organise. Include a link when there is something useful to share.",
      },
    ],
    cost: "Check each event’s registration details, travel needs, and any computing costs for the activity. Career Pages is not an official Hacktoberfest partner.",
    resources: [
      {
        title: "Programme, events, and FAQs",
        url: "https://hacktoberfest.com",
      },
    ],
    logo: {
      type: "image",
      src: "/logo-cache/hacktoberfest.png",
      alt: "",
      fill: true,
    },
    playbook: [
      {
        title: "Choose an appropriate event",
        body: "Check the official listing for the date, time zone, format, prerequisites, and registration details.",
      },
      {
        title: "Bring one small question",
        body: "Read the event setup instructions. Choose something you would like to understand or try, and prepare any required accounts or software.",
      },
      {
        title: "Reflect afterwards",
        body: "Save your notes or experiment and credit collaborators. If you met someone you would like to learn with again, send a personal follow-up.",
      },
    ],
    relatedSlugs: ["meetup", "luma"],
    metaTitle: "Hacktoberfest: learn with other developers",
    metaDescription:
      "Hacktoberfest is an October open-source community programme. In 2026, its focus is local and online events for learning and experimenting with open-source AI. It is an event, rather than a software tool.",
    keywords: [
      "Hacktoberfest",
      "Learn with other developers",
      "developer job search",
    ],
  },
  {
    slug: "meetup",
    name: "Meetup",
    kind: "community",
    purpose: "Find events near you",
    tagline: "Find local groups and events around skills you want to learn.",
    description:
      "Meetup helps you discover groups and events by interest and location. Use it to find developer talks, study groups, and professional communities near you.",
    bestFor:
      "Job seekers who want to learn with others and build professional relationships through shared interests.",
    skipIf:
      "There are no suitable sessions nearby or the available events do not fit your schedule. Look for an online community or a different organiser.",
    logo: {
      type: "image",
      src: "/logo-cache/meetup.png",
      alt: "",
    },
    features: [
      {
        title: "Search by location and topic",
        body: "Enter your city or postcode and a topic such as JavaScript, data science, or public speaking.",
      },
      {
        title: "Interest-based groups",
        body: "Explore the group behind an event to see its focus and other sessions you might enjoy.",
      },
      {
        title: "Local and online events",
        body: "Look for an in-person session within reach, or an online event when travel is difficult.",
      },
    ],
    uses: [
      {
        title: "Learn from people doing the work",
        body: "Use a relevant session to ask how people approach a skill or problem you are exploring. Their examples can help you decide what to practise next.",
      },
      {
        title: "Make your job search less solitary",
        body: "Meet peers facing similar questions and exchange experiences. Useful connections can grow from shared interests; attending an event does not guarantee interviews or referrals.",
      },
    ],
    activity: "Try this: find one local event",
    playbook: [
      {
        title: "Search near home",
        body: "Set your city or postcode and try one specific interest. Compare a few event descriptions for the topic, experience level, and travel time.",
      },
      {
        title: "Choose a session you can learn from",
        body: "Read the agenda and group description, check any fee, and RSVP if it fits. Prepare a question about something you are learning.",
      },
      {
        title: "Keep the conversation going",
        body: "After attending, note one useful idea. If someone welcomed staying in touch, send a short message referring to your conversation. Return to the group if you enjoyed it.",
      },
    ],
    tips: [
      {
        title: "Try a specific search",
        body: "“Python” or “UX research” may reveal more relevant sessions than “networking.” Try a nearby city if your first search is quiet.",
      },
      {
        title: "Make introductions easy",
        body: "Start with what brought you to the session and ask what the other person is working on. You do not need a polished career pitch.",
      },
      {
        title: "Build familiarity over time",
        body: "Attending the same group again can make conversations more comfortable. Share a relevant resource or offer help when you can.",
      },
    ],
    cost: "Check the individual listing for ticket costs, registration requirements, and cancellation terms. Allow for travel time and cost; an event listed on the platform is not necessarily free.",
    resources: [
      {
        title: "Find events on Meetup",
        url: "https://www.meetup.com/",
      },
    ],
    relatedSlugs: ["luma", "hacktoberfest"],
    metaTitle: "Meetup: find local events and communities",
    metaDescription:
      "Meetup helps you discover groups and events by interest and location. Use it to find developer talks, study groups, and professional communities near you.",
    keywords: ["Meetup", "local developer events", "professional networking"],
  },
  {
    slug: "luma",
    name: "Luma",
    kind: "community",
    purpose: "Find events near you",
    tagline: "Explore nearby talks, workshops, and community calendars.",
    description:
      "Luma Discover brings together events by location and category, along with community calendars. Use it to explore local tech sessions and find organisers whose events match your interests.",
    bestFor:
      "Job seekers who want to learn with others and build professional relationships through shared interests.",
    skipIf:
      "There are no suitable sessions nearby or the available events do not fit your schedule. Look for an online community or a different organiser.",
    logo: {
      type: "image",
      src: "/logo-cache/luma.png",
      alt: "",
    },
    features: [
      {
        title: "Discover nearby events",
        body: "Browse events for a location and check the venue on the individual event page.",
      },
      {
        title: "Browse by category",
        body: "Explore categories such as Tech or AI to find sessions related to what you want to learn.",
      },
      {
        title: "Community calendars",
        body: "Explore an organiser’s calendar to find other events from the same community.",
      },
    ],
    uses: [
      {
        title: "Learn from people doing the work",
        body: "Use a relevant session to ask how people approach a skill or problem you are exploring. Their examples can help you decide what to practise next.",
      },
      {
        title: "Make your job search less solitary",
        body: "Meet peers facing similar questions and exchange experiences. Useful connections can grow from shared interests; attending an event does not guarantee interviews or referrals.",
      },
    ],
    activity: "Try this: find one local event",
    playbook: [
      {
        title: "Explore your location",
        body: "Open Discover and choose your city or a nearby location. Browse a relevant category and shortlist a session with a clear topic.",
      },
      {
        title: "Read the event details",
        body: "Check the agenda, location, date, ticket price, and any registration requirements. Make sure your place is confirmed before making travel plans.",
      },
      {
        title: "Bring a question and follow up",
        body: "Ask about a topic from the session or a project someone mentions. Afterwards, save a useful takeaway and follow up personally if you agreed to keep in touch.",
      },
    ],
    tips: [
      {
        title: "Look beyond the event title",
        body: "Check who the session is for and whether it is a talk, workshop, or social gathering. Choose the format that helps you participate comfortably.",
      },
      {
        title: "Explore the organiser’s calendar",
        body: "If one session looks useful, check what else that community runs. It can be an easier starting point for your next event.",
      },
      {
        title: "Keep follow-ups specific",
        body: "Mention the conversation you enjoyed or share the resource you discussed. Let a professional relationship develop before asking for a favour.",
      },
    ],
    cost: "Check the individual listing for ticket costs, registration requirements, and cancellation terms. Allow for travel time and cost; an event listed on the platform is not necessarily free.",
    resources: [
      {
        title: "Find events on Luma",
        url: "https://luma.com/discover",
      },
    ],
    relatedSlugs: ["meetup", "hacktoberfest"],
    metaTitle: "Luma: find local events and communities",
    metaDescription:
      "Luma Discover brings together events by location and category, along with community calendars. Use it to explore local tech sessions and find organisers whose events match your interests.",
    keywords: ["Luma", "local developer events", "professional networking"],
  },
];
export function isToolSlug(value: string): value is ToolSlug {
  return (TOOL_SLUGS as readonly string[]).includes(value);
}
export function getTool(slug: string): ToolGuide | undefined {
  return TOOLS.find((tool) => tool.slug === slug);
}
export function getRelatedTools(tool: ToolGuide): ToolGuide[] {
  return tool.relatedSlugs.map((slug) => getTool(slug)!);
}
export function getStackTools(): ToolGuide[] {
  return TOOLS.filter((tool) => tool.kind === "stack");
}
export function getLearnTools(): ToolGuide[] {
  return TOOLS.filter((tool) => tool.kind === "learn");
}
export function getEventTools(): ToolGuide[] {
  return TOOLS.filter((tool) => tool.kind === "event");
}
