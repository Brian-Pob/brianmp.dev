// Local type for build-time type checking
export type Experience = {
  title: string;
  company: string;
  dateLabel: string;
  dateTime: string;
  tech: string[];
  bullets: string[];
};

export const experiences: Experience[] = [
  {
    title: "Front End Engineer",
    company: "Amazon Finance Automation",
    dateLabel: "June 2025 — Present",
    dateTime: "2025-06",
    tech: ["TypeScript", "React", "Cypress", "Jest", "AWS"],
    bullets: [
      "Collaborated with cross-timezone teams to build and update an internal email application used by financial analysts across the globe.",
      "Parallelized Cypress end-to-end tests for a micro-frontend React app, cutting runtime by ~50% and improving developer feedback loops.",
      "Implemented lazy-loading for a React micro-frontend to reduce perceived load time by 400ms and improve LCP metrics.",
    ],
  },
  {
    title: "Front End Engineer",
    company: "National High Magnetic Field Laboratory",
    dateLabel: "May 2024 — July 2024",
    dateTime: "2024-05",
    tech: ["Python", "Qt (PyQt)", "Desktop UIs"],
    bullets: [
      "Built modern data-visualization tools for mass spectrometry analysis.",
      "Integrated open-source Python libraries into a cross-platform PyQt desktop app (macOS &amp; Windows).",
      "Partnered with scientists and engineers to design a usable interface that sped up mass-spectrometry research workflows.",
    ],
  },
  {
    title: "Research Assistant",
    company: "FSU Dept. of Computer Science",
    dateLabel: "May 2023 — Dec 2024",
    dateTime: "2023-05",
    tech: ["C#", "Visual Studio", "User Research", "Documentation"],
    bullets: [
      "Researched traffic monitoring systems for the Florida Department of Transportation (FDOT).",
      "Identified usability pain points and optimised data-analysis flows to reduce friction for researchers and analysts.",
    ],
  },
  {
    title: "Web Developer",
    company: "Venerate Agency",
    dateLabel: "Mar 2022 — May 2023",
    dateTime: "2022-03",
    tech: ["JavaScript", "TypeScript", "React", "SCSS", "Accessibility"],
    bullets: [
      "Improved customer engagement and conversion for clients including <strong>The Gap</strong> and <strong>Old Navy</strong> by building maintainable React components.",
      "Maintained component libraries and ensured code quality and readability across multiple client projects.",
      "Implemented accessibility features (keyboard navigation, screen-reader support) to help sites meet ADA guidelines.",
    ],
  },
];
