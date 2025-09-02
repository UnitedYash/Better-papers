import React from 'react'
import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'

interface LatexRendererProps {
  text: string
  className?: string
}

export function LatexRenderer({ text, className = '' }: LatexRendererProps) {
  if (!text) return null

  // Split text into parts: regular text and LaTeX expressions
  const renderMixedContent = (content: string) => {
    const parts: React.ReactNode[] = []
    let currentIndex = 0
    
    // Regex to find LaTeX expressions
    const latexPatterns = [
      // Inline math: $...$
      /\$([^$]+)\$/g,
      // Display math: $$...$$
      /\$\$([^$]+)\$\$/g,
      // LaTeX commands in text
      /\\([a-zA-Z]+)(?:\{([^}]*)\})?/g
    ]
    
    // Find all LaTeX expressions
    const matches: Array<{
      start: number
      end: number
      content: string
      type: 'inline' | 'block' | 'command'
      original: string
    }> = []
    
    // Find inline math $...$
    let match
    const inlineMathRegex = /\$([^$\n]+)\$/g
    while ((match = inlineMathRegex.exec(content)) !== null) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        content: match[1],
        type: 'inline',
        original: match[0]
      })
    }
    
    // Find display math $$...$$
    const blockMathRegex = /\$\$([^$]+)\$\$/g
    while ((match = blockMathRegex.exec(content)) !== null) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        content: match[1],
        type: 'block',
        original: match[0]
      })
    }
    
    // Sort matches by position
    matches.sort((a, b) => a.start - b.start)
    
    // Remove overlapping matches (prefer longer ones)
    const filteredMatches = matches.filter((match, index) => {
      for (let i = 0; i < index; i++) {
        const prevMatch = matches[i]
        if (match.start < prevMatch.end) {
          return false // This match overlaps with a previous one
        }
      }
      return true
    })
    
    let lastIndex = 0
    
    filteredMatches.forEach((match, index) => {
      // Add text before this match
      if (match.start > lastIndex) {
        const textBefore = content.slice(lastIndex, match.start)
        if (textBefore.trim()) {
          parts.push(
            <span key={`text-${index}`}>
              {processTextForLatexCommands(textBefore)}
            </span>
          )
        }
      }
      
      // Add the LaTeX expression
      try {
        if (match.type === 'inline') {
          parts.push(
            <InlineMath key={`math-${index}`} math={match.content} />
          )
        } else if (match.type === 'block') {
          parts.push(
            <BlockMath key={`math-${index}`} math={match.content} />
          )
        }
      } catch (error) {
        // If LaTeX rendering fails, fall back to cleaned text
        console.warn('LaTeX rendering failed:', error)
        parts.push(
          <span key={`fallback-${index}`} className="text-muted-foreground">
            {cleanLatexCommand(match.original)}
          </span>
        )
      }
      
      lastIndex = match.end
    })
    
    // Add remaining text
    if (lastIndex < content.length) {
      const remainingText = content.slice(lastIndex)
      if (remainingText.trim()) {
        parts.push(
          <span key="text-final">
            {processTextForLatexCommands(remainingText)}
          </span>
        )
      }
    }
    
    // If no LaTeX found, process the whole text for commands
    if (parts.length === 0) {
      return processTextForLatexCommands(content)
    }
    
    return parts
  }
  
  return (
    <div className={className}>
      {renderMixedContent(text)}
    </div>
  )
}

// Process text for LaTeX commands that aren't in math mode
function processTextForLatexCommands(text: string): string {
  let processed = text
  
  // Common LaTeX text commands
  const textCommands: [RegExp, string][] = [
    [/\\textit\{([^}]+)\}/g, '$1'], // \textit{text} -> text (could be <em> in HTML)
    [/\\textbf\{([^}]+)\}/g, '$1'], // \textbf{text} -> text (could be <strong> in HTML)
    [/\\emph\{([^}]+)\}/g, '$1'],   // \emph{text} -> text
    [/\\text\{([^}]+)\}/g, '$1'],   // \text{text} -> text
    
    // Greek letters that might appear outside math mode
    [/\\alpha\b/g, 'α'],
    [/\\beta\b/g, 'β'],
    [/\\gamma\b/g, 'γ'],
    [/\\delta\b/g, 'δ'],
    [/\\epsilon\b/g, 'ε'],
    [/\\lambda\b/g, 'λ'],
    [/\\mu\b/g, 'μ'],
    [/\\pi\b/g, 'π'],
    [/\\sigma\b/g, 'σ'],
    [/\\tau\b/g, 'τ'],
    [/\\phi\b/g, 'φ'],
    [/\\omega\b/g, 'ω'],
    
    // Remove remaining backslashes for unknown commands
    [/\\([a-zA-Z]+)/g, '$1'],
    
    // Clean up braces
    [/\{([^}]*)\}/g, '$1'],
  ]
  
  textCommands.forEach(([pattern, replacement]) => {
    processed = processed.replace(pattern, replacement)
  })
  
  return processed
}

// Fallback cleaning for failed LaTeX expressions
function cleanLatexCommand(text: string): string {
  return text
    .replace(/\$/g, '')
    .replace(/\\([a-zA-Z]+)/g, '$1')
    .replace(/\{([^}]*)\}/g, '$1')
}