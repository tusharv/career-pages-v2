export const V0_PROMPTS = [
  {
    title: "E-commerce application",
    steps: [
      {
        title: "Sketch the shopping journey",
        body: "Start with fictional sneakers, sizes, colours, and prices. Choose a simple path from the product grid to a cart.",
      },
      {
        title: "Make the cart respond",
        body: "Try changing a size, adding two pairs, and removing one. Check quantities, totals, and the empty-cart message.",
      },
      {
        title: "Test the awkward purchase",
        body: "Choose an out-of-stock size and review the checkout on a phone. Keep checkout clearly labelled as a demo.",
      },
    ],
    prompt:
      "Build a responsive shop for a fictional independent sneaker brand. Include a product grid with size and price filters, a product detail view with colour selection, and a cart with editable quantities and an order summary. Use sample products, show out-of-stock and empty-cart states, and keep checkout as a clearly labelled demo without collecting payment details.",
    twist:
      "What happens when the last pair in a selected size sells out after it is added to the cart? Design a helpful recovery path.",
  },
  {
    title: "OTT streaming application",
    steps: [
      {
        title: "Create a fictional catalogue",
        body: "Choose a few films and series with genres, descriptions, and placeholder artwork. Sketch browsing, details, and a watchlist.",
      },
      {
        title: "Connect discovery and saving",
        body: "Search for a title, open its details, and add it to the watchlist. Check that removing it updates both views.",
      },
      {
        title: "Try a first-time viewer",
        body: "Test an empty watchlist, no search results, and a narrow screen. Make simulated playback clear.",
      },
    ],
    prompt:
      "Create a film and series streaming interface for a fictional service. Include genre browsing, search, a title detail page, a watchlist, and a continue-watching row with progress indicators. Use fictional titles and placeholder artwork. Make saving a title interactive and show a labelled demo player instead of pretending to stream a real film.",
    twist:
      "Design the first visit for someone with no watch history. How can they find something good without personalised recommendations?",
  },
  {
    title: "Short videos platform",
    steps: [
      {
        title: "Plan one cooking-tip feed",
        body: "Write three fictional cooking tips with creators and captions. Start with a vertical feed and a saved-videos view.",
      },
      {
        title: "Try the feed controls",
        body: "Save and unsave a tip, filter by topic, and check that likes update. Use labelled placeholders for videos.",
      },
      {
        title: "Watch without sound",
        body: "Check whether captions explain the recipe. Test on a phone and make sure any demo media can be paused.",
      },
    ],
    prompt:
      "Build a mobile-first short-video discovery app for cooking tips. Show a vertical feed with captions, creator profiles, topic filters, and working save and like controls using local sample data. Use placeholder video panels, provide pause controls for any demo media, and include a saved-videos view. Avoid autoplay with sound.",
    twist:
      "Make the feed useful with sound muted. Can someone understand a recipe from the captions and on-screen steps alone?",
  },
  {
    title: "Music application",
    steps: [
      {
        title: "Set up a small music library",
        body: "Invent a few artists, albums, and tracks. Sketch browsing, a playlist, and a persistent mini-player.",
      },
      {
        title: "Build a playlist you can change",
        body: "Add songs, remove one, and check the queue. Keep the playlist and player consistent and label playback as simulated.",
      },
      {
        title: "Test a quiet moment",
        body: "Try an empty playlist and an unavailable track. Check that the mini-player does not hide content on a phone.",
      },
    ],
    prompt:
      "Design a music discovery app for fictional independent artists. Include album browsing, search, a playlist editor, a queue, and a persistent mini-player. Use sample tracks and artwork, make adding and removing songs work locally, and clearly label simulated playback. Include an empty playlist and a track-unavailable state.",
    twist:
      "A favourite track becomes unavailable. Keep the playlist understandable and let the listener continue without losing their place.",
  },
  {
    title: "Cab booking application",
    steps: [
      {
        title: "Choose a fictional route",
        body: "Define sample pickup and destination locations, three ride types, and estimated fares. Use a schematic map.",
      },
      {
        title: "Walk through a demo booking",
        body: "Change the route and ride option, review the fare, then cancel a simulated request. Keep route details consistent.",
      },
      {
        title: "Handle an unavailable ride",
        body: "Test a route with no nearby drivers and a narrow screen. Make it clear that the prototype cannot book a real cab.",
      },
    ],
    prompt:
      "Create a mobile cab-booking prototype with pickup and destination inputs, a schematic map, three ride options, estimated fares, and a booking review screen. Use fictional locations and simulated driver data. Let users edit the route and cancel a simulated request, and clearly state that no real ride will be booked.",
    twist:
      "No drivers are nearby. Offer useful choices without presenting an invented arrival time as a guarantee.",
  },
  {
    title: "Food delivery application",
    steps: [
      {
        title: "Create a small sample menu",
        body: "Invent a restaurant, a few meals, dietary labels, and optional extras. Plan the path from menu to cart.",
      },
      {
        title: "Check the order maths",
        body: "Add a meal with extras, change its quantity, and remove it. Make sure totals and delivery fees update.",
      },
      {
        title: "Review before ordering",
        body: "Try an empty cart and a phone-width layout. Show the full cost and label the order timeline as simulated.",
      },
    ],
    prompt:
      "Build a neighbourhood food-delivery prototype with restaurant browsing, dietary filters, menu customisation, a cart, and a simulated order-status timeline. Use fictional restaurants and sample prices. Make item quantities and totals update, show delivery fees before review, and label ordering as a demo.",
    twist:
      "Someone changes a meal option after adding it to the cart. Keep the customisations and total clear throughout the edit.",
  },
  {
    title: "Travel planning application",
    steps: [
      {
        title: "Plan a fictional weekend",
        body: "Pick a destination, several sample activities, and estimated costs. Sketch saved places and a two-day itinerary.",
      },
      {
        title: "Move an activity",
        body: "Add a place to a day, move it to the next day, and remove it. Check that the budget updates and keyboard controls work.",
      },
      {
        title: "Change the plan",
        body: "Swap an outdoor activity for an indoor one. Test an empty itinerary and clearly label prices as examples.",
      },
    ],
    prompt:
      "Create a weekend-trip planner with a destination browser, saved places, and a day-by-day itinerary. Use fictional listings and sample budgets. Let users add activities to a day, move them between days with accessible controls, and see an estimated total. Include an empty itinerary and clearly label all prices as examples.",
    twist:
      "Rain cancels an outdoor activity. Let the traveller swap it for an indoor option without rebuilding the whole day.",
  },
  {
    title: "Fitness and habit tracker",
    steps: [
      {
        title: "Choose three everyday habits",
        body: "Start with walking, stretching, and breaks. Set sample goals and sketch a week of check-ins.",
      },
      {
        title: "Make progress reversible",
        body: "Check off a habit, undo it, and edit a goal. Confirm the weekly overview reflects each change.",
      },
      {
        title: "Welcome someone back",
        body: "Try a new account and a week with missed days. Use supportive language and check chart labels on a phone.",
      },
    ],
    prompt:
      "Build a friendly habit tracker for walking, stretching, and taking breaks. Include a weekly overview, editable personal goals, daily check-ins, and simple progress charts using local sample data. Make check-ins reversible, include a first-use state, and use encouraging language when a day is missed.",
    twist:
      "A person returns after two weeks away. Welcome them back and let them adjust their goals without a guilt-heavy reset screen.",
  },
  {
    title: "Online learning application",
    steps: [
      {
        title: "Outline a short course",
        body: "Invent a beginner photography course with a few lessons. Sketch the library, lesson view, and progress dashboard.",
      },
      {
        title: "Connect learning actions",
        body: "Mark a lesson complete, bookmark another, and save a note. Check that the dashboard and resume action update.",
      },
      {
        title: "Try a short study session",
        body: "Find a lesson for someone with ten minutes. Test the first-lesson state on mobile and label media placeholders.",
      },
    ],
    prompt:
      "Design a learning app for beginner photography with a course library, lesson view, bookmarks, and a progress dashboard. Use fictional lessons and clearly labelled media placeholders. Let learners mark lessons complete, resume a course, and find saved notes. Include a useful first-lesson experience on mobile.",
    twist:
      "A learner only has ten minutes today. Help them choose a small lesson and return to the longer course later.",
  },
  {
    title: "Job application tracker",
    steps: [
      {
        title: "Define a few applications",
        body: "Invent company names, roles, stages, follow-up dates, and notes. Sketch a list and a board using the same sample data.",
      },
      {
        title: "Keep both views in sync",
        body: "Add an application, edit its stage, and switch views. Check that filters and notes still show the correct information.",
      },
      {
        title: "Choose a next action",
        body: "Try overdue follow-ups and an empty list. Check the layout on a phone and use fictional data throughout.",
      },
    ],
    prompt:
      "Build a private job-application tracker prototype with a list and board view, company and role fields, application stages, follow-up dates, and notes. Use fictional applications stored locally, with no real personal data. Make adding and editing an application work, include filters and an empty state, and keep the interface usable on a phone.",
    twist:
      "There are 50 applications and several overdue follow-ups. Help the user choose one next action without making the screen overwhelming.",
  },
] as const;
