import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { ThemeToggle } from "@/components/theme-toggle"
import { BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/papers', label: 'All Papers' },
    { path: '/categories', label: 'Categories' },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/">
              <motion.div 
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <BookOpen className="h-8 w-8 text-primary" />
                </motion.div>
                <span className="text-2xl font-bold">Better Papers</span>
              </motion.div>
            </Link>

            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  asChild
                  variant={location.pathname === item.path ? "default" : "ghost"}
                  size="sm"
                >
                  <Link to={item.path}>{item.label}</Link>
                </Button>
              ))}
            </div>

            <ThemeToggle />
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main>
        {children}
      </main>
    </div>
  )
}