import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto text-center max-w-3xl">
        <h3 className="text-4xl font-serif font-bold text-foreground mb-6">Ready to Transform Your Hiring?</h3>
        <p className="text-xl text-muted-foreground mb-8">
          Join thousands of HR professionals who trust Resume Screener to find the best candidates faster.
        </p>
        <Button size="lg" className="text-lg px-8 py-6">
          Start Free Trial
          <CheckCircle className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </section>
  )
}
