import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload } from "lucide-react"

export function HeroSection() {
  const scrollToScreener = () => {
    document.getElementById("screener")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto text-center max-w-4xl">
        <Badge variant="secondary" className="mb-4">
          AI-Powered Screening
        </Badge>
        <h2 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-6 leading-tight">
          Screen Resumes with
          <span className="text-primary"> Intelligence</span>
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          Transform your hiring process with AI-powered resume analysis. Identify top candidates faster, reduce bias,
          and make data-driven hiring decisions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="text-lg px-8 py-6 cursor-pointer" onClick={scrollToScreener} type="button">
            Start Screening Now
            <Upload className="ml-2 h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="text-lg px-8 py-6 bg-transparent cursor-pointer"
            onClick={scrollToScreener}
            type="button"
          >
            Watch Demo
          </Button>
        </div>
      </div>
    </section>
  )
}
