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
    { path: '/papers', label: 'Papers' },
    { path: '/categories', label: 'Categories' },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-xl font-semibold">Better Papers</span>
            </Link>

            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center space-x-1">
                {navItems.map((item) => (
                  <Button
                    key={item.path}
                    asChild
                    variant={location.pathname === item.path ? "default" : "ghost"}
                    size="sm"
                    className="text-sm"
                  >
                    <Link to={item.path}>{item.label}</Link>
                  </Button>
                ))}
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {children}
      </main>
    </div>
  )
}