"use client"

import type React from "react"

import {
  X,
  MapPin,
  Clock,
  Building,
  Users,
  Send,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  DollarSign,
  BadgeCheck,
  Timer,
  Shuffle,
  Wifi,
  Hash,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MatchScoreRing } from "./match-score-ring"
import type { Job } from "@/lib/job-data"

interface JobDetailModalProps {
  job: Job | null
  isOpen: boolean
  onClose: () => void
  isSaved: boolean
  onSave: (id: string) => void
  onApply: (job: Job) => void
}

function formatSalary(min: number, max: number) {
  const format = (n: number) => `$${(n / 1000).toFixed(0)}k`
  return `${format(min)} - ${format(max)}`
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

const jobTypeIcons: Record<Job["jobType"], React.ReactNode> = {
  "Full-time": <BadgeCheck className="w-3.5 h-3.5" />,
  "Part-time": <Timer className="w-3.5 h-3.5" />,
  Remote: <Wifi className="w-3.5 h-3.5" />,
  Hybrid: <Shuffle className="w-3.5 h-3.5" />,
}

const jobTypeColors: Record<Job["jobType"], string> = {
  "Full-time": "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  "Part-time": "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30",
  Remote: "bg-primary/20 text-primary border-primary/30",
  Hybrid: "bg-accent/20 text-accent-foreground border-accent/30",
}

export function JobDetailModal({ job, isOpen, onClose, isSaved, onSave, onApply }: JobDetailModalProps) {
  if (!isOpen || !job) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-card w-full max-w-2xl max-h-[90vh] overflow-auto animate-in fade-in zoom-in-95 duration-300">
        <div className="sticky top-0 glass p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-lg">Job Details</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <img
              src={job.logo || "/placeholder.svg"}
              alt={`${job.company} logo`}
              className="w-16 h-16 rounded-xl object-cover bg-muted"
            />
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground mb-1">{job.title}</h1>
              <p className="text-muted-foreground flex items-center gap-1">
                <Building className="w-4 h-4" />
                {job.company}
              </p>
            </div>
            <MatchScoreRing score={job.matchScore} size={64} />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="glass-card p-3">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <MapPin className="w-4 h-4" />
                Location
              </div>
              <p className="font-medium">{job.location}</p>
            </div>
            <div className="glass-card p-3">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <DollarSign className="w-4 h-4" />
                Salary
              </div>
              <p className="font-medium">{formatSalary(job.salary.min, job.salary.max)}</p>
            </div>
            <div className="glass-card p-3">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <Users className="w-4 h-4" />
                Experience
              </div>
              <p className="font-medium">{job.experience}+ years</p>
            </div>
            <div className="glass-card p-3">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <Clock className="w-4 h-4" />
                Posted
              </div>
              <p className="font-medium">{formatDate(job.postedDate)}</p>
            </div>
          </div>

          <div className="mb-6">
            <Badge variant="outline" className={`${jobTypeColors[job.jobType]} mb-4 flex items-center gap-1 w-fit`}>
              {jobTypeIcons[job.jobType]}
              {job.jobType}
            </Badge>
            <h3 className="font-semibold mb-2">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="bg-secondary/50 flex items-center gap-1">
                  <Hash className="w-3 h-3 opacity-50" />
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">About This Role</h3>
            <p className="text-muted-foreground leading-relaxed">{job.description}</p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              Join {job.company} as a {job.title} and be part of an innovative team pushing the boundaries of
              technology. You will work on challenging projects, collaborate with talented colleagues, and have
              opportunities for professional growth.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 glass hover:neon-border bg-transparent"
              onClick={() => onSave(job.id)}
            >
              {isSaved ? (
                <BookmarkCheck className="w-4 h-4 mr-2 text-primary" />
              ) : (
                <Bookmark className="w-4 h-4 mr-2" />
              )}
              {isSaved ? "Saved" : "Save Job"}
            </Button>
            <Button className="flex-1 bg-primary hover:bg-primary/90" onClick={() => onApply(job)}>
              <Send className="w-4 h-4 mr-2" />
              Apply Now
            </Button>
            <Button variant="outline" className="glass hover:neon-border bg-transparent">
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
