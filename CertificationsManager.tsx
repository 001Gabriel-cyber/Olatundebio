import React, { useState, useEffect, useRef } from "react";
import { 
  Award, 
  Plus, 
  Trash2, 
  Upload, 
  Eye, 
  X, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Calendar, 
  Hash,
  ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
  image?: string; // base64 string
  isUploaded: boolean;
}

const DEFAULT_CERTIFICATIONS: Certification[] = [
  {
    id: "cert-1",
    name: "Google IT Support Professional Certificate",
    issuer: "Google / Coursera",
    date: "2021",
    credentialId: "G-IT-8849-OGA",
    isUploaded: false
  },
  {
    id: "cert-2",
    name: "Python Programming Fundamentals",
    issuer: "Cisco Networking Academy",
    date: "2022",
    credentialId: "PY-NET-5510-AOP",
    isUploaded: false
  },
  {
    id: "cert-3",
    name: "Advanced Web Design & UI Integration",
    issuer: "Lagos Tech Institute",
    date: "2023",
    credentialId: "WD-LTI-9014-LAP",
    isUploaded: false
  }
];

export default function CertificationsManager() {
  const [certs, setCerts] = useState<Certification[]>([]);
  const [name, setName] = useState("");
  const [issuer, setIssuer] = useState("");
  const [date, setDate] = useState("");
  const [credentialId, setCredentialId] = useState("");
  const [image, setImage] = useState<string | undefined>(undefined);
  const [imageName, setImageName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [activeCert, setActiveCert] = useState<Certification | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("oga_certifications");
    if (stored) {
      try {
        setCerts(JSON.parse(stored));
      } catch (e) {
        setCerts(DEFAULT_CERTIFICATIONS);
      }
    } else {
      setCerts(DEFAULT_CERTIFICATIONS);
      localStorage.setItem("oga_certifications", JSON.stringify(DEFAULT_CERTIFICATIONS));
    }
  }, []);

  // Sync to localStorage
  const saveCerts = (updatedCerts: Certification[]) => {
    setCerts(updatedCerts);
    localStorage.setItem("oga_certifications", JSON.stringify(updatedCerts));
  };

  // Convert File to Base64 String
  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Unsupported format. Please select an image file (PNG, JPG, WEBP).");
      return;
    }

    if (file.size > 1.5 * 1024 * 1024) {
      setError("File is too large. Max allowed image size is 1.5MB to ensure local storage stability.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImage(reader.result);
        setImageName(file.name);
        setError("");
      }
    };
    reader.onerror = () => {
      setError("Error reading file. Please try another image.");
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Create new certification
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim() || !issuer.trim() || !date.trim()) {
      setError("Please fill out all mandatory fields (Name, Issuer, and Issue Date).");
      return;
    }

    const newCert: Certification = {
      id: "cert-user-" + Date.now(),
      name: name.trim(),
      issuer: issuer.trim(),
      date: date.trim(),
      credentialId: credentialId.trim() || undefined,
      image,
      isUploaded: true
    };

    const updated = [newCert, ...certs];
    saveCerts(updated);

    // Reset Form
    setName("");
    setIssuer("");
    setDate("");
    setCredentialId("");
    setImage(undefined);
    setImageName("");
    setSuccess("Certification loaded into secure digital portfolio successfully.");

    setTimeout(() => setSuccess(""), 4000);
  };

  // Delete certification
  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to remove this certification from your portfolio?")) {
      const updated = certs.filter(c => c.id !== id);
      saveCerts(updated);
      if (activeCert?.id === id) {
        setActiveCert(null);
      }
    }
  };

  // Clear current image selection
  const clearSelectedImage = () => {
    setImage(undefined);
    setImageName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-12">
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Upload Form Box */}
        <div className="lg:col-span-5 bg-cyber-card backdrop-blur-md border border-slate-800/85 p-6 rounded-2xl shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-500 to-blue-500"></div>
          
          <div className="space-y-1.5 mb-6">
            <h3 className="font-display font-bold text-lg text-white flex items-center">
              <Upload className="w-4 h-4 mr-2 text-cyber-cyan" />
              Secure Certifications Portal
            </h3>
            <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">
              SYSTEM_ACTION: LOAD_CREDENTIAL_DATA
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 font-sans">
            {/* Cert Name */}
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] text-slate-500 uppercase tracking-wider block">
                Certificate Title *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. CompTIA Security+ / AWS Cloud Practitioner"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-4 text-xs text-white focus:outline-none focus:border-cyan-500/50 placeholder-slate-700"
              />
            </div>

            {/* Issuer */}
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] text-slate-500 uppercase tracking-wider block">
                Issuing Organization *
              </label>
              <input
                type="text"
                required
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
                placeholder="e.g. Google, CompTIA, Microsoft, Cisco"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-4 text-xs text-white focus:outline-none focus:border-cyan-500/50 placeholder-slate-700"
              />
            </div>

            {/* Date & Credential ID Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] text-slate-500 uppercase tracking-wider block">
                  Issue Date *
                </label>
                <input
                  type="text"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="e.g. Jan 2024 / 2023"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-4 text-xs text-white focus:outline-none focus:border-cyan-500/50 placeholder-slate-700"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[10px] text-slate-500 uppercase tracking-wider block">
                  Credential ID (Opt)
                </label>
                <input
                  type="text"
                  value={credentialId}
                  onChange={(e) => setCredentialId(e.target.value)}
                  placeholder="e.g. SEC-90234-A"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-4 text-xs text-white focus:outline-none focus:border-cyan-500/50 placeholder-slate-700"
                />
              </div>
            </div>

            {/* Drag & Drop File Zone */}
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] text-slate-500 uppercase tracking-wider block">
                Certificate Image File (Optional)
              </label>

              {!image ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center space-y-2 ${
                    isDragging 
                      ? "border-cyber-cyan bg-cyan-500/5 shadow-[0_0_12px_rgba(0,242,254,0.1)]" 
                      : "border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-950/90"
                  }`}
                >
                  <Upload className={`w-8 h-8 transition-colors ${isDragging ? 'text-cyber-cyan' : 'text-slate-500'}`} />
                  <div className="space-y-1">
                    <p className="text-xs text-slate-300 font-medium">
                      Drag & drop certificate image or <span className="text-cyber-cyan underline">browse</span>
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono uppercase">
                      PNG, JPG, WEBP (Max size: 1.5MB)
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <div className="w-10 h-10 rounded bg-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                      <img src={image} alt="Selected preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs text-white font-medium truncate">{imageName || "selected_certificate.jpg"}</p>
                      <p className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider flex items-center mt-0.5">
                        <CheckCircle className="w-3 h-3 mr-1" /> Ready
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={clearSelectedImage}
                    className="p-1.5 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Error and Success notifications */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="bg-red-500/10 border border-red-500/35 p-3 rounded-lg text-red-400 text-xs flex items-start space-x-2.5 font-mono"
                >
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="bg-emerald-500/10 border border-emerald-500/35 p-3 rounded-lg text-emerald-400 text-xs flex items-start space-x-2.5 font-mono"
                >
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{success}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold font-display tracking-wider text-xs py-3.5 rounded-lg transition-all duration-300 shadow-md cursor-pointer hover:shadow-cyan-400/20"
            >
              <Plus className="w-4 h-4 mr-1.5 stroke-[2.5]" />
              LOAD CERTIFICATION RECORD
            </button>
          </form>
        </div>

        {/* Certificates List View Grid */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-display font-semibold text-white tracking-wide flex items-center text-md">
              <Award className="w-5 h-5 text-cyber-cyan mr-2" />
              Verified Certificate Vault
            </h3>
            <span className="font-mono text-[10px] text-slate-500 bg-slate-950 border border-slate-800 px-2 py-0.5 rounded">
              TOTAL: {certs.length} RECORDS
            </span>
          </div>

          {certs.length === 0 ? (
            <div className="bg-slate-900/40 border border-slate-800 border-dashed rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-3">
              <Award className="w-12 h-12 text-slate-600 animate-pulse" />
              <p className="text-slate-400 text-sm font-medium">No certificates loaded in database.</p>
              <p className="text-slate-600 text-xs font-mono max-w-sm">
                Use the left-hand form to load custom hardware, network, or programming certifications into the system.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4 max-h-[580px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
              <AnimatePresence mode="popLayout">
                {certs.map((cert) => (
                  <motion.div
                    key={cert.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.25 }}
                    whileHover={{ y: -3 }}
                    className="bg-slate-900/65 border border-slate-800/80 hover:border-cyan-500/30 p-5 rounded-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                  >
                    {/* Glowing highlight tag for custom uploads */}
                    {cert.isUploaded && (
                      <span className="absolute top-0 right-12 bg-cyan-500/10 text-cyber-cyan border-b border-x border-cyan-500/20 px-2 py-0.5 text-[8px] font-mono rounded-b uppercase tracking-wider">
                        Custom
                      </span>
                    )}

                    <div className="space-y-3.5">
                      {/* Thumbnail Container */}
                      <div className="relative aspect-video w-full rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden">
                        {cert.image ? (
                          <img 
                            src={cert.image} 
                            alt={cert.name} 
                            className="w-full h-full object-cover filter brightness-[0.85] group-hover:scale-105 transition-transform duration-500" 
                          />
                        ) : (
                          /* Cyber template SVG/CSS Graphic */
                          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col justify-between p-3 select-none">
                            <div className="flex justify-between items-start">
                              <ShieldCheck className="w-5 h-5 text-cyan-400 opacity-60" />
                              <span className="font-mono text-[7px] text-slate-500 uppercase tracking-widest">
                                OGA_SECURE_VERIFIED
                              </span>
                            </div>
                            
                            <div className="space-y-0.5 text-center">
                              <h4 className="font-display font-bold text-[9px] text-slate-200 tracking-wide truncate max-w-xs px-2 leading-tight">
                                {cert.name}
                              </h4>
                              <p className="font-mono text-[7px] text-cyber-cyan tracking-wider">
                                ISSUER: {cert.issuer.toUpperCase()}
                              </p>
                            </div>

                            <div className="flex justify-between items-end border-t border-slate-800/60 pt-1.5 text-[7px] font-mono text-slate-500">
                              <span>DATE: {cert.date}</span>
                              <span className="text-[6px] tracking-tight">{cert.credentialId || "N/A"}</span>
                            </div>
                          </div>
                        )}

                        {/* Interactive Scanlines overlay */}
                        <div className="absolute inset-0 bg-cyan-500/[0.02] pointer-events-none"></div>

                        {/* Hover Overlay Button to open Lightbox */}
                        <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <button
                            onClick={() => setActiveCert(cert)}
                            className="inline-flex items-center justify-center bg-cyan-500 text-black font-semibold rounded-lg text-xs py-2 px-4 shadow-lg cursor-pointer transform hover:scale-105 transition-all font-display tracking-wide"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1.5 stroke-[2.5]" />
                            VERIFY & INSPECT
                          </button>
                        </div>
                      </div>

                      {/* Info lines */}
                      <div className="space-y-1">
                        <h4 className="font-display font-semibold text-white text-sm group-hover:text-cyber-cyan transition-colors line-clamp-1">
                          {cert.name}
                        </h4>
                        <p className="font-mono text-[10px] text-slate-400">
                          {cert.issuer}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3.5 border-t border-slate-950 flex items-center justify-between">
                      {/* Meta dates and ID */}
                      <div className="flex items-center space-x-3.5 font-mono text-[9px] text-slate-500">
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1 text-slate-600" />
                          {cert.date}
                        </span>
                        {cert.credentialId && (
                          <span className="flex items-center truncate max-w-[110px]">
                            <Hash className="w-3 h-3 mr-0.5 text-slate-600" />
                            {cert.credentialId}
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-1 flex-shrink-0">
                        <button
                          onClick={() => setActiveCert(cert)}
                          className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-cyber-cyan rounded-lg transition-all"
                          title="View Certificate Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        
                        {/* Users can delete user-uploaded certs, or optionally all certs */}
                        <button
                          onClick={(e) => handleDelete(cert.id, e)}
                          className="p-1.5 hover:bg-red-500/10 text-slate-600 hover:text-red-400 rounded-lg transition-all"
                          title="Delete Certificate Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

      </div>

      {/* Lightbox / High-Tech Modal Drawer */}
      <AnimatePresence>
        {activeCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={() => setActiveCert(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-slate-900 border border-slate-800/80 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl relative flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header bar */}
              <div className="bg-slate-950 px-6 py-4 flex items-center justify-between border-b border-slate-800/60 font-mono text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
                  <span className="text-white font-bold tracking-widest uppercase">
                    CREDENTIAL_VERIFICATION_MATRIX
                  </span>
                </div>
                <button
                  onClick={() => setActiveCert(null)}
                  className="p-1.5 bg-slate-900 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Modal Body Container */}
              <div className="p-6 overflow-y-auto flex-1 grid md:grid-cols-12 gap-8 scrollbar-thin scrollbar-thumb-slate-800">
                
                {/* Visual Certificate Frame */}
                <div className="md:col-span-7 flex flex-col justify-center">
                  <div className="relative aspect-video rounded-xl bg-slate-950 border border-cyan-500/20 shadow-2xl flex items-center justify-center overflow-hidden p-1.5">
                    {activeCert.image ? (
                      <img 
                        src={activeCert.image} 
                        alt={activeCert.name} 
                        className="w-full h-full object-contain max-h-[380px]" 
                      />
                    ) : (
                      /* Fully customized large scale CSS visual mock certificate */
                      <div className="w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-lg p-6 flex flex-col justify-between border border-slate-800 relative">
                        {/* Background structural noise watermark overlay */}
                        <div className="absolute inset-0 bg-cyan-500/[0.015] cyber-grid-bg rounded-lg pointer-events-none"></div>
                        
                        <div className="flex justify-between items-start relative z-10">
                          <div className="space-y-1">
                            <span className="font-mono text-[8px] text-cyber-cyan bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded tracking-widest uppercase">
                              OGA CORE SECURE NETWORK
                            </span>
                            <p className="font-mono text-[7px] text-slate-500 mt-1">SECURE ID: {activeCert.id}</p>
                          </div>
                          <ShieldCheck className="w-10 h-10 text-cyan-400 opacity-80" />
                        </div>

                        <div className="text-center space-y-3 relative z-10">
                          <h4 className="font-mono text-[9px] text-slate-400 tracking-widest uppercase">
                            CERTIFICATE OF SPECIALIZATION & VERIFICATION
                          </h4>
                          <div className="space-y-1">
                            <h3 className="font-display font-extrabold text-lg sm:text-xl text-white tracking-tight leading-tight px-4 text-glow-cyan">
                              {activeCert.name}
                            </h3>
                            <p className="font-sans text-[11px] text-slate-400">
                              This document officially registers the competence, training, and specialized mastery of
                            </p>
                            <p className="font-display font-bold text-base text-cyber-cyan mt-1 select-all">
                              ADEDAYO OLATUNDE-PETERS
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-between items-end border-t border-slate-800/80 pt-4 text-[9px] font-mono text-slate-400 relative z-10">
                          <div className="space-y-0.5">
                            <p className="text-slate-500 text-[8px] uppercase">Issuing Authority</p>
                            <p className="text-white font-bold">{activeCert.issuer}</p>
                          </div>
                          <div className="space-y-0.5 text-center">
                            <p className="text-slate-500 text-[8px] uppercase">Authentication Date</p>
                            <p className="text-white">{activeCert.date}</p>
                          </div>
                          <div className="space-y-0.5 text-right">
                            <p className="text-slate-500 text-[8px] uppercase">Credential Reference</p>
                            <p className="text-cyber-cyan font-bold select-all">{activeCert.credentialId || "SYS_VERIFIED_OGA"}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-center font-mono text-[10px] text-slate-500 mt-3 uppercase tracking-wider">
                    // AUTHENTIC_ENCRYPTED_SIGNATURE_OK
                  </p>
                </div>

                {/* Metadata details printout column */}
                <div className="md:col-span-5 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="border-b border-slate-800 pb-3">
                      <span className="font-mono text-[10px] text-cyber-cyan tracking-widest uppercase">
                        // CREDENTIAL_SPEC
                      </span>
                      <h3 className="text-xl font-display font-bold text-white mt-1">
                        {activeCert.name}
                      </h3>
                    </div>

                    <div className="space-y-3 font-mono text-xs">
                      <div>
                        <span className="text-slate-500 text-[10px] uppercase block">Issuing Organization</span>
                        <span className="text-white text-sm font-semibold mt-0.5 block">{activeCert.issuer}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-slate-500 text-[10px] uppercase block">Validation Date</span>
                          <span className="text-white text-sm mt-0.5 block">{activeCert.date}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] uppercase block">Database Origin</span>
                          <span className="text-cyber-cyan text-sm mt-0.5 block">
                            {activeCert.isUploaded ? "LOCAL_USER" : "SYSTEM_CORE"}
                          </span>
                        </div>
                      </div>

                      {activeCert.credentialId && (
                        <div>
                          <span className="text-slate-500 text-[10px] uppercase block">Secure Credential ID</span>
                          <span className="text-slate-200 text-xs font-bold font-mono select-all bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 mt-1 block">
                            {activeCert.credentialId}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-slate-800">
                    <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                      This certificate is fully cached inside the browser's persistent state container. If this is a physical paper or PDF credential, the digital record validates ICT capabilities in technical support, training, or code orchestration.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setActiveCert(null)}
                        className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs py-2.5 rounded-lg transition-colors border border-slate-700/50"
                      >
                        CLOSE INSPECTOR
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
