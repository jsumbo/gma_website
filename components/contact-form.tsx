"use client"

import { useState, type FormEvent } from "react"
import { ArrowRight, Check, Loader2 } from "lucide-react"

const SUBJECTS = [
  { value: "representation", label: "Talent Representation" },
  { value: "partnership", label: "Club / Partnership Inquiry" },
  { value: "brand", label: "Brand & Sponsorship" },
  { value: "media", label: "Media Request" },
  { value: "other", label: "Other" },
]

const fieldClass =
  "w-full border border-border bg-white px-4 py-3.5 text-sm transition-colors placeholder:text-neutral-400 focus:border-[#01255f] focus:outline-none focus:ring-2 focus:ring-[#01255f]/10 aria-[invalid=true]:border-red-500"
const labelClass = "mb-2 block font-heading text-xs font-semibold uppercase tracking-widest text-muted-foreground"

type Status = "idle" | "sending" | "sent" | "error"

export function ContactForm({ defaultSubject = "" }: { defaultSubject?: string }) {
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState("")

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("sending")
    setError("")
    const form = e.currentTarget
    const payload = Object.fromEntries(new FormData(form).entries())

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json.error || "Something went wrong.")
      form.reset()
      setStatus("sent")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.")
      setStatus("error")
    }
  }

  if (status === "sent") {
    return (
      <div className="border border-border bg-white p-10 text-center" role="status">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center" style={{ backgroundColor: "#fee11b", color: "#01255f" }}>
          <Check className="h-7 w-7" />
        </div>
        <h3 className="font-display text-4xl" style={{ color: "#01255f" }}>MESSAGE SENT</h3>
        <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
          Thank you — we&apos;ll be in touch soon.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 font-heading text-xs font-bold uppercase tracking-[0.15em] underline underline-offset-4"
          style={{ color: "#01255f" }}
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className={labelClass}>First Name</label>
          <input type="text" id="firstName" name="firstName" required maxLength={80} autoComplete="given-name" className={fieldClass} placeholder="John" />
        </div>
        <div>
          <label htmlFor="lastName" className={labelClass}>Last Name</label>
          <input type="text" id="lastName" name="lastName" required maxLength={80} autoComplete="family-name" className={fieldClass} placeholder="Doe" />
        </div>
      </div>
      <div>
        <label htmlFor="email" className={labelClass}>Email</label>
        <input type="email" id="email" name="email" required maxLength={200} autoComplete="email" className={fieldClass} placeholder="john@example.com" />
      </div>
      <div>
        <label htmlFor="subject" className={labelClass}>Subject</label>
        <select id="subject" name="subject" required defaultValue={SUBJECTS.some((s) => s.value === defaultSubject) ? defaultSubject : ""} className={fieldClass}>
          <option value="" disabled>Select a subject</option>
          {SUBJECTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="message" className={labelClass}>Message</label>
        <textarea id="message" name="message" required minLength={10} maxLength={5000} rows={5} className={`${fieldClass} resize-none`} placeholder="Tell us about yourself or your inquiry..." />
      </div>

      {/* Honeypot — hidden from people and assistive tech, bots fill it in */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
        <label htmlFor="website">Website</label>
        <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="group flex w-full items-center justify-center gap-2.5 py-4 font-heading text-sm font-bold uppercase tracking-[0.12em] text-white transition-all hover:gap-4 disabled:cursor-not-allowed disabled:opacity-70"
        style={{ backgroundColor: "#01255f" }}
      >
        {status === "sending" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Sending…
          </>
        ) : (
          <>
            Send Message <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>

      <div aria-live="polite">
        {status === "error" && (
          <p className="border-l-2 border-red-500 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}{" "}
            <a href="mailto:hello@gayduosa.com" className="font-semibold underline underline-offset-2">
              hello@gayduosa.com
            </a>
          </p>
        )}
      </div>
    </form>
  )
}
