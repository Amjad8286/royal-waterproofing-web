import type { TeamMember } from "@/types/content";

/**
 * PLACEHOLDER TEAM. Roles only — add real names, a line about each person and
 * (optionally) real photos. Never use stock photos of people as your staff.
 */
export const team: TeamMember[] = [
  {
    id: "director",
    name: "Name to be added",
    role: "Founder & Managing Director",
    bio: "Leads major projects and signs off every warranty.",
    initials: "MD",
    placeholder: true,
  },
  {
    id: "technical",
    name: "Name to be added",
    role: "Technical Manager",
    bio: "Diagnoses problems, specifies systems and checks quality on site.",
    initials: "TM",
    placeholder: true,
  },
  {
    id: "supervisor",
    name: "Name to be added",
    role: "Site Supervisor",
    bio: "Runs the crew day to day and is your contact on site.",
    initials: "SS",
    placeholder: true,
  },
  {
    id: "coordinator",
    name: "Name to be added",
    role: "Customer Coordinator",
    bio: "Books inspections, keeps you updated and handles the paperwork.",
    initials: "CC",
    placeholder: true,
  },
];
