"use client"

import React from "react";
import Image from "next/image"; // Import next/image
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // Assuming Badge is used, if not remove.
import { Card, CardContent } from "@/components/ui/card";
import { BookmarkIcon, MapPin, DollarSign, Building } from "lucide-react";

// Define JobType based on the structure in jobs/page.tsx
// This should be defined in a shared types file ideally, e.g., "@/types/index.ts"
// For now, defining it locally for the component.
interface JobType {
  id: number | string;
  title: string;
  company: string;
  logo: string;
  location: string;
  salary: string;
  type: string;
  remote: string;
  posted: string;
  description: string;
  skills: string[];
}

interface JobCardProps {
  job: JobType;
  onClick: (job: JobType) => void; // Keep original job type for now
  onBookmark: (jobId: number | string) => void; // Example bookmark handler
}

// Function to determine remote color, moved from jobs/page.tsx
const getRemoteColor = (remote: string) => {
  switch (remote) {
    case "Remote":
      return "bg-green-100 text-green-700";
    case "Hybrid":
      return "bg-blue-100 text-blue-700";
    case "On-site":
      return "bg-red-100 text-red-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

const JobCard: React.FC<JobCardProps> = ({ job, onClick, onBookmark }) => {
  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent Card's onClick from firing
    onBookmark(job.id);
    // console.log("Bookmark clicked for job:", job.id); // Placeholder
  };

  return (
    <Card
      className="border-slate-200 hover:shadow-lg hover:border-primary-navy/30 transition-all duration-200 group cursor-pointer"
      onClick={() => onClick(job)}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-start space-x-4 mb-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0 relative"> {/* Added relative for NextImage fill */}
                <Image
                  src={job.logo}
                  alt={`${job.company} logo`}
                  fill // Use fill
                  sizes="64px" // Provide sizes attribute for optimization with fill
                  className="object-cover" // Ensure image covers the area
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-heading text-primary-navy group-hover:text-primary-navy transition-colors line-clamp-1">
                  {job.title}
                </h3>
                <div className="flex items-center space-x-3 text-slate-600 mt-1 text-base">
                  <div className="flex items-center space-x-1">
                    <Building className="h-4 w-4" />
                    <span className="font-subheading truncate">{job.company}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span className="font-subheading truncate">{job.location}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {job.skills.slice(0, 4).map((skill, index) => (
                // Using skill as key if unique, otherwise index is fallback but less ideal
                <span
                  key={skill || index}
                  className={`px-3 py-1 rounded-full text-sm font-subheading ${
                    skill.includes('+') || skill.includes('years')
                      ? 'bg-primary-navy/10 text-primary-navy'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {skill}
                </span>
              ))}
              {job.skills.length > 4 && (
                <span className="px-3 py-1 rounded-full text-sm font-subheading bg-slate-100 text-slate-700">
                  +{job.skills.length - 4} more
                </span>
              )}
            </div>

            <p className="text-slate-600 font-subheading leading-relaxed mb-4 text-base line-clamp-3">
              {job.description}
            </p>

            <div className="flex items-center justify-between text-base">
              <div className="flex items-center space-x-4 text-slate-500">
                <div className="flex items-center space-x-1">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-subheading">{job.salary}</span>
                </div>
                <span className="font-subheading">{job.type}</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-subheading ${getRemoteColor(
                    job.remote
                  )}`}
                >
                  {job.remote}
                </span>
              </div>
              <span className="text-sm text-slate-400 font-subheading">
                Posted {job.posted}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-400 hover:text-primary-navy hover:bg-primary-navy/5 rounded-full flex-shrink-0"
            onClick={handleBookmarkClick}
            aria-label="Bookmark job"
          >
            <BookmarkIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default React.memo(JobCard);
