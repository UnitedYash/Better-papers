// Utility functions to clean up LaTeX formatting in paper abstracts

export function cleanLatexText(text: string): string {
  if (!text) return text;
  
  let cleaned = text;
  
  // First pass: handle error bounds before other processing
  // Convert error bound notation like 0.32_{-0.20}^{+0.22} to 0.32 (+0.22/-0.20)
  cleaned = cleaned.replace(/([0-9.]+)_\{([^}]+)\}\^\{([^}]+)\}/g, '$1 ($3/$2)');
  cleaned = cleaned.replace(/([0-9.]+)_([^}\s^]+)\^\{([^}]+)\}/g, '$1 ($3/$2)');
  cleaned = cleaned.replace(/([0-9.]+)_\{([^}]+)\}\^([^}\s]+)/g, '$1 ($3/$2)');
  cleaned = cleaned.replace(/([0-9.]+)_([^}\s^]+)\^([^}\s]+)/g, '$1 ($3/$2)');
  
  // Handle complex mathematical expressions
  // Convert common scientific notation patterns
  cleaned = cleaned.replace(/\\times\s*10\^\{([^}]+)\}/g, ' × 10^$1');
  cleaned = cleaned.replace(/\\times\s*10\^([0-9-]+)/g, ' × 10^$1');
  
  // Remove common LaTeX commands and replace with readable text
  const replacements: [RegExp, string][] = [
    // Math mode delimiters
    [/\$([^$]+)\$/g, '$1'], // Remove single $ delimiters
    [/\$\$([^$]+)\$\$/g, '$1'], // Remove double $$ delimiters
    
    // Text formatting commands
    [/\\textit\{([^}]+)\}/g, '$1'], // Remove \textit{}
    [/\\textbf\{([^}]+)\}/g, '$1'], // Remove \textbf{}
    [/\\emph\{([^}]+)\}/g, '$1'], // Remove \emph{}
    [/\\text\{([^}]+)\}/g, '$1'], // Remove \text{}
    [/\\mathrm\{([^}]+)\}/g, '$1'], // Remove \mathrm{}
    [/\\mathit\{([^}]+)\}/g, '$1'], // Remove \mathit{}
    [/\\mathbf\{([^}]+)\}/g, '$1'], // Remove \mathbf{}
    [/\\mathcal\{([^}]+)\}/g, '$1'], // Remove \mathcal{}
    [/\\mathbb\{([^}]+)\}/g, '$1'], // Remove \mathbb{}
    [/\\mathfrak\{([^}]+)\}/g, '$1'], // Remove \mathfrak{}
    
    // Subscripts and superscripts - convert to readable format
    [/([a-zA-Z0-9])_\{([^}]+)\}/g, '$1($2)'], // Convert _{} to parentheses
    [/([a-zA-Z0-9])\^\{([^}]+)\}/g, '$1^($2)'], // Convert ^{} to ^()
    [/([a-zA-Z0-9])_([a-zA-Z0-9]+)/g, '$1($2)'], // Convert simple subscripts to parentheses
    [/([a-zA-Z0-9])\^([a-zA-Z0-9]+)/g, '$1^$2'], // Keep simple superscripts
    
    // Handle complex subscripts/superscripts with error bounds
    [/([a-zA-Z0-9]+)_\{([^}]*-[^}]*\+[^}]*)\}/g, '$1 = $2'], // Convert error bounds
    [/([a-zA-Z0-9]+)_([^}\s]*-[^}\s]*\+[^}\s]*)/g, '$1 = $2'], // Convert error bounds without braces
    
    // Greek letters - convert to readable names
    [/\\alpha/g, 'α'],
    [/\\beta/g, 'β'],
    [/\\gamma/g, 'γ'],
    [/\\delta/g, 'δ'],
    [/\\epsilon/g, 'ε'],
    [/\\zeta/g, 'ζ'],
    [/\\eta/g, 'η'],
    [/\\theta/g, 'θ'],
    [/\\iota/g, 'ι'],
    [/\\kappa/g, 'κ'],
    [/\\lambda/g, 'λ'],
    [/\\mu/g, 'μ'],
    [/\\nu/g, 'ν'],
    [/\\xi/g, 'ξ'],
    [/\\pi/g, 'π'],
    [/\\rho/g, 'ρ'],
    [/\\sigma/g, 'σ'],
    [/\\tau/g, 'τ'],
    [/\\upsilon/g, 'υ'],
    [/\\phi/g, 'φ'],
    [/\\chi/g, 'χ'],
    [/\\psi/g, 'ψ'],
    [/\\omega/g, 'ω'],
    [/\\Gamma/g, 'Γ'],
    [/\\Delta/g, 'Δ'],
    [/\\Theta/g, 'Θ'],
    [/\\Lambda/g, 'Λ'],
    [/\\Xi/g, 'Ξ'],
    [/\\Pi/g, 'Π'],
    [/\\Sigma/g, 'Σ'],
    [/\\Upsilon/g, 'Υ'],
    [/\\Phi/g, 'Φ'],
    [/\\Psi/g, 'Ψ'],
    [/\\Omega/g, 'Ω'],
    
    // Mathematical symbols
    [/\\times/g, '×'],
    [/\\cdot/g, '·'],
    [/\\pm/g, '±'],
    [/\\mp/g, '∓'],
    [/\\leq/g, '≤'],
    [/\\geq/g, '≥'],
    [/\\neq/g, '≠'],
    [/\\approx/g, '≈'],
    [/\\sim/g, '∼'],
    [/\\propto/g, '∝'],
    [/\\infty/g, '∞'],
    [/\\partial/g, '∂'],
    [/\\nabla/g, '∇'],
    [/\\int/g, '∫'],
    [/\\sum/g, '∑'],
    [/\\prod/g, '∏'],
    [/\\sqrt\{([^}]+)\}/g, '√($1)'],
    [/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)'],
    [/\\log_\{([^}]+)\}/g, 'log_$1'],
    [/\\log/g, 'log'],
    [/\\ln/g, 'ln'],
    [/\\exp/g, 'exp'],
    [/\\sin/g, 'sin'],
    [/\\cos/g, 'cos'],
    [/\\tan/g, 'tan'],
    
    // Units and spacing
    [/\\,/g, ' '], // Thin space
    [/\\;/g, ' '], // Medium space
    [/\\quad/g, ' '], // Quad space
    [/\\qquad/g, '  '], // Double quad space
    [/\\ /g, ' '], // Escaped space
    
    // Handle angle brackets for averages
    [/\\langle\s*([^\\]*)\s*\\rangle/g, '⟨$1⟩'],
    
    // Remove remaining LaTeX commands (anything starting with \)
    [/\\[a-zA-Z]+\*?/g, ''], // Remove unhandled commands
    [/\{([^}]*)\}/g, '$1'], // Remove remaining braces
    [/\\\\/g, ' '], // Remove line breaks
    
    // Clean up underscores and make them more readable
    [/N_HI\^DW/g, 'N(HI,DW)'], // Specific case for column density
    [/([A-Z]+)_([A-Z]+)/g, '$1($2)'], // Convert things like HI_DW to HI(DW)
    [/log_([0-9]+)/g, 'log($1)'], // Convert log_10 to log(10)
    [/([a-z]+)_([0-9]+)/g, '$1($2)'], // Convert other subscripts
    [/x_HI/g, 'x(HI)'], // Specific case for ionization fraction
    [/t_Q/g, 't(Q)'], // Specific case for quasar lifetime
    [/r_patch/g, 'r(patch)'], // Specific case for distance
    
    // Clean up multiple spaces and trim
    [/\s+/g, ' '], // Multiple spaces to single space
  ];
  
  // Apply all replacements
  for (const [pattern, replacement] of replacements) {
    cleaned = cleaned.replace(pattern, replacement);
  }
  
  return cleaned.trim();
}

export function formatMathExpression(text: string): string {
  // For inline math expressions, we can do some basic formatting
  return cleanLatexText(text);
}

export function formatErrorBounds(text: string): string {
  // Convert error bound notation in various formats to readable form
  let result = text;
  
  // Handle the format: 0.32(-0.20)^+0.22 -> 0.32 (+0.22/-0.20)
  result = result.replace(/([0-9.]+)\(([^)]+)\)\^\+([0-9.]+)/g, '$1 (+$3/$2)');
  
  // Handle the format: 0.32_{-0.20}^{+0.22} -> 0.32 (+0.22/-0.20)
  result = result.replace(/([0-9.]+)_\{([^}]+)\}\^\{([^}]+)\}/g, '$1 ($3/$2)');
  
  // Handle the format: 0.32_-0.20^+0.22 -> 0.32 (+0.22/-0.20)
  result = result.replace(/([0-9.]+)_([^}\s^]+)\^([^}\s]+)/g, '$1 ($3/$2)');
  
  // Clean up any remaining error notation patterns
  result = result.replace(/\^(\+[0-9.]+)/g, ' (+$1)');
  result = result.replace(/\((-[0-9.]+)\)/g, ' ($1)');
  
  return result;
}