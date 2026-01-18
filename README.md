# HireSphere Discover

A modern, responsive job discovery interface built with React and Next.js, featuring advanced filtering, real-time search, and personalized match scores.

## Features

### Core Features
- **Job Cards Display**
  - Grid/List view toggle
  - Cards show: Title, company, location, salary, skill tags, match score (visual ring/badge)
  - "Save" and "Apply" buttons with state management

- **Smart Filter Panel**
  - Location (multi-select)
  - Experience (0-10 year slider)
  - Salary range (dual-handle slider)
  - Skills (searchable multi-select with tags)
  - Job type (Full-time, Remote, Hybrid, Part-time)
  - Posted date (24hrs, Week, Month)

- **Search & Sort**
  - Real-time search (title, company, description)
  - Sort: Match score (default), Salary, Date, Experience
  - Debounced search implementation

- **Responsive Design**
  - Mobile-friendly
  - Collapsible filter drawer on mobile
  - Touch-friendly interactions

### Bonus Features
- LocalStorage for "Saved Jobs"
- Infinite scroll/pagination
- Job details modal
- Filter presets ("Remote Jobs", "High Salary")
- Skeleton loading states
- Dark/Light mode toggle

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Theme**: next-themes

## Design

- Glassmorphism aesthetic with frosted semi-transparent cards
- Deep navy/teal dark mode with cyan/teal neon accents
- Light mode with soft neutral backgrounds
- Smooth micro-animations (100-150ms transitions)
- Editorial typography with clear visual hierarchy

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/devsivv/job-discovery-dashboard.git
cd job-discovery-dashboard
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/
│   ├── globals.css        # Global styles and Tailwind config
│   ├── layout.tsx         # Root layout with theme provider
│   └── page.tsx           # Main page component
├── components/
│   ├── job-card.tsx       # Individual job card component
│   ├── job-dashboard.tsx  # Main dashboard with search, filters, grid
│   ├── job-detail-modal.tsx # Job details modal
│   ├── job-skeleton.tsx   # Loading skeleton component
│   ├── filter-panel.tsx   # Smart filter panel
│   ├── match-score-ring.tsx # Circular match score indicator
│   ├── theme-toggle.tsx   # Dark/Light mode toggle
│   └── theme-provider.tsx # Theme context provider
├── lib/
│   └── job-data.ts        # Mock data with 50+ job listings
└── README.md
```

## Mock Data

The project includes 50+ mock job listings with:
- Job titles across various tech roles
- Companies (FAANG, startups, enterprises)
- Locations (major tech hubs)
- Salary ranges ($60K - $300K+)
- Skills (React, Python, AWS, etc.)
- Match scores (randomly generated 60-98%)
- Job types and experience levels

## Screenshots

### Dark Mode
- Glassmorphism cards with neon accents
- Animated match score rings
- Premium hover effects

### Light Mode
- Clean, minimal aesthetic
- Soft shadows and borders
- High contrast text

---

## Team Members

| Name | GitHub |
|------|--------|
| **Shivam Dubey** | [GitHub Profile](https://github.com/devsivv) |
| **Dhrutabrata Biswal** | [GitHub Profile](https://github.com/Dhruta25) |
| **Saloni Sahoo** | [GitHub Profile](https://github.com/saloni259) |

---

Built by **Byte_Force** team at **January Cohort, NIT Rourkela**
