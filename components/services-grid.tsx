import type { Service } from "@/lib/data"
import { resolveServiceIcon } from "@/lib/service-icons"

interface ServicesGridProps {
  services: Service[]
  /** Show the longer description text (used on the dedicated /services page) */
  detailed?: boolean
}

/** Liquid-glass service cards: frosted, translucent, glowing icon, thin accent border. */
export function ServicesGrid({ services, detailed = false }: ServicesGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {services.map(({ id, title, description, icon }) => {
        const Icon = resolveServiceIcon(icon)
        return (
          <div
            key={id}
            className="group relative flex flex-col items-start gap-6 overflow-hidden border px-5 py-7 backdrop-blur-md transition-colors duration-200 hover:border-[#fee11b] sm:px-6 sm:py-8"
            style={{ borderColor: "rgba(254,225,27,0.35)", backgroundColor: "rgba(255,255,255,0.06)" }}
          >
            {/* Glowing blurred orb behind the icon */}
            <div
              className="pointer-events-none absolute -left-6 -top-6 h-28 w-28 rounded-full opacity-40 blur-2xl transition-opacity duration-300 group-hover:opacity-60"
              style={{ backgroundColor: "#fee11b" }}
            />

            <Icon className="relative h-8 w-8" style={{ color: "#fee11b" }} strokeWidth={1.5} />

            <div className="relative">
              <p className="font-heading text-xs font-bold uppercase tracking-wider" style={{ color: "#fee11b" }}>
                {title[0]}
              </p>
              <div className="my-2.5 h-0.5 w-5" style={{ backgroundColor: "#fee11b" }} />
              <h3 className="font-heading text-xl font-bold uppercase leading-tight text-white sm:text-2xl">{title[1]}</h3>
              {detailed && <p className="mt-4 text-sm leading-relaxed text-white/55">{description}</p>}
            </div>
          </div>
        )
      })}
    </div>
  )
}
