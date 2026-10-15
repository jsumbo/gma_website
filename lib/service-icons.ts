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
  Megaphone,
  Camera,
  Briefcase,
  Users,
  Globe,
  Shield,
  Award,
  Target,
  Star,
  Rocket,
  Plane,
  Building2,
  GraduationCap,
  Newspaper,
  Mic,
  Wallet,
  type LucideIcon,
} from "lucide-react"

// A curated icon set for service cards — not all 1500+ lucide icons, just ones that make
// sense for a talent management agency. Both the admin icon picker and the public-facing
// ServicesGrid resolve icon keys through this same map, so they can never drift out of sync.
export const SERVICE_ICONS: Record<string, LucideIcon> = {
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
  Megaphone,
  Camera,
  Briefcase,
  Users,
  Globe,
  Shield,
  Award,
  Target,
  Star,
  Rocket,
  Plane,
  Building2,
  GraduationCap,
  Newspaper,
  Mic,
  Wallet,
}

export const SERVICE_ICON_KEYS = Object.keys(SERVICE_ICONS)

export const DEFAULT_SERVICE_ICON = "Star"

/** Resolves a stored icon key to its component, falling back safely if the key is missing or unrecognized. */
export function resolveServiceIcon(key: string | undefined): LucideIcon {
  return (key && SERVICE_ICONS[key]) || SERVICE_ICONS[DEFAULT_SERVICE_ICON]
}
