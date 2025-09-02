// src/lib/formspree.ts

export type FormspreeResponse =
  | { ok: true; message: string }
  | { ok: false; error: string; status?: number }

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000 // 10 minutes
const RATE_LIMIT_MAX = 3
const SUBMISSION_THROTTLE_MS = 2000

let submissionTimestamps: number[] = []

export function canSubmitForm(): boolean {
  const now = Date.now()
  submissionTimestamps = submissionTimestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW_MS)
  return submissionTimestamps.length < RATE_LIMIT_MAX
}

export function recordSubmission() {
  submissionTimestamps.push(Date.now())
}

export function throttleSubmission(lastSubmit: number): boolean {
  return Date.now() - lastSubmit > SUBMISSION_THROTTLE_MS
}

export interface FormspreePayload {
  [key: string]: string | undefined
}

export async function submitToFormspree(
  data: FormspreePayload,
  endpoint: string
): Promise<FormspreeResponse> {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
    const json = await res.json()
    if (res.ok && json.ok) {
      return { ok: true, message: json.message || "Submission successful." }
    }
    return { ok: false, error: json.error || "Unknown error", status: res.status }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Network error"
    return { ok: false, error: errorMsg }
  }
}

// Honeypot field helper
export function isHoneypotTripped(data: FormspreePayload, honeypotField = "_hp"): boolean {
  return !!data[honeypotField]
}