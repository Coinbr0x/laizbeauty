import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Sparkle,
  Scissors,
  Flower2,
  Calendar,
  Clock,
  MapPin,
  Phone,
  ChevronRight,
  CheckCircle,
  Menu,
  X,
  Compass,
  Github
} from 'lucide-react';

// Asset paths (referenced exactly as in DESIGN.md, served from root)
const BG_IMAGE_1 = 'nomakeup.png';
const BG_IMAGE_2 = 'withmakeup.png';

interface RevealLayerProps {
  image: string;
  cursorX: number;
  cursorY: number;
}

const RevealLayer: React.FC<RevealLayerProps> = ({ image, cursorX, cursorY }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const divRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // Clear canvas
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    // If mouse has not moved, hide or center the spotlight
    if (cursorX === -999) return;

    // Build radial gradient at cursor coordinates
    const SPOTLIGHT_R = 260;
    const grad = ctx.createRadialGradient(cursorX, cursorY, 0, cursorX, cursorY, SPOTLIGHT_R);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.4, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.6, 'rgba(255, 255, 255, 0.75)');
    grad.addColorStop(0.75, 'rgba(255, 255, 255, 0.4)');
    grad.addColorStop(0.88, 'rgba(255, 255, 255, 0.12)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cursorX, cursorY, SPOTLIGHT_R, 0, Math.PI * 2);
    ctx.fill();

    try {
      const dataUrl = canvas.toDataURL();
      if (divRef.current) {
        divRef.current.style.maskImage = `url(${dataUrl})`;
        divRef.current.style.webkitMaskImage = `url(${dataUrl})`;
        divRef.current.style.maskSize = '100% 100%';
        divRef.current.style.webkitMaskSize = '100% 100%';
      }
    } catch (e) {
      console.error("Mask image rendering error:", e);
    }
  }, [cursorX, cursorY, dimensions]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ display: 'none' }}
      />
      <div
        ref={divRef}
        className="absolute inset-0 bg-center bg-cover bg-no-repeat z-30 pointer-events-none transition-transform duration-1000 ease-out"
        style={{ backgroundImage: `url(${image})` }}
      />
    </>
  );
};

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Bespoke Makeup Artistry',
    date: '',
    time: '',
    notes: ''
  });

  const mouseRef = useRef({ x: -999, y: -999 });
  const smoothRef = useRef({ x: -999, y: -999 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (smoothRef.current.x === -999) {
        smoothRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    const updateSpotlight = () => {
      if (smoothRef.current.x !== -999) {
        // Linear interpolation (lerp) for smooth tracking
        smoothRef.current.x += (mouseRef.current.x - smoothRef.current.x) * 0.1;
        smoothRef.current.y += (mouseRef.current.y - smoothRef.current.y) * 0.1;
        setCursorPos({ x: smoothRef.current.x, y: smoothRef.current.y });
      }
      rafRef.current = requestAnimationFrame(updateSpotlight);
    };

    rafRef.current = requestAnimationFrame(updateSpotlight);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 tracking-[-0.02em] font-sans overflow-x-hidden">

      {/* Navigation (Fixed, over Hero) */}
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
        {/* Left Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <svg className="w-7 h-7" viewBox="0 0 256 256" fill="#ffffff">
            <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
          </svg>
          <span className="text-white text-2xl font-playfair italic tracking-wider">LaizBeauty</span>
        </div>

        {/* Center Pill Menu (Desktop) */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-2 py-1.5 items-center gap-1">
          <button
            onClick={() => scrollToSection('hero')}
            className="text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-white/10 transition-colors"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection('services')}
            className="text-white/80 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-white/10 hover:text-white transition-colors"
          >
            Services
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className="text-white/80 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-white/10 hover:text-white transition-colors"
          >
            Philosophy
          </button>
          <button
            onClick={() => scrollToSection('booking')}
            className="text-white/80 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-white/10 hover:text-white transition-colors"
          >
            Book Now
          </button>
        </div>

        {/* Right CTA (Desktop) */}
        <div className="hidden md:block">
          <button
            onClick={() => scrollToSection('booking')}
            className="bg-white text-black text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-zinc-200 transition-all hover:scale-[1.03] active:scale-95 shadow-md shadow-white/5"
          >
            Reserve Session
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white hover:text-zinc-300 p-1"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[99] bg-black/95 backdrop-blur-lg flex flex-col justify-center items-center gap-8 md:hidden transition-all duration-300">
          <button onClick={() => scrollToSection('hero')} className="text-3xl font-playfair italic text-white hover:text-[#e8702a] transition-colors">Home</button>
          <button onClick={() => scrollToSection('services')} className="text-3xl font-playfair italic text-white hover:text-[#e8702a] transition-colors">Services</button>
          <button onClick={() => scrollToSection('about')} className="text-3xl font-playfair italic text-white hover:text-[#e8702a] transition-colors">Philosophy</button>
          <button onClick={() => scrollToSection('booking')} className="text-3xl font-playfair italic text-white hover:text-[#e8702a] transition-colors">Book Now</button>
          <button
            onClick={() => scrollToSection('booking')}
            className="mt-4 bg-[#e8702a] text-white text-base font-semibold px-8 py-3.5 rounded-full hover:bg-[#d2611f]"
          >
            Reserve Session
          </button>
        </div>
      )}

      {/* Hero Section */}
      <section
        id="hero"
        className="relative w-full overflow-hidden h-screen bg-black"
        style={{ height: '100dvh' }}
      >
        {/* Layer 1: Base image (z-10) with Ken Burns zoom effect */}
        <div
          className="absolute inset-0 bg-center bg-cover bg-no-repeat z-10 hero-zoom"
          style={{ backgroundImage: `url(${BG_IMAGE_1})` }}
        />

        {/* Layer 2: Reveal image masked by spotlight (z-30) */}
        <RevealLayer
          image={BG_IMAGE_2}
          cursorX={cursorPos.x}
          cursorY={cursorPos.y}
        />

        {/* Layer 3: Heading (z-50) */}
        <div className="absolute top-[18%] left-0 right-0 flex flex-col items-center text-center px-5 pointer-events-none z-50">
          <h1 className="text-white leading-[0.95] flex flex-col items-center">
            <span
              className="block font-playfair italic font-normal text-4xl sm:text-6xl md:text-7xl lg:text-8xl hero-anim hero-reveal"
              style={{ letterSpacing: '-0.03em', animationDelay: '0.25s' }}
            >
              Reveal your
            </span>
            <span
              className="block font-normal text-4xl sm:text-6xl md:text-7xl lg:text-8xl -mt-1 tracking-tight hero-anim hero-reveal uppercase font-semibold text-zinc-100"
              style={{ letterSpacing: '-0.05em', animationDelay: '0.42s' }}
            >
              Masterpiece Glow
            </span>
          </h1>
          <div className="w-16 h-[1px] bg-white/40 mt-6 hero-anim hero-fade" style={{ animationDelay: '0.55s' }} />
        </div>

        {/* Layer 4: Bottom-left narrative block (z-50) */}
        <div
          className="hidden sm:block absolute bottom-14 left-10 md:left-14 max-w-[280px] z-50 hero-anim hero-fade"
          style={{ animationDelay: '0.7s' }}
        >
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-light">
            Every face is a unique canvas. Our master artists don't mask who you are; we unveil the timeless harmony and balance hidden beneath the surface.
          </p>
        </div>

        {/* Layer 5: Bottom-right interactive / CTA block (z-50) */}
        <div
          className="absolute bottom-10 sm:bottom-14 left-5 right-5 sm:left-auto sm:right-10 md:right-14 max-w-full sm:max-w-[280px] flex flex-col items-start gap-4 sm:gap-5 z-50 hero-anim hero-fade"
          style={{ animationDelay: '0.85s' }}
        >
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-light">
            Move your cursor across the canvas to see the transformation from pure essence to professional glamour. Witness true artistry.
          </p>
          <button
            onClick={() => scrollToSection('booking')}
            className="bg-[#e8702a] hover:bg-[#d2611f] text-white text-sm font-medium px-8 py-3.5 rounded-full transition-all hover:scale-[1.03] active:scale-95 hover:shadow-lg hover:shadow-[#e8702a]/30 flex items-center gap-2 cursor-pointer pointer-events-auto"
          >
            <span>Book Appointment</span>
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Subtle scroll indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center opacity-40 animate-pulse">
          <span className="text-[10px] uppercase tracking-widest text-white/60 mb-1">Scroll</span>
          <div className="w-[1px] h-6 bg-white/60" />
        </div>
      </section>

      {/* Convincing Introduction Section (Philosophy) */}
      <section id="about" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left - Large Text */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-[#e8702a] uppercase">
                <Sparkle size={12} className="animate-spin" style={{ animationDuration: '4s' }} />
                <span>The Masterclass Philosophy</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-playfair italic text-white leading-tight">
                "Where raw beauty meets masterclass precision."
              </h2>
              <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
                At LaizBeauty, we operate at the intersection of natural aesthetics and professional science. We believe beauty is not about applying a generic template, but tailoring every brush stroke, serum, and contour to match your unique bone structure and skin health.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#e8702a]">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Elite Artisans</h4>
                    <p className="text-zinc-500 text-sm">Our specialists undergo extensive global training in advanced cosmetology.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#e8702a]">
                    <Compass size={18} />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Bespoke Rituals</h4>
                    <p className="text-zinc-500 text-sm">Every treatment is custom-mixed using cruelty-free, clinical-grade cosmetics.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Accent Frame */}
            <div className="lg:col-span-5 relative">
              <div className="aspect-[4/5] bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 p-6 flex flex-col justify-between relative group hover:border-[#e8702a]/30 transition-all duration-500">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#e8702a]/5 blur-3xl rounded-full" />
                <div className="space-y-4">
                  <span className="text-[#e8702a] text-lg font-playfair italic">01 / Pure Confidence</span>
                  <h3 className="text-2xl font-semibold text-white tracking-tight">Our Promise of Excellence</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    We ensure a luxurious, tranquil atmosphere paired with rigorous sterile standards. Our tools are medically sanitized, and our products represent the pinnacle of organic skin-synergy.
                  </p>
                </div>
                <div className="border-t border-zinc-800 pt-6 flex justify-between items-center">
                  <div className="text-xs text-zinc-500 tracking-wider uppercase">
                    ESTABLISHED 2026
                  </div>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className="text-[#e8702a] text-sm">★</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-4 sm:px-6 lg:px-8 bg-black relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-[#e8702a] text-xs font-semibold tracking-widest uppercase">Our Curated Menu</span>
            <h2 className="text-3xl sm:text-5xl font-playfair italic text-white">Bespoke Artistry & Treatments</h2>
            <div className="w-12 h-[1px] bg-zinc-800 mx-auto" />
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              Explore our core salon disciplines designed to accentuate, nourish, and redefine. Select a service to reserve your consultation.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Service 1 */}
            <div className="group relative bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/80 rounded-2xl p-6 hover:border-[#e8702a]/40 hover:bg-zinc-900/60 transition-all duration-500 flex flex-col justify-between h-[320px]">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#e8702a]/2 blur-2xl rounded-full group-hover:bg-[#e8702a]/10 transition-all duration-500" />
              <div>
                <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-[#e8702a] mb-5 group-hover:scale-110 transition-transform duration-500">
                  <Sparkles size={20} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#e8702a] transition-colors">Glamour Makeup</h3>
                <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed line-clamp-3">
                  Tailored styling, contouring, and lashes designed to endure and radiate for galas, red carpets, or wedding ceremonies.
                </p>
              </div>
              <div className="flex justify-between items-center border-t border-zinc-800/60 pt-4">
                <span className="text-xs text-zinc-400 font-medium">90 mins</span>
                <span className="text-sm font-semibold text-[#e8702a]">$140</span>
              </div>
            </div>

            {/* Service 2 */}
            <div className="group relative bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/80 rounded-2xl p-6 hover:border-[#e8702a]/40 hover:bg-zinc-900/60 transition-all duration-500 flex flex-col justify-between h-[320px]">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#e8702a]/2 blur-2xl rounded-full group-hover:bg-[#e8702a]/10 transition-all duration-500" />
              <div>
                <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-[#e8702a] mb-5 group-hover:scale-110 transition-transform duration-500">
                  <Flower2 size={20} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#e8702a] transition-colors">Micro-Aesthetics</h3>
                <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed line-clamp-3">
                  Advanced skin infusions, peeling, and micro-needling designed to boost natural collagen synthesis and reveal velvety texture.
                </p>
              </div>
              <div className="flex justify-between items-center border-t border-zinc-800/60 pt-4">
                <span className="text-xs text-zinc-400 font-medium">60 mins</span>
                <span className="text-sm font-semibold text-[#e8702a]">$165</span>
              </div>
            </div>

            {/* Service 3 */}
            <div className="group relative bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/80 rounded-2xl p-6 hover:border-[#e8702a]/40 hover:bg-zinc-900/60 transition-all duration-500 flex flex-col justify-between h-[320px]">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#e8702a]/2 blur-2xl rounded-full group-hover:bg-[#e8702a]/10 transition-all duration-500" />
              <div>
                <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-[#e8702a] mb-5 group-hover:scale-110 transition-transform duration-500">
                  <Scissors size={20} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#e8702a] transition-colors">Hair Architecture</h3>
                <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed line-clamp-3">
                  Precision cutting, custom dimensional balayage, and luxurious keratin baths curated for structural and chromatic perfection.
                </p>
              </div>
              <div className="flex justify-between items-center border-t border-zinc-800/60 pt-4">
                <span className="text-xs text-zinc-400 font-medium">120 mins</span>
                <span className="text-sm font-semibold text-[#e8702a]">$180</span>
              </div>
            </div>

            {/* Service 4 */}
            <div className="group relative bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/80 rounded-2xl p-6 hover:border-[#e8702a]/40 hover:bg-zinc-900/60 transition-all duration-500 flex flex-col justify-between h-[320px]">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#e8702a]/2 blur-2xl rounded-full group-hover:bg-[#e8702a]/10 transition-all duration-500" />
              <div>
                <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-[#e8702a] mb-5 group-hover:scale-110 transition-transform duration-500">
                  <Sparkle size={20} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#e8702a] transition-colors">Lash & Brow Design</h3>
                <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed line-clamp-3">
                  Sculpting, lamination, and organic tinting designed to structure and frame your eyes with subtle, natural elegance.
                </p>
              </div>
              <div className="flex justify-between items-center border-t border-zinc-800/60 pt-4">
                <span className="text-xs text-zinc-400 font-medium">45 mins</span>
                <span className="text-sm font-semibold text-[#e8702a]">$95</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Appointment Booking / CTA Section */}
      <section id="booking" className="py-24 px-4 sm:px-6 lg:px-8 bg-zinc-950 border-t border-zinc-900 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#e8702a]/2 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* Info & Location Column (4 cols) */}
            <div className="lg:col-span-5 space-y-8 flex flex-col justify-between">
              <div>
                <div className="inline-block text-xs font-semibold text-[#e8702a] uppercase tracking-widest mb-4">
                  Reservations
                </div>
                <h2 className="text-3xl sm:text-5xl font-playfair italic text-white mb-6">
                  Reserve your beauty experience
                </h2>
                <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-8">
                  Book a slot with one of our master beauty specialists. Your session includes a custom skin evaluation and personalized cosmetic consultation.
                </p>

                <div className="space-y-6">
                  <div className="flex items-center gap-4 text-zinc-300">
                    <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#e8702a]">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 uppercase tracking-wider">Our Salon</p>
                      <p className="text-sm font-medium">742 Avenue de l'Élégance, Paris</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-zinc-300">
                    <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#e8702a]">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 uppercase tracking-wider">Direct Line</p>
                      <p className="text-sm font-medium">+33 (0) 1 45 67 89 10</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-zinc-300">
                    <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#e8702a]">
                      <Clock size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 uppercase tracking-wider">Hours</p>
                      <p className="text-sm font-medium">Tue &ndash; Sat: 10:00 &ndash; 19:00</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-xs text-zinc-600 border-t border-zinc-900 pt-6">
                Appointments are held for up to 15 minutes. Please notify us 24 hours in advance for cancellations.
              </div>
            </div>

            {/* Booking Form (7 cols) */}
            <div className="lg:col-span-7">
              <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800/80 rounded-3xl p-6 sm:p-10">
                {submitted ? (
                  <div className="py-12 text-center space-y-6 animate-fadeIn">
                    <div className="w-16 h-16 bg-[#e8702a]/10 border border-[#e8702a]/30 rounded-full flex items-center justify-center mx-auto text-[#e8702a]">
                      <CheckCircle size={36} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-playfair italic text-white">Your session is requested</h3>
                      <p className="text-zinc-400 text-sm max-w-sm mx-auto">
                        Thank you, <span className="text-white font-medium">{formData.name}</span>. A luxury coordinator will contact you at <span className="text-white font-medium">{formData.email}</span> shortly to finalize your appointment for <span className="text-white font-medium">{formData.date}</span>.
                      </p>
                    </div>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="text-xs text-zinc-400 hover:text-white underline underline-offset-4 tracking-wider uppercase pt-4 block mx-auto"
                    >
                      Book Another Service
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleBookingSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                      {/* Name input */}
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-zinc-400 font-medium" htmlFor="name">Your Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-[#e8702a] transition-colors text-sm"
                          placeholder="e.g. Adrienne Laurent"
                        />
                      </div>

                      {/* Email input */}
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-zinc-400 font-medium" htmlFor="email">Email Address</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-[#e8702a] transition-colors text-sm"
                          placeholder="e.g. adrienne@domain.com"
                        />
                      </div>

                      {/* Phone input */}
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-zinc-400 font-medium" htmlFor="phone">Phone Number</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-[#e8702a] transition-colors text-sm"
                          placeholder="e.g. +33 6 1234 5678"
                        />
                      </div>

                      {/* Service selection */}
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-zinc-400 font-medium" htmlFor="service">Desired Service</label>
                        <select
                          id="service"
                          name="service"
                          value={formData.service}
                          onChange={handleInputChange}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#e8702a] transition-colors text-sm"
                        >
                          <option value="Bespoke Makeup Artistry">Bespoke Makeup Artistry</option>
                          <option value="Dermatological Skin Therapy">Dermatological Skin Therapy</option>
                          <option value="Hair Architecture">Hair Architecture</option>
                          <option value="Lash & Brow Design">Lash & Brow Design</option>
                        </select>
                      </div>

                      {/* Date input */}
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-zinc-400 font-medium" htmlFor="date">Preferred Date</label>
                        <input
                          type="date"
                          id="date"
                          name="date"
                          required
                          value={formData.date}
                          onChange={handleInputChange}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#e8702a] transition-colors text-sm"
                        />
                      </div>

                      {/* Time input */}
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-zinc-400 font-medium" htmlFor="time">Preferred Time</label>
                        <input
                          type="time"
                          id="time"
                          name="time"
                          required
                          value={formData.time}
                          onChange={handleInputChange}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#e8702a] transition-colors text-sm"
                        />
                      </div>

                    </div>

                    {/* Special requests textarea */}
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-zinc-400 font-medium" htmlFor="notes">Special Notes & Skin Sensitivities</label>
                      <textarea
                        id="notes"
                        name="notes"
                        rows={3}
                        value={formData.notes}
                        onChange={handleInputChange}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-[#e8702a] transition-colors text-sm resize-none"
                        placeholder="Please detail any allergies or specific skin notes..."
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#e8702a] hover:bg-[#d2611f] disabled:bg-zinc-800 text-white font-medium py-4 rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#e8702a]/10"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Processing reservation...</span>
                        </>
                      ) : (
                        <>
                          <Calendar size={18} />
                          <span>Request Session Reservation</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-zinc-900 py-12 px-4 sm:px-6 lg:px-8 text-center text-xs text-zinc-500 space-y-4">
        <div className="flex justify-center items-center gap-2">
          <svg className="w-5 h-5" viewBox="0 0 256 256" fill="#888888">
            <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
          </svg>
          <span className="font-playfair italic text-sm text-zinc-400">LaizBeauty</span>
        </div>
        <p> 2026 LAIZDEV. Premium Webdesign & Development.</p>
        <div className="flex justify-center pt-2">
          <a 
            href="https://github.com/Coinbr0x/laizbeauty" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-zinc-500 hover:text-white transition-colors"
            title="GitHub Repository"
          >
            <Github size={18} />
          </a>
        </div>
      </footer>

    </div>
  );
}
