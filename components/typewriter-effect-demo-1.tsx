"use client"
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect"
import { FlipWords } from "@/components/ui/flip-words"
import Image from "next/image"
import { useState, useEffect } from "react"
import { toast } from "sonner"

export default function TypewriterEffectSmoothDemo() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [honeypot, setHoneypot] = useState("")
  const [lastSubmission, setLastSubmission] = useState<number | null>(null)
  const [submissionCount, setSubmissionCount] = useState(0)

  useEffect(() => {
    const stored = localStorage.getItem("emailSubmissions")
    if (stored) {
      const data = JSON.parse(stored)
      setLastSubmission(data.lastSubmission)
      setSubmissionCount(data.count)
    }
  }, [])

  const brandWords = [
    {
      text: "NY",
      className: "text-blue-500 dark:text-blue-500",
    },
    {
      text: "Supreme",
      className: "text-blue-500 dark:text-blue-500",
    },
    {
      text: "Sportswear",
      className: "text-blue-500 dark:text-blue-500",
    },
  ]

  const taglineWords = [
    {
      text: "Launching",
      className: "text-[#0A0A0A] dark:text-[#0A0A0A] font-medium",
    },
    {
      text: "soon.",
      className: "text-[#0A0A0A] dark:text-[#0A0A0A] font-medium",
    },
    {
      text: "Become",
      className: "text-[#0A0A0A] dark:text-[#0A0A0A] font-medium",
    },
    {
      text: "a",
      className: "text-[#0A0A0A] dark:text-[#0A0A0A] font-medium",
    },
    {
      text: "pioneer.",
      className: "text-[#0A0A0A] dark:text-[#0A0A0A] font-medium",
    },
  ]

  const flipWords = ["comfort", "movement", "style", "hustlers"]

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const checkSpamProtection = () => {
    const now = Date.now()
    const RATE_LIMIT_WINDOW = 60000 // 1 minute
    const MAX_SUBMISSIONS = 3 // Max 3 submissions per minute

    if (honeypot.trim() !== "") {
      toast.error("Submission blocked")
      return false
    }

    if (lastSubmission && now - lastSubmission < RATE_LIMIT_WINDOW) {
      if (submissionCount >= MAX_SUBMISSIONS) {
        toast.error("Too many attempts. Please wait a minute before trying again.")
        return false
      }
    } else {
      setSubmissionCount(0)
    }

    return true
  }

  const handleSubmit = async () => {
    if (!email.trim()) {
      toast.error("Please enter your email address")
      return
    }

    if (!isValidEmail(email)) {
      toast.error("Invalid email address")
      return
    }

    if (!checkSpamProtection()) {
      return
    }

    setIsSubmitting(true)

    try {
      console.log("[v0] Submitting email:", email)

      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbxr0OVWo1sb7jdVYoal8iYtZzC4L-aKyUW1ZvGQlvN3K00DN4dA825mqEMpOdxsgAe5Tw/exec",
        {
          method: "POST",
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
          body: JSON.stringify({
            email: email,
            timestamp: new Date().toISOString(),
            source: "NY Supreme Sportswear Landing Page",
          }),
        },
      )

      console.log("[v0] Response status:", response.status)
      console.log("[v0] Response ok:", response.ok)

      const responseText = await response.text()
      console.log("[v0] Response text:", responseText)

      if (response.ok) {
        toast.success("Success! We will keep you posted", {
          description: "You'll be notified when we launch",
        })
        setEmail("")

        const now = Date.now()
        const newCount = submissionCount + 1
        setLastSubmission(now)
        setSubmissionCount(newCount)
        localStorage.setItem(
          "emailSubmissions",
          JSON.stringify({
            lastSubmission: now,
            count: newCount,
          }),
        )
      } else {
        throw new Error(`HTTP ${response.status}: ${responseText}`)
      }
    } catch (error) {
      console.log("[v0] Full error:", error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-[40rem]  ">
      <input
        type="text"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        style={{ display: "none" }}
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="mb-4">
        <Image src="/logo.png" alt="Crown logo with city skyline" width={120} height={120} className="object-contain" />
      </div>

      <div className="text-lg font-medium text-[#0A0A0A] dark:text-blue-500 mb-2">NY Supreme Sportswear</div>

      <p className="text-neutral-600 dark:text-neutral-200 text-sm text-center">
        On a mission to style the streets
        <br />
        with affordable and innovative sportswear
      </p>

      <div className="-mt-1">
        <TypewriterEffectSmooth words={taglineWords} />
      </div>

      <div className="mt-4 text-md font-normal text-neutral-600 dark:text-neutral-400">
        Crafting
        <FlipWords words={flipWords} className="text-[#0A0A0A] font-medium dark:text-blue-500" />
      </div>

      <div className="mt-6 flex flex-col items-center gap-3">
        <input
          type="email"
          placeholder="legend@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit()
            }
          }}
          disabled={isSubmitting}
          className="w-80 h-12 px-4 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-0  text-sm disabled:opacity-50"
        />
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="h-8 px-6 bg-[#0A0A0A] hover:bg-neutral-600 text-white rounded-xl font-medium transition-colors focus:outline-none focus:ring-0 hover:text-white focus:ring-offset-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Notify me"}
        </button>
      </div>
    </div>
  )
}
