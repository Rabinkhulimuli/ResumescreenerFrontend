import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, BarChart3, Users } from "lucide-react"

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-serif font-bold text-foreground mb-4">Powerful Features for Modern Hiring</h3>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to streamline your recruitment process and find the perfect candidates.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-border hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="font-serif">Smart Upload</CardTitle>
              <CardDescription>
                Drag and drop multiple resumes or upload entire folders. Our system handles all major formats.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-secondary" />
              </div>
              <CardTitle className="font-serif">AI Analysis</CardTitle>
              <CardDescription>
                Advanced algorithms score candidates based on skills, experience, and job requirements.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <CardTitle className="font-serif">Team Collaboration</CardTitle>
              <CardDescription>
                Share candidate profiles, add notes, and collaborate with your hiring team in real-time.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  )
}
