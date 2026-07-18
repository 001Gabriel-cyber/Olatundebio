export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: "Support" | "Web" | "Troubleshoot" | "Coding" | "Desktop" | "EdTech";
}

export interface SkillItem {
  name: string;
  percentage: number;
}

export interface BiodataItem {
  label: string;
  value: string;
}

export interface ExperienceItem {
  id: string;
  period: string;
  role: string;
  organization: string;
  description: string;
}

export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Skills", href: "#skills" },
  { label: "Biodata", href: "#biodata" },
  { label: "Experience", href: "#experience" },
  { label: "Gallery", href: "#gallery" },
  { label: "Certifications", href: "#certifications" },
  { label: "Contact", href: "#contact" }
];

export const SERVICES: ServiceItem[] = [
  {
    id: "systems-support",
    title: "Computer Systems Support",
    description: "End-to-end hardware installations, enterprise software configurations, and preventive maintenance routines to guarantee peak performance.",
    iconName: "Support"
  },
  {
    id: "web-design",
    title: "Web Design",
    description: "Designing fast, responsive, and visually compelling web interfaces customized to showcase branding and maximize user engagement.",
    iconName: "Web"
  },
  {
    id: "troubleshooting",
    title: "Hardware & Software Troubleshooting",
    description: "Rapid, expert diagnostics and repairs for desktops, laptops, network appliances, OS environments, and utility software suites.",
    iconName: "Troubleshoot"
  },
  {
    id: "coding-instruction",
    title: "Coding Instruction",
    description: "Practical coding lessons in Python, HTML, and CSS structured for young minds, academic students, and career changers.",
    iconName: "Coding"
  },
  {
    id: "desktop-publishing",
    title: "Desktop Publishing",
    description: "Professional digital graphic layout, publication design, flyer typesetting, and formatting for high-impact print or digital media.",
    iconName: "Desktop"
  },
  {
    id: "edtech-integration",
    title: "Educational Technology",
    description: "Integrating modern learning management systems (LMS), digital tools, and technical curricula into schools for digital-first classrooms.",
    iconName: "EdTech"
  }
];

export const SKILLS: SkillItem[] = [
  { name: "HTML & CSS", percentage: 95 },
  { name: "Web Design", percentage: 90 },
  { name: "Computer Troubleshooting", percentage: 92 },
  { name: "ICT Training", percentage: 88 },
  { name: "Desktop Publishing", percentage: 90 },
  { name: "Educational Technology", percentage: 95 }
];

export const BIODATA: BiodataItem[] = [
  { label: "Full Name", value: "Adedayo Olatunde-Peters" },
  { label: "Date of Birth", value: "September 10th" },
  { label: "Nationality", value: "Nigerian" },
  { label: "State of Origin", value: "Ogun State" },
  { label: "Languages", value: "English & Yoruba" },
  { label: "Marital Status", value: "Married" },
  { label: "Occupation", value: "ICT Professional" },
  { label: "Experience", value: "7+ Years" }
];

export const EXPERIENCE: ExperienceItem[] = [
  {
    id: "exp-1",
    period: "2023 - Present",
    role: "ICT Coding Instructor & Consultant",
    organization: "O.G.A Digital Academy & Training Center",
    description: "Teaching python scripts, front-end web design, and ICT literacy. Empowering over 150+ students with market-ready coding skills."
  },
  {
    id: "exp-2",
    period: "2020 - 2023",
    role: "Computer Systems Support Specialist",
    organization: "Global Tech Solutions & Systems",
    description: "Handled full-cycle hardware servicing, desktop configuration support, OS troubleshooting, and secure network infrastructure maintenance."
  },
  {
    id: "exp-3",
    period: "2018 - 2020",
    role: "Web Designer & Digital Creator",
    organization: "Freelance Consultancy (O.G.A)",
    description: "Crafted sleek, lightning-fast landing pages, digital portfolios, and e-commerce websites using standard HTML, CSS, and interactive design tools."
  },
  {
    id: "exp-4",
    period: "2016 - 2018",
    role: "Educational Technology Coordinator",
    organization: "Leading Private Educational Institute",
    description: "Engineered and deployed tech learning aids, conducted software training workshops for teachers, and managed academic lab systems."
  }
];

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  isCustom?: boolean;
}

export const DEFAULT_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "gal-1",
    title: "O.G.A Academy Portal",
    category: "Web Design",
    description: "A fast, modern responsive educational web platform designed for ICT learning. Features interactive course modules, registration management, and online resources.",
    imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "gal-2",
    title: "Linux Laboratory Server Setup",
    category: "Computer Support",
    description: "Full-scale layout, configuration, and provisioning of a high-performance Ubuntu workstation laboratory. Configured local networks, file share nodes, and access filters.",
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "gal-3",
    title: "Python Playground Engine",
    category: "Coding Projects",
    description: "An intuitive web-based editor designed for young students to run basic Python code snippets and receive friendly, immediate terminal feedbacks.",
    imageUrl: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "gal-4",
    title: "ICT Training Curriculum Guide",
    category: "Desktop Publishing",
    description: "High-impact visual curriculum textbook layout and typesetting. Designed completely for modern digital print, leveraging geometric alignments.",
    imageUrl: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80"
  }
];
