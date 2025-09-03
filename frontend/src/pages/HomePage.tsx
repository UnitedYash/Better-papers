import { Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { WeeklyTrendsChart } from "@/components/WeeklyTrendsChart"
import { BookOpen, Zap, Grid3X3, ArrowRight, Search, TrendingUp, Users, Globe, Sparkles, BarChart3 } from "lucide-react"

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
      title: 'Latest Research',
      description: 'Fresh papers from arXiv updated daily across all scientific disciplines',
      icon: Zap,
      color: 'text-blue-500'
    },
    {
      title: 'Smart Organization',
      description: 'Browse by field with intuitive categorization and powerful search',
      icon: Grid3X3,
      color: 'text-green-500'
    },
    {
      title: 'Beautiful Math',
      description: 'Properly rendered LaTeX equations and scientific notation',
      icon: Sparkles,
      color: 'text-purple-500'
    },
    {
      title: 'Network Visualization',
      description: 'Explore connections between research fields and discover patterns',
      icon: BarChart3,
      color: 'text-orange-500'
    }
  ]

  const stats = [
    { label: 'Research Papers', value: '50K+', icon: BookOpen },
    { label: 'Categories', value: '30+', icon: Grid3X3 },
    { label: 'Daily Updates', value: '500+', icon: TrendingUp },
    { label: 'Researchers', value: '10K+', icon: Users }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5"></div>
        
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Globe className="h-4 w-4" />
              Powered by arXiv • Updated Daily
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Discover the Future of
              <span className="block text-primary">Scientific Research</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Access the latest research papers from arXiv with beautiful LaTeX rendering, 
              smart categorization, and powerful visualization tools.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link to="/papers">
                  <Search className="mr-2 h-5 w-5" />
                  Explore Papers
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                <Link to="/graph">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  View Network
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-3">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need for research discovery
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built for researchers, by researchers. Experience the next generation of academic paper browsing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={feature.title} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="text-center pb-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl mb-4 mx-auto">
                      <Icon className={`h-8 w-8 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center pt-0">
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Weekly Trends Chart */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Publication Activity</h2>
            <p className="text-lg text-muted-foreground">
              Track daily research output across top categories
            </p>
          </div>
          <WeeklyTrendsChart width={1000} height={400} />
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore Research Fields</h2>
            <p className="text-lg text-muted-foreground">
              From AI and machine learning to quantum physics and biology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {categories.slice(0, 6).map((category, index) => (
              <Link key={category.id} to={`/category/${category.id}`}>
                <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {category.name}
                      </CardTitle>
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        {category.count}
                      </Badge>
                    </div>
                    <CardDescription className="text-base leading-relaxed">
                      {category.description}
                    </CardDescription>
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

          <div className="text-center">
            <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6">
              <Link to="/categories">
                View All {categories.length} Categories
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 rounded-3xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to explore the future of science?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of researchers discovering breakthrough papers every day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link to="/papers">
                  Start Exploring
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                <Link to="/graph">
                  View Research Network
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-xl font-semibold">Better Papers</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built with ❤️ for the research community
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}