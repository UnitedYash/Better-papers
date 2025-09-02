import { motion } from 'framer-motion'
import { useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ExternalLink, Calendar, Users, AlertCircle } from "lucide-react"
import { useEffect, useState } from 'react'
import { api, type Paper } from '@/lib/api'

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
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Button asChild variant="ghost" className="mb-4">
            <Link to="/categories">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Categories
            </Link>
          </Button>

          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              {categoryNames[categoryId || ''] || categoryId}
            </h1>
            <Badge variant="outline" className="font-mono">
              {categoryId}
            </Badge>
          </div>

          <p className="text-muted-foreground text-lg">
            Latest papers from the past 7 days • {papers.length} papers found
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <p className="text-destructive font-medium">
                API Connection Failed
              </p>
            </div>
            <p className="text-destructive/80 text-sm mt-1">
              Could not connect to backend API at localhost:8000. Make sure your FastAPI server is running. Showing sample data instead.
            </p>
          </motion.div>
        )}

        {/* Papers List */}
        <div className="space-y-8">
          {papers.map((paper, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.005 }}
            >
              <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-primary/20 hover:border-l-primary">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl md:text-2xl leading-tight mb-3 text-foreground hover:text-primary transition-colors">
                        {paper.title}
                      </CardTitle>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-primary" />
                          <span className="font-medium">{paper.authors.slice(0, 3).join(', ')}{paper.authors.length > 3 ? ` +${paper.authors.length - 3} more` : ''}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span>{formatDate(paper.published)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Button asChild variant="outline" size="sm" className="hover:bg-primary hover:text-primary-foreground">
                        <a href={paper.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Paper
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="bg-muted/30 rounded-lg p-4 border-l-2 border-l-muted-foreground/20">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Abstract</h4>
                    <p className="text-foreground leading-relaxed text-base">
                      {paper.summary}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {papers.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground text-lg">
              No papers found for this category in the past 7 days.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}