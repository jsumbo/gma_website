export interface HighlightVideo {
  url: string
  label?: string
}

export interface Athlete {
  id: string
  name: string
  slug: string
  position: string
  team: string
  image: string
  number: number
  nationality: string
  dateOfBirth: string
  height: string
  preferredFoot: string
  biography: string
  achievements: Achievement[]
  gallery: string[]
  socialLinks: SocialLinks
  highlightVideo?: string
  highlightVideos?: HighlightVideo[]
  stats: AthleteStats
}

export interface Achievement {
  year: string
  title: string
}

export interface SocialLinks {
  instagram?: string
  twitter?: string
  facebook?: string
}

export interface AthleteStats {
  appearances: number
  goals: number
  assists: number
  cleanSheets?: number
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage: string
  category: string
  author: string
  publishedAt: string
  featured?: boolean
  seoTitle: string
  seoDescription: string
  seoKeywords: string[]
}

export const athletes: Athlete[] = [
  {
    id: "1",
    name: "Vasco Jacobs",
    slug: "vasco-jacobs",
    position: "Forward",
    team: "Thunder FC",
    image: "/athletes/vasco-jacobs.jpg",
    number: 9,
    nationality: "Liberian",
    dateOfBirth: "2002-04-15",
    height: "1.85m",
    preferredFoot: "Right",
    biography:
      "Vasco Jacobs is one of the most compelling attacking talents to emerge from West Africa in recent years. Born in Monrovia, Liberia, he developed his craft at Mighty Barrolle FC — one of the country's most storied clubs — before European scouts took notice and his career crossed continents.\n\nAt Thunder FC, Vasco has quickly become a player that opposition defences build game plans around. His combination of explosive pace off the mark, intelligent movement into channels, and composed finishing under pressure makes him a threat from multiple angles. He can finish from distance or wait for a yard of space — both outcomes tend to end the same way.\n\nOff the pitch, Vasco carries his roots with him. He returns to Monrovia each off-season to run football development camps for young players, investing in the community that shaped him. For Gayduo Management Agency, he represents exactly what we look for: elite ability paired with genuine character.",
    achievements: [
      { year: "2025–26", title: "League Top Scorer — 18 goals" },
      { year: "2025–26", title: "National County Sports Meet Runner-up" },
      { year: "2024", title: "African Youth Championship — Golden Boot" },
      { year: "2023", title: "Liberian Footballer of the Year" },
    ],
    gallery: [
      "/athletes/vasco-jacobs.jpg",
      "/athletes/gallery/vasco-action-1.jpg",
      "/athletes/gallery/vasco-action-2.jpg",
    ],
    socialLinks: {
      instagram: "https://www.instagram.com/v.danabaro/",
      facebook: "https://www.facebook.com/VJacobs14",
    },
    highlightVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    stats: {
      appearances: 89,
      goals: 42,
      assists: 18,
    },
  },
  {
    id: "2",
    name: "Alvin Martor",
    slug: "alvin-martor",
    position: "Central Midfielder",
    team: "Professional Sports Academy",
    image: "/athletes/alvin-martor.jpg",
    number: 8,
    nationality: "Rwandan",
    dateOfBirth: "2004-08-22",
    height: "1.78m",
    preferredFoot: "Both",
    biography:
      "Alvin Martor is a midfielder with a rare quality: he makes the team around him better. Hailing from Kigali, Rwanda, he came through the ranks at the prestigious Kigali Football Academy, where his ability to see passes others can't even conceive of quickly set him apart from his peers.\n\nAt Professional Sports Academy, Alvin has established himself as the engine and the compass of the midfield — dictating tempo, recycling possession efficiently, and unlocking defences with precisely weighted through balls. Despite only being in his early twenties, he plays with a composure and intelligence that suggests many years of elite football ahead.\n\nHis recent first call-up to the Rwandan national team for World Cup qualifiers was a recognition long overdue. Alvin is proof that elite football talent exists across the continent — it just needs the right environment to thrive.",
    achievements: [
      { year: "2025–26", title: "League Assist Leader — 12 assists" },
      { year: "2025", title: "Rwanda Sports Awards — Breakthrough Athlete" },
      { year: "2024–25", title: "Professional Sports Academy Player of the Season" },
      { year: "2024", title: "U-23 Africa Cup — Best Midfielder" },
    ],
    gallery: [
      "/athletes/alvin-martor.jpg",
      "/athletes/gallery/alvin-action-1.jpg",
      "/athletes/gallery/alvin-action-2.jpg",
    ],
    socialLinks: {
      instagram: "https://instagram.com/alvinmartor",
      twitter: "https://twitter.com/alvinmartor",
      facebook: "https://facebook.com/alvinmartor",
    },
    highlightVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    stats: {
      appearances: 67,
      goals: 12,
      assists: 34,
    },
  },
  {
    id: "3",
    name: "Daniel Parker",
    slug: "daniel-parker",
    position: "Defensive Midfielder",
    team: "Jovial Kids Academy",
    image: "/athletes/daniel-parker.jpg",
    number: 6,
    nationality: "Liberian",
    dateOfBirth: "2000-11-03",
    height: "1.82m",
    preferredFoot: "Left",
    biography:
      "Daniel Parker is the kind of player every winning team is built around but few outside the game fully appreciate. Born in Buchanan, Liberia, he grew up playing on the streets before finding his way to LISCR FC's youth academy — where his reading of the game, physical presence, and leadership instincts were quickly identified.\n\nAs vice-captain of Jovial Kids Academy, Daniel is the backbone of the side. His ability to anticipate danger before it develops, win the ball back cleanly, and immediately transition into quality possession sets the standard for those around him. The league's tackling statistics tell only part of the story — his influence on structure, intensity, and mentality tells the rest.\n\nDaniel understands that football has given him a platform, and he uses it deliberately. His scholarship fund for student-athletes in Buchanan continues to open doors for young people who might otherwise have none.",
    achievements: [
      { year: "2025–26", title: "League Team of the Season" },
      { year: "2025", title: "Cup Winner — Jovial Kids Academy" },
      { year: "2024–25", title: "Most Tackles in the League" },
      { year: "2023", title: "Liberian Premier League Champion" },
    ],
    gallery: [
      "/athletes/daniel-parker.jpg",
      "/athletes/gallery/daniel-action-1.jpg",
      "/athletes/gallery/daniel-action-2.jpg",
    ],
    socialLinks: {
      instagram: "https://instagram.com/danielparker6",
      twitter: "https://twitter.com/danielparker6",
    },
    highlightVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    stats: {
      appearances: 142,
      goals: 8,
      assists: 21,
    },
  },
]

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Vasco Jacobs Signs New Multi-Year Contract Extension",
    slug: "vasco-jacobs-contract-extension",
    excerpt:
      "Star forward Vasco Jacobs has committed his future to Thunder FC, signing a new multi-year deal that keeps him at the club through 2029.",
    content:
      "<p>Thunder FC today confirmed that Vasco Jacobs has signed a new multi-year contract extension, keeping him at the club through 2029. The announcement puts to rest months of speculation linking the Liberian forward with several of Europe's top clubs.</p><p>The 24-year-old has been in career-defining form this season, scoring 18 goals across all competitions while adding six assists. His ability to perform consistently at the highest level — combined with his professionalism and character — made extending his contract a clear priority for the club's leadership.</p><p>We are proud to have supported Vasco through this negotiation and look forward to watching him reach new heights in the seasons ahead.</p>",
    featuredImage: "/blog/contract-signing.jpg",
    category: "Transfers",
    author: "Gayduo Management Agency",
    publishedAt: "2026-03-15",
    seoTitle: "Vasco Jacobs Signs Contract Extension",
    seoDescription:
      "Star forward Vasco Jacobs signs a new multi-year contract extension with Thunder FC through 2029.",
    seoKeywords: ["Vasco Jacobs", "contract extension", "Thunder FC", "transfer news"],
  },
  {
    id: "2",
    title: "Alvin Martor Earns First Senior National Team Call-Up",
    slug: "alvin-martor-national-team",
    excerpt:
      "Central midfielder Alvin Martor receives his first call-up to the senior national team squad for the upcoming World Cup qualifiers.",
    content:
      "<p>Alvin Martor has been rewarded for an exceptional run of form with his first call-up to the senior national team squad for the upcoming World Cup qualifying campaign. The announcement was widely celebrated, with supporters and pundits alike having made the case for his inclusion for some time.</p><p>The 22-year-old has been Professional Sports Academy's standout performer in midfield, registering 6 goals and 12 assists this season while consistently driving the tempo of his side's best performances. His ability to combine technical quality with intelligent positioning has marked him out as one of the most complete midfielders in the division.</p><p>This call-up is a significant milestone — and one that represents the beginning, not the ceiling, of his international career.</p>",
    featuredImage: "/blog/national-team.jpg",
    category: "News",
    author: "Gayduo Management Agency",
    publishedAt: "2026-03-10",
    seoTitle: "Alvin Martor National Team Call-Up",
    seoDescription:
      "Alvin Martor receives his first senior international call-up for the upcoming World Cup qualifiers.",
    seoKeywords: ["Alvin Martor", "national team", "Rwanda football", "World Cup qualifiers"],
  },
  {
    id: "3",
    title: "What Pre-Season Actually Looks Like for an Elite Player",
    slug: "inside-the-training",
    excerpt:
      "Pre-season is where careers are built or lost. We take you inside what our athletes go through before the first ball is kicked.",
    content:
      "<p>Most fans see match day. Pre-season is invisible to them — and that is exactly where the real work happens.</p><p>For our players, preparation begins weeks before the squad reports back to training. Personalised fitness programmes, video analysis sessions, nutrition planning, and recovery protocols are all in place before the first whistle of the new campaign. The goal is simple: arrive ready, not just fit.</p><p>This level of preparation doesn't happen by accident. It is the result of a support structure that treats every player as an individual — with specific physical profiles, specific tactical responsibilities, and specific career objectives. That is what we mean when we talk about 360-degree management. It shows on the pitch.</p>",
    featuredImage: "/blog/training-session.jpg",
    category: "Features",
    author: "Gayduo Management Agency",
    publishedAt: "2026-03-05",
    seoTitle: "Inside Elite Pre-Season Training",
    seoDescription:
      "An inside look at how Gayduo Management Agency athletes prepare for the season — from fitness to tactics to recovery.",
    seoKeywords: ["pre-season training", "football preparation", "elite athletes", "Gayduo Management Agency"],
  },
]

export const categories = ["All", "News", "Transfers", "Features", "Interviews"]
