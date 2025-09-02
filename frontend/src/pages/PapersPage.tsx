import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ExternalLink, Calendar, Users, Search, Filter, AlertCircle } from "lucide-react"
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

interface Paper {
  title: string
  authors: string[]
  summary: string
  published: string
  link: string
  category: string
}

export function PapersPage() {
  const [papers, setPapers] = useState<Paper[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('date')
  const [error, setError] = useState<string | null>(null)

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'cs.LG', name: 'Machine Learning' },
    { id: 'cs.AI', name: 'Artificial Intelligence' },
    { id: 'cs.CL', name: 'Natural Language Processing' },
    { id: 'cs.CV', name: 'Computer Vision' },
    { id: 'quant-ph', name: 'Quantum Physics' },
    { id: 'math.ST', name: 'Statistics' },
  ]

  useEffect(() => {
    const fetchAllPapers = async () => {
      try {
        setLoading(true)
        // Try to fetch categories first, then get papers from each
        try {
          const categories = await api.getCategories()
          const allPapersPromises = categories.slice(0, 5).map(async (category) => {
            try {
              const papers = await api.getPapersByCategory(category)
              return papers.map(paper => ({ ...paper, category }))
            } catch {
              return []
            }
          })

          const papersArrays = await Promise.all(allPapersPromises)
          const allPapers = papersArrays.flat()

          if (allPapers.length > 0) {
            setPapers(allPapers)
            return
          }
        } catch (error) {
          console.error('Failed to fetch from API, using mock data:', error)
        }

        // Fallback to mock data
        const mockPapers: Paper[] = [
          {
            title: "Attention Is All You Need: A Comprehensive Survey",
            authors: ["John Doe", "Jane Smith", "Bob Johnson"],
            summary: "This paper presents a comprehensive survey of attention mechanisms in deep learning, covering the evolution from basic attention to transformer architectures.",
            published: "2024-01-15T10:30:00Z",
            link: "https://arxiv.org/abs/2401.12345",
            category: "cs.LG"
          },
          {
            title: "Quantum Machine Learning: Bridging Two Worlds",
            authors: ["Alice Cooper", "Charlie Brown"],
            summary: "We explore the intersection of quantum computing and machine learning, presenting novel algorithms that leverage quantum properties.",
            published: "2024-01-14T14:20:00Z",
            link: "https://arxiv.org/abs/2401.12346",
            category: "quant-ph"
          },
          {
            title: "Computer Vision in Autonomous Systems",
            authors: ["David Wilson", "Emma Davis"],
            summary: "This work addresses the challenges of implementing computer vision algorithms in real-time autonomous systems.",
            published: "2024-01-13T09:15:00Z",
            link: "https://arxiv.org/abs/2401.12347",
            category: "cs.CV"
          },
          {
            title: "Natural Language Understanding with Large Models",
            authors: ["Frank Miller", "Grace Lee", "Henry Chen"],
            summary: "We present new techniques for improving natural language understanding using large-scale transformer models.",
            published: "2024-01-12T16:45:00Z",
            link: "https://arxiv.org/abs/2401.12348",
            category: "cs.CL"
          },
          {
            title: "Statistical Methods for High-Dimensional Data",
            authors: ["Ivy Johnson", "Jack Wilson"],
            summary: "This paper introduces novel statistical methods for analyzing high-dimensional datasets with applications to genomics.",
            published: "2024-01-11T11:20:00Z",
            link: "https://arxiv.org/abs/2401.12349",
            category: "math.ST"
          }
        ]
        setPapers(mockPapers)
        setError('Using sample data - API not available')
      } catch (error) {
        console.error('Failed to fetch papers:', error)
        setError('Failed to load papers')
      } finally {
        setLoading(false)
      }
    }

    fetchAllPapers()
  }, [])

  const filteredPapers = papers
    .filter(paper => {
      const matchesSearch = paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paper.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase())) ||
        paper.summary.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || paper.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.published).getTime() - new Date(a.published).getTime()
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title)
      }
      return 0
    })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getCategoryName = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.name || categoryId
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">All Papers</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Explore the latest research papers from the past 7 days across all categories
          </p>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search papers, authors, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Latest</SelectItem>
                <SelectItem value="title">Title A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <p className="text-sm text-muted-foreground">
            Showing {filteredPapers.length} of {papers.length} papers
          </p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <p className="text-destructive font-medium">
                API Connection Issue
              </p>
            </div>
            <p className="text-destructive/80 text-sm mt-1">
              {error}. Make sure your FastAPI server is running at localhost:8000.
            </p>
          </motion.div>
        )}

        {/* Papers List */}
        <div className="space-y-8">
          {filteredPapers.map((paper, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              whileHover={{ scale: 1.005 }}
            >
              <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-primary/20 hover:border-l-primary">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl md:text-2xl leading-tight mb-3 text-foreground hover:text-primary transition-colors">
                        {paper.title}
                      </CardTitle>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-primary" />
                          <span className="font-medium">{paper.authors.slice(0, 3).join(', ')}{paper.authors.length > 3 ? ` +${paper.authors.length - 3} more` : ''}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span>{formatDate(paper.published)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                          {getCategoryName(paper.category)}
                        </Badge>
                        <Badge variant="outline" className="font-mono text-xs">
                          {paper.category}
                        </Badge>
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

        {filteredPapers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground text-lg">
              No papers found matching your criteria.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
              }}
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}