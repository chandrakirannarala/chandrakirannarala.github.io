/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from "react";
import { motion } from "motion/react";
import { 
  Search, 
  Code, 
  Terminal, 
  Share2, 
  Home, 
  Cpu, 
  User, 
  AtSign, 
  FileUp, 
  Settings, 
  ScrollText,
  Network,
  ArrowRight,
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
  ExternalLink
} from "lucide-react";

// --- Types ---

interface Project {
  id: string;
  title: string;
  desc: string;
  details: string;
  status: string;
  link: string;
  tags: string[];
  category: string;
}

const PROJECTS_DATA: Project[] = [
  {
    id: "PRJ_01",
    title: "SubwayCatch",
    category: "REAL-TIME_TRANSIT_BOT",
    desc: "Production-grade Telegram bot delivering real-time NYC subway arrivals using MTA GTFS-Realtime feeds.",
    details: "A high-performance Python bot that sits between the Telegram Bot API and MTA GTFS-RT API. Implements a four-stage async pipeline: command validation, feed resolution, protobuf parsing, and HTML delivery. Uses asyncio.gather for concurrent fetching, achieving a ~75% reduction in latency compared to sequential methods. Features O(1) station metadata lookup and robust error handling for complex transit hubs like Times Square. The codebase is architected across four modules: bot.py (lifecycle), mta_api.py (protobuf decoding), station_data.py (static mapping), and utils.py (helpers).",
    status: "75% LATENCY REDUCTION",
    link: "https://github.com/chandrakirannarala/SubwayCatch",
    tags: ["PYTHON", "GTFS-RT", "ASYNCIO", "TELEGRAM-API"]
  },
  {
    id: "PRJ_02",
    title: "FIX_Parser_FPGA",
    category: "FINANCIAL_ACCELERATION",
    desc: "Ultra-low latency FPGA-based FIX parser for financial market data. Leveraging parallelism and hardware-optimized state machines to achieve near-instantaneous message parsing.",
    details: "Implemented a high-speed FIX (Financial Information eXchange) protocol parser on a Xilinx Artix-7 FPGA. Achieved sub-microsecond latency by using a pipelined architecture and custom FSMs. Integrated with 10G Ethernet IP for real-time data ingestion. Optimized for High-Frequency Trading (HFT) environments where every nanosecond counts.",
    status: "PRODUCTION_READY",
    link: "https://github.com/chandrakirannarala/fpga_accelerate_FIX",
    tags: ["VERILOG", "FPGA", "HFT", "ARTIX-7"]
  },
  {
    id: "PRJ_03",
    title: "RISC-V_Processor",
    category: "COMPUTER_ARCHITECTURE",
    desc: "Architecting a 32-bit RISC-V RV32I processor with a 5-stage pipeline in Verilog, deployed on Basys3.",
    details: "Designed a complete RV32I ISA compliant processor. Features include a 5-stage pipeline (Fetch, Decode, Execute, Memory, Writeback), hazard detection, and forwarding logic to handle data and control hazards. Verified through extensive simulation and hardware testing on Basys3 FPGA. Achieved 100MHz operation frequency.",
    status: "100MHZ OPERATION",
    link: "https://github.com/chandrakirannarala/EL6463-Team-Project",
    tags: ["VERILOG", "RISC-V", "PIPELINING", "BASYS3"]
  },
  {
    id: "PRJ_04",
    title: "SRAM_Array_7nm",
    category: "VLSI_DESIGN",
    desc: "High-performance 256x32 SRAM array on 7nm node. Optimized for stability and power efficiency.",
    details: "Custom design of a 256x32 SRAM memory array using a 7nm FinFET process. Focused on optimizing the 6T bitcell for Static Noise Margin (SNM) and minimizing leakage power. Designed peripheral circuitry including sense amplifiers, row decoders, and column muxes. Verified using HSPICE simulations across various PVT corners.",
    status: "HSPICE VERIFIED",
    link: "#",
    tags: ["HSPICE", "7NM", "FINFET", "SRAM"]
  },
  {
    id: "PRJ_05",
    title: "MA_Crossover",
    category: "ALGORITHMIC_TRADING",
    desc: "Event-driven trading strategy with live data fetching and real-time dashboard visualization.",
    details: "Developed a Python-based event-driven backtesting engine. Implemented a Moving Average Crossover strategy. Integrated with Alpha Vantage API for live market data and used Streamlit for real-time performance visualization. Includes risk management modules and performance metrics calculation (Sharpe ratio, Max Drawdown).",
    status: "LIVE_PROTOTYPE",
    link: "https://github.com/chandrakirannarala/Event-Driven-MA-Crossover-Strategy",
    tags: ["PYTHON", "ALGO-TRADING", "STREAMLIT", "API"]
  },
  {
    id: "PRJ_06",
    title: "Pong_FPGA",
    category: "HARDWARE_GAMING",
    desc: "Low-latency Pong game on Artix-7 using VGA controller and custom FSMs for responsive control.",
    details: "Created a classic Pong game entirely in hardware using Verilog. Implemented a VGA controller (640x480 @ 60Hz), collision detection logic, and score tracking. Used rotary encoders for paddle control to ensure zero-lag input response. Deployed on Nexys A7 development board.",
    status: "60HZ_VGA",
    link: "https://github.com/chandrakirannarala/FPGA-Ping-Pong-Game",
    tags: ["VERILOG", "VGA", "FSM", "ARTIX-7"]
  },
  {
    id: "PRJ_07",
    title: "Heart_Monitor",
    category: "BIOMEDICAL_EMBEDDED",
    desc: "Real-time heart rate and BP monitor using STM32F429I and MPR sensor via SPI protocol.",
    details: "Embedded system project using an STM32 microcontroller. Interfaced with an MPR pressure sensor to capture pulse waves. Implemented digital signal processing (DSP) filters to extract heart rate and estimate blood pressure. Displayed real-time waveforms on the built-in LCD using the LTDC controller.",
    status: "98%_ACCURACY",
    link: "https://github.com/chandrakirannarala/BloodPressureMonitor",
    tags: ["C", "STM32", "SPI", "DSP"]
  },
  {
    id: "PRJ_08",
    title: "MBIST_Engine",
    category: "DFT_DESIGN",
    desc: "Designed an MBIST engine for a 256x4b SRAM array using March C- algorithm for fault detection.",
    details: "Developed a Memory Built-In Self-Test (MBIST) controller to automate the testing of embedded SRAM. Implemented the March C- algorithm to detect stuck-at, transition, and coupling faults. Integrated the engine with the SRAM wrapper for seamless at-speed testing. Verified with Verilog testbenches.",
    status: "VERILOG_VERIFIED",
    link: "#",
    tags: ["VERILOG", "DFT", "MBIST", "SRAM"]
  },
  {
    id: "PRJ_09",
    title: "Fingerprint_Matcher",
    category: "IMAGE_PROCESSING",
    desc: "Fingerprint matching system with a GUI interface for secure authentication and database management.",
    details: "MATLAB-based image processing project. Implemented minutiae extraction and matching algorithms. Built a user-friendly GUI for enrolling new fingerprints and verifying identities against a local database. Achieved high matching accuracy through optimized feature extraction.",
    status: "MATLAB_GUI",
    link: "#",
    tags: ["MATLAB", "GUI", "BIOMETRICS", "SECURITY"]
  }
];

// --- Components ---

const ProjectModal = ({ project, onClose }: { project: Project, onClose: () => void }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-background/90 backdrop-blur-md overflow-hidden"
    onClick={onClose}
  >
    {/* Scanline Effect */}
    <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
    
    <motion.div 
      initial={{ scale: 0.95, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.95, opacity: 0, y: 20 }}
      className="bg-surface border-2 border-primary/30 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative p-6 md:p-12 shadow-[0_0_50px_rgba(127,238,100,0.1)]"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Terminal Header */}
      <div className="flex items-center justify-between mb-8 border-b border-primary/20 pb-4">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-primary" />
          <span className="font-mono text-xs text-primary/60 uppercase tracking-widest">PROJECT_DETAILS_v2.4</span>
        </div>
        <button 
          onClick={onClose}
          className="text-primary/40 hover:text-primary transition-colors flex items-center gap-2 font-mono text-xs"
        >
          [ESC] CLOSE
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="font-mono text-[10px] md:text-xs text-primary/40 mb-2 uppercase tracking-widest">{project.id} // {project.category}</div>
          <h2 className="text-3xl md:text-6xl font-bold text-primary mb-8 font-mono lowercase tracking-tighter leading-none">{project.title}</h2>
          
          <div className="space-y-8">
            <div>
              <div className="text-primary/40 font-mono text-[10px] uppercase mb-3 tracking-widest">// DESCRIPTION</div>
              <div className="text-muted font-mono text-sm md:text-lg leading-relaxed">
                {project.desc}
              </div>
            </div>
            
            <div>
              <div className="text-primary/40 font-mono text-[10px] uppercase mb-3 tracking-widest">// TECHNICAL_DEEP_DIVE</div>
              <div className="text-ink/90 font-mono text-sm md:text-base leading-relaxed bg-background/50 p-6 border-l-2 border-primary/30">
                {project.details}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <div className="text-primary/40 font-mono text-[10px] uppercase mb-4 tracking-widest">// TECH_STACK</div>
            <div className="flex flex-wrap gap-2">
              {project.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-background border border-primary/10 text-primary/60 font-mono text-[10px] uppercase">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="text-primary/40 font-mono text-[10px] uppercase mb-4 tracking-widest">// SYSTEM_STATUS</div>
            <div className="flex items-center gap-3 px-4 py-3 bg-background border border-primary/10 font-mono text-xs text-primary">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_#7FEE64]"></span>
              {project.status}
            </div>
          </div>

          <div className="pt-6">
            <a 
              href={project.link} 
              target="_blank" 
              rel="noreferrer" 
              className={`btn-primary w-full flex items-center justify-center gap-3 py-4 ${project.link === "#" ? "opacity-50 pointer-events-none" : ""}`}
            >
              <Github className="w-5 h-5" />
              ACCESS_REPOSITORY
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="fixed top-0 w-full flex justify-between items-center px-4 md:px-6 h-14 bg-background/90 backdrop-blur-xl border-b border-primary/10 z-50">
      <div className="text-primary font-mono font-bold tracking-[0.2em] text-sm md:text-lg truncate mr-2">
        TERMINAL_USER_v1.0
      </div>
      
      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-8 font-mono uppercase tracking-tighter text-sm">
        <a className="text-primary border-b-2 border-primary hover:bg-surface transition-all duration-150" href="#home">DIRECTORY</a>
        <a className="text-primary/60 hover:text-primary hover:bg-surface transition-all duration-150" href="#projects">PROJECTS</a>
        <a className="text-primary/60 hover:text-primary hover:bg-surface transition-all duration-150" href="#about">ABOUT</a>
        <a className="text-primary/60 hover:text-primary hover:bg-surface transition-all duration-150" href="#contact">CONTACT</a>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="relative hidden sm:flex items-center bg-surface px-3 py-1 border-b border-primary/30">
          <Search className="w-4 h-4 text-primary mr-2" />
          <input 
            className="bg-transparent border-none focus:ring-0 text-xs font-mono text-primary placeholder:text-primary/30 w-24 lg:w-48 transition-all" 
            placeholder="SEARCH..." 
            type="text"
          />
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <a href="https://github.com/chandrakirannarala" target="_blank" rel="noreferrer">
            <Github className="w-5 h-5 text-primary cursor-pointer hover:bg-surface p-1" />
          </a>
          <a href="https://www.linkedin.com/in/chandrakirannarala/" target="_blank" rel="noreferrer">
            <Linkedin className="w-5 h-5 text-primary cursor-pointer hover:bg-surface p-1" />
          </a>
        </div>
        
        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-1 text-primary hover:bg-surface transition-colors"
        >
          {isOpen ? <AtSign className="w-6 h-6" /> : <Terminal className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-14 left-0 w-full bg-background border-b border-primary/20 p-6 flex flex-col gap-6 md:hidden z-40 shadow-2xl"
        >
          <a onClick={() => setIsOpen(false)} className="text-primary font-mono text-lg lowercase" href="#home">/home</a>
          <a onClick={() => setIsOpen(false)} className="text-primary font-mono text-lg lowercase" href="#projects">/projects</a>
          <a onClick={() => setIsOpen(false)} className="text-primary font-mono text-lg lowercase" href="#about">/about</a>
          <a onClick={() => setIsOpen(false)} className="text-primary font-mono text-lg lowercase" href="#contact">/contact</a>
          <div className="flex gap-4 pt-4 border-t border-primary/10">
            <a href="https://github.com/chandrakirannarala" target="_blank" rel="noreferrer"><Github className="w-6 h-6 text-primary" /></a>
            <a href="https://www.linkedin.com/in/chandrakirannarala/" target="_blank" rel="noreferrer"><Linkedin className="w-6 h-6 text-primary" /></a>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

const Sidebar = () => (
  <aside className="sticky top-14 h-[calc(100vh-3.5rem)] flex flex-col p-4 bg-surface/30 backdrop-blur-md w-16 lg:w-64 shrink-0 border-r border-primary/5 hidden md:flex overflow-hidden group transition-all duration-300">
    <div className="mb-10 opacity-0 lg:opacity-100 group-hover:opacity-100 transition-opacity duration-300">
      <div className="text-primary font-mono font-black text-xs uppercase tracking-widest whitespace-nowrap">DIRECTORY</div>
      <div className="text-primary/40 font-mono text-[10px] mt-1 whitespace-nowrap">root/dev/personal</div>
    </div>
    <nav className="flex-grow space-y-4">
      <SidebarItem icon={<Home className="w-5 h-5" />} label="Home" href="#home" />
      <SidebarItem icon={<Cpu className="w-5 h-5" />} label="Projects" href="#projects" />
      <SidebarItem icon={<User className="w-5 h-5" />} label="About" href="#about" />
      <SidebarItem icon={<AtSign className="w-5 h-5" />} label="Contact" href="#contact" />
    </nav>
    <div className="mt-auto pt-6 border-t border-primary/10">
      <a href="assets/resume.pdf" target="_blank" rel="noreferrer" className="btn-primary w-full flex items-center justify-center gap-2 overflow-hidden">
        <FileUp className="w-4 h-4" />
        <span className="lg:block hidden group-hover:block transition-all whitespace-nowrap">VIEW_RESUME</span>
      </a>
      <div className="mt-6 space-y-4 opacity-0 lg:opacity-100 group-hover:opacity-100 transition-opacity duration-300">
        <a className="flex items-center gap-3 px-3 py-1 text-muted hover:text-primary font-mono text-xs whitespace-nowrap" href="#experience">
          <ScrollText className="w-4 h-4" />
          <span className="lg:block hidden">Experience</span>
        </a>
        <a className="flex items-center gap-3 px-3 py-1 text-muted hover:text-primary font-mono text-xs whitespace-nowrap" href="#education">
          <Terminal className="w-4 h-4" />
          <span className="lg:block hidden">Education</span>
        </a>
      </div>
    </div>
  </aside>
);

const SidebarItem = ({ icon, label, href }: { icon: React.ReactNode, label: string, href: string }) => (
  <a className="flex items-center gap-4 p-2 lg:p-3 font-mono lowercase text-base transition-all group/item text-muted hover:bg-surface-high hover:text-primary" href={href}>
    {icon}
    <span className="lg:block hidden group-hover:block transition-all">{label}</span>
  </a>
);

const Hero = () => (
  <section id="home" className="mb-16 md:mb-24 scroll-mt-20">
    <div className="flex flex-col-reverse lg:flex-row gap-10 lg:gap-16 items-start">
      <div className="flex-grow w-full">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-mono font-bold text-4xl sm:text-5xl md:text-6xl lg:text-[83px] tracking-tighter text-primary mb-4 leading-none break-all"
        >
          CHANDRA_KIRAN_NARALA
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="font-mono text-lg md:text-xl text-primary/60 tracking-tight mb-8"
        >
          FPGA Design // Hardware Design // ASIC Design Engineer
        </motion.p>
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl mb-12 text-muted font-mono text-sm md:text-base leading-relaxed"
        >
          Hi, I'm Chandra Kiran Narala. Actively looking for ASIC/ FPGA and Hardware design Engineer roles. I build high-performance, low-latency systems using FPGA acceleration.
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-muted">
          <div className="border-l-2 border-primary/20 pl-4 md:pl-6 py-2">
            <div className="text-primary mb-2 font-bold">CONTACT</div>
            <div className="text-ink/80 lowercase">chandrakirannarala@gmail.com</div>
          </div>
          <div className="border-l-2 border-primary/20 pl-4 md:pl-6 py-2">
            <div className="text-primary mb-2 font-bold">STATUS</div>
            <div className="flex items-center gap-3 text-ink/80">
              <span className="w-3 h-3 bg-primary rounded-full animate-pulse shadow-[0_0_8px_#7FEE64]"></span>
              READY_FOR_HIRE
            </div>
          </div>
        </div>
      </div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-[240px] md:max-w-[280px] aspect-square bg-surface border border-primary/10 relative group shrink-0 self-center lg:self-start lg:mt-4"
      >
        <img 
          alt="Terminal Profile" 
          className="w-full h-full object-cover grayscale contrast-125 opacity-40 group-hover:opacity-80 transition-all duration-500" 
          src="assets/profile.png"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 border-[8px] border-background group-hover:border-background/50 transition-all"></div>
        <div className="absolute -bottom-3 -right-3 bg-primary text-background px-3 py-1.5 font-mono font-bold text-xs uppercase tracking-tighter shadow-lg z-10">
          IMG_0x442
        </div>
      </motion.div>
    </div>
  </section>
);

const About = () => (
  <section id="about" className="mb-16 md:mb-24 scroll-mt-20">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 border-b border-primary/10 pb-6 gap-4">
      <h2 className="font-mono text-xl md:text-2xl font-bold text-primary lowercase tracking-tighter flex items-center gap-4">
        <User className="w-6 h-6 md:w-8 md:h-8" />
        About Me
      </h2>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="space-y-6 text-muted font-mono text-sm md:text-base leading-relaxed"
      >
        <p>
          I am an experienced engineer specializing in FPGA/ASIC design, Verilog, and robust coding skills. I am actively seeking a full-time position as an FPGA/ASIC Design Engineer to apply my in-depth knowledge of semiconductor technologies.
        </p>
        <p>
          I aim to contribute to cutting-edge projects, optimize ASIC architectures, and play a key role in the development of high-performance integrated circuits.
        </p>
        <div className="pt-4">
          <a href="#contact" className="btn-outline inline-block">Initialize_Contact</a>
        </div>
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="bg-surface p-8 border border-primary/10 font-mono text-xs"
      >
        <div className="text-primary mb-4">// Technical_Stack</div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-ink font-bold mb-2">Languages</div>
            <ul className="space-y-1 text-muted">
              <li>Verilog / SystemVerilog</li>
              <li>Python / C++</li>
              <li>TCL / Bash</li>
            </ul>
          </div>
          <div>
            <div className="text-ink font-bold mb-2">Tools</div>
            <ul className="space-y-1 text-muted">
              <li>Vivado / Quartus</li>
              <li>HSPICE / Cadence</li>
              <li>Wireshark / Git</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

const Projects = () => {
  const [selectedProject, setSelectedProject] = React.useState<Project | null>(null);

  return (
    <section id="projects" className="mb-16 md:mb-24 scroll-mt-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 border-b border-primary/10 pb-6 gap-4">
        <h2 className="font-mono text-xl md:text-2xl font-bold text-primary lowercase tracking-tighter flex items-center gap-4">
          <Cpu className="w-6 h-6 md:w-8 md:h-8" />
          Active Projects
        </h2>
        <a className="font-mono text-[10px] md:text-xs text-muted hover:text-primary transition-colors border border-muted/30 px-4 py-1 hover:border-primary/50" href="https://github.com/chandrakirannarala" target="_blank" rel="noreferrer">VIEW_ALL_REPOS</a>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        {/* Main Featured Card */}
        <motion.div 
          whileHover={{ scale: 1.005, backgroundColor: "rgba(127, 238, 100, 0.02)" }}
          onClick={() => setSelectedProject(PROJECTS_DATA[0])}
          className="md:col-span-4 bg-surface/30 border border-primary/10 p-6 md:p-10 group relative overflow-hidden min-h-[350px] md:min-h-[400px] flex flex-col justify-center cursor-pointer"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
          <div className="absolute top-0 right-0 p-4 md:p-6 font-mono text-[10px] md:text-xs text-primary/20 uppercase tracking-[0.3em]">{PROJECTS_DATA[0].id} // FEATURED_SYSTEM</div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <div className="text-primary font-mono text-xs md:text-sm tracking-[0.3em] uppercase">{PROJECTS_DATA[0].category}</div>
            </div>
            
            <h3 className="text-3xl md:text-6xl font-bold text-ink mb-6 font-mono lowercase break-words tracking-tighter group-hover:text-primary transition-colors">{PROJECTS_DATA[0].title}</h3>
            
            <p className="text-muted font-mono text-sm md:text-lg max-w-2xl mb-10 leading-relaxed group-hover:text-ink transition-colors">
              {PROJECTS_DATA[0].desc}
            </p>
            
            <div className="flex flex-wrap gap-2 md:gap-3 mb-12">
              {PROJECTS_DATA[0].tags.slice(0, 4).map(tag => (
                <span key={tag} className="px-3 py-1 bg-surface border border-primary/20 text-primary/60 font-mono text-[10px] md:text-xs uppercase">{tag}</span>
              ))}
            </div>
            
            <div className="flex items-center gap-4">
              <button className="btn-primary px-8 py-3 flex items-center gap-2">
                INITIALIZE_LOG_VIEW <ArrowRight className="w-4 h-4" />
              </button>
              <span className="hidden sm:block font-mono text-[10px] text-primary/40 uppercase tracking-widest">SYSTEM_READY_FOR_INSPECTION</span>
            </div>
          </div>
          
          <div className="absolute -right-20 -bottom-20 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700 pointer-events-none rotate-12">
            <Network className="w-[200px] h-[200px] md:w-[400px] md:h-[400px]" />
          </div>
        </motion.div>
        
        {/* Side Stack */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <ProjectSmall 
            project={PROJECTS_DATA[1]}
            onClick={() => setSelectedProject(PROJECTS_DATA[1])}
          />
          <ProjectSmall 
            project={PROJECTS_DATA[2]}
            onClick={() => setSelectedProject(PROJECTS_DATA[2])}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {PROJECTS_DATA.slice(3).map(project => (
          <ProjectSmall 
            key={project.id}
            project={project}
            onClick={() => setSelectedProject(project)}
          />
        ))}
      </div>

      {/* Modal Portal */}
      {selectedProject && (
        <ProjectModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}
    </section>
  );
};

interface ProjectSmallProps {
  project: Project;
  onClick: () => void;
}

const ProjectSmall: React.FC<ProjectSmallProps> = ({ project, onClick }) => (
  <motion.div 
    onClick={onClick}
    whileHover={{ x: 4, backgroundColor: "rgba(127, 238, 100, 0.05)" }}
    className="flex-grow bg-surface p-6 md:p-8 border border-primary/5 hover:border-primary/30 transition-all group block cursor-pointer relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
      <ArrowUpRight className="w-4 h-4 text-primary" />
    </div>
    <div className="text-primary font-mono text-[10px] md:text-xs mb-4 uppercase tracking-widest flex items-center gap-2">
      <span className="w-1 h-1 bg-primary/40"></span>
      {project.id}
    </div>
    <h3 className="text-xl md:text-2xl font-bold text-ink mb-4 font-mono lowercase group-hover:text-primary transition-colors">{project.title}</h3>
    <p className="text-muted font-mono text-sm leading-relaxed mb-8 line-clamp-3 group-hover:text-ink/80 transition-colors">{project.desc}</p>
    <div className="flex items-center justify-between mt-auto pt-4 border-t border-primary/5">
      <span className="text-primary/60 font-mono text-[10px] md:text-xs uppercase tracking-tighter">{project.status}</span>
      <div className="flex items-center gap-2 text-primary font-mono text-[10px] uppercase opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
        READ_LOG <ArrowRight className="w-3 h-3" />
      </div>
    </div>
  </motion.div>
);

const Experience = () => (
  <section id="experience" className="mb-16 md:mb-24 scroll-mt-20">
    <div className="flex items-center justify-between mb-8 border-b border-primary/10 pb-6">
      <h2 className="font-mono text-xl md:text-2xl font-bold text-primary lowercase tracking-tighter flex items-center gap-4">
        <ScrollText className="w-6 h-6 md:w-8 md:h-8" />
        Experience_Logs
      </h2>
    </div>
    <div className="space-y-0 divide-y divide-primary/5 border-y border-primary/5">
      <LogEntry 
        date="2024_JAN_PRESENT" 
        title="SRAM Design Engineer" 
        company="New York University, USA"
        desc="Designed & optimized 256x4b SRAM array, improving speed and reducing power by 20%. Executed Timing Analysis and verified with Cocotb." 
      />
      <LogEntry 
        date="2020_NOV_2021_DEC" 
        title="Software Engineer" 
        company="Cognizant Technology Solutions, India"
        desc="Optimized low-latency data pipelines, reducing packet delay by 20%. Analyzed network traffic with Wireshark to cut latency to 40ms." 
      />
    </div>
  </section>
);

const Education = () => (
  <section id="education" className="mb-16 md:mb-24 scroll-mt-20">
    <div className="flex items-center justify-between mb-8 border-b border-primary/10 pb-6">
      <h2 className="font-mono text-xl md:text-2xl font-bold text-primary lowercase tracking-tighter flex items-center gap-4">
        <Terminal className="w-6 h-6 md:w-8 md:h-8" />
        Education_History
      </h2>
    </div>
    <div className="space-y-0 divide-y divide-primary/5 border-y border-primary/5">
      <LogEntry 
        date="2022_2024" 
        title="Master of Science in Electrical Engineering" 
        company="New York University"
        desc="Specialization in Hardware Design and ASIC architectures." 
      />
      <LogEntry 
        date="2016_2020" 
        title="BTech in Electronics & Communication Engineering" 
        company="Gayatri Vidya Parishad College of Engineering"
        desc="Foundation in electronics, communication systems, and embedded logic." 
      />
    </div>
  </section>
);

const LogEntry = ({ date, title, company, desc }: { date: string, title: string, company: string, desc: string }) => (
  <motion.div 
    whileHover={{ backgroundColor: "rgba(23, 35, 20, 0.4)" }}
    className="grid grid-cols-1 md:grid-cols-12 py-6 md:py-8 transition-all group px-4 -mx-4"
  >
    <div className="md:col-span-2 font-mono text-[10px] md:text-xs text-muted mb-2 md:mb-0 group-hover:text-primary transition-colors">
      {date}
    </div>
    <div className="md:col-span-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
        <h4 className="font-mono text-base md:text-xl text-ink lowercase group-hover:text-primary transition-colors">{title}</h4>
        <span className="text-[10px] font-mono uppercase text-muted tracking-widest">{company}</span>
      </div>
      <p className="text-muted font-mono text-xs md:text-sm max-w-3xl group-hover:text-ink transition-colors">{desc}</p>
    </div>
  </motion.div>
);

const Contact = () => (
  <section id="contact" className="mb-24 scroll-mt-20">
    <div className="flex items-center justify-between mb-8 border-b border-primary/10 pb-6">
      <h2 className="font-mono text-xl md:text-2xl font-bold text-primary lowercase tracking-tighter flex items-center gap-4">
        <AtSign className="w-6 h-6 md:w-8 md:h-8" />
        Contact_Interface
      </h2>
    </div>
    <div className="max-w-2xl">
      <p className="text-muted font-mono text-sm md:text-base leading-relaxed mb-10">
        If you'd like to discuss opportunities or simply drop a message, please reach out via the secure channel below.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <a href="mailto:chandrakirannarala@gmail.com" className="bg-surface p-6 border border-primary/10 hover:border-primary/50 transition-all group flex items-center gap-4">
          <Mail className="w-6 h-6 text-primary" />
          <div>
            <div className="text-primary font-mono text-[10px] uppercase">Email</div>
            <div className="text-ink font-mono text-sm truncate">chandrakirannarala@gmail.com</div>
          </div>
        </a>
        <a href="https://www.linkedin.com/in/chandrakirannarala/" target="_blank" rel="noreferrer" className="bg-surface p-6 border border-primary/10 hover:border-primary/50 transition-all group flex items-center gap-4">
          <Linkedin className="w-6 h-6 text-primary" />
          <div>
            <div className="text-primary font-mono text-[10px] uppercase">LinkedIn</div>
            <div className="text-ink font-mono text-sm">/in/chandrakirannarala</div>
          </div>
        </a>
      </div>
      <div className="mt-12">
        <a href="mailto:chandrakirannarala@gmail.com" className="btn-primary inline-flex items-center gap-2">
          <ExternalLink className="w-4 h-4" />
          INITIALIZE_TRANSMISSION
        </a>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="w-full flex flex-col items-center gap-4 py-8 bg-background border-t border-primary/10 relative z-10 px-4 text-center">
    <div className="text-muted font-mono uppercase text-[8px] md:text-[10px] tracking-widest opacity-80">
      © 2024 CHANDRA_KIRAN_NARALA. ALL RIGHTS RESERVED.
    </div>
    <div className="flex items-center gap-3 opacity-40">
      <div className="flex gap-1">
        <span className="w-1 h-1 bg-primary rounded-full"></span>
        <span className="w-1 h-1 bg-primary rounded-full"></span>
        <span className="w-1 h-1 bg-primary rounded-full"></span>
      </div>
      <div className="text-[8px] md:text-[9px] font-mono text-primary tracking-widest uppercase">SECURE_CONNECTION_ESTABLISHED</div>
    </div>
  </footer>
);

export default function App() {
  useEffect(() => {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth'
          });
        }
      });
    });
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex pt-14">
        <Sidebar />
        <main className="flex-grow overflow-x-hidden p-6 md:p-12 lg:px-16 lg:py-12">
          <Hero />
          <Projects />
          <Experience />
          <About />
          <Education />
          <Contact />
        </main>
      </div>
      <Footer />
    </div>
  );
}
