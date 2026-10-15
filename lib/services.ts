import {
  Handshake,
  FileSignature,
  TrendingUp,
  BarChart3,
  HeartPulse,
  Scale,
  MonitorPlay,
  Video,
  Share2,
  MessageCircleQuestion,
  Clapperboard,
  HeartHandshake,
  type LucideIcon,
} from "lucide-react"

export interface Service {
  title: [string, string]
  description: string
  icon: LucideIcon
}

export const services: Service[] = [
  {
    title: ["TRANSFER", "GUIDANCE"],
    description:
      "Closing transfers in over 12 countries, our innovative and proactive approach ensures that our clients secure standout moves and career opportunities in a highly competitive transfer market. We continue to raise the bar with the quantity and quality of completed transfers.",
    icon: Handshake,
  },
  {
    title: ["CONTRACT", "NEGOTIATION"],
    description:
      "We understand just how complicated the process of a contract renewal or transfer can be. We draw on our extensive experience, market knowledge and global network to deliver the correct result and best possible terms.",
    icon: FileSignature,
  },
  {
    title: ["CAREER", "DEVELOPMENT"],
    description:
      "Combining first-hand knowledge with bespoke career guidance, we confidently navigate talents and their families through the formative career years from scholarship, first pro, essential development loans to achieving significant long term career development and salary growth.",
    icon: TrendingUp,
  },
  {
    title: ["DATA & VIDEO", "ANALYSIS"],
    description:
      // Note: the source copy originally referenced a competitor's brand name here ("Unique
      // players") — corrected to "our players" so we're not promoting another agency.
      "Data interpretation is vital in understanding a player's ranking and qualities. Whether in a negotiation or when sourcing transfers, we can accurately demonstrate our clients' attributes and give our players an edge over competitors in the market place.",
    icon: BarChart3,
  },
  {
    title: ["WELLBEING &", "NUTRITION"],
    description:
      "We have carefully built a roster of experts to assist and aid performance from specialist sports therapists to private nutrition, pilates, medical care and private one-to-one coaching. We ensure that access to leading, trained professionals is available at all times with discretion.",
    icon: HeartPulse,
  },
  {
    title: ["LEGAL", "ADVICE"],
    description:
      "Our legal department's 24/7, 365 approach to protecting and supporting our clients and their families gives immediate peace of mind with direct assistance and referrals across a range of legal matters, including contract and employment law, domestic, family estate and other issues.",
    icon: Scale,
  },
  {
    title: ["COMMERCIAL", "PARTNERSHIPS"],
    description:
      "From brand partnerships, lucrative endorsements to long-term strategic planning. We have worked with major brands including Teeket, Freza, and The SnackShop.",
    icon: MonitorPlay,
  },
  {
    title: ["MEDIA &", "BROADCAST"],
    description:
      "Our Broadcast division represents talents and recently retired players through their transition to broadcasting and ensure we create personalities that get seen and heard.",
    icon: Video,
  },
  {
    title: ["SOCIAL MEDIA &", "STRATEGY"],
    description:
      "Building strong and authentic online profiles to construct your narrative, while generating plans to increase engagement and positive sentiment without it being an additional burden. We are best-placed to protect you, enhance your image and help you navigate the landscape.",
    icon: Share2,
  },
  {
    title: ["PUBLIC", "RELATIONS"],
    description:
      "Your media profile is managed with attention to detail at every step – from media training at the start of your journey to screen testing towards retirement and post-football. Understanding the importance of reputation and the pressures of life on-camera, we take great pride in the many features across media channels.",
    icon: MessageCircleQuestion,
  },
  {
    title: ["CONTENT", "PRODUCTION"],
    description:
      "Our internal production house gives talents a voice and platform to create. From tactical social content to long-form features, we work with talent to conceptualise and produce content that is memorable and relevant. Exchanging concepts with brands enables us to add value and revenue beyond the traditional routes.",
    icon: Clapperboard,
  },
  {
    title: ["PHILANTHROPY &", "SPECIAL PROJECTS"],
    description:
      "We are proud to support several charities close to our hearts. We advise and support clients with personal charitable activity and foundations in addition to club or national team partners. We believe that giving back is an essential part of being a positive role model and that our clients should strive to actively participate and make a difference in society.",
    icon: HeartHandshake,
  },
]
