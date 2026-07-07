import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"

export function Header() {
  return (
    <header className="border-b border-border bg-sky-500 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <a href="/" className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-serif font-bold text-card-foreground">
                        Resume Screener
              </h1>
            </a>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-white hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-white hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="#support" className="text-white hover:text-foreground transition-colors">
              Support
            </a>
            <Button variant="outline" size="sm">
              Sign In
            </Button>
            <Button size="sm">Get Started</Button>
          </div>
        </nav>
      </div>
    </header>
  )
}
