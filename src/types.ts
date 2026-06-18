export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "professional";
  phone: string;
  college?: string;
  yr?: string;
  dept?: string;
  company?: string;
  designation?: string;
  created_at?: string;
}

export interface ProjectRequest {
  id: string;
  user_email: string;
  name: string;
  email: string;
  phone: string;
  what_to_do: string;
  status: "pending" | "in_progress" | "done";
  ppt_url?: string;
  abstract_content?: string;
  rating?: number;
  feedback?: string;
  created_at: string;
}

export interface Innovation {
  id: string;
  title: string;
  tagline: string;
  category: "Agentic AI" | "Full-Stack Development" | "Web Development" | "Machine Learning" | "IoT & Automation" | "Hardware & Sensors";
  abstract: string;
  technologies: string[];
  metrics: string;
  demoUrl?: string;
  extraDemoUrl?: string;
}

export interface Achievement {
  id: string;
  title: string;
  value: string;
  description: string;
  date: string;
}

export const PREVIOUS_INNOVATIONS: Innovation[] = [
  {
    id: "inn-unified-ats",
    title: "Unified ATS - Automated Talent Intelligent Hub",
    tagline: "Live Academic Recruitment & Webinar Ecosystem",
    category: "Full-Stack Development",
    abstract: "Deployed live applicant tracking system delivering high-fidelity parsing, automated skill tracking, and collaborative event hosting modules. Highly successful real-world reference showcasing flawless cloud integrations and live responsive tools.",
    technologies: ["React", "FastAPI", "Python", "SQLite"],
    metrics: "Production Ready",
    demoUrl: "https://unifiedats.pythonanywhere.com",
    extraDemoUrl: "https://unifiedats-webinarhub.web.app/"
  },
  {
    id: "inn-blackbox-ai",
    title: "BLACKBOX-AI - Agentic Surveillance System",
    tagline: "Agentic Surveillance System",
    category: "Agentic AI",
    abstract: "Built real-time AI surveillance processing continuous video streams with multi-agent pipelines for detection, reasoning, and response. Automated incident analysis and timeline reconstruction; secured 3rd Place - KANAM'26 Project Expo.",
    technologies: ["Python", "FastAPI", "OpenCV", "AI/ML"],
    metrics: "3rd Place - KANAM'26"
  },
  {
    id: "inn-autodev-ai",
    title: "AutoDev AI - Autonomous Code Generator",
    tagline: "Autonomous Code Generator",
    category: "Agentic AI",
    abstract: "Engineered 6-agent architecture (plan, build, test, debug, deploy) automating complete software development lifecycle. Generated full-stack applications from prompts, reducing development effort by 80 percent.",
    technologies: ["Python", "FastAPI", "Multi-Agent AI", "APIs"],
    metrics: "-80% Dev Effort"
  },
  {
    id: "inn-smart-id",
    title: "Smart ID System - QR Access Control",
    tagline: "QR Access Control",
    category: "Web Development",
    abstract: "Developed secure QR-based authentication system enabling real-time identity verification. Designed scalable access control architecture; achieved Top 3 - ISRO Project Competition.",
    technologies: ["Python", "Flask", "QR Tech", "SQLite"],
    metrics: "Top 3 - ISRO"
  },
  {
    id: "inn-bionic-arm",
    title: "Bionic Arm - Sensor-Based Prosthetic",
    tagline: "Sensor-Based Prosthetic",
    category: "Hardware & Sensors",
    abstract: "Designed ESP32-based prosthetic arm with sensor-driven gesture recognition and actuation. Achieved real-time movement response; won 2nd Place - Intra-College Expo.",
    technologies: ["ESP32", "Arduino IDE", "Sensors"],
    metrics: "2nd Place - Expo"
  },
  {
    id: "inn-smart-parking",
    title: "Smart Parking System - IoT Automation",
    tagline: "IoT Automation",
    category: "IoT & Automation",
    abstract: "Built IoT parking system using ESP32 and IR sensors for real-time slot detection. Automated availability tracking; won 1st Place - National Level Symposium.",
    technologies: ["ESP32", "IR Sensors", "IoT"],
    metrics: "1st Place - National Sym."
  }
];

export const PUBLIC_ACHIEVEMENTS: Achievement[] = [
  {
    id: "ach-1",
    title: "Elite Tech Deliveries",
    value: "50+ Projects",
    description: "Successfully supported final year computer science and engineering students in launching high-fidelity systems globally.",
    date: "A.Y. 2025 - 2026"
  },
  {
    id: "ach-2",
    title: "Agentic AI Excellence Award",
    value: "🏆 National Champion",
    description: "Ranked first place in the Autonomous Agents Tech Summit for our innovative multi-agent container self-healing mesh.",
    date: "March 2026"
  },
  {
    id: "ach-3",
    title: "IEEE Publications Authored",
    value: "45+ Papers",
    description: "Helped student teams write and document compliant research and custom innovations accepted into core journals.",
    date: "Ongoing"
  },
  {
    id: "ach-4",
    title: "Total Mentorship Hours",
    value: "10,000+ Hrs",
    description: "Dedicated full developer mentorship support, assisting from initial planning to live production deployments.",
    date: "Cumulative"
  }
];
