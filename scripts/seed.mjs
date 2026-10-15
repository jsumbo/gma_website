// Seed Firestore with initial athletes and blog posts.
// Before running, make sure your Firestore rules allow writes.
// Run with: pnpm seed

import { initializeApp, getApps } from "firebase/app"
import { getFirestore, doc, setDoc } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const db = getFirestore(app)

const athletes = [
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
      "Vasco Jacobs is one of the most compelling attacking talents to emerge from West Africa in recent years. Born in Monrovia, Liberia, he developed his craft at Mighty Barrolle FC — one of the country's most storied clubs — before European scouts took notice and his career crossed continents.\n\nAt Thunder FC, Vasco has quickly become a player that opposition defences build game plans around. His combination of explosive pace off the mark, intelligent movement into channels, and composed finishing under pressure makes him a threat from multiple angles. He can finish from distance or wait for a yard of space — both outcomes tend to end the same way.\n\nOff the pitch, Vasco carries his roots with him. He returns to Monrovia each off-season to run football development camps for young players, investing in the community that shaped him. For Gayduo Sports Agency, he represents exactly what we look for: elite ability paired with genuine character.",
    achievements: [
      { year: "2025–26", title: "League Top Scorer — 18 goals" },
      { year: "2024–25", title: "Young Player of the Season" },
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
    stats: { appearances: 89, goals: 42, assists: 18 },
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
    stats: { appearances: 67, goals: 12, assists: 34 },
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
    stats: { appearances: 142, goals: 8, assists: 21 },
  },
]

const blogPosts = [
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
    author: "Gayduo Sports Agency",
    publishedAt: "2026-03-15",
    featured: true,
    seoTitle: "Vasco Jacobs Signs Contract Extension | Gayduo Sports Agency",
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
    author: "Gayduo Sports Agency",
    publishedAt: "2026-03-10",
    featured: true,
    seoTitle: "Alvin Martor National Team Call-Up | Gayduo Sports Agency",
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
    author: "Gayduo Sports Agency",
    publishedAt: "2026-03-05",
    featured: true,
    seoTitle: "Inside Elite Pre-Season Training | Gayduo Sports Agency",
    seoDescription:
      "An inside look at how Gayduo Sports Agency athletes prepare for the season — from fitness to tactics to recovery.",
    seoKeywords: ["pre-season training", "football preparation", "elite athletes", "Gayduo Sports Agency"],
  },
]

// Keep in sync with lib/services.ts's static fallback — this seeds the live, admin-editable copy.
const services = [
  {
    id: "transfer-guidance",
    title: ["TRANSFER", "GUIDANCE"],
    description:
      "Closing transfers in over 12 countries, our innovative and proactive approach ensures that our clients secure standout moves and career opportunities in a highly competitive transfer market. We continue to raise the bar with the quantity and quality of completed transfers.",
    icon: "Handshake",
    order: 0,
  },
  {
    id: "contract-negotiation",
    title: ["CONTRACT", "NEGOTIATION"],
    description:
      "We understand just how complicated the process of a contract renewal or transfer can be. We draw on our extensive experience, market knowledge and global network to deliver the correct result and best possible terms.",
    icon: "FileSignature",
    order: 1,
  },
  {
    id: "career-development",
    title: ["CAREER", "DEVELOPMENT"],
    description:
      "Combining first-hand knowledge with bespoke career guidance, we confidently navigate talents and their families through the formative career years from scholarship, first pro, essential development loans to achieving significant long term career development and salary growth.",
    icon: "TrendingUp",
    order: 2,
  },
  {
    id: "data-video-analysis",
    title: ["DATA & VIDEO", "ANALYSIS"],
    description:
      "Data interpretation is vital in understanding a player's ranking and qualities. Whether in a negotiation or when sourcing transfers, we can accurately demonstrate our clients' attributes and give our players an edge over competitors in the market place.",
    icon: "BarChart3",
    order: 3,
  },
  {
    id: "wellbeing-nutrition",
    title: ["WELLBEING &", "NUTRITION"],
    description:
      "We have carefully built a roster of experts to assist and aid performance from specialist sports therapists to private nutrition, pilates, medical care and private one-to-one coaching. We ensure that access to leading, trained professionals is available at all times with discretion.",
    icon: "HeartPulse",
    order: 4,
  },
  {
    id: "legal-advice",
    title: ["LEGAL", "ADVICE"],
    description:
      "Our legal department's 24/7, 365 approach to protecting and supporting our clients and their families gives immediate peace of mind with direct assistance and referrals across a range of legal matters, including contract and employment law, domestic, family estate and other issues.",
    icon: "Scale",
    order: 5,
  },
  {
    id: "commercial-partnerships",
    title: ["COMMERCIAL", "PARTNERSHIPS"],
    description:
      "From brand partnerships, lucrative endorsements to long-term strategic planning. We have worked with major brands including Teeket, Freza, and The SnackShop.",
    icon: "MonitorPlay",
    order: 6,
  },
  {
    id: "media-broadcast",
    title: ["MEDIA &", "BROADCAST"],
    description:
      "Our Broadcast division represents talents and recently retired players through their transition to broadcasting and ensure we create personalities that get seen and heard.",
    icon: "Video",
    order: 7,
  },
  {
    id: "social-media-strategy",
    title: ["SOCIAL MEDIA &", "STRATEGY"],
    description:
      "Building strong and authentic online profiles to construct your narrative, while generating plans to increase engagement and positive sentiment without it being an additional burden. We are best-placed to protect you, enhance your image and help you navigate the landscape.",
    icon: "Share2",
    order: 8,
  },
  {
    id: "public-relations",
    title: ["PUBLIC", "RELATIONS"],
    description:
      "Your media profile is managed with attention to detail at every step – from media training at the start of your journey to screen testing towards retirement and post-football. Understanding the importance of reputation and the pressures of life on-camera, we take great pride in the many features across media channels.",
    icon: "MessageCircleQuestion",
    order: 9,
  },
  {
    id: "content-production",
    title: ["CONTENT", "PRODUCTION"],
    description:
      "Our internal production house gives talents a voice and platform to create. From tactical social content to long-form features, we work with talent to conceptualise and produce content that is memorable and relevant. Exchanging concepts with brands enables us to add value and revenue beyond the traditional routes.",
    icon: "Clapperboard",
    order: 10,
  },
  {
    id: "philanthropy-special-projects",
    title: ["PHILANTHROPY &", "SPECIAL PROJECTS"],
    description:
      "We are proud to support several charities close to our hearts. We advise and support clients with personal charitable activity and foundations in addition to club or national team partners. We believe that giving back is an essential part of being a positive role model and that our clients should strive to actively participate and make a difference in society.",
    icon: "HeartHandshake",
    order: 11,
  },
]

// Keep in sync with lib/team.ts's static fallback.
const team = [
  { id: "jallah-sumbo", name: "Jallah Sumbo", role: "Founder", order: 0 },
  { id: "levi-martin", name: "Levi Martin", role: "Business Development Manager", order: 1 },
  { id: "sarabel-akinyi-odero", name: "Sarabel Akinyi Odero", role: "Legal Advisor", order: 2 },
  { id: "latjor-wuon-dak", name: "Latjor Wuon Dak", role: "Advisor, Partnership Lead", order: 3 },
  { id: "michael-sawyer", name: "Michael Sawyer", role: "Talent Manager", order: 4 },
]

async function seed() {
  console.log("Seeding Firestore...\n")

  console.log("Athletes:")
  for (const athlete of athletes) {
    const { id, ...data } = athlete
    await setDoc(doc(db, "athletes", id), data)
    console.log(`  ${athlete.name}`)
  }

  console.log("\nBlog posts:")
  for (const post of blogPosts) {
    const { id, ...data } = post
    await setDoc(doc(db, "blogPosts", id), data)
    console.log(`  ${post.title}`)
  }

  console.log("\nServices:")
  for (const service of services) {
    const { id, ...data } = service
    await setDoc(doc(db, "services", id), data)
    console.log(`  ${service.title.join(" ")}`)
  }

  console.log("\nTeam:")
  for (const member of team) {
    const { id, ...data } = member
    await setDoc(doc(db, "managementTeam", id), data)
    console.log(`  ${member.name}`)
  }

  const adminUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME
  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD
  if (adminUsername && adminPassword) {
    await setDoc(doc(db, "adminConfig", "credentials"), {
      username: adminUsername,
      password: adminPassword,
    })
    console.log("\nAdmin credentials stored.")
  } else {
    console.log("\nSkipping admin credentials — NEXT_PUBLIC_ADMIN_USERNAME / NEXT_PUBLIC_ADMIN_PASSWORD not set in .env.local")
  }

  console.log("\nDone.")
  process.exit(0)
}

seed().catch((err) => {
  console.error("Seeding failed:", err.message)
  console.error("Make sure your Firestore security rules allow writes (Firebase Console > Firestore > Rules).")
  process.exit(1)
})
