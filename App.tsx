import React, { useState, useEffect, useRef } from "react";
import { 
  Cpu, 
  Globe, 
  Wrench, 
  Terminal, 
  FileText, 
  GraduationCap, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Menu, 
  X, 
  ChevronRight,
  ChevronLeft, 
  Send, 
  Clock, 
  Award, 
  ArrowUpRight,
  ShieldCheck,
  MessageSquare,
  Upload,
  Trash2,
  Plus,
  Eye,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import profileImg from "./assets/images/New Pix.jpg";

import { 
  SERVICES, 
  SKILLS, 
  BIODATA, 
  EXPERIENCE, 
  NAV_LINKS, 
  ServiceItem, 
  SkillItem, 
  BiodataItem, 
  ExperienceItem,
  DEFAULT_GALLERY_ITEMS,
  GalleryItem
} from "./data";

import CertificationsManager from "./components/CertificationsManager";

// Custom Particle Grid Network Canvas for cyber background
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }> = [];

    const numParticles = Math.min(45, Math.floor((width * height) / 35000));

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.5 + 0.6,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw subtle background nodes
      ctx.fillStyle = "rgba(0, 242, 254, 0.25)";
      ctx.strokeStyle = "rgba(0, 242, 254, 0.04)";
      ctx.lineWidth = 0.5;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Bounce boundaries
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />;
}

export default function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lagosTime, setLagosTime] = useState("");
  const [skillsVisible, setSkillsVisible] = useState(false);
  const skillsSectionRef = useRef<HTMLDivElement | null>(null);

  // Profile Picture Dynamic Customizer state
  const [avatarImg, setAvatarImg] = useState<string>(() => {
    return localStorage.getItem("oga_avatar_image") || profileImg;
  });
  const avatarInputRef = useRef<HTMLInputElement | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image file size is too large. Please select an image under 2MB for compatibility.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          localStorage.setItem("oga_avatar_image", reader.result);
          setAvatarImg(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetAvatar = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Restore default system profile picture?")) {
      localStorage.removeItem("oga_avatar_image");
      setAvatarImg(profileImg);
    }
  };

  // Terminal state
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalHistory, setTerminalHistory] = useState<Array<{ cmd: string; output: string | string[] }>>([
    { cmd: "system-init", output: "O.G.A Cyber-Core Environment v1.0.4 initialized successfully." },
    { cmd: "help", output: "Available commands: 'about', 'biodata', 'skills', 'services', 'gallery', 'contact', 'clear'" }
  ]);
  const terminalBottomRef = useRef<HTMLDivElement | null>(null);

  // Gallery Section States
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem("oga_custom_gallery_items");
    const parsedCustom = saved ? JSON.parse(saved) : [];
    return [...DEFAULT_GALLERY_ITEMS, ...parsedCustom];
  });
  const [galleryFilter, setGalleryFilter] = useState("All");
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);
  
  // Add Project drawer state
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [newWorkTitle, setNewWorkTitle] = useState("");
  const [newWorkDesc, setNewWorkDesc] = useState("");
  const [newWorkCategory, setNewWorkCategory] = useState("Web Design");
  const [newWorkImage, setNewWorkImage] = useState<string | null>(null);
  const [isUploadingWork, setIsUploadingWork] = useState(false);

  const compressAndResizeImage = (file: File, maxWidth = 800, maxHeight = 800): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL("image/jpeg", 0.75);
            resolve(compressed);
          } else {
            resolve(reader.result as string);
          }
        };
        img.src = e.target?.result as string;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const handleWorkImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingWork(true);
      try {
        const compressed = await compressAndResizeImage(file);
        setNewWorkImage(compressed);
      } catch (err) {
        console.error("Error compressing work image:", err);
        alert("Failed to process image. Please try another image file.");
      } finally {
        setIsUploadingWork(false);
      }
    }
  };

  const handleAddWorkItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkTitle.trim()) {
      alert("Please enter a title for your work.");
      return;
    }
    if (!newWorkImage) {
      alert("Please select or drop an image for your work.");
      return;
    }

    const newItem: GalleryItem = {
      id: "custom-" + Date.now(),
      title: newWorkTitle.trim(),
      category: newWorkCategory,
      description: newWorkDesc.trim() || "No description provided.",
      imageUrl: newWorkImage,
      isCustom: true
    };

    const saved = localStorage.getItem("oga_custom_gallery_items");
    const parsedCustom = saved ? JSON.parse(saved) : [];
    const updatedCustom = [...parsedCustom, newItem];
    
    localStorage.setItem("oga_custom_gallery_items", JSON.stringify(updatedCustom));
    setGalleryItems([...DEFAULT_GALLERY_ITEMS, ...updatedCustom]);

    // Reset fields
    setNewWorkTitle("");
    setNewWorkDesc("");
    setNewWorkCategory("Web Design");
    setNewWorkImage(null);
    setIsAddFormOpen(false);
  };

  const handleDeleteWorkItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this custom project from your gallery?")) {
      const saved = localStorage.getItem("oga_custom_gallery_items");
      const parsedCustom = saved ? JSON.parse(saved) : [];
      const updatedCustom = parsedCustom.filter((item: GalleryItem) => item.id !== id);
      
      localStorage.setItem("oga_custom_gallery_items", JSON.stringify(updatedCustom));
      setGalleryItems([...DEFAULT_GALLERY_ITEMS, ...updatedCustom]);
      
      // Close lightbox if open
      setActiveLightboxIndex(null);
    }
  };

  // Contact form state
  const [formState, setFormState] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<typeof formState | null>(null);

  // Auto-clock for Lagos time
  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Africa/Lagos",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      };
      setLagosTime(new Intl.DateTimeFormat("en-US", options).format(new Date()));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Intersection observer for animating progress bars
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSkillsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (skillsSectionRef.current) {
      observer.observe(skillsSectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Terminal scroll to bottom
  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalHistory]);

  // Terminal input processing
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = terminalInput.trim().toLowerCase();
    if (!trimmedInput) return;

    let output: string | string[] = "";

    switch (trimmedInput) {
      case "help":
        output = [
          "-------------------------------------------",
          "COMMAND UTILITIES:",
          "  about    - Displays professional summary & biography",
          "  biodata  - Lists official biodata parameters",
          "  skills   - Prints interactive skill metrics in ASCII",
          "  services - Summarizes professional service offerings",
          "  gallery  - Displays dynamic project gallery titles",
          "  contact  - Outputs secure connection channels",
          "  clear    - Purges the current session console buffer",
          "-------------------------------------------"
        ];
        break;
      case "about":
        output = "I am Adedayo Olatunde-Peters, an ICT professional with over 7 years of experience in computer support, web design, and ICT education. Passionate about empowering individuals through digital integration.";
        break;
      case "biodata":
        output = BIODATA.map(item => `  ${item.label.padEnd(20)}: ${item.value}`);
        break;
      case "skills":
        output = SKILLS.map(item => {
          const filled = Math.round(item.percentage / 10);
          const bar = "█".repeat(filled) + "░".repeat(10 - filled);
          return `  ${item.name.padEnd(25)} [${bar}] ${item.percentage}%`;
        });
        break;
      case "services":
        output = SERVICES.map(item => `  [+] ${item.title}: ${item.description}`);
        break;
      case "gallery":
        output = [
          "---------------- O.G.A WORK GALLERY ----------------",
          ...galleryItems.map((item, idx) => `  [${idx + 1}] ${item.title.padEnd(30)} [Category: ${item.category}]`),
          "----------------------------------------------------",
          "  Type or click to view full item visuals in the gallery section below!"
        ];
        break;
      case "contact":
        output = [
          `  Location : Lagos, Nigeria`,
          `  Mobile   : +234 705 601 7458`,
          `  WhatsApp : +234 705 601 7458`,
          `  Email    : adedayolatunde@gmail.pro (Placeholder)`
        ];
        break;
      case "clear":
        setTerminalHistory([]);
        setTerminalInput("");
        return;
      default:
        output = `Command not found: '${trimmedInput}'. Type 'help' for available diagnostic tools.`;
    }

    setTerminalHistory(prev => [...prev, { cmd: trimmedInput, output }]);
    setTerminalInput("");
  };

  // Service icons mapper
  const renderServiceIcon = (name: string) => {
    switch (name) {
      case "Support":
        return <Cpu className="w-8 h-8 text-cyber-cyan" />;
      case "Web":
        return <Globe className="w-8 h-8 text-cyber-cyan" />;
      case "Troubleshoot":
        return <Wrench className="w-8 h-8 text-cyber-cyan" />;
      case "Coding":
        return <Terminal className="w-8 h-8 text-cyber-cyan" />;
      case "Desktop":
        return <FileText className="w-8 h-8 text-cyber-cyan" />;
      case "EdTech":
        return <GraduationCap className="w-8 h-8 text-cyber-cyan" />;
      default:
        return <Cpu className="w-8 h-8 text-cyber-cyan" />;
    }
  };

  // Submit form handler
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedData(formState);
    }, 1500);
  };

  return (
    <div className="relative min-h-screen bg-cyber-dark text-slate-200 font-sans selection:bg-cyber-cyan selection:text-black overflow-x-hidden cyber-grid-bg">
      {/* Decorative top ambient light pods */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 left-1/3 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[140px] pointer-events-none z-0"></div>

      <ParticleCanvas />

      {/* STICKY HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-cyber-dark/85 border-b border-cyan-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <a href="#home" className="flex items-center space-x-2 group focus:outline-none">
            <span className="text-xl font-mono font-bold tracking-widest text-cyber-cyan group-hover:text-glow-cyan transition-all duration-300">
              [O.G.A]
            </span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex space-x-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setActiveSection(link.href.replace("#", ""))}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 relative font-display tracking-wider ${
                  activeSection === link.href.replace("#", "")
                    ? "text-cyber-cyan"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {link.label}
                {activeSection === link.href.replace("#", "") && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute bottom-0 left-4 right-4 h-[2px] bg-cyan-400"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </nav>

          {/* Lagos Time Widget */}
          <div className="hidden lg:flex items-center space-x-2 bg-slate-900/80 border border-slate-800 rounded-full py-1.5 px-4 font-mono text-xs">
            <Clock className="w-3.5 h-3.5 text-cyber-cyan animate-pulse" />
            <span className="text-slate-400">LAGOS:</span>
            <span className="text-cyber-cyan font-bold tracking-wider">{lagosTime || "12:00:00 AM"}</span>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-slate-400 hover:text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-b border-cyan-500/15 bg-cyber-dark/95 backdrop-blur-lg px-4 pt-2 pb-6 space-y-2"
            >
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => {
                    setActiveSection(link.href.replace("#", ""));
                    setMobileMenuOpen(false);
                  }}
                  className={`block px-4 py-3 rounded-md text-base font-medium font-display tracking-wide ${
                    activeSection === link.href.replace("#", "")
                      ? "bg-cyan-500/10 text-cyber-cyan border-l-2 border-cyber-cyan"
                      : "text-slate-300 hover:bg-slate-900"
                  }`}
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between font-mono text-xs px-4">
                <span className="text-slate-400">LOCAL TIME (NG):</span>
                <span className="text-cyber-cyan font-bold">{lagosTime || "00:00:00 AM"}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO SECTION */}
      <section id="home" className="relative pt-12 pb-20 md:py-32 flex items-center z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="md:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 font-mono text-xs text-cyber-cyan">
                <span className="flex h-2 w-2 rounded-full bg-cyber-cyan animate-pulse"></span>
                <span className="tracking-widest uppercase">7+ Years Active Service</span>
              </div>

              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-none">
                  Adedayo <br className="hidden lg:block"/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-blue text-glow-cyan">
                    Olatunde-Peters
                  </span>
                </h1>
                <p className="text-lg sm:text-xl font-display font-medium text-slate-300 tracking-wide mt-3">
                  ICT Professional <span className="text-cyber-cyan">|</span> Web Designer <span className="text-cyber-cyan">|</span> Coding Instructor
                </p>
              </div>

              <p className="text-slate-400 text-base sm:text-lg max-w-xl leading-relaxed">
                Engineering elegant systems interfaces, diagnosing network architecture, and coaching the next generation of software creators with a digital-first methodology.
              </p>

              {/* Badges / CTA */}
              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold font-display tracking-wider text-sm py-3.5 px-8 rounded-lg shadow-lg shadow-cyan-500/20 hover:shadow-cyan-400/40 transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  Connect Securely
                  <ChevronRight className="w-4 h-4 ml-2 stroke-[2.5]" />
                </a>
                <a
                  href="#biodata"
                  className="inline-flex items-center justify-center bg-slate-900/80 border border-slate-700/60 hover:border-cyber-cyan/50 text-white font-medium font-display tracking-wider text-sm py-3.5 px-8 rounded-lg transition-all duration-300"
                >
                  Verify Biodata
                </a>
              </div>

              {/* Status Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 max-w-lg font-mono text-xs text-slate-400">
                <div>
                  <p className="text-slate-500 uppercase">Current Node</p>
                  <p className="text-white mt-1 flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-cyber-cyan" />
                    Lagos, Nigeria
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 uppercase">Availability</p>
                  <p className="text-cyber-cyan mt-1 flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan mr-1.5 animate-pulse"></span>
                    Open for Projects
                  </p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <p className="text-slate-500 uppercase">Core Specialties</p>
                  <p className="text-white mt-1">Python, IT Support, Web</p>
                </div>
              </div>

            </div>

            {/* Right Profile Image Column */}
            <div className="md:col-span-5 flex justify-center">
              <div className="relative group">
                {/* Cyber tech background borders */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-cyber-cyan to-cyber-blue rounded-full opacity-35 blur group-hover:opacity-60 transition duration-1000"></div>
                
                {/* Image Frame Wrapper */}
                <div className="relative w-72 h-72 sm:w-85 sm:h-85 rounded-full p-1 bg-cyber-dark border border-cyan-500/30 overflow-hidden shadow-2xl">
                  {/* Subtle Grid overlay inside frame */}
                  <div className="absolute inset-0 bg-cyan-500/[0.03] cyber-grid-bg z-10 rounded-full"></div>
                  
                  {/* Scanline Effect */}
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-40 animate-scanline z-20"></div>

                  {/* Hover Upload Overlay */}
                  <div 
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute inset-0 bg-slate-950/75 opacity-0 hover:opacity-100 transition-opacity duration-300 z-30 flex flex-col items-center justify-center cursor-pointer rounded-full"
                  >
                    <Upload className="w-7 h-7 text-cyber-cyan mb-1.5 animate-bounce" />
                    <span className="font-mono text-[9px] text-white uppercase tracking-wider">Upload New Photo</span>
                    <span className="font-mono text-[8px] text-slate-500 uppercase tracking-widest mt-0.5">PNG, JPG, WEBP</span>
                    {avatarImg !== profileImg && (
                      <button
                        onClick={handleResetAvatar}
                        className="mt-3 px-2 py-0.5 bg-red-500/15 hover:bg-red-500/30 text-red-400 font-mono text-[8px] rounded border border-red-500/30 uppercase tracking-widest transition-colors"
                      >
                        Reset
                      </button>
                    )}
                  </div>

                  {/* Profile Picture */}
                  <img
                    src={avatarImg}
                    alt="Adedayo Olatunde-Peters"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-full filter saturate-[1.1] brightness-[1.05] transition-all duration-700 group-hover:scale-105 z-0"
                  />

                  {/* Hidden File Input for Avatar */}
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>

                {/* Cyber corner brackets (Floating decoration) */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyber-cyan -translate-x-2 -translate-y-2 pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyber-cyan translate-x-2 -translate-y-2 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyber-cyan -translate-x-2 translate-y-2 pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyber-cyan translate-x-2 translate-y-2 pointer-events-none"></div>

                {/* Floating badge */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-slate-900 border border-cyber-cyan/30 px-4 py-1.5 rounded-full font-mono text-[10px] tracking-widest text-cyber-cyan uppercase shadow-lg shadow-black/85">
                  SYSTEM_ID: OGA.PRO
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-20 bg-slate-950/40 relative border-y border-slate-900 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Biography text */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="font-mono text-xs text-cyber-cyan tracking-widest uppercase block"> ABOUT ME</span>
                <h2 className="text-3xl font-display font-bold text-white tracking-tight">
                  About Adedayo
                </h2>
              </div>

              <div className="text-slate-300 leading-relaxed space-y-4 text-base sm:text-lg font-light">
                <p>
                  "I am Adedayo Olatunde-Peters, an ICT professional with over 7 years of experience in computer systems support, desktop publishing, web design, and ICT education. I specialize in troubleshooting hardware and software systems, teaching coding, and integrating technology into learning environments."
                </p>
                <p>
                  "My passion is helping individuals and organizations use technology effectively for growth, productivity, and digital empowerment. I believe that technical literacy is the foundation of modern opportunities, and I translate complex technology concepts into functional knowledge."
                </p>
              </div>

              {/* Stat grid widgets */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-lg hover:border-cyan-500/30 transition-all duration-300">
                  <p className="font-display text-2xl font-bold text-cyber-cyan text-glow-cyan">7+</p>
                  <p className="font-mono text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Years Experience</p>
                </div>
                <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-lg hover:border-cyan-500/30 transition-all duration-300">
                  <p className="font-display text-2xl font-bold text-white">150+</p>
                  <p className="font-mono text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Students Coached</p>
                </div>
                <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-lg hover:border-cyan-500/30 transition-all duration-300">
                  <p className="font-display text-2xl font-bold text-white">50+</p>
                  <p className="font-mono text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Systems Serviced</p>
                </div>
                <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-lg hover:border-cyan-500/30 transition-all duration-300">
                  <p className="font-display text-2xl font-bold text-cyber-cyan text-glow-cyan">100%</p>
                  <p className="font-mono text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Delivery Rate</p>
                </div>
              </div>
            </div>

            {/* Grid Box of Professional Core Focus */}
            <div className="lg:col-span-5">
              <div className="bg-cyber-card backdrop-blur-md border border-cyan-500/15 p-6 rounded-2xl shadow-xl space-y-6 relative border-glow-cyan">
                {/* Tech aesthetics inside card */}
                <div className="absolute top-4 right-4 flex space-x-1.5">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping"></span>
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  <span className="w-1.5 h-1.5 bg-slate-700 rounded-full"></span>
                </div>
                
                <h3 className="font-display text-lg font-bold text-white tracking-wide border-b border-slate-800 pb-3 flex items-center">
                  <Award className="w-5 h-5 text-cyber-cyan mr-2" />
                  Core Competency Anchors
                </h3>

                <ul className="space-y-4 font-mono text-xs text-slate-300">
                  <li className="flex items-start space-x-3 bg-slate-950/55 p-2.5 rounded border border-slate-800/60">
                    <span className="text-cyber-cyan font-bold">[01]</span>
                    <div>
                      <h4 className="text-white font-semibold">Systems Integration & Support</h4>
                      <p className="text-slate-400 mt-0.5 text-[11px]">Hardware installations, OS environments, setups.</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3 bg-slate-950/55 p-2.5 rounded border border-slate-800/60">
                    <span className="text-cyber-cyan font-bold">[02]</span>
                    <div>
                      <h4 className="text-white font-semibold">Modern Web Engineering</h4>
                      <p className="text-slate-400 mt-0.5 text-[11px]">Tailored UX, speed, fluid layouts, semantic structure.</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3 bg-slate-950/55 p-2.5 rounded border border-slate-800/60">
                    <span className="text-cyber-cyan font-bold">[03]</span>
                    <div>
                      <h4 className="text-white font-semibold">ICT Coaching & Curriculum</h4>
                      <p className="text-slate-400 mt-0.5 text-[11px]">Python, HTML, CSS, computing fundamentals, and systems labs.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto space-y-3 mb-16">
            <span className="font-mono text-xs text-cyber-cyan tracking-widest uppercase block"> MY SERVICES</span>
            <h2 className="text-3xl font-display font-bold text-white tracking-tight">
              Operational Solutions
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Providing professional ICT solutions, hardware support, web infrastructure, and educational technology consulting services.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service, index) => (
              <motion.div
                key={service.id}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-cyber-card backdrop-blur-md border border-slate-800/80 p-6 rounded-xl hover:border-cyan-500/30 transition-all duration-300 relative group overflow-hidden"
              >
                {/* Glowing Corner Accents */}
                <span className="absolute top-0 right-0 w-3 h-[1px] bg-cyan-400/0 group-hover:bg-cyan-400/80 transition-all duration-300"></span>
                <span className="absolute top-0 right-0 w-[1px] h-3 bg-cyan-400/0 group-hover:bg-cyan-400/80 transition-all duration-300"></span>

                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 group-hover:border-cyan-500/40 transition-colors duration-300">
                    {renderServiceIcon(service.iconName)}
                  </div>
                  <span className="font-mono text-slate-600 text-xs font-bold self-start mt-1">
                    {`[0${index + 1}]`}
                  </span>
                </div>

                <h3 className="text-lg font-display font-semibold text-white group-hover:text-cyber-cyan transition-colors duration-300 mb-2">
                  {service.title}
                </h3>
                
                <p className="text-slate-400 text-sm leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* SKILLS SECTION */}
      <section id="skills" ref={skillsSectionRef} className="py-20 bg-slate-950/40 relative border-y border-slate-900 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left intro copy */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <span className="font-mono text-xs text-cyber-cyan tracking-widest uppercase block"></span>
                <h2 className="text-3xl font-display font-bold text-white tracking-tight">
                  Core Expertise
                </h2>
              </div>
              <p className="text-slate-400 text-base leading-relaxed">
                A quantitative assessment of core ICT proficiencies gained through over 7 years of full-cycle technical operations, coding instruction, and systems installations.
              </p>
              
              <div className="p-5 bg-slate-900/60 border border-slate-800/80 rounded-xl space-y-3 font-mono text-xs text-slate-300">
                <div className="flex items-center space-x-2.5 text-cyber-cyan font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified Qualifications</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Continuous system audits, advanced operating frameworks, and student certification mentorship are maintained regularly.
                </p>
              </div>
            </div>

            {/* Right progress bars */}
            <div className="lg:col-span-7 space-y-6">
              {SKILLS.map((skill, index) => (
                <div key={skill.name} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="font-display text-sm font-semibold text-slate-200">
                      {skill.name}
                    </span>
                    <span className="font-mono text-xs text-cyber-cyan font-bold">
                      {skill.percentage}%
                    </span>
                  </div>
                  
                  {/* Progress bar container */}
                  <div className="h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-[1px]">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-1000 ease-out relative"
                      style={{ width: skillsVisible ? `${skill.percentage}%` : "0%" }}
                    >
                      {/* Glow indicator at the edge */}
                      <span className="absolute right-0 top-0 bottom-0 w-1.5 bg-white shadow-[0_0_10px_#00f2fe] rounded-full"></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* BIODATA SECTION */}
      <section id="biodata" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto space-y-3 mb-16">
            <span className="font-mono text-xs text-cyber-cyan tracking-widest uppercase block"> BIODATA</span>
            <h2 className="text-3xl font-display font-bold text-white tracking-tight">
              Personal Biodata
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Verified identity specifications and structural records of Adedayo Olatunde-Peters.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Cyber Dossier Card */}
            <div className="bg-cyber-card backdrop-blur-md border border-cyan-500/15 rounded-2xl overflow-hidden shadow-xl border-glow-cyan">
              
              {/* Card top banner */}
              <div className="bg-slate-900/80 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-cyber-cyan" />
                  <span className="font-mono text-xs text-slate-300 font-bold tracking-widest uppercase">
                    CERTIFIED IDENTITY SHEETS
                  </span>
                </div>
                <div className="font-mono text-[10px] text-slate-500 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                  RECORD_REF: AOP-1993
                </div>
              </div>

              {/* Card Main Body */}
              <div className="p-6 md:p-8 grid md:grid-cols-12 gap-8 items-center">
                
                {/* Profile mini frame */}
                <div className="md:col-span-4 flex flex-col items-center space-y-4">
                  <div 
                    onClick={() => avatarInputRef.current?.click()}
                    className="relative w-44 h-44 rounded-full p-1 bg-slate-950 border border-slate-800 cursor-pointer group/mini overflow-hidden"
                    title="Click to update picture"
                  >
                    <img
                      src={avatarImg}
                      alt="Adedayo"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-full filter brightness-95 group-hover/mini:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent rounded-full"></div>
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/mini:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-full">
                      <span className="font-mono text-[8px] text-cyber-cyan uppercase tracking-widest bg-slate-950/90 border border-cyber-cyan/30 px-2 py-1 rounded">Update</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="font-display font-semibold text-white">O.G.A</h3>
                    <p className="font-mono text-[10px] text-cyber-cyan mt-0.5 tracking-wider uppercase">Lagos</p>
                  </div>
                </div>

                {/* Info Table Grid */}
                <div className="md:col-span-8">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {BIODATA.map((data) => (
                      <div
                        key={data.label}
                        className="p-3 bg-slate-950/60 border border-slate-900/80 hover:border-cyan-500/10 rounded-lg transition-colors duration-200"
                      >
                        <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest block">
                          {data.label}
                        </span>
                        <span className="font-display text-sm font-semibold text-white mt-1 block">
                          {data.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* EXPERIENCE TIMELINE SECTION */}
      <section id="experience" className="py-20 bg-slate-950/40 relative border-y border-slate-900 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto space-y-3 mb-16">
            <span className="font-mono text-xs text-cyber-cyan tracking-widest uppercase block"></span>
            <h2 className="text-3xl font-display font-bold text-white tracking-tight">
              Professional Timeline
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              A chronological log of Adedayo's professional service journey and organizational tenures.
            </p>
          </div>

          {/* Timeline Node Chain */}
          <div className="relative max-w-3xl mx-auto">
            {/* Center neon column line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-cyan-400 via-blue-500 to-transparent"></div>

            <div className="space-y-12">
              {EXPERIENCE.map((item, index) => {
                const isEven = index % 2 === 0;
                return (
                  <div
                    key={item.id}
                    className={`relative flex flex-col md:flex-row ${
                      isEven ? "md:flex-row-reverse" : ""
                    } items-start md:items-center`}
                  >
                    {/* Timeline dot node */}
                    <div className="absolute left-4 md:left-1/2 -translate-x-[7px] w-3.5 h-3.5 rounded-full bg-slate-950 border border-cyan-400 shadow-[0_0_8px_#00f2fe] z-20"></div>

                    {/* Timeline card side */}
                    <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${isEven ? "md:pl-8" : "md:pr-8"}`}>
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        className="bg-cyber-card backdrop-blur-md border border-slate-800/80 p-6 rounded-xl hover:border-cyan-500/30 transition-all duration-300"
                      >
                        <span className="font-mono text-xs text-cyber-cyan font-bold tracking-widest">
                          {item.period}
                        </span>
                        <h3 className="font-display text-lg font-bold text-white mt-1 leading-tight">
                          {item.role}
                        </h3>
                        <p className="font-display text-sm text-slate-400 font-medium mt-0.5">
                          {item.organization}
                        </p>
                        <p className="text-slate-400 text-sm mt-3 leading-relaxed">
                          {item.description}
                        </p>
                      </motion.div>
                    </div>

                    {/* Empty placeholder spacer for desktop symmetry */}
                    <div className="hidden md:block w-1/2"></div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* GALLERY / PORTFOLIO SECTION */}
      <section id="gallery" className="py-20 relative z-10 border-b border-slate-900 bg-cyber-dark/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto space-y-3 mb-12">
            <span className="font-mono text-xs text-cyber-cyan tracking-widest uppercase block">PORTFOLIO GALLERY</span>
            <h2 className="text-3xl font-display font-bold text-white tracking-tight">
              My Professional Works
            </h2>
            <div className="h-0.5 w-12 bg-cyber-cyan mx-auto rounded-full"></div>
            <p className="text-slate-400 text-sm">
              Explore dynamic projects, server assemblies, curriculum designs, and custom works. Feel free to upload and add your own works below!
            </p>
          </div>

          {/* Controls: Filter chips + Add project button */}
          <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-12 border-b border-slate-900 pb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              {["All", "Web Design", "Computer Support", "Coding Projects", "Desktop Publishing"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setGalleryFilter(filter)}
                  className={`px-4 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider border transition-all duration-300 ${
                    galleryFilter === filter
                      ? "bg-cyber-cyan/15 border-cyber-cyan text-cyber-cyan shadow-sm shadow-cyan-500/10"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsAddFormOpen(!isAddFormOpen)}
              className="px-5 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 text-cyber-cyan border border-cyber-cyan/40 hover:border-cyber-cyan rounded-md font-mono text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-2 group shadow-sm shadow-cyan-500/5 active:scale-[0.98]"
            >
              <Plus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
              {isAddFormOpen ? "Close Panel" : "Upload New Work"}
            </button>
          </div>

          {/* Add Work Form Drawer */}
          <AnimatePresence>
            {isAddFormOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden mb-12"
              >
                <div className="p-6 sm:p-8 bg-slate-950/80 border border-slate-800/80 rounded-xl relative">
                  {/* Visual cyber decorations */}
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-500/50"></div>
                  <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-500/50"></div>
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-500/50"></div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-500/50"></div>

                  <h3 className="font-display font-semibold text-white mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse"></span>
                    Upload & Add Project Showcase
                  </h3>

                  <form onSubmit={handleAddWorkItem} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block font-mono text-[10px] text-slate-400 uppercase tracking-wider mb-1.5">
                          Project Title <span className="text-cyber-cyan">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={newWorkTitle}
                          onChange={(e) => setNewWorkTitle(e.target.value)}
                          placeholder="e.g. Cisco Lab Topology"
                          className="w-full bg-slate-900 border border-slate-800 rounded-md py-2 px-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyber-cyan transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-[10px] text-slate-400 uppercase tracking-wider mb-1.5">
                          Category <span className="text-cyber-cyan">*</span>
                        </label>
                        <select
                          value={newWorkCategory}
                          onChange={(e) => setNewWorkCategory(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:border-cyber-cyan transition-colors"
                        >
                          <option value="Web Design">Web Design</option>
                          <option value="Computer Support">Computer Support</option>
                          <option value="Coding Projects">Coding Projects</option>
                          <option value="Desktop Publishing">Desktop Publishing</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-mono text-[10px] text-slate-400 uppercase tracking-wider mb-1.5">
                          Description Summary
                        </label>
                        <textarea
                          rows={3}
                          value={newWorkDesc}
                          onChange={(e) => setNewWorkDesc(e.target.value)}
                          placeholder="Provide a brief explanation of this system setup, design flow, or academic purpose..."
                          className="w-full bg-slate-900 border border-slate-800 rounded-md py-2 px-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyber-cyan transition-colors resize-none"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <span className="block font-mono text-[10px] text-slate-400 uppercase tracking-wider mb-1.5">
                        Work Visual Image <span className="text-cyber-cyan">*</span>
                      </span>

                      {/* Drag & Drop Upload Zone */}
                      <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={async (e) => {
                          e.preventDefault();
                          const file = e.dataTransfer.files?.[0];
                          if (file) {
                            setIsUploadingWork(true);
                            try {
                              const compressed = await compressAndResizeImage(file);
                              setNewWorkImage(compressed);
                            } catch (err) {
                              console.error(err);
                              alert("Failed to compress image.");
                            } finally {
                              setIsUploadingWork(false);
                            }
                          }
                        }}
                        onClick={() => document.getElementById("work-file-input")?.click()}
                        className={`flex-1 min-h-[160px] border border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
                          newWorkImage 
                            ? "border-cyber-cyan bg-cyan-950/5" 
                            : "border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/60"
                        }`}
                      >
                        <input
                          id="work-file-input"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleWorkImageUpload}
                        />

                        {isUploadingWork ? (
                          <div className="flex flex-col items-center space-y-2">
                            <div className="w-6 h-6 border-2 border-t-transparent border-cyber-cyan rounded-full animate-spin"></div>
                            <span className="font-mono text-[10px] text-slate-400">Processing & Optimizing Image...</span>
                          </div>
                        ) : newWorkImage ? (
                          <div className="relative group w-full h-[140px]">
                            <img
                              src={newWorkImage}
                              alt="Uploaded Preview"
                              className="w-full h-full object-cover rounded-md border border-slate-800"
                            />
                            <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-md">
                              <span className="font-mono text-[10px] text-cyber-cyan uppercase tracking-widest border border-cyber-cyan/30 px-2 py-1 rounded">Change Photo</span>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Upload className="w-8 h-8 text-slate-500 mx-auto animate-pulse" />
                            <div>
                              <p className="font-display text-xs text-white">Drag & drop your project image here, or <span className="text-cyber-cyan underline">browse</span></p>
                              <p className="font-mono text-[9px] text-slate-500 mt-1 uppercase tracking-widest">PNG, JPG, WEBP, GIF (Auto-compressed)</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 flex gap-3 justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setNewWorkTitle("");
                            setNewWorkDesc("");
                            setNewWorkCategory("Web Design");
                            setNewWorkImage(null);
                            setIsAddFormOpen(false);
                          }}
                          className="px-4 py-2 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded font-mono text-xs uppercase tracking-wider transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isUploadingWork || !newWorkImage || !newWorkTitle}
                          className="px-4 py-2 bg-cyber-cyan text-slate-950 hover:bg-cyan-300 disabled:opacity-50 font-mono font-bold text-xs uppercase tracking-wider rounded transition-colors"
                        >
                          Save Project
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Grid of Projects */}
          {galleryItems.filter(item => galleryFilter === "All" || item.category === galleryFilter).length === 0 ? (
            <div className="text-center py-16 bg-slate-950/30 border border-slate-900 rounded-lg p-8">
              <AlertCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="font-mono text-xs text-slate-500 uppercase tracking-widest">No Projects Found</p>
              <p className="text-slate-400 text-sm mt-1">There are no work projects uploaded in the "{galleryFilter}" category yet.</p>
              <button
                onClick={() => {
                  setNewWorkCategory(galleryFilter === "All" ? "Web Design" : galleryFilter);
                  setIsAddFormOpen(true);
                }}
                className="mt-4 px-4 py-1.5 bg-slate-900 border border-slate-800 text-cyber-cyan hover:border-cyber-cyan/30 text-xs rounded transition-all font-mono uppercase tracking-wider"
              >
                Be the first to upload one!
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {galleryItems
                .filter(item => galleryFilter === "All" || item.category === galleryFilter)
                .map((item) => {
                  // Find real index in overall array for Lightbox navigation
                  const realIndex = galleryItems.findIndex(g => g.id === item.id);
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="group relative bg-slate-950 border border-slate-800/80 rounded-xl overflow-hidden shadow-md hover:border-cyan-500/30 transition-all duration-300"
                    >
                      {/* Image section */}
                      <div 
                        onClick={() => setActiveLightboxIndex(realIndex)}
                        className="relative aspect-video w-full overflow-hidden cursor-pointer bg-slate-900"
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                          <div className="w-10 h-10 rounded-full bg-cyber-dark/90 border border-cyber-cyan/40 flex items-center justify-center transform scale-90 group-hover:scale-100 transition-all duration-300 shadow-sm shadow-cyan-500/20">
                            <Eye className="w-5 h-5 text-cyber-cyan" />
                          </div>
                        </div>

                        {/* Category Tag (Absolute) */}
                        <span className="absolute top-3 left-3 px-2 py-0.5 bg-slate-950/80 border border-slate-800 text-[9px] text-cyber-cyan font-mono rounded uppercase tracking-wider z-20">
                          {item.category}
                        </span>

                        {/* Delete button for custom items */}
                        {item.isCustom && (
                          <button
                            onClick={(e) => handleDeleteWorkItem(item.id, e)}
                            className="absolute top-3 right-3 p-1.5 bg-red-500/10 hover:bg-red-500 border border-red-500/30 hover:border-red-500 text-red-400 hover:text-white rounded-md z-20 transition-all opacity-0 group-hover:opacity-100 active:scale-95"
                            title="Delete this project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Info Section */}
                      <div className="p-4 flex flex-col justify-between">
                        <div>
                          <h4 className="font-display font-semibold text-white group-hover:text-cyber-cyan transition-colors leading-snug">
                            {item.title}
                          </h4>
                          <p className="text-slate-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                        
                        <div className="mt-4 pt-3 border-t border-slate-900 flex justify-between items-center">
                          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                            {item.isCustom ? "Custom Upload" : "O.G.A System"}
                          </span>
                          <button
                            onClick={() => setActiveLightboxIndex(realIndex)}
                            className="text-[10px] font-mono text-cyber-cyan hover:underline uppercase tracking-wider flex items-center gap-1"
                          >
                            View details
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          )}

        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {activeLightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-12"
            onClick={() => setActiveLightboxIndex(null)}
          >
            {/* Close button top right */}
            <button
              onClick={() => setActiveLightboxIndex(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors z-50"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Left navigation arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveLightboxIndex(prev => {
                  if (prev === null) return null;
                  return prev === 0 ? galleryItems.length - 1 : prev - 1;
                });
              }}
              className="absolute left-4 md:left-8 p-3 rounded-full bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 text-slate-400 hover:text-white hover:border-slate-700 transition-colors z-40"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Main content modal */}
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative max-w-4xl w-full bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl z-40 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image box */}
              <div className="relative aspect-video w-full bg-slate-900 border-b border-slate-900">
                <img
                  src={galleryItems[activeLightboxIndex].imageUrl}
                  alt={galleryItems[activeLightboxIndex].title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                
                {/* Delete in lightbox option */}
                {galleryItems[activeLightboxIndex].isCustom && (
                  <button
                    onClick={(e) => handleDeleteWorkItem(galleryItems[activeLightboxIndex].id, e)}
                    className="absolute top-4 right-4 px-3 py-1.5 bg-red-500/10 hover:bg-red-500 border border-red-500/30 hover:border-red-500 text-red-400 hover:text-white rounded font-mono text-xs uppercase tracking-wider transition-colors"
                  >
                    Delete Work
                  </button>
                )}
              </div>

              {/* Text metadata */}
              <div className="p-6 md:p-8 space-y-4">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="px-2.5 py-0.5 bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyber-cyan font-mono rounded uppercase tracking-wider">
                    {galleryItems[activeLightboxIndex].category}
                  </span>
                  <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
                    {galleryItems[activeLightboxIndex].isCustom ? "User Uploaded" : "System Default Case"}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-display font-bold text-white">
                    {galleryItems[activeLightboxIndex].title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {galleryItems[activeLightboxIndex].description}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right navigation arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveLightboxIndex(prev => {
                  if (prev === null) return null;
                  return prev === galleryItems.length - 1 ? 0 : prev + 1;
                });
              }}
              className="absolute right-4 md:right-8 p-3 rounded-full bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 text-slate-400 hover:text-white hover:border-slate-700 transition-colors z-40"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CERTIFICATIONS SECTION */}
      <section id="certifications" className="py-20 relative z-10 border-b border-slate-900 bg-slate-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto space-y-3 mb-16">
            <span className="font-mono text-xs text-cyber-cyan tracking-widest uppercase block"> CERTIFICATIONS</span>
            <h2 className="text-3xl font-display font-bold text-white tracking-tight">
              Professional Credentials
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Browse, inspect, and load verified technical support, development, and system security certifications.
            </p>
          </div>

          <CertificationsManager />

        </div>
      </section>

      {/* INTERACTIVE DIGITAL TERMINAL SECTION (Feature of Craft) */}
      <section className="py-20 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="space-y-1.5 text-center md:text-left">
            <span className="font-mono text-xs text-cyber-cyan tracking-widest uppercase"></span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              Interactive Terminal Shell
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Inquire into Adedayo's background directly from the console frame below.
            </p>
          </div>

          {/* Terminal Window Box */}
          <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col h-96">
            
            {/* Terminal Top Window Bar */}
            <div className="bg-slate-900 px-4 py-2.5 flex items-center justify-between border-b border-slate-800 font-mono text-xs">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/70"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/70"></span>
                <span className="text-slate-400 font-bold ml-1.5">oga_shell_session.sh</span>
              </div>
              <span className="text-slate-600">STABLE</span>
            </div>

            {/* Terminal Body */}
            <div className="p-4 flex-1 overflow-y-auto font-mono text-xs space-y-3.5 scrollbar-thin scrollbar-thumb-slate-800">
              {terminalHistory.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  {item.cmd !== "system-init" && (
                    <div className="flex items-center space-x-2 text-slate-500">
                      <span>guest@oga-node:~$</span>
                      <span className="text-white font-bold">{item.cmd}</span>
                    </div>
                  )}
                  <div className="text-slate-300 leading-relaxed pl-2 whitespace-pre-wrap">
                    {Array.isArray(item.output) ? (
                      item.output.map((line, lIdx) => <div key={lIdx}>{line}</div>)
                    ) : (
                      <div>{item.output}</div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={terminalBottomRef} />
            </div>

            {/* Terminal Bottom Input Bar */}
            <form onSubmit={handleTerminalSubmit} className="bg-slate-900 border-t border-slate-800/80 px-4 py-3 flex items-center space-x-2">
              <span className="font-mono text-xs text-cyber-cyan">guest@oga-node:~$</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                placeholder="Type 'help' and press Enter..."
                className="flex-1 bg-transparent border-none text-xs font-mono text-white focus:outline-none placeholder-slate-600"
              />
              <button type="submit" className="text-[10px] font-mono font-bold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyber-cyan border border-cyan-500/25 px-2.5 py-1 rounded transition-all duration-200">
                EXEC
              </button>
            </form>

          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-20 bg-slate-950/40 relative border-t border-slate-900 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto space-y-3 mb-16">
            <span className="font-mono text-xs text-cyber-cyan tracking-widest uppercase block"></span>
            <h2 className="text-3xl font-display font-bold text-white tracking-tight">
              Get In Touch
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Securely transmit your inquiry or connect directly via mobile communication.
            </p>
          </div>

          <div className="grid md:grid-cols-12 gap-12 max-w-5xl mx-auto">
            
            {/* Left Contact Coordinates */}
            <div className="md:col-span-5 space-y-6">
              <h3 className="font-display text-xl font-bold text-white tracking-wide">
                Secure Channels
              </h3>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Connect directly for consultations, hardware support, or customized computing instruction inquiries.
              </p>

              <div className="space-y-4 font-mono text-xs">
                {/* Channel 1: Phone */}
                <div className="flex items-center space-x-4 p-4 bg-slate-900/60 border border-slate-800/80 rounded-lg">
                  <Phone className="w-5 h-5 text-cyber-cyan" />
                  <div>
                    <p className="text-slate-500 text-[10px] uppercase">Phone Line</p>
                    <a href="tel:+2347056017458" className="text-white hover:text-cyber-cyan font-bold transition-colors">
                      +234 705 601 7458
                    </a>
                  </div>
                </div>

                {/* Channel 2: WhatsApp */}
                <div className="flex items-center space-x-4 p-4 bg-slate-900/60 border border-slate-800/80 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-slate-500 text-[10px] uppercase">WhatsApp Chat</p>
                    <a
                      href="https://wa.me/2347056017458?text=Hello%20Adedayo,%20I%20visited%20your%20biodata%20website%20and%20would%20love%20to%20connect!"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-emerald-400 font-bold flex items-center transition-colors"
                    >
                      +234 705 601 7458
                      <ArrowUpRight className="w-3 h-3 ml-1 text-emerald-400" />
                    </a>
                  </div>
                </div>

                {/* Channel 3: Email */}
                <div className="flex items-center space-x-4 p-4 bg-slate-900/60 border border-slate-800/80 rounded-lg">
                  <Mail className="w-5 h-5 text-cyber-cyan" />
                  <div>
                    <p className="text-slate-500 text-[10px] uppercase">Email Channel</p>
                    <a href="mailto:adedayo@example.com" className="text-white hover:text-cyber-cyan font-bold transition-colors">
                      adedayolatunde@gmail.com
                    </a>
                  </div>
                </div>

                {/* Channel 4: Location */}
                <div className="flex items-center space-x-4 p-4 bg-slate-900/60 border border-slate-800/80 rounded-lg">
                  <MapPin className="w-5 h-5 text-cyber-cyan" />
                  <div>
                    <p className="text-slate-500 text-[10px] uppercase">Node Location</p>
                    <span className="text-white font-bold">Lagos, Nigeria</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Contact Form / Success state */}
            <div className="md:col-span-7">
              <AnimatePresence mode="wait">
                {!submittedData ? (
                  <motion.form
                    key="contact-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleFormSubmit}
                    className="bg-cyber-card backdrop-blur-md border border-slate-800/85 p-6 rounded-2xl shadow-xl space-y-4"
                  >
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] text-slate-500 uppercase tracking-wider block">Your Name</label>
                        <input
                          type="text"
                          required
                          value={formState.name}
                          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                          placeholder="Adedayo O."
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 placeholder-slate-700"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] text-slate-500 uppercase tracking-wider block">Your Email</label>
                        <input
                          type="email"
                          required
                          value={formState.email}
                          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                          placeholder="name@domain.com"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 placeholder-slate-700"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-mono text-[10px] text-slate-500 uppercase tracking-wider block">Subject</label>
                      <input
                        type="text"
                        required
                        value={formState.subject}
                        onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                        placeholder="Project Partnership / Support Booking"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 placeholder-slate-700"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-mono text-[10px] text-slate-500 uppercase tracking-wider block">Message Details</label>
                      <textarea
                        rows={4}
                        required
                        value={formState.message}
                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                        placeholder="Write details of your support or coaching inquiry here..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 placeholder-slate-700 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-55 text-black font-semibold font-display tracking-wider text-sm py-3.5 rounded-lg transition-all duration-300 shadow-lg cursor-pointer shadow-cyan-500/10"
                    >
                      {isSubmitting ? "TRANSMITTING..." : "TRANSMIT MESSAGE SECURELY"}
                      <Send className="w-4 h-4 ml-2" />
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="receipt-form"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-slate-950 border border-emerald-500/20 p-6 rounded-2xl shadow-xl space-y-6"
                  >
                    <div className="flex items-center space-x-3 text-emerald-400 border-b border-emerald-500/10 pb-4">
                      <ShieldCheck className="w-8 h-8" />
                      <div>
                        <h3 className="font-display font-bold text-lg text-white">TRANSMISSION SECURED</h3>
                        <p className="font-mono text-[9px] text-emerald-400 uppercase tracking-widest">
                          STATUS: DATA_PACKET_RECEIVED_100
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 font-mono text-xs text-slate-300">
                      <p className="text-[11px] leading-relaxed text-slate-400">
                        The console packet was processed successfully. A secure record was stamped with Nigerian Time zone parameters:
                      </p>

                      <div className="space-y-2.5 bg-slate-900/60 p-4 rounded-lg border border-slate-800">
                        <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                          <span className="text-slate-500">SENDER:</span>
                          <span className="text-white font-bold">{submittedData.name}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                          <span className="text-slate-500">EMAIL:</span>
                          <span className="text-white">{submittedData.email}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                          <span className="text-slate-500">SUBJECT:</span>
                          <span className="text-white font-semibold">{submittedData.subject}</span>
                        </div>
                        <div className="pt-1">
                          <span className="text-slate-500 block">MESSAGE PAYLOAD:</span>
                          <span className="text-slate-300 mt-1 block leading-relaxed italic">
                            "{submittedData.message}"
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2">
                        <span>SIG_HASH: MD5_OGA_SECURE_REPLY</span>
                        <span>STAMP: {lagosTime}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSubmittedData(null)}
                      className="w-full text-center bg-slate-900 hover:bg-slate-800 border border-emerald-500/30 text-emerald-400 font-mono text-xs py-2.5 rounded-lg transition-colors duration-200"
                    >
                      TRANSMIT ANOTHER PACKET
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-cyber-dark border-t border-slate-900 py-12 relative z-10 font-mono text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-1">
            <span className="text-sm font-bold text-white tracking-widest">[O.G.A]</span>
            <p className="text-slate-500 text-[11px] mt-1">
              &copy; {new Date().getFullYear()} Adedayo Olatunde-Peters. All rights reserved.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-slate-400">
            <a href="#home" className="hover:text-cyber-cyan transition-colors">Home</a>
            <a href="#about" className="hover:text-cyber-cyan transition-colors">About</a>
            <a href="#services" className="hover:text-cyber-cyan transition-colors">Services</a>
            <a href="#skills" className="hover:text-cyber-cyan transition-colors">Skills</a>
            <a href="#certifications" className="hover:text-cyber-cyan transition-colors">Certifications</a>
            <a href="#contact" className="hover:text-cyber-cyan transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
