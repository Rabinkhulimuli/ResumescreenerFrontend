import { Card, CardContent } from "@/components/ui/card"
import { BadgeCheck, FileText, Radar, Sparkles, Target} from "lucide-react"
import { useState } from "react"

interface PreviewFile extends File {
  preview: string
}

interface ScoreBreakdown {
  semantic_score?: number
  skill_score?: number
  related_skill_score?: number
  experience_score?: number
  base_score?: number
  penalty_score?: number
  final_score?: number
}

interface ResumeRankResult {
  resume: string
  is_resume?: boolean
  screening_status?: string
  validation_score?: number
  validation_reasons?: string[]
  domain_detected?: string
  domain_confidence?: number
  domain_rationale?: string
  semantic_similarity?: number
  cosine_similarity?: number
  skill_match_score: number
  related_skill_score?: number
  experience_match_score?: number
  final_score: number
  matched_skills: string[]
  related_skills_detected?: string[]
  normalized_skills: string[]
  missing_skills: string[]
  required_experience_years?: number | null
  resume_experience_years?: number | null
  experience_gap_years?: number | null
  required_certifications?: string[]
  resume_certifications?: string[]
  missing_certifications?: string[]
  penalty_score?: number
  recommendation: string
  explanation?: string
  summary_points?: string[]
  score_breakdown?: ScoreBreakdown
}

const scoreColor = (value: number) => {
  if (value >= 0.85) return "from-emerald-500 to-teal-500"
  if (value >= 0.7) return "from-sky-500 to-cyan-500"
  if (value >= 0.5) return "from-amber-500 to-orange-500"
  return "from-rose-500 to-red-500"
}

const formatPercent = (value: number | undefined) => `${Math.round((value ?? 0) * 100)}%`

function ScoreGauge({ value, label, accent }: { value: number; label: string; accent: string }) {
  const percentage = Math.max(0, Math.min(100, value * 100))
  return (
    <div className="relative flex items-center justify-center rounded-3xl border border-border/60 bg-background p-4 shadow-sm">
      <div
        className="flex h-32 w-32 items-center justify-center rounded-full"
        style={{ background: `conic-gradient(${accent} ${percentage * 3.6}deg, rgba(148,163,184,0.16) 0deg)` }}
      >
        <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-card text-center shadow-inner">
          <span className="text-2xl font-semibold text-foreground">{Math.round(percentage)}</span>
          <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
        </div>
      </div>
    </div>
  )
}

function RadarChart({
  semantic,
  skills,
  related,
  experience,
}: {
  semantic: number
  skills: number
  related: number
  experience: number
}) {
  const values = [semantic, skills, related, experience]
  const labels = ["Semantic", "Skills", "Related", "Experience"]
  const center = 60
  const radius = 42
  const angleStep = (Math.PI * 2) / values.length

  const points = values
    .map((value, index) => {
      const angle = -Math.PI / 2 + index * angleStep
      const distance = radius * Math.max(0.15, Math.min(1, value))
      const x = center + Math.cos(angle) * distance
      const y = center + Math.sin(angle) * distance
      return `${x},${y}`
    })
    .join(" ")

  return (
    <div className="rounded-3xl border border-border/60 bg-background p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
        <Radar className="h-4 w-4 text-primary" />
        Skill balance
      </div>
      <svg viewBox="0 0 120 120" className="h-40 w-full overflow-visible">
        {[1, 2, 3].map((ring) => (
          <polygon
            key={ring}
            points={labels
              .map((_, index) => {
                const angle = -Math.PI / 2 + index * angleStep
                const distance = (radius * ring) / 3
                const x = center + Math.cos(angle) * distance
                const y = center + Math.sin(angle) * distance
                return `${x},${y}`
              })
              .join(" ")}
            fill="none"
            stroke="rgba(148,163,184,0.22)"
            strokeWidth="0.8"
          />
        ))}
        {labels.map((label, index) => {
          const angle = -Math.PI / 2 + index * angleStep
          const x = center + Math.cos(angle) * (radius + 12)
          const y = center + Math.sin(angle) * (radius + 12)
          return (
            <text key={label} x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="fill-muted-foreground text-[8px]">
              {label}
            </text>
          )
        })}
        <polygon points={points} fill="rgba(14,165,233,0.22)" stroke="rgb(14,165,233)" strokeWidth="1.5" />
      </svg>
    </div>
  )
}

function SkillGroup({ title, items, tone }: { title: string; items: string[]; tone: "emerald" | "sky" | "rose" | "amber" }) {
  const palette = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    sky: "bg-sky-50 text-sky-700 border-sky-200",
    rose: "bg-rose-50 text-rose-700 border-rose-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
  }

  return (
    <div className="rounded-3xl border border-border/60 bg-background p-4 shadow-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.length > 0 ? (
          items.map((skill) => (
            <span key={skill} className={`rounded-full border px-3 py-1 text-xs ${palette[tone]}`}>
              {skill}
            </span>
          ))
        ) : (
          <span className="text-xs text-muted-foreground">None detected</span>
        )}
      </div>
    </div>
  )
}

function ComparisonTable({ result }: { result: ResumeRankResult }) {
  const rows = [
    ["Domain", result.domain_detected ?? "Unknown"],
    ["Semantic", formatPercent(result.semantic_similarity ?? result.cosine_similarity)],
    ["Skill coverage", formatPercent(result.skill_match_score)],
    ["Related coverage", formatPercent(result.related_skill_score)],
    ["Experience", formatPercent(result.experience_match_score)],
    ["Penalty", formatPercent(result.penalty_score)],
    ["Final score", formatPercent(result.final_score)],
  ]

  return (
    <div className="rounded-3xl border border-border/60 bg-background p-4 shadow-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Resume comparison</p>
      <div className="overflow-hidden rounded-2xl border border-border/50">
        <table className="w-full text-left text-sm">
          <tbody className="divide-y divide-border/50">
            {rows.map(([label, value]) => (
              <tr key={label} className="bg-card/20">
                <td className="px-3 py-2 text-muted-foreground">{label}</td>
                <td className="px-3 py-2 font-medium text-foreground">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function ViewDetailInterface({results}:{results: ResumeRankResult[]}) {
  const [files, setFiles] = useState<PreviewFile[]>([])
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)


 
  return (
    <section className="bg-gradient-to-b from-background via-background to-muted/20 px-4 py-20">
      <div className="container mx-auto max-w-6xl">
       

        <div className="space-y-8">
         

          {files.length > 0 && (
            <Card className="border border-border/50 shadow-lg">
              <CardContent className="p-6">
                <h5 className="mb-4 text-lg font-semibold text-foreground">Selected Files ({files.length})</h5>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {files.map((file, index) => (
                    <div key={`${file.name}-${index}`} className="group relative">
                      <div className="aspect-square w-full overflow-hidden rounded-lg border-2 border-border/50 bg-muted/20 transition-colors hover:border-primary/50">
                        <button
                          type="button"
                          onClick={() => setFiles(files.filter((_, fileIndex) => fileIndex !== index))}
                          className="absolute -right-2 -top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground shadow-md transition-colors hover:bg-destructive/90"
                        >
                          ×
                        </button>

                        {file.type.startsWith("image/") ? (
                          <img src={file.preview} alt={file.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full flex-col items-center justify-center p-2">
                            <FileText className="mb-2 h-8 w-8 text-primary" />
                            <span className="w-full truncate text-center text-xs text-muted-foreground">{file.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {results.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-2xl font-bold tracking-tight text-foreground">Candidate Ranking</h5>
                  <p className="text-sm text-muted-foreground">{results.length} resumes analyzed with domain-aware normalization.</p>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background px-4 py-2 text-sm text-muted-foreground shadow-sm">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Explainable ATS output
                </div>
              </div>

              <div className="space-y-5">
                {results.map((result, index) => {
                  const semanticScore = result.semantic_similarity ?? result.cosine_similarity ?? 0
                  const skillScore = result.skill_match_score ?? 0
                  const relatedScore = result.related_skill_score ?? 0
                  const experienceScore = result.experience_match_score ?? 0
                  const finalScore = result.final_score ?? 0
                  const isExpanded = expandedIndex === index

                  return (
                    <Card key={`${result.resume}-${index}`} className="overflow-hidden border border-border/60 shadow-lg transition-shadow duration-300 hover:shadow-xl">
                      <CardContent className="p-6 lg:p-8">
                        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
                          <div className="space-y-4">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                              <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                                  {index + 1}
                                </div>

                                <div className="space-y-2">
                                  <div>
                                    <h6 className="text-lg font-semibold text-foreground">{result.resume}</h6>
                                    <p className="text-sm text-muted-foreground">{result.recommendation}</p>
                                  </div>

                                  <div className="flex flex-wrap gap-2">
                                    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${result.is_resume ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"}`}>
                                      <BadgeCheck className="h-3.5 w-3.5" />
                                      {result.is_resume ? "Resume detected" : "Not a resume"}
                                    </span>
                                    <span className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
                                      <Target className="h-3.5 w-3.5" />
                                      {result.domain_detected ?? "Unknown domain"}
                                    </span>
                                    {result.domain_confidence !== undefined && (
                                      <span className="rounded-full border border-border/60 bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                                        Domain confidence {formatPercent(result.domain_confidence)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => setExpandedIndex(isExpanded ? null : index)}
                                className="rounded-full border border-border/60 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/60"
                              >
                                {isExpanded ? "Hide details" : "View details"}
                              </button>
                            </div>

                            {result.domain_rationale && (
                              <div className="rounded-3xl border border-sky-200 bg-sky-50/70 p-4 text-sm text-sky-800">
                                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">Why this domain</p>
                                <p>{result.domain_rationale}</p>
                              </div>
                            )}

                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                              <div className="rounded-3xl border border-border/60 bg-background p-4 shadow-sm">
                                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Final score</p>
                                <div className="flex items-end gap-3">
                                  <div className={`bg-gradient-to-r bg-clip-text text-4xl font-bold text-transparent ${scoreColor(finalScore)}`}>
                                    {formatPercent(finalScore)}
                                  </div>
                                  <div className="pb-1 text-xs text-muted-foreground">weighted ATS score</div>
                                </div>
                              </div>

                              <div className="rounded-3xl border border-border/60 bg-background p-4 shadow-sm">
                                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Semantic</p>
                                <div className="text-3xl font-bold text-foreground">{formatPercent(semanticScore)}</div>
                                <div className="mt-2 h-2 rounded-full bg-muted">
                                  <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{ width: formatPercent(semanticScore) }} />
                                </div>
                              </div>

                              <div className="rounded-3xl border border-border/60 bg-background p-4 shadow-sm">
                                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Skill coverage</p>
                                <div className="text-3xl font-bold text-foreground">{formatPercent(skillScore)}</div>
                                <div className="mt-2 h-2 rounded-full bg-muted">
                                  <div className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" style={{ width: formatPercent(skillScore) }} />
                                </div>
                              </div>

                              <div className="rounded-3xl border border-border/60 bg-background p-4 shadow-sm">
                                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Experience</p>
                                <div className="text-3xl font-bold text-foreground">{formatPercent(experienceScore)}</div>
                                <div className="mt-2 h-2 rounded-full bg-muted">
                                  <div className={`h-2 rounded-full bg-gradient-to-r ${experienceScore >= 0.7 ? "from-indigo-500 to-violet-500" : "from-amber-500 to-orange-500"}`} style={{ width: formatPercent(experienceScore) }} />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="grid gap-4">
                            <ScoreGauge value={finalScore} label="ATS score" accent="rgb(14,165,233)" />
                            <RadarChart semantic={semanticScore} skills={skillScore} related={relatedScore} experience={experienceScore} />
                          </div>
                        </div>

                        <div className="mt-6 grid gap-4 xl:grid-cols-3">
                          <SkillGroup title="Matched skills" items={result.matched_skills} tone="emerald" />
                          <SkillGroup title="Related skills" items={result.related_skills_detected ?? []} tone="sky" />
                          <SkillGroup title="Missing skills" items={result.missing_skills} tone="rose" />
                        </div>

                        {!result.is_resume && result.validation_reasons && result.validation_reasons.length > 0 && (
                          <div className="mt-4 rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-rose-600">Validation notes</p>
                            <ul className="space-y-1 list-disc pl-5">
                              {result.validation_reasons.map((reason) => (
                                <li key={reason}>{reason}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {result.is_resume && result.required_experience_years !== null && result.required_experience_years !== undefined && result.experience_gap_years !== null && result.experience_gap_years !== undefined && (
                          <div className={`mt-4 rounded-3xl border p-4 text-sm ${result.experience_gap_years >= 0 ? "border-indigo-200 bg-indigo-50 text-indigo-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}>
                            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em]">Experience fit</p>
                            <p>
                              {result.experience_gap_years >= 0
                                ? `Meets the requirement by ${result.experience_gap_years.toFixed(1)} years.`
                                : `Needs ${Math.abs(result.experience_gap_years).toFixed(1)} more years to match the requirement.`}
                            </p>
                          </div>
                        )}

                        {isExpanded && (
                          <div className="mt-6 grid gap-4 lg:grid-cols-2">
                            <div className="space-y-4 rounded-3xl border border-border/60 bg-background p-4 shadow-sm">
                              <div>
                                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Candidate explanation</p>
                                <p className="text-sm leading-6 text-foreground">{result.explanation ?? "No explanation was returned for this candidate."}</p>
                              </div>

                              {result.summary_points && result.summary_points.length > 0 && (
                                <div>
                                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Summary points</p>
                                  <ul className="space-y-2 text-sm text-foreground">
                                    {result.summary_points.map((point) => (
                                      <li key={point} className="flex gap-2">
                                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                                        <span>{point}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {(result.required_certifications?.length || result.missing_certifications?.length) && (
                                <div className="grid gap-4 md:grid-cols-2">
                                  <SkillGroup title="Required certifications" items={result.required_certifications ?? []} tone="amber" />
                                  <SkillGroup title="Missing certifications" items={result.missing_certifications ?? []} tone="rose" />
                                </div>
                              )}
                            </div>

                            <div className="space-y-4">
                              <ComparisonTable result={result} />

                              <div className="rounded-3xl border border-border/60 bg-background p-4 shadow-sm">
                                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Score breakdown</p>
                                <div className="space-y-3 text-sm">
                                  {[
                                    ["Semantic", result.score_breakdown?.semantic_score ?? semanticScore],
                                    ["Skill", result.score_breakdown?.skill_score ?? skillScore],
                                    ["Related", result.score_breakdown?.related_skill_score ?? relatedScore],
                                    ["Experience", result.score_breakdown?.experience_score ?? experienceScore],
                                    ["Penalty", result.score_breakdown?.penalty_score ?? 0],
                                  ].map(([label, value]) => (
                                    <div key={label}>
                                      <div className="mb-1 flex items-center justify-between">
                                        <span className="text-muted-foreground">{label}</span>
                                        <span className="font-medium text-foreground">{formatPercent(Number(value))}</span>
                                      </div>
                                      <div className="h-2 rounded-full bg-muted">
                                        <div className="h-2 rounded-full bg-gradient-to-r from-slate-500 to-slate-300" style={{ width: formatPercent(Number(value)) }} />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
