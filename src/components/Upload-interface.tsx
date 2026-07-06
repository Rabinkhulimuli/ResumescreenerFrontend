import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { apiClient } from "@/lib/apiClient"
import { Upload, FileText } from "lucide-react"
import { useCallback, useRef, useState } from "react"
import { useDropzone } from "react-dropzone"
import { toast } from "react-toastify"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { ViewDetailInterface } from "./new-interface"

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

export function UploadInterface() {
  const [files, setFiles] = useState<PreviewFile[]>([])
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")
  const [results, setResults] = useState<ResumeRankResult[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const descriptionRef = useRef<HTMLDivElement>(null)
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const mappedFiles: PreviewFile[] = acceptedFiles.map((file) =>
      Object.assign(file, { preview: URL.createObjectURL(file) }),
    )
    setFiles((prev) => [...prev, ...mappedFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [],
      "application/msword": [],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [],
    },
    multiple: true,
  })

  const handleFile = async () => {
    if (isSubmitting) return

    try {
      if (description.length < 20) {
        setError("Job description is required")
        descriptionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
        return
      }
      setError("")
      setIsSubmitting(true)
      const formData = new FormData()

      files.forEach((file) => {
        formData.append("resumes", file)
      })

      formData.append("job_description", description)

      const response = await apiClient.post<ResumeRankResult[]>("/api/rank-resumes", formData)
      setResults(response.data)

      toast("Resumes ranked successfully!")
      setFiles([])
    } catch (error) {
      console.error("Upload failed:", error)
      toast("Upload failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-serif font-bold text-foreground mb-4">Simple. Fast. Effective.</h3>
          <p className="text-xl text-muted-foreground">
            Upload your files and add a description to get started in seconds.
          </p>
        </div>

        <div className="space-y-8">
          <Card
          ref={descriptionRef}
          className={` ${description.length<10?"border-2 border-red-700 shadow-lg shadow-red-100 ":"border border-border/50 shadow-lg"}`}>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <Label htmlFor="description" className="text-lg font-semibold text-foreground">
                    Job Description
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Provide job description for your uploaded resume
                  </p>
                  {error && <div className="text-red-700">{error}</div>}
                </div>
              </div>
              <Textarea
                id="description"
                placeholder="Enter a detailed job description for your files ..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[120px] resize-none border-border/50 focus:border-primary/50 transition-colors"
              />
            </CardContent>
          </Card>

          <div className="relative">
            <Card
              {...getRootProps()}
              className={`border-2 border-dashed transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl ${
                isDragActive
                  ? "border-primary bg-primary/5 scale-[1.02]"
                  : "border-primary/30 bg-card hover:border-primary/50 hover:bg-muted/20"
              }`}
            >
              <CardContent className="p-12 text-center">
                <input {...getInputProps()} />
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors ${
                    isDragActive ? "bg-primary/20" : "bg-primary/10"
                  }`}
                >
                  <Upload
                    className={`h-10 w-10 transition-colors ${isDragActive ? "text-primary" : "text-primary/80"}`}
                  />
                </div>
                <h4 className="text-2xl font-serif font-semibold text-card-foreground mb-4">
                  {isDragActive ? (
                    <span className="text-primary">Drop your files here...</span>
                  ) : (
                    "Drag & drop files here, or click to select"
                  )}
                </h4>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed">
                  Supports PDF, DOC, DOCX files up to 10MB each. Upload multiple files at once for batch processing.
                </p>
                <Button size="lg" variant="outline" className="font-medium bg-transparent">
                  Choose Files
                </Button>
              </CardContent>
            </Card>

            {(files.length > 0 || description.trim()) && (
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
                <Button
                  onClick={handleFile}
                  size="lg"
                  className="shadow-lg hover:shadow-xl transition-all duration-200 font-medium px-8"
                  disabled={files.length === 0 || isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Upload"}
                </Button>
              </div>
            )}
          </div>

          {files.length > 0 && (
            <Card className="border border-border/50 shadow-lg">
              <CardContent className="p-6">
                <h5 className="text-lg font-semibold text-foreground mb-4">Selected Files ({files.length})</h5>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {files.map((file, index) => (
                    <div key={file.name} className="relative group">
                      <div className="w-full aspect-square border-2 border-border/50 rounded-lg overflow-hidden bg-muted/20 hover:border-primary/50 transition-colors">
                        <button
                          type="button"
                          onClick={() => setFiles(files.filter((_, i) => i !== index))}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs rounded-full w-6 h-6 flex items-center justify-center hover:bg-destructive/90 transition-colors shadow-md z-10"
                        >
                          ×
                        </button>

                        {file.type.startsWith("image/") ? (
                          <img
                            src={file.preview || "/placeholder.svg"}
                            alt={file.name}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center w-full h-full p-2">
                            <FileText className="h-8 w-8 text-primary mb-2" />
                            <span className="text-xs text-center text-muted-foreground truncate w-full">
                              {file.name}
                            </span>
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
  <Card className="border shadow-xl rounded-2xl">
    <CardContent className="p-8">
      <div className="w-full">
<Dialog>
  <DialogTrigger asChild className="flex w-full items-center justify-end">
    <Button className="cursor-pointer w-fit ml-auto">
      Expand View
    </Button>
  </DialogTrigger>

  <DialogContent
    className="
      min-w-[95vw]
      max-w-[1200px]
      h-[90vh]
      p-0
      overflow-hidden
      flex flex-col
    "
  >
    {/* Header */}
    <DialogHeader className="px-6 py-4 border-b">
      <DialogTitle>Resume Details</DialogTitle>
    </DialogHeader>

    {/* Body */}
    <div className="flex-1 overflow-y-auto px-6 py-4">
      <ViewDetailInterface results={results} />
    </div>
  </DialogContent>
</Dialog>
      </div>
      <div className="flex items-center justify-between mb-6">
        <h5 className="text-2xl font-bold tracking-tight">
          Candidate Ranking
        </h5>
        <span className="text-sm text-muted-foreground">
          {results.length} resumes analyzed
        </span>
      </div>

      <div className="space-y-5">
        {results.map((result, index) => {
          const finalScore = (result.final_score * 100).toFixed(1)

          return (
            <div
              key={`${result.resume}-${index}`}
              className="group border rounded-xl p-6 bg-background hover:shadow-lg transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                {/* LEFT SIDE */}
                <div className="flex items-start gap-4">
                  {/* Rank */}
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary font-semibold">
                    {index + 1}
                  </div>

                  <div>
                    <h6 className="text-lg font-semibold">
                      {result.resume}
                    </h6>
                    <p className="text-sm text-muted-foreground">
                      {result.recommendation}
                    </p>
                    {!result.is_resume && (
                      <p className="text-xs font-medium text-red-600 mt-1">
                        {result.screening_status === "unreadable_or_unsupported"
                          ? "File could not be read as a resume"
                          : "Not detected as a resume"}
                      </p>
                    )}
                  </div>
                </div>

                {/* RIGHT SIDE SCORES */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:w-auto">

                  {/* Similarity */}
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      Similarity
                    </p>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: `${(result?.cosine_similarity??1 * 100).toFixed(1)}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs font-medium">
                      {(result?.cosine_similarity??1 * 100).toFixed(1)}%
                    </p>
                  </div>

                  {/* Skill Match */}
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      Skill Match
                    </p>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${(result.skill_match_score * 100).toFixed(1)}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs font-medium">
                      {(result.skill_match_score * 100).toFixed(1)}%
                    </p>
                  </div>

                  {/* Final Score */}
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      Final Score
                    </p>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{
                          width: `${finalScore}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs font-bold text-purple-600">
                      {finalScore}%
                    </p>
                  </div>

                  {/* Experience */}
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      Experience
                    </p>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${result.experience_gap_years !== undefined && result.experience_gap_years !== null && result.experience_gap_years < 0 ? "bg-amber-500" : "bg-indigo-500"}`}
                        style={{
                          width: `${Math.max(0, Math.min(100, (result.experience_match_score ?? 0) * 100)).toFixed(1)}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs font-medium">
                      {result.resume_experience_years !== null && result.resume_experience_years !== undefined
                        ? `${result.resume_experience_years.toFixed(1)} yrs`
                        : "Not detected"}
                      {result.required_experience_years !== null && result.required_experience_years !== undefined
                        ? ` / ${result.required_experience_years.toFixed(1)} yrs needed`
                        : ""}
                    </p>
                  </div>

                </div>
              </div>

              {/* SKILLS */}
              <div className="mt-5 space-y-3">
                {!result.is_resume && result.validation_reasons && result.validation_reasons.length > 0 && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                    <p className="text-xs font-semibold text-red-700 mb-1">
                      Validation Notes
                    </p>
                    <ul className="text-xs text-red-700 space-y-1 list-disc list-inside">
                      {result.validation_reasons.map((reason, reasonIndex) => (
                        <li key={reasonIndex}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.is_resume && result.required_experience_years !== null && result.required_experience_years !== undefined && result.experience_gap_years !== null && result.experience_gap_years !== undefined && (
                  <div className={`rounded-lg border p-3 ${result.experience_gap_years >= 0 ? "border-indigo-200 bg-indigo-50" : "border-amber-200 bg-amber-50"}`}>
                    <p className={`text-xs font-semibold mb-1 ${result.experience_gap_years >= 0 ? "text-indigo-700" : "text-amber-700"}`}>
                      Experience Fit
                    </p>
                    <p className={`text-xs ${result.experience_gap_years >= 0 ? "text-indigo-700" : "text-amber-700"}`}>
                      {result.experience_gap_years >= 0
                        ? `Meets the requirement by ${result.experience_gap_years.toFixed(1)} years.`
                        : `Needs ${Math.abs(result.experience_gap_years).toFixed(1)} more years to match the requirement.`}
                    </p>
                  </div>
                )}

                {/* matched */}
                <div>
                  <p className="text-xs font-medium text-green-600 mb-1">
                    Matched Skills
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {result.matched_skills.length > 0 ? (
                      result.matched_skills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 text-xs rounded-md bg-green-100 text-green-700"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        None
                      </span>
                    )}
                  </div>
                </div>

                {/* missing */}
                <div>
                  <p className="text-xs font-medium text-red-600 mb-1">
                    Missing Skills
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {result.missing_skills.length > 0 ? (
                      result.missing_skills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 text-xs rounded-md bg-red-100 text-red-700"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        None
                      </span>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )
        })}
      </div>
    </CardContent>
  </Card>
)}
        </div>
      </div>
    </section>
  )
}
