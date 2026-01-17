"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Job } from "@/lib/job-data"

interface JobCardProps {
  job: Job
  view: "grid" | "list"
  isSaved: boolean
  onSave: (id: string) => void
  onApply: (job: Job) => void
  onClick: (job: Job) => void
}

function formatSalary(min: number, max: number) {
  const format = (n: number) => `$${(n / 1000).toFixed(0)}k`
  return `${format(min)} - ${format(max)}`
}

function formatDate(date: Date) {
  const now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  if (diff === 0) return "Today"
  if (diff === 1) return "Yesterday"
  if (diff < 7) return `${diff} days ago`
  if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`
  return `${Math.floor(diff / 30)} months ago`
}

const jobTypeColors: Record<Job["jobType"], string> = {
  "Full-time": "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  "Part-time": "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30",
  Remote: "bg-primary/20 text-primary border-primary/30",
  Hybrid: "bg-accent/20 text-accent-foreground border-accent/30",
}

function getMatchScoreColor(score: number) {
  if (score >= 90) return "bg-teal-500/20 text-teal-400 border-teal-500/40"
  if (score >= 75) return "bg-cyan-500/20 text-cyan-400 border-cyan-500/40"
  return "bg-blue-500/15 text-blue-400/80 border-blue-500/30"
}

export function JobCard({ job, view, isSaved, onSave, onApply, onClick }: JobCardProps) {
  const saveButtonClasses = isSaved
    ? `flex-1 h-9 text-sm font-medium rounded-md
       bg-gradient-to-r from-indigo-500/20 to-purple-500/20
       border border-indigo-400/40
       text-indigo-300 
       shadow-[0_0_12px_rgba(99,102,241,0.15)]
       hover:from-indigo-500/25 hover:to-purple-500/25
       hover:border-indigo-400/50 hover:text-indigo-200
       transition-all duration-150 ease-out active:scale-95`
    : `flex-1 h-9 text-sm font-medium rounded-md
       bg-white/5 dark:bg-slate-800/50
       border border-white/10 dark:border-slate-600/30
       text-slate-400 dark:text-slate-400
       hover:bg-cyan-500/10 hover:border-cyan-500/30
       hover:text-slate-300 hover:shadow-[0_0_10px_rgba(6,182,212,0.1)]
       transition-all duration-150 ease-out active:scale-95`

  const saveButtonClassesList = isSaved
    ? `text-xs h-8 font-medium rounded-md
       bg-gradient-to-r from-indigo-500/20 to-purple-500/20
       border border-indigo-400/40
       text-indigo-300
       shadow-[0_0_12px_rgba(99,102,241,0.15)]
       hover:from-indigo-500/25 hover:to-purple-500/25
       hover:border-indigo-400/50 hover:text-indigo-200
       transition-all duration-150 ease-out active:scale-95`
    : `text-xs h-8 font-medium rounded-md
       bg-white/5 dark:bg-slate-800/50
       border border-white/10 dark:border-slate-600/30
       text-slate-400 dark:text-slate-400
       hover:bg-cyan-500/10 hover:border-cyan-500/30
       hover:text-slate-300 hover:shadow-[0_0_10px_rgba(6,182,212,0.1)]
       transition-all duration-150 ease-out active:scale-95`

  if (view === "list") {
    return (
      <div
        className="glass-card p-5 cursor-pointer group relative
          hover:-translate-y-[3px] hover:shadow-[0_8px_30px_rgba(20,184,166,0.15)] 
          hover:bg-card/60 hover:border-primary/40
          transition-all duration-150 ease-out"
        onClick={() => onClick(job)}
      >
        <div
          className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm ${getMatchScoreColor(job.matchScore)}`}
        >
          {job.matchScore}% match
        </div>

        <div className="flex items-center gap-6 pr-24">
          <div className="flex-1 min-w-0">
            <h3
              className="font-bold text-2xl text-foreground tracking-wide mb-2 
              group-hover:text-primary transition-colors duration-100 ease-out
              group-hover:[text-shadow:0_0_25px_rgba(20,184,166,0.4)]"
            >
              {job.title}
            </h3>
            <p className="text-sm text-muted-foreground/60 mb-3">{job.company}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground/50">
              <span>{job.location}</span>
              <span className="text-muted-foreground/20">|</span>
              <span className="text-foreground/70 font-medium">{formatSalary(job.salary.min, job.salary.max)}</span>
              <span className="text-muted-foreground/20">|</span>
              <span className="text-muted-foreground/40">{formatDate(job.postedDate)}</span>
              <Badge variant="outline" className={jobTypeColors[job.jobType]}>
                {job.jobType}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-4 h-[26px] overflow-hidden">
              {job.skills.slice(0, 5).map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="text-xs bg-secondary/50 hover:bg-secondary transition-colors duration-100 ease-out"
                >
                  {skill}
                </Badge>
              ))}
              {job.skills.length > 5 && (
                <Badge variant="secondary" className="text-xs">
                  +{job.skills.length - 5} more
                </Badge>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onSave(job.id)
              }}
              className={saveButtonClassesList}
            >
              {isSaved ? "Saved" : "Save"}
            </Button>
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onApply(job)
              }}
              className="bg-primary hover:bg-primary/90 text-xs h-8 transition-all duration-100 ease-out active:scale-95"
            >
              Apply
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="glass-card p-6 cursor-pointer group flex flex-col h-full relative
        hover:-translate-y-[3px] hover:shadow-[0_12px_35px_rgba(20,184,166,0.12)] 
        hover:bg-card/60 hover:border-primary/40
        transition-all duration-150 ease-out"
      onClick={() => onClick(job)}
    >
      <div
        className={`absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm ${getMatchScoreColor(job.matchScore)}`}
      >
        {job.matchScore}%
      </div>

      <h3
        className="font-bold text-2xl text-foreground tracking-wide text-center mt-2 mb-3 
        group-hover:text-primary transition-colors duration-100 ease-out
        group-hover:[text-shadow:0_0_25px_rgba(20,184,166,0.4)]"
      >
        {job.title}
      </h3>

      <p className="text-sm text-muted-foreground/55 text-center mb-4">{job.company}</p>

      <div className="space-y-1.5 text-sm text-center mb-4">
        <p className="text-muted-foreground/50">{job.location}</p>
        <p className="font-medium text-foreground/75">{formatSalary(job.salary.min, job.salary.max)}</p>
        <p className="text-xs text-muted-foreground/40">{formatDate(job.postedDate)}</p>
      </div>

      <div className="flex justify-center mb-4">
        <Badge variant="outline" className={jobTypeColors[job.jobType]}>
          {job.jobType}
        </Badge>
      </div>

      <div className="flex flex-wrap justify-center gap-1.5 mb-5 h-[52px] min-h-[52px] max-h-[52px] overflow-hidden content-start">
        {job.skills.slice(0, 4).map((skill) => (
          <Badge
            key={skill}
            variant="secondary"
            className="text-xs bg-secondary/50 hover:bg-secondary transition-colors duration-100 ease-out h-[22px]"
          >
            {skill}
          </Badge>
        ))}
        {job.skills.length > 4 && (
          <Badge variant="secondary" className="text-xs h-[22px]">
            +{job.skills.length - 4} more
          </Badge>
        )}
      </div>

      <div className="flex gap-2 mt-auto">
        <Button
          variant="ghost"
          size="sm"
          className={saveButtonClasses}
          onClick={(e) => {
            e.stopPropagation()
            onSave(job.id)
          }}
        >
          {isSaved ? "Saved" : "Save"}
        </Button>
        <Button
          size="sm"
          className="flex-1 bg-primary hover:bg-primary/90 h-9 transition-all duration-100 ease-out active:scale-95"
          onClick={(e) => {
            e.stopPropagation()
            onApply(job)
          }}
        >
          Apply
        </Button>
      </div>
    </div>
  )
}
