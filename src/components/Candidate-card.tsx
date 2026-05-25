import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

interface CandidateCardProps {
  name: string
  score: number
  status: string
  skills: string[]
}

export function CandidateCard({ name, score, status, skills }: CandidateCardProps) {
  return (
    <Card className="border-border hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-primary font-semibold">
                {name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <div>
              <h4 className="font-serif font-semibold text-card-foreground">{name}</h4>
              <p className="text-sm text-muted-foreground">{status}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              {skills.map((skill, skillIndex) => (
                <Badge key={skillIndex} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-secondary fill-current" />
              <span className="font-semibold text-foreground">{score}</span>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline">
                View
              </Button>
              <Button size="sm">Contact</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
