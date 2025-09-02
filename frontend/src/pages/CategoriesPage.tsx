import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, AlertCircle } from "lucide-react"
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'

export function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [availableCategories, setAvailableCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Static category metadata for display purposes
  const categoryMetadata: Record<string, { name: string; description: string; field: string }> = {
    'cs.LG': { name: 'Machine Learning', description: 'Latest ML research and algorithms', field: 'Computer Science' },
    'cs.AI': { name: 'Artificial Intelligence', description: 'AI systems and methodologies', field: 'Computer Science' },
    'cs.CL': { name: 'Natural Language Processing', description: 'Language understanding and generation', field: 'Computer Science' },
    'cs.CV': { name: 'Computer Vision', description: 'Image and video analysis', field: 'Computer Science' },
    'cs.CR': { name: 'Cryptography', description: 'Security and cryptographic systems', field: 'Computer Science' },
    'cs.RO': { name: 'Robotics', description: 'Robotic systems and automation', field: 'Computer Science' },
    'cs.SE': { name: 'Software Engineering', description: 'Software development methodologies', field: 'Computer Science' },
    'cs.DB': { name: 'Databases', description: 'Database systems and theory', field: 'Computer Science' },
    'cs.OS': { name: 'Operating Systems', description: 'Operating system design and implementation', field: 'Computer Science' },
    'cs.PL': { name: 'Programming Languages', description: 'Programming language theory and design', field: 'Computer Science' },
    
    'math.CO': { name: 'Combinatorics', description: 'Discrete mathematics and combinatorics', field: 'Mathematics' },
    'math.PR': { name: 'Probability', description: 'Probability theory and stochastic processes', field: 'Mathematics' },
    'math.ST': { name: 'Statistics', description: 'Statistical theory and methods', field: 'Mathematics' },
    'math.NT': { name: 'Number Theory', description: 'Pure number theory research', field: 'Mathematics' },
    'math.AG': { name: 'Algebraic Geometry', description: 'Geometric algebra and algebraic varieties', field: 'Mathematics' },
    'math.MG': { name: 'Metric Geometry', description: 'Geometric analysis and metric spaces', field: 'Mathematics' },
    'math.DS': { name: 'Dynamical Systems', description: 'Dynamical systems and chaos theory', field: 'Mathematics' },
    'math.FA': { name: 'Functional Analysis', description: 'Functional analysis and operator theory', field: 'Mathematics' },
    
    'quant-ph': { name: 'Quantum Physics', description: 'Quantum mechanics and computing', field: 'Physics' },
    'astro-ph.CO': { name: 'Cosmology', description: 'Cosmological models and observations', field: 'Physics' },
    'astro-ph.HE': { name: 'High Energy Astrophysics', description: 'High energy phenomena in space', field: 'Physics' },
    'astro-ph.GA': { name: 'Galaxies', description: 'Galaxy formation and evolution', field: 'Physics' },
    'cond-mat.mes-hall': { name: 'Mesoscale Physics', description: 'Nanoscale and mesoscale systems', field: 'Physics' },
    'cond-mat.soft': { name: 'Soft Condensed Matter', description: 'Soft matter and complex fluids', field: 'Physics' },
    'cond-mat.stat-mech': { name: 'Statistical Mechanics', description: 'Statistical mechanics and thermodynamics', field: 'Physics' },
    'physics.optics': { name: 'Optics', description: 'Optical systems and photonics', field: 'Physics' },
    'physics.plasm-ph': { name: 'Plasma Physics', description: 'Plasma physics and fusion', field: 'Physics' },
    'physics.bio-ph': { name: 'Biological Physics', description: 'Physics of biological systems', field: 'Physics' },
    
    'q-bio.BM': { name: 'Biomolecules', description: 'Molecular biology and biochemistry', field: 'Biology' },
    'q-bio.NC': { name: 'Neurons and Cognition', description: 'Neuroscience and cognitive science', field: 'Biology' },
    'q-fin.CP': { name: 'Computational Finance', description: 'Mathematical finance and economics', field: 'Finance' },
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        setError(null)
        const categories = await api.getCategories()
        setAvailableCategories(categories)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch categories'
        setError(errorMessage)
        console.error('Error fetching categories:', err)
        
        // Fallback to all known categories for demo
        setAvailableCategories(Object.keys(categoryMetadata))
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // Create display categories from available categories
  const allCategories = availableCategories.map(id => ({
    id,
    ...categoryMetadata[id],
    // Default values for unknown categories
    name: categoryMetadata[id]?.name || id,
    description: categoryMetadata[id]?.description || 'Research papers in this category',
    field: categoryMetadata[id]?.field || 'Other'
  }))

  const filteredCategories = allCategories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.field.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const groupedCategories = filteredCategories.reduce((acc, category) => {
    if (!acc[category.field]) {
      acc[category.field] = []
    }
    acc[category.field].push(category)
    return acc
  }, {} as Record<string, typeof allCategories>)

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading categories...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Categories</h1>
          <p className="text-muted-foreground mb-6">
            Browse research by field of study
          </p>
          
          {/* Search */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <p className="text-destructive font-medium">
                API Connection Failed
              </p>
            </div>
            <p className="text-destructive/80 text-sm mt-1">
              Could not fetch categories from backend API. Make sure your FastAPI server is running. Showing all available categories instead.
            </p>
          </div>
        )}

        {/* Categories by Field */}
        {Object.entries(groupedCategories).map(([field, categories]) => (
          <div key={field} className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-primary">{field}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <Link key={category.id} to={`/category/${category.id}`}>
                  <Card className="cursor-pointer hover:shadow-md transition-shadow duration-200 h-full border-l-2 border-l-primary/20 hover:border-l-primary">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">{category.name}</CardTitle>
                      <CardDescription className="text-sm">{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Badge variant="outline" className="font-mono text-xs">
                        {category.id}
                      </Badge>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No categories found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}