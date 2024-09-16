import React, { useState, useEffect, useRef } from 'react'

interface AutoSuggestProps {
  suggestions: string[]
  onSuggestionClick: (suggestion: string) => void
  onClose: () => void
}

const AutoSuggest: React.FC<AutoSuggestProps> = ({ suggestions, onSuggestionClick, onClose }) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)
  const ulRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev))
          break
        case 'Enter':
          if (selectedIndex >= 0) {
            onSuggestionClick(suggestions[selectedIndex])
          }
          break
        case 'Escape':
          onClose()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [suggestions, selectedIndex, onSuggestionClick, onClose])

  useEffect(() => {
    if (selectedIndex >= 0 && ulRef.current) {
      const selectedElement = ulRef.current.children[selectedIndex] as HTMLElement
      selectedElement.scrollIntoView({ block: 'nearest' })
    }
  }, [selectedIndex])

  return (
    <ul ref={ulRef} className="absolute z-10 w-full bg-white border border-input rounded-md mt-1 max-h-60 overflow-auto">
      {suggestions.map((suggestion, index) => (
        <li
          key={index}
          className={`px-4 py-2 cursor-pointer bg-white text-gray-800 ${
            index === selectedIndex ? 'bg-gray-100' : 'hover:bg-gray-100'
          }`}
          onClick={() => onSuggestionClick(suggestion)}
        >
          {suggestion}
        </li>
      ))}
    </ul>
  )
}

export default AutoSuggest
