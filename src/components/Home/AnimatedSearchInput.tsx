"use client"

import { useEffect, useState } from "react"
import { Search } from "lucide-react"

const placeholderItems: string[] = [
  'Search "milk"',
  'Search "bread"',
  'Search "sugar"',
  'Search "butter"',
  'Search "paneer"',
  'Search "chocolate"',
  'Search "curd"',
  'Search "rice"',
  'Search "egg"',
  'Search "chips"',
]

export default function AnimatedSearchInput() {
  const [index, setIndex] = useState<number>(0)
  const [inputValue, setInputValue] = useState<string>("")

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % placeholderItems.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full md:w-96"> {/* ⬅️ Increased width */}
      {/* Search icon */}
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

      {/* Input field with left padding for the icon */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring w-full"
      />

      {/* Animated placeholder overlay (only when empty) */}
      {inputValue === "" && (
        <div className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none overflow-hidden h-[20px]">
          <div
            style={{
              transform: `translateY(-${index * 20}px)`,
              transition: "transform 0.5s ease-in-out",
            }}
          >
            {placeholderItems.map((text, i) => (
              <div key={i} className="h-[20px] flex items-center">
                {text}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
