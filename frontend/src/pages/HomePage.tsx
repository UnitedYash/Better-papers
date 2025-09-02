import { Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Zap, Grid3X3, ArrowRight } from "lucide-react"

export function HomePage() {
  const categories = [
    { id: 'cs.LG', name: 'Machine Learning', description: 'Latest ML research and algorithms', count: 42 },
    { id: 'cs.AI', name: 'Artificial Intelligence', description: 'AI systems and methodologies', count: 38 },
    { id: 'cs.CL', name: 'Natural Language Processing', description: 'Language understanding and generation', count: 29 },
    { id: 'cs.CV', name: 'Computer Vision', description: 'Image and video analysis', count: 35 },
    { id: 'quant-ph', name: 'Quantum Physics', description: 'Quantum mechanics and computing', count: 24 },
    { id: 'math.ST', name: 'Statistics', description: 'Statistical theory and methods', count: 31 },
  ]

  const features = [
    {
      title: 'Fresh Content',
      description: 'Papers from the last 7 days across multiple disciplines',
      icon: Zap
    },
    {
      title: 'Organized Categories',
      description: 'Browse by field: CS, Math, Physics, Biology, and more',
      icon: Grid3X3
    },
    {
      title: 'Clean Interface',
      description: 'Focus on reading, not navigating complex interfaces',
      icon: BookOpen
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Latest Research Papers
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover cutting-edge research from arXiv. Fresh papers curated daily across multiple domains.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg">
              <Link to="/papers">
                Browse Papers
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/categories">View Categories</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="text-center">
                  <Icon className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Popular Categories</h2>
            <p className="text-muted-foreground">Explore research across different fields</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.slice(0, 6).map((category) => (
              <Link key={category.id} to={`/category/${category.id}`}>
                <Card className="cursor-pointer hover:shadow-md transition-shadow duration-200 h-full border-l-2 border-l-primary/20 hover:border-l-primary">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{category.name}</CardTitle>
                      <Badge variant="secondary" className="text-xs">{category.count}</Badge>
                    </div>
                    <CardDescription className="text-sm">{category.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button asChild variant="outline">
              <Link to="/categories">
                View All Categories
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            Built for researchers and curious minds
          </p>
        </div>
      </footer>
    </div>
  )
}