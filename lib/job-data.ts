// Mock job data
export interface Job {
  id: string
  title: string
  company: string
  location: string
  salary: { min: number; max: number }
  skills: string[]
  matchScore: number
  jobType: "Full-time" | "Part-time" | "Remote" | "Hybrid"
  postedDate: Date
  experience: number
  description: string
  logo: string
}

const companies = [
  "TechCorp",
  "InnovateLab",
  "DataFlow",
  "CloudNine",
  "PixelPerfect",
  "CodeCraft",
  "ByteWise",
  "QuantumLeap",
  "SynergyTech",
  "FutureSoft",
  "NexGen",
  "CyberPulse",
  "Streamline",
  "Elevate",
  "Velocity",
  "Catalyst",
  "Horizon",
  "Apex",
  "Zenith",
  "Momentum",
]

const titles = [
  "Senior Frontend Developer",
  "Full Stack Engineer",
  "React Developer",
  "Backend Engineer",
  "DevOps Engineer",
  "Data Scientist",
  "UX Designer",
  "Product Manager",
  "Machine Learning Engineer",
  "Cloud Architect",
  "Mobile Developer",
  "Security Engineer",
  "QA Engineer",
  "Tech Lead",
  "Software Architect",
  "UI Developer",
  "Node.js Developer",
  "Python Developer",
  "Java Developer",
  "Go Developer",
]

const locations = [
  "San Francisco, CA",
  "New York, NY",
  "Seattle, WA",
  "Austin, TX",
  "Boston, MA",
  "Denver, CO",
  "Chicago, IL",
  "Los Angeles, CA",
  "Miami, FL",
  "Portland, OR",
  "Remote",
  "Atlanta, GA",
]

const allSkills = [
  "React",
  "TypeScript",
  "Node.js",
  "Python",
  "AWS",
  "Docker",
  "Kubernetes",
  "GraphQL",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "Go",
  "Java",
  "Rust",
  "Next.js",
  "Vue.js",
  "Angular",
  "Tailwind CSS",
  "Figma",
  "Git",
]

const jobTypes: Job["jobType"][] = ["Full-time", "Part-time", "Remote", "Hybrid"]

function randomFromArray<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomSkills(): string[] {
  const count = Math.floor(Math.random() * 4) + 2
  const shuffled = [...allSkills].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

function randomSalary(): { min: number; max: number } {
  const base = Math.floor(Math.random() * 100 + 60) * 1000
  return { min: base, max: base + Math.floor(Math.random() * 50 + 20) * 1000 }
}

function randomDate(): Date {
  const now = new Date()
  const daysAgo = Math.floor(Math.random() * 30)
  return new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
}

export function generateJobs(count = 55): Job[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `job-${i + 1}`,
    title: randomFromArray(titles),
    company: randomFromArray(companies),
    location: randomFromArray(locations),
    salary: randomSalary(),
    skills: randomSkills(),
    matchScore: Math.floor(Math.random() * 39) + 60, // 60-98%
    jobType: randomFromArray(jobTypes),
    postedDate: randomDate(),
    experience: Math.floor(Math.random() * 10),
    description: `We are looking for a talented professional to join our team. This role offers exciting opportunities for growth and innovation in a dynamic environment.`,
    logo: `/placeholder.svg?height=48&width=48&query=${randomFromArray(companies)} tech company logo`,
  }))
}

export const mockJobs = generateJobs(55)

export const uniqueLocations = [...new Set(mockJobs.map((j) => j.location))]
export const uniqueSkills = allSkills
