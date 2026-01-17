"use client"

import { useState } from "react"
import {
  X,
  ChevronDown,
  Filter,
  Sparkles,
  MapPin,
  Clock,
  DollarSign,
  Code,
  Briefcase,
  CalendarDays,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { uniqueLocations, uniqueSkills } from "@/lib/job-data"

export interface Filters {
  locations: string[]
  experience: [number, number]
  salary: [number, number]
  skills: string[]
  jobTypes: string[]
  postedDate: string
}

interface FilterPanelProps {
  filters: Filters
  onChange: (filters: Filters) => void
  onClose?: () => void
  isMobile?: boolean
}

const jobTypeOptions = ["Full-time", "Part-time", "Remote", "Hybrid"]
const postedDateOptions = [
  { label: "Any time", value: "any" },
  { label: "Past 24 hours", value: "24h" },
  { label: "Past week", value: "week" },
  { label: "Past month", value: "month" },
]

const presets = [
  { label: "Remote Jobs", filters: { jobTypes: ["Remote"] } },
  { label: "High Salary", filters: { salary: [150000, 250000] as [number, number] } },
]

export function FilterPanel({ filters, onChange, onClose, isMobile }: FilterPanelProps) {
  const [skillSearch, setSkillSearch] = useState("")
  const [openSections, setOpenSections] = useState({
    location: true,
    experience: true,
    salary: true,
    skills: true,
    jobType: true,
    postedDate: true,
  })

  const filteredSkills = uniqueSkills.filter((s) => s.toLowerCase().includes(skillSearch.toLowerCase()))

  const toggleLocation = (loc: string) => {
    const newLocations = filters.locations.includes(loc)
      ? filters.locations.filter((l) => l !== loc)
      : [...filters.locations, loc]
    onChange({ ...filters, locations: newLocations })
  }

  const toggleSkill = (skill: string) => {
    const newSkills = filters.skills.includes(skill)
      ? filters.skills.filter((s) => s !== skill)
      : [...filters.skills, skill]
    onChange({ ...filters, skills: newSkills })
  }

  const toggleJobType = (type: string) => {
    const newTypes = filters.jobTypes.includes(type)
      ? filters.jobTypes.filter((t) => t !== type)
      : [...filters.jobTypes, type]
    onChange({ ...filters, jobTypes: newTypes })
  }

  const applyPreset = (preset: (typeof presets)[0]) => {
    onChange({ ...filters, ...preset.filters })
  }

  const clearAll = () => {
    onChange({
      locations: [],
      experience: [0, 10],
      salary: [0, 250000],
      skills: [],
      jobTypes: [],
      postedDate: "any",
    })
  }

  const hasActiveFilters =
    filters.locations.length > 0 ||
    filters.skills.length > 0 ||
    filters.jobTypes.length > 0 ||
    filters.experience[0] > 0 ||
    filters.experience[1] < 10 ||
    filters.salary[0] > 0 ||
    filters.salary[1] < 250000 ||
    filters.postedDate !== "any"

  return (
    <div className={`glass-card p-4 ${isMobile ? "h-full overflow-auto" : ""}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-foreground">Filters</h2>
        </div>
        {isMobile && onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="transition-colors duration-100 ease-out">
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Presets */}
      <div className="mb-4">
        <Label className="text-xs text-muted-foreground mb-2 block">Quick Presets</Label>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <Button
              key={preset.label}
              variant="outline"
              size="sm"
              className="text-xs glass hover:neon-border bg-transparent transition-all duration-100 ease-out active:scale-95"
              onClick={() => applyPreset(preset)}
            >
              <Sparkles className="w-3 h-3 mr-1" />
              {preset.label}
            </Button>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAll}
          className="text-destructive hover:text-destructive/90 mb-4 w-full transition-colors duration-100 ease-out"
        >
          Clear all filters
        </Button>
      )}

      <div className="space-y-4">
        {/* Location */}
        <Collapsible
          open={openSections.location}
          onOpenChange={(open) => setOpenSections((s) => ({ ...s, location: open }))}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium transition-colors duration-100 ease-out hover:text-primary">
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              Location
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-100 ease-out ${openSections.location ? "rotate-180" : ""}`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 space-y-2">
            {uniqueLocations.map((loc) => (
              <label
                key={loc}
                className="flex items-center gap-2 cursor-pointer transition-colors duration-100 ease-out hover:text-foreground"
              >
                <Checkbox checked={filters.locations.includes(loc)} onCheckedChange={() => toggleLocation(loc)} />
                <span className="text-sm">{loc}</span>
              </label>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Experience */}
        <Collapsible
          open={openSections.experience}
          onOpenChange={(open) => setOpenSections((s) => ({ ...s, experience: open }))}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium transition-colors duration-100 ease-out hover:text-primary">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              Experience (years)
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-100 ease-out ${openSections.experience ? "rotate-180" : ""}`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4 px-1">
            <Slider
              value={filters.experience}
              min={0}
              max={10}
              step={1}
              onValueChange={(value) => onChange({ ...filters, experience: value as [number, number] })}
              className="mb-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{filters.experience[0]} years</span>
              <span>{filters.experience[1]}+ years</span>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Salary */}
        <Collapsible
          open={openSections.salary}
          onOpenChange={(open) => setOpenSections((s) => ({ ...s, salary: open }))}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium transition-colors duration-100 ease-out hover:text-primary">
            <span className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              Salary Range
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-100 ease-out ${openSections.salary ? "rotate-180" : ""}`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4 px-1">
            <Slider
              value={filters.salary}
              min={0}
              max={250000}
              step={10000}
              onValueChange={(value) => onChange({ ...filters, salary: value as [number, number] })}
              className="mb-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>${(filters.salary[0] / 1000).toFixed(0)}k</span>
              <span>${(filters.salary[1] / 1000).toFixed(0)}k</span>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Skills */}
        <Collapsible
          open={openSections.skills}
          onOpenChange={(open) => setOpenSections((s) => ({ ...s, skills: open }))}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium transition-colors duration-100 ease-out hover:text-primary">
            <span className="flex items-center gap-2">
              <Code className="w-4 h-4 text-muted-foreground" />
              Skills
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-100 ease-out ${openSections.skills ? "rotate-180" : ""}`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 space-y-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search skills..."
                value={skillSearch}
                onChange={(e) => setSkillSearch(e.target.value)}
                className="glass text-sm pl-8 transition-all duration-100 ease-out focus:ring-2"
              />
            </div>
            {filters.skills.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {filters.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="default"
                    className="cursor-pointer bg-primary/20 text-primary hover:bg-primary/30 transition-colors duration-100 ease-out"
                    onClick={() => toggleSkill(skill)}
                  >
                    {skill}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}
            <div className="max-h-32 overflow-y-auto space-y-1">
              {filteredSkills.map((skill) => (
                <label
                  key={skill}
                  className="flex items-center gap-2 cursor-pointer transition-colors duration-100 ease-out hover:text-foreground"
                >
                  <Checkbox checked={filters.skills.includes(skill)} onCheckedChange={() => toggleSkill(skill)} />
                  <span className="text-sm">{skill}</span>
                </label>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Job Type */}
        <Collapsible
          open={openSections.jobType}
          onOpenChange={(open) => setOpenSections((s) => ({ ...s, jobType: open }))}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium transition-colors duration-100 ease-out hover:text-primary">
            <span className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-muted-foreground" />
              Job Type
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-100 ease-out ${openSections.jobType ? "rotate-180" : ""}`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 space-y-2">
            {jobTypeOptions.map((type) => (
              <label
                key={type}
                className="flex items-center gap-2 cursor-pointer transition-colors duration-100 ease-out hover:text-foreground"
              >
                <Checkbox checked={filters.jobTypes.includes(type)} onCheckedChange={() => toggleJobType(type)} />
                <span className="text-sm">{type}</span>
              </label>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Posted Date */}
        <Collapsible
          open={openSections.postedDate}
          onOpenChange={(open) => setOpenSections((s) => ({ ...s, postedDate: open }))}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium transition-colors duration-100 ease-out hover:text-primary">
            <span className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-muted-foreground" />
              Posted Date
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-100 ease-out ${openSections.postedDate ? "rotate-180" : ""}`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 space-y-2">
            {postedDateOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 cursor-pointer transition-colors duration-100 ease-out hover:text-foreground"
              >
                <input
                  type="radio"
                  name="postedDate"
                  checked={filters.postedDate === option.value}
                  onChange={() => onChange({ ...filters, postedDate: option.value })}
                  className="accent-primary"
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  )
}
