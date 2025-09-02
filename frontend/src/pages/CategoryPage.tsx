import { useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ExternalLink, Calendar, Users, AlertCircle } from "lucide-react"
import { useEffect, useState } from 'react'
import { api, type Paper } from '@/lib/api'
import { LatexRenderer } from '@/components/LatexRenderer'

export function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>()
  const [papers, setPapers] = useState<Paper[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const categoryNames: Record<string, string> = {
    'cs.LG': 'Machine Learning',
    'cs.AI': 'Artificial Intelligence',
    'cs.CL': 'Natural Language Processing',
    'cs.CV': 'Computer Vision',
    'cs.CR': 'Cryptography',
    'cs.RO': 'Robotics',
    'cs.SE': 'Software Engineering',
    'cs.DB': 'Databases',
    'cs.OS': 'Operating Systems',
    'cs.PL': 'Programming Languages',
    'math.CO': 'Combinatorics',
    'math.PR': 'Probability',
    'math.ST': 'Statistics',
    'math.NT': 'Number Theory',
    'math.AG': 'Algebraic Geometry',
    'math.MG': 'Metric Geometry',
    'math.DS': 'Dynamical Systems',
    'math.FA': 'Functional Analysis',
    'astro-ph.CO': 'Cosmology',
    'astro-ph.HE': 'High Energy Astrophysics',
    'astro-ph.GA': 'Galaxies',
    'cond-mat.mes-hall': 'Mesoscale Physics',
    'cond-mat.soft': 'Soft Condensed Matter',
    'cond-mat.stat-mech': 'Statistical Mechanics',
    'physics.optics': 'Optics',
    'physics.plasm-ph': 'Plasma Physics',
    'physics.bio-ph': 'Biological Physics',
    'quant-ph': 'Quantum Physics',
    'q-bio.BM': 'Biomolecules',
    'q-bio.NC': 'Neurons and Cognition',
    'q-fin.CP': 'Computational Finance',
  }

  useEffect(() => {
    const fetchPapers = async () => {
      if (!categoryId) return

      try {
        setLoading(true)
        setError(null)
        const fetchedPapers = await api.getPapersByCategory(categoryId)
        setPapers(fetchedPapers)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred'
        setError(errorMessage)
        console.error('Error fetching papers:', err)

        // Fallback to mock data for development/demo
        setPapers([
          {
            title: "Attention Is All You Need: A Comprehensive Survey",
            authors: ["John Doe", "Jane Smith", "Bob Johnson"],
            summary: "This paper presents a comprehensive survey of attention mechanisms in deep learning, covering the evolution from basic attention to transformer architectures and their applications across various domains.",
            published: "2024-01-15T10:30:00Z",
            link: "https://arxiv.org/abs/2401.12345"
          },
          {
            title: "Quantum Machine Learning: Bridging Two Worlds",
            authors: ["Alice Cooper", "Charlie Brown"],
            summary: "We explore the intersection of quantum computing and machine learning, presenting novel algorithms that leverage quantum properties to achieve computational advantages in specific learning tasks.",
            published: "2024-01-14T14:20:00Z",
            link: "https://arxiv.org/abs/2401.12346"
          },
          {
            title: "Federated Learning in Edge Computing Environments",
            authors: ["David Wilson", "Emma Davis", "Frank Miller", "Grace Lee"],
            summary: "This work addresses the challenges of implementing federated learning in resource-constrained edge computing environments, proposing efficient algorithms for model aggregation and communication.",
            published: "2024-01-13T09:15:00Z",
            link: "https://arxiv.org/abs/2401.12347"
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchPapers()
  }, [categoryId])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading papers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm" className="mb-3">
            <Link to="/categories">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>

          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">
              {categoryNames[categoryId || ''] || categoryId}
            </h1>
            <Badge variant="outline" className="font-mono text-xs">
              {categoryId}
            </Badge>
          </div>

          <p className="text-muted-foreground">
            {papers.length} papers from the past 7 days
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <p className="text-destructive font-medium">
                API Connection Failed
              </p>
            </div>
            <p className="text-destructive/80 text-sm mt-1">
              Could not connect to backend API at localhost:8000. Make sure your FastAPI server is running. Showing sample data instead.
            </p>
          </div>
        )}

        {/* Papers List */}
        <div className="space-y-4">
          {papers.map((paper, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow duration-200 border-l-2 border-l-primary/20 hover:border-l-primary">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg leading-tight mb-2 hover:text-primary transition-colors">
                      <LatexRenderer text={paper.title} />
                    </CardTitle>
                    
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-2">
                      <span>{paper.authors.slice(0, 2).join(', ')}{paper.authors.length > 2 ? ` +${paper.authors.length - 2}` : ''}</span>
                      <span>•</span>
                      <span>{formatDate(paper.published)}</span>
                    </div>
                  </div>
                  
                  <Button asChild variant="outline" size="sm">
                    <a href={paper.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <LatexRenderer 
                  text={paper.summary}
                  className="text-sm text-muted-foreground leading-relaxed"
                />
              </CardContent>
            </Card>
          ))}
        </div>

        {papers.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No papers found for this category in the past 7 days.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}