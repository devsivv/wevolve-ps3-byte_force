"use client"

import { useState, useMemo, useEffect, useCallback, useRef } from "react"
import { Search, LayoutGrid, List, SlidersHorizontal, X, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { JobCard } from "./job-card"
import { FilterPanel, type Filters } from "./filter-panel"
import { JobDetailModal } from "./job-detail-modal"
import { JobCardSkeleton } from "./job-skeleton"
import { ThemeToggle } from "./theme-toggle"
import { mockJobs, type Job } from "@/lib/job-data"
import { useIsMobile } from "@/hooks/use-mobile"

type SortOption = "match" | "salary" | "date" | "experience"

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "match", label: "Match Score" },
  { value: "salary", label: "Salary" },
  { value: "date", label: "Date Posted" },
  { value: "experience", label: "Experience" },
]

const ITEMS_PER_PAGE = 12

export function JobDashboard() {
  const isMobile = useIsMobile()
  const [view, setView] = useState<"grid" | "list">("grid")
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [sort, setSort] = useState<SortOption>("match")
  const [filters, setFilters] = useState<Filters>({
    locations: [],
    experience: [0, 10],
    salary: [0, 250000],
    skills: [],
    jobTypes: [],
    postedDate: "any",
  })
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set())
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem("savedJobs")
    if (saved) {
      setSavedJobs(new Set(JSON.parse(saved)))
    }
    setTimeout(() => setIsLoading(false), 800)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const handleSaveJob = useCallback((id: string) => {
    setSavedJobs((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      localStorage.setItem("savedJobs", JSON.stringify([...newSet]))
      return newSet
    })
  }, [])

  const handleApply = useCallback((job: Job) => {
    alert(`Application submitted for ${job.title} at ${job.company}!`)
  }, [])

  const filteredJobs = useMemo(() => {
    let result = [...mockJobs]

    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase()
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(searchLower) ||
          job.company.toLowerCase().includes(searchLower) ||
          job.description.toLowerCase().includes(searchLower),
      )
    }

    if (filters.locations.length > 0) {
      result = result.filter((job) => filters.locations.includes(job.location))
    }

    result = result.filter((job) => job.experience >= filters.experience[0] && job.experience <= filters.experience[1])

    result = result.filter((job) => job.salary.min >= filters.salary[0] && job.salary.max <= filters.salary[1])

    if (filters.skills.length > 0) {
      result = result.filter((job) => filters.skills.some((skill) => job.skills.includes(skill)))
    }

    if (filters.jobTypes.length > 0) {
      result = result.filter((job) => filters.jobTypes.includes(job.jobType))
    }

    if (filters.postedDate !== "any") {
      const now = new Date()
      const cutoff = new Date()
      if (filters.postedDate === "24h") {
        cutoff.setDate(now.getDate() - 1)
      } else if (filters.postedDate === "week") {
        cutoff.setDate(now.getDate() - 7)
      } else if (filters.postedDate === "month") {
        cutoff.setMonth(now.getMonth() - 1)
      }
      result = result.filter((job) => job.postedDate >= cutoff)
    }

    result.sort((a, b) => {
      switch (sort) {
        case "match":
          return b.matchScore - a.matchScore
        case "salary":
          return b.salary.max - a.salary.max
        case "date":
          return b.postedDate.getTime() - a.postedDate.getTime()
        case "experience":
          return a.experience - b.experience
        default:
          return 0
      }
    })

    return result
  }, [debouncedSearch, filters, sort])

  const visibleJobs = filteredJobs.slice(0, visibleCount)
  const hasMore = visibleCount < filteredJobs.length

  useEffect(() => {
    const loadMoreElement = loadMoreRef.current
    if (!loadMoreElement) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && hasMore && !isLoadingMore && !isLoading) {
          setIsLoadingMore(true)
          requestAnimationFrame(() => {
            setVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, filteredJobs.length))
            setIsLoadingMore(false)
          })
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0,
      },
    )

    observer.observe(loadMoreElement)

    return () => {
      observer.disconnect()
    }
  }, [hasMore, isLoadingMore, isLoading, filteredJobs.length])

  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE)
  }, [debouncedSearch, filters, sort])

  const activeFilterCount =
    filters.locations.length +
    filters.skills.length +
    filters.jobTypes.length +
    (filters.experience[0] > 0 || filters.experience[1] < 10 ? 1 : 0) +
    (filters.salary[0] > 0 || filters.salary[1] < 250000 ? 1 : 0) +
    (filters.postedDate !== "any" ? 1 : 0)

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 glass border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Job<span className="text-primary">Finder</span>
              </h1>
              <p className="text-sm text-muted-foreground">Discover your perfect opportunity</p>
            </div>
            <ThemeToggle />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search jobs, companies, or keywords..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 glass transition-all duration-100 ease-out focus:ring-2"
              />
              {search && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 transition-colors duration-100 ease-out"
                  onClick={() => setSearch("")}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              {isMobile && (
                <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      className="glass relative bg-transparent transition-all duration-100 ease-out active:scale-95"
                    >
                      <SlidersHorizontal className="w-4 h-4 mr-2" />
                      Filters
                      {activeFilterCount > 0 && (
                        <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-primary text-primary-foreground">
                          {activeFilterCount}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 p-0">
                    <FilterPanel
                      filters={filters}
                      onChange={setFilters}
                      onClose={() => setFilterSheetOpen(false)}
                      isMobile
                    />
                  </SheetContent>
                </Sheet>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="glass bg-transparent transition-all duration-100 ease-out active:scale-95"
                  >
                    <ArrowUpDown className="w-4 h-4 mr-2" />
                    Sort: {sortOptions.find((s) => s.value === sort)?.label}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass-card">
                  {sortOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => setSort(option.value)}
                      className={`transition-colors duration-100 ease-out ${sort === option.value ? "text-primary" : ""}`}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="flex glass-card p-1 gap-1">
                <Button
                  variant={view === "grid" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setView("grid")}
                  className={`transition-all duration-100 ease-out ${view === "grid" ? "bg-primary" : ""}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button
                  variant={view === "list" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setView("list")}
                  className={`transition-all duration-100 ease-out ${view === "list" ? "bg-primary" : ""}`}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {!isMobile && (
            <aside className="w-72 shrink-0 sticky top-32 h-fit">
              <FilterPanel filters={filters} onChange={setFilters} />
            </aside>
          )}

          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium text-foreground">{visibleJobs.length}</span> of{" "}
                <span className="font-medium text-foreground">{filteredJobs.length}</span> jobs
              </p>
              {savedJobs.size > 0 && (
                <Badge variant="secondary" className="glass">
                  {savedJobs.size} saved
                </Badge>
              )}
            </div>

            {isLoading ? (
              <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" : "space-y-4"}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <JobCardSkeleton key={i} view={view} />
                ))}
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <p className="text-muted-foreground mb-4">No jobs found matching your criteria</p>
                <Button
                  variant="outline"
                  className="transition-all duration-100 ease-out active:scale-95 bg-transparent"
                  onClick={() =>
                    setFilters({
                      locations: [],
                      experience: [0, 10],
                      salary: [0, 250000],
                      skills: [],
                      jobTypes: [],
                      postedDate: "any",
                    })
                  }
                >
                  Clear all filters
                </Button>
              </div>
            ) : (
              <>
                <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" : "space-y-4"}>
                  {visibleJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      view={view}
                      isSaved={savedJobs.has(job.id)}
                      onSave={handleSaveJob}
                      onApply={handleApply}
                      onClick={setSelectedJob}
                    />
                  ))}
                </div>

                {hasMore && (
                  <>
                    {isLoadingMore && (
                      <div
                        className={`mt-4 ${view === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" : "space-y-4"}`}
                      >
                        {Array.from({ length: view === "grid" ? 3 : 2 }).map((_, i) => (
                          <JobCardSkeleton key={`loading-${i}`} view={view} />
                        ))}
                      </div>
                    )}
                    <div ref={loadMoreRef} className="h-1 w-full" aria-hidden="true" />
                  </>
                )}

                {!hasMore && filteredJobs.length > ITEMS_PER_PAGE && (
                  <p className="text-center text-sm text-muted-foreground mt-8">
                    You've reached the end of the results
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <JobDetailModal
        job={selectedJob}
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        isSaved={selectedJob ? savedJobs.has(selectedJob.id) : false}
        onSave={handleSaveJob}
        onApply={handleApply}
      />
    </div>
  )
}
