/* =====================================================================
   EDIT YOUR PORTFOLIO HERE
   ---------------------------------------------------------------------
   - Your name, intro and contact details live in SITE.
   - Games show on the page in the SAME ORDER as in PROJECTS below.
     To move a game up or down, cut its whole { ... }, block
     (from its opening { to its closing },) and paste it elsewhere.
   - To hide a game without deleting it, add:  hidden: true,
   - Images and videos go in the /assets folder. The first item in
     "media" is the big one, the rest become thumbnails.
       image:  { src: "assets/my-image.png", alt: "short description" },
       video:  { video: "assets/my-clip.mp4", alt: "short description" },
   ===================================================================== */

const SITE = {
  headline: "Roblox developer specialized in 3D stylized environments.",
  intro:
    "3D artist and Roblox developer on the platform since 2012. I model, build and design levels, " +
    "with a soft spot for waterslides, ragdolls and puzzles you solve with friends. " +
    "My games have passed 63 million visits.",

  // Contact — fill these in. Leave a value as "" to hide that line.
  email: "pikol53.fluxgames@gmail.com",
  discord: "pikol53",
  robloxProfile: "https://www.roblox.com/users/47317527/profile",
};

const PROJECTS = [
  {
    title: "Epic Huge Slide",
    stat: "4M+",
    statLabel: "plays in 2026 so far",
    role: "Solo project",
    year: "2026",                           // leave "" to hide
    tags: ["Ragdoll physics", "Slide design", "3D modeling", "Scripting"],
    description:
      "An experiment in building a game around one thing only: the most fun giant slide I could make. " +
      "There are no extra mechanics. Physics-based ragdolls make every run play out differently.",
    link: "https://www.roblox.com/games/92660740921628/Epic-Huge-Slide",
    media: [
      { src: "assets/epic-huge-slide-1.png", alt: "Rainbow waterslide winding through floating islands above the clouds" },
      { src: "assets/epic-huge-slide-2.png", alt: "Inside the rainbow tube slide, looking toward the light" },
    ],
  },

  {
    title: "Teamwork Puzzles Obby",
    stat: "52M+",
    statLabel: "visits",
    role: "Everything except scripting",
    year: "2023",
    tags: ["Level design", "Puzzle design", "3D modeling", "UI"],
    description:
      "My most popular game: a puzzle obby built around cooperation, where players have to work " +
      "together with buttons, platforms and timing to get through each stage.",
    link: "https://www.roblox.com/games/12820501582/Teamwork-Puzzles-Obby",
    media: [
      { src: "assets/teamwork-puzzles-1.png", alt: "Lava puzzle room with colored buttons and moving platforms" },
      { src: "assets/teamwork-puzzles-2.png", alt: "Game thumbnail: one player holds a button while another slides down" },
    ],
  },

  {
    title: "2 Player Ragdoll Tycoon",
    stat: "4M+",
    statLabel: "visits across multiple experiences",
    role: "Solo project",
    year: "2024",
    tags: ["Tycoon systems", "Ragdoll physics", "3D modeling", "Scripting"],
    description:
      "A two-player ragdoll tycoon. I rebranded and relaunched it several times, which grew its " +
      "player count more than six times over.",
    link: "https://www.roblox.com/games/18233657371/2-Player-Ragdoll-Tycoon",
    // Shown as small plain text (not clickable)
    footnote: {
      label: "Published through these communities:",
      lines: [
        "roblox.com/communities/34506648/99-miners-quit",
        "roblox.com/communities/34948246/2-Player-VS-Tycoon-Studio",
        "roblox.com/communities/34940131/One-Question-Why-So-Serious",
      ],
    },
    media: [
      { src: "assets/ragdoll-tycoon-1.png", alt: "Yellow tycoon tower with waterslides spiraling down its side" },
      { src: "assets/ragdoll-tycoon-2.png", alt: "Ragdoll Tycoon 2 Player game thumbnail" },
    ],
  },

  {
    title: "Find The Slimes",
    stat: "3.4M+",
    statLabel: "visits",
    role: "Everything except scripting",
    year: "2022",
    tags: ["Open world", "Obby design", "Physics puzzles", "3D modeling"],
    description:
      "An open-world scavenger hunt built from many different obbies and puzzles, a lot of them " +
      "centered on ragdolls, waterslides and physics.",
    link: "https://www.roblox.com/games/8850326889/Find-The-Slimes",
    media: [
      { src: "assets/find-the-slimes-1.png", alt: "Find The Slimes game thumbnail with three themed areas" },
      { src: "assets/find-the-slimes-2.png", alt: "Overview of the open world: beach, forest, candy land and snow zone" },
      { src: "assets/find-the-slimes-3.png", alt: "Candy land area with a pink sea, candy canes and pirate ships" },
    ],
  },

  {
    title: "Trampoline Park",
    stat: "Demo",
    statLabel: "unfinished concept",
    role: "Prototype",
    year: "",
    tags: ["Movement", "Combo scoring", "Prototype"],
    description:
      "A trampoline park where you earn more points for longer, faster and more creative combos " +
      "before you land. It's only a concept, but it would make a great tycoon or hangout game.",
    link: "",
    media: [
      { video: "assets/trampoline-park-demo.mp4", poster: "assets/trampoline-park-poster.jpg", alt: "Trampoline park gameplay demo" },
    ],
  },
];

// The block shown after the games. Set text to "" to hide it.
const MORE_WORK = {
  text: "Plus many smaller games I've made since joining Roblox in 2012.",
  button: "Find them in the groups on my profile",   // links to SITE.robloxProfile
};
