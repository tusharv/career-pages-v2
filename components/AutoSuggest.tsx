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
    <ul
      ref={ulRef}
      className="animate-suggest-in absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-border bg-popover text-popover-foreground shadow-lg"
    >
      {suggestions.map((suggestion, index) => (
        <li
          key={index}
          className={`px-4 py-2 cursor-pointer text-left text-sm transition-colors ${
            index === selectedIndex
              ? 'bg-accent text-accent-foreground'
              : 'hover:bg-accent/80 hover:text-accent-foreground'
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
