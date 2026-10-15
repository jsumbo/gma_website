// One-off: seed ONLY the new "services" and "team" Firestore collections.
// Does not touch athletes or blogPosts — those already hold real, live-edited content.
// Run with: node --env-file=.env scripts/seed-services-team.mjs

import { initializeApp, getApps } from "firebase/app"
import { getFirestore, doc, setDoc, getDocs, collection } from "firebase/firestore"

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

const team = [
  { id: "jallah-sumbo", name: "Jallah Sumbo", role: "Founder", order: 0 },
  { id: "levi-martin", name: "Levi Martin", role: "Business Development Manager", order: 1 },
  { id: "sarabel-akinyi-odero", name: "Sarabel Akinyi Odero", role: "Legal Advisor", order: 2 },
  { id: "latjor-wuon-dak", name: "Latjor Wuon Dak", role: "Advisor, Partnership Lead", order: 3 },
  { id: "michael-sawyer", name: "Michael Sawyer", role: "Talent Manager", order: 4 },
]

async function seed() {
  console.log("Seeding Firestore (services + team only)...\n")

  const existingServices = await getDocs(collection(db, "services"))
  if (!existingServices.empty) {
    console.log(`"services" already has ${existingServices.size} document(s) — skipping, to avoid clobbering anything already edited there.`)
  } else {
    console.log("Services:")
    for (const service of services) {
      const { id, ...data } = service
      await setDoc(doc(db, "services", id), data)
      console.log(`  ${service.title.join(" ")}`)
    }
  }

  const existingTeam = await getDocs(collection(db, "managementTeam"))
  if (!existingTeam.empty) {
    console.log(`\n"team" already has ${existingTeam.size} document(s) — skipping, to avoid clobbering anything already edited there.`)
  } else {
    console.log("\nTeam:")
    for (const member of team) {
      const { id, ...data } = member
      await setDoc(doc(db, "managementTeam", id), data)
      console.log(`  ${member.name}`)
    }
  }

  console.log("\nDone.")
  process.exit(0)
}

seed().catch((err) => {
  console.error("Seeding failed:", err.message)
  console.error("Make sure your Firestore security rules allow writes (Firebase Console > Firestore > Rules).")
  process.exit(1)
})
