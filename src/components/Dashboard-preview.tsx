import { CandidateCard } from "./Candidate-card"

const sampleCandidates = [
  {
    name: "Sarah Johnson",
    score: 95,
    status: "Excellent Match",
    skills: ["React", "TypeScript", "Node.js"],
  },
  { name: "Michael Chen", score: 87, status: "Good Match", skills: ["Python", "Django", "PostgreSQL"] },
  { name: "Emily Rodriguez", score: 82, status: "Potential Match", skills: ["Java", "Spring", "AWS"] },
]

export function DashboardPreview() {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-serif font-bold text-foreground mb-4">Comprehensive Candidate Dashboard</h3>
          <p className="text-xl text-muted-foreground">View, filter, and manage all your candidates in one place.</p>
        </div>

        <div className="grid gap-6">
          {sampleCandidates.map((candidate, index) => (
            <CandidateCard
              key={index}
              name={candidate.name}
              score={candidate.score}
              status={candidate.status}
              skills={candidate.skills}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
