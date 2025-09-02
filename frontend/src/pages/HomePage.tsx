import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Zap, Grid3X3, ArrowRight } from "lucide-react"

export function HomePage() {
  const featuresRef = useRef(null)
  const categoriesRef = useRef(null)
  const footerRef = useRef(null)
  
  const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" })
  const categoriesInView = useInView(categoriesRef, { once: true, margin: "-100px" })
  const footerInView = useInView(footerRef, { once: true, margin: "-50px" })

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Discover the Latest{" "}
              <motion.span 
                className="text-primary"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Research Papers
              </motion.span>
            </motion.h1>
            <motion.p 
              className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Stay updated with cutting-edge science and technology from arXiv. 
              Fresh papers curated daily across multiple research domains.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild size="lg" className="text-lg">
                  <Link to="/papers">
                    Explore Papers
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </motion.div>
                  </Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild variant="outline" size="lg" className="text-lg">
                  <Link to="/categories">Browse Categories</Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={featuresInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Why Better Papers?
            </motion.h2>
            <motion.p 
              className="text-muted-foreground text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              We curate and organize the latest research so you can focus on what matters most.
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.05,
                    transition: { type: "spring", stiffness: 300, damping: 10 }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={featuresInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
                        transition={{ 
                          duration: 0.6, 
                          delay: 0.6 + index * 0.1,
                          type: "spring",
                          stiffness: 200
                        }}
                      >
                        <Icon className="h-12 w-12 text-primary mb-4" />
                      </motion.div>
                      <CardTitle>{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Categories Preview */}
      <section ref={categoriesRef} className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={categoriesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, x: -50 }}
              animate={categoriesInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Popular Categories
            </motion.h2>
            <motion.p 
              className="text-muted-foreground text-lg"
              initial={{ opacity: 0, x: 50 }}
              animate={categoriesInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Explore research across different fields of study
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate={categoriesInView ? "visible" : "hidden"}
          >
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.03,
                  rotateY: 5,
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
                whileTap={{ scale: 0.97 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <Link to={`/category/${category.id}`}>
                  <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 h-full">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={categoriesInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                          transition={{ 
                            duration: 0.5, 
                            delay: 0.6 + index * 0.1,
                            type: "spring",
                            stiffness: 200
                          }}
                        >
                          <Badge variant="secondary">{category.count} papers</Badge>
                        </motion.div>
                      </div>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={categoriesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                        transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                      >
                        <Badge variant="outline" className="font-mono text-xs">
                          {category.id}
                        </Badge>
                      </motion.div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={categoriesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button asChild variant="outline" size="lg">
                <Link to="/categories">
                  View All Categories
                  <motion.div
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </motion.div>
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer ref={footerRef} className="py-12 px-4 sm:px-6 lg:px-8 border-t bg-muted/50">
        <div className="max-w-7xl mx-auto text-center">
          <motion.p 
            className="text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={footerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            Built with{" "}
            <motion.span
              animate={{ 
                scale: [1, 1.2, 1],
                color: ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ef4444"]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              ❤️
            </motion.span>
            {" "}for researchers and curious minds everywhere
          </motion.p>
        </div>
      </footer>
    </div>
  )
}