import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Pill,
  HeartPulse,
  Stethoscope,
  Star,
  ArrowRight,
  CheckCircle2,
  Package,
  UserPlus,
  MessageCircle,
  Sun,
  Moon,
  Activity,
  FileText,
  Globe,
  ChevronDown,
  ShieldCheck,
  Zap,
} from "lucide-react";

// ==========================================
// 1. FULL TRANSLATION DICTIONARY (EN & NE)
// ==========================================
const translations = {
  en: {
    promo: "Nationwide delivery now available across Nepal.",
    logoSub: "Clinical Care",
    searchPlaceholder: "Search medications, conditions...",
    searchBtn: "Search",
    signIn: "Sign In",
    getStarted: "Get Started",
    heroBadge: "Award-Winning Digital Pharmacy",
    heroTitle1: "Healthcare that",
    heroTitle2: "revolves around",
    heroTitle3: "you.",
    heroDesc:
      "Skip the waiting room. Get doctor consultations, genuine medications, and automatic refills delivered straight to your door in hours.",
    btnTransfer: "Transfer Prescription",
    btnBrowse: "Browse Pharmacy",
    marqueeItems: [
      "100% Genuine Medicines",
      "Licensed Pharmacists",
      "24/7 Support",
      "Express Delivery",
      "Secure Records",
      "Easy Refills",
    ],
    stats: [
      { num: "100K+", label: "Happy Patients" },
      { num: "500+", label: "Verified Doctors" },
      { num: "24h", label: "Average Delivery" },
      { num: "4.9", label: "App Store Rating" },
    ],
    featuresTitle: "Everything you need, in one place.",
    featuresDesc:
      "We've rebuilt the pharmacy experience from the ground up to save you time, money, and stress.",
    features: [
      {
        title: "Smart E-Prescriptions",
        desc: "Your doctor sends your Rx directly to our system instantly.",
        icon: FileText,
      },
      {
        title: "Telemedicine Consults",
        desc: "Live chat with top specialists without leaving your couch.",
        icon: Stethoscope,
      },
      {
        title: "Automated Refills",
        desc: "We track your dosage and auto-ship before you ever run out.",
        icon: Package,
      },
      {
        title: "Health Tracking",
        desc: "Monitor your vitals and share them seamlessly with providers.",
        icon: Activity,
      },
    ],
    showcaseTitle: "Experience seamless healthcare.",
    showcaseDesc:
      "See how our intuitive platform connects you with top doctors, manages your prescriptions, and tracks your deliveries in real-time.",
    showcaseBtn: "Join Now",
    pricingTitle: "Honest, transparent pricing.",
    pricingDesc:
      "We cut out the middlemen. No hidden fees, no surprise bills. Just affordable healthcare.",
    pricingPoints: [
      "Zero membership fees",
      "Free nationwide shipping",
      "Save up to 80% on generics",
    ],
    pricingBtn: "Compare Prices",
    popGenerics: "Popular Generics",
    retail: "Retail",
    faqTitle: "Common Questions",
    faqSearch: "Search for answers...",
    faqs: [
      {
        q: "How do I transfer my prescription?",
        a: "Simply create an account, select 'Transfer Rx', and provide your current pharmacy details. We handle the rest.",
      },
      {
        q: "How long does delivery take?",
        a: "Orders placed before 2 PM are delivered the same day in major cities. Nationwide delivery takes 24-48 hours.",
      },
      {
        q: "Is my medical data secure?",
        a: "Yes. Our platform is strictly HIPAA-compliant and uses bank-level 256-bit encryption for all patient records.",
      },
      {
        q: "Do you accept insurance?",
        a: "Yes, we partner with major providers. Add your insurance card to your profile to instantly see your copay.",
      },
    ],
    noFaq: "No results found.",
  },
  ne: {
    promo: "अब नेपालभर राष्ट्रव्यापी डेलिभरी उपलब्ध छ।",
    logoSub: "क्लिनिकल केयर",
    searchPlaceholder: "औषधि र रोगहरू खोज्नुहोस्...",
    searchBtn: "खोज्नुहोस्",
    signIn: "लगइन",
    getStarted: "सुरु गर्नुहोस्",
    heroBadge: "पुरस्कृत डिजिटल फार्मेसी",
    heroTitle1: "तपाईंको वरिपरि घुम्ने",
    heroTitle2: "आधुनिक",
    heroTitle3: "स्वास्थ्य सेवा।",
    heroDesc:
      "पर्खाइको समय अन्त्य गर्नुहोस्। डाक्टरको परामर्श, सक्कली औषधि, र स्वचालित रिफिलहरू सिधै तपाईंको घरमा पाउनुहोस्।",
    btnTransfer: "प्रिस्क्रिप्शन पठाउनुहोस्",
    btnBrowse: "फार्मेसी हेर्नुहोस्",
    marqueeItems: [
      "१००% सक्कली औषधि",
      "इजाजतप्राप्त फार्मासिस्ट",
      "२४/७ सहयोग",
      "एक्सप्रेस डेलिभरी",
      "सुरक्षित रेकर्ड",
      "सजिलो रिफिल",
    ],
    stats: [
      { num: "१००K+", label: "सन्तुष्ट बिरामीहरू" },
      { num: "५००+", label: "प्रमाणित डाक्टरहरू" },
      { num: "२४ घन्टा", label: "औसत डेलिभरी" },
      { num: "४.९", label: "एप स्टोर रेटिङ" },
    ],
    featuresTitle: "तपाईंलाई चाहिने सबै कुरा, एकै ठाउँमा।",
    featuresDesc:
      "तपाईंको समय, पैसा, र तनाव बचाउन हामीले फार्मेसी अनुभवलाई नयाँ रूप दिएका छौं।",
    features: [
      {
        title: "स्मार्ट ई-प्रिस्क्रिप्शन",
        desc: "तपाईंको डाक्टरले सिधै हाम्रो प्रणालीमा प्रिस्क्रिप्शन पठाउनुहुन्छ।",
        icon: FileText,
      },
      {
        title: "टेलिमेडिसिन परामर्श",
        desc: "घरमै बसेर शीर्ष विशेषज्ञहरूसँग कुराकानी गर्नुहोस्।",
        icon: Stethoscope,
      },
      {
        title: "स्वचालित रिफिल",
        desc: "औषधि सकिनु अघि नै हामी ट्र्याक गरेर स्वतः पठाउँछौं।",
        icon: Package,
      },
      {
        title: "स्वास्थ्य ट्र्याकिङ",
        desc: "आफ्नो स्वास्थ्य विवरण निगरानी गर्नुहोस् र डाक्टरसँग साझा गर्नुहोस्।",
        icon: Activity,
      },
    ],
    showcaseTitle: "सहज स्वास्थ्य सेवाको अनुभव लिनुहोस्।",
    showcaseDesc:
      "हाम्रो सहज प्लेटफर्मले तपाईंलाई उत्कृष्ट डाक्टरहरूसँग कसरी जोड्छ, प्रिस्क्रिप्शनहरू व्यवस्थापन गर्छ र वास्तविक समयमा तपाईंको डेलिभरी ट्र्याक गर्छ हेर्नुहोस्।",
    showcaseBtn: "अहिले नै जोडिनुहोस्",
    pricingTitle: "इमानदार, पारदर्शी मूल्य।",
    pricingDesc:
      "हामी बिचौलियालाई हटाउँछौं। कुनै लुकेको शुल्क छैन। केवल सस्तो र सुलभ स्वास्थ्य सेवा।",
    pricingPoints: [
      "कुनै सदस्यता शुल्क छैन",
      "नि:शुल्क राष्ट्रव्यापी डेलिभरी",
      "जेनेरिक औषधिमा ८०% सम्म बचत",
    ],
    pricingBtn: "मूल्य तुलना गर्नुहोस्",
    popGenerics: "लोकप्रिय जेनेरिक औषधिहरू",
    retail: "बजार मूल्य",
    faqTitle: "प्रायः सोधिने प्रश्नहरू",
    faqSearch: "उत्तरहरू खोज्नुहोस्...",
    faqs: [
      {
        q: "मैले मेरो प्रिस्क्रिप्शन कसरी ट्रान्सफर गर्ने?",
        a: "खाता बनाउनुहोस्, 'प्रिस्क्रिप्शन ट्रान्सफर' रोज्नुहोस् र हालको फार्मेसी विवरण दिनुहोस्। बाँकी काम हामी गर्छौं।",
      },
      {
        q: "डेलिभरी हुन कति समय लाग्छ?",
        a: "दिउँसो २ बजे अघिका अर्डरहरू मुख्य सहरहरूमा सोही दिन डेलिभर हुन्छन्। राष्ट्रव्यापी डेलिभरीमा २४-४८ घण्टा लाग्छ।",
      },
      {
        q: "के मेरो मेडिकल डाटा सुरक्षित छ?",
        a: "हो। हाम्रो प्लेटफर्म HIPAA-प्रमाणित छ र बैंक-स्तरको २५६-बिट इन्क्रिप्सन प्रयोग गर्दछ।",
      },
      {
        q: "के तपाईं बीमा (Insurance) स्वीकार गर्नुहुन्छ?",
        a: "हो, हामी प्रमुख प्रदायकहरूसँग काम गर्छौं। आफ्नो बीमा कार्ड प्रोफाइलमा थप्नुहोस्।",
      },
    ],
    noFaq: "कुनै नतिजा फेला परेन।",
  },
};

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // --- UI States ---
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [lang, setLang] = useState("en"); // "en" or "ne"

  const t = translations[lang]; // Translation helper

  // --- Hero Image Swapper State ---
  const [currentImg, setCurrentImg] = useState(0);
  const heroImages = [
    "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=1200&q=80",
  ];

  // --- Showcase Image Swapper State ---
  const [currentShowcaseImg, setCurrentShowcaseImg] = useState(0);
  const showcaseImages = [
    "https://images.unsplash.com/photo-1576091160550-2173ff9e5fe3?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1200&q=80",
  ];

  useEffect(() => {
    const heroTimer = setInterval(
      () => setCurrentImg((p) => (p + 1) % heroImages.length),
      5000,
    );
    const showcaseTimer = setInterval(
      () => setCurrentShowcaseImg((p) => (p + 1) % showcaseImages.length),
      4000,
    );
    return () => {
      clearInterval(heroTimer);
      clearInterval(showcaseTimer);
    };
  }, []);

  // --- FAQ State ---
  const [faqSearch, setFaqSearch] = useState("");
  const [activeFaq, setActiveFaq] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery) navigate("/login");
  };

  const filteredFaqs = t.faqs.filter(
    (item) =>
      item.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
      item.a.toLowerCase().includes(faqSearch.toLowerCase()),
  );

  // Dynamic Theme Classes
  const themeBg = isDarkMode ? "bg-dark" : "bg-white";
  const themeAltBg = isDarkMode ? "bg-secondary bg-opacity-10" : "bg-light";
  const themeText = isDarkMode ? "text-light" : "text-dark";
  const themeMuted = isDarkMode ? "text-white-50" : "text-muted";
  const themeCard = isDarkMode
    ? "bg-dark border-secondary"
    : "bg-white border-light-subtle";

  return (
    <div
      className={`custom-home-wrapper ${isDarkMode ? "theme-dark" : "theme-light"}`}
    >
      {/* 1. TOP PROMO BANNER */}
      <div className="promo-banner text-center py-2 px-3 small fw-medium">
        <span className="badge bg-white text-dark me-2 rounded-pill shadow-sm">
          <Zap size={12} className="text-warning mb-1" /> NEW
        </span>
        {t.promo}
        <span
          className="text-decoration-underline ms-2 cursor-pointer fw-bold"
          onClick={() => navigate("/register")}
        >
          {t.promoLink}
        </span>
      </div>

      {/* 2. GLASSMORPHISM NAVBAR */}
      <header className="glass-nav sticky-top z-3 border-bottom border-opacity-10">
        <div className="container-fluid px-4 py-3 d-flex justify-content-between align-items-center gap-3">
          <div
            className="d-flex align-items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="logo-icon shadow-sm d-flex align-items-center justify-content-center">
              <Pill size={24} className="text-white" />
            </div>
            <div className="d-none d-sm-block">
              <div className="fw-black fs-4 lh-1 theme-text logo-text">
                SmartPharmacy
              </div>
              <div
                className="theme-accent fw-bold"
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                }}
              >
                {t.logoSub}
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSearch}
            className="flex-grow-1 max-w-2xl d-none d-md-flex align-items-center search-bar rounded-pill px-2 py-1 transition-all"
          >
            <Search className="theme-muted ms-3 me-2" size={18} />
            <input
              type="text"
              className="form-control border-0 bg-transparent shadow-none theme-text ps-1"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="btn btn-accent rounded-pill fw-bold px-4 py-2 text-uppercase shadow-sm"
              style={{ fontSize: "0.8rem" }}
            >
              {t.searchBtn}
            </button>
          </form>

          <div className="d-flex gap-3 align-items-center flex-shrink-0">
            {/* Language Toggle */}
            <button
              className="btn btn-sm btn-lang rounded-pill fw-bold d-flex align-items-center gap-1"
              onClick={() => setLang(lang === "en" ? "ne" : "en")}
            >
              <Globe size={14} /> {lang === "en" ? "नेपाली" : "EN"}
            </button>
            {/* Theme Toggle */}
            <button
              className="btn btn-link theme-muted p-0 d-flex align-items-center hover-accent"
              onClick={() => setIsDarkMode(!isDarkMode)}
              title="Toggle Theme"
            >
              {isDarkMode ? (
                <Sun size={22} className="text-warning" />
              ) : (
                <Moon size={22} />
              )}
            </button>
            <button
              className="btn btn-link text-decoration-none theme-text fw-bold d-none d-lg-block hover-accent"
              onClick={() => navigate("/login")}
            >
              {t.signIn}
            </button>
            <button
              className="btn btn-accent rounded-pill px-4 py-2 fw-bold shadow-lg hover-lift d-none d-sm-flex align-items-center gap-2"
              onClick={() => navigate("/register")}
            >
              {t.getStarted} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION (Organic & Premium) */}
      <section className="hero-section position-relative overflow-hidden pt-5 pb-5">
        <div className="hero-blob-1"></div>
        <div className="hero-blob-2"></div>

        <div className="container position-relative z-2 pt-4 pb-5">
          <div className="row align-items-center gy-5">
            <div className="col-lg-6 pe-lg-5 text-center text-lg-start">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="d-inline-flex align-items-center gap-2 badge-glass text-accent px-3 py-2 rounded-pill mb-4 fw-bold shadow-sm">
                  <Star size={14} className="fill-accent" /> {t.heroBadge}
                </div>
                <h1 className="display-2 fw-black theme-text lh-sm mb-4 font-playfair">
                  {t.heroTitle1} <br />
                  <span className="text-gradient">{t.heroTitle2}</span> <br />
                  {t.heroTitle3}
                </h1>
                <p className="fs-5 theme-muted mb-5 pe-lg-5 fw-medium lh-lg">
                  {t.heroDesc}
                </p>
                <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
                  <button
                    className="btn btn-accent btn-lg rounded-pill px-5 fw-bold shadow-lg hover-lift"
                    onClick={() => navigate("/register")}
                  >
                    {t.btnTransfer}
                  </button>
                  <button
                    className="btn btn-glass btn-lg rounded-pill px-5 fw-bold hover-lift theme-text"
                    onClick={() => navigate("/login")}
                  >
                    {t.btnBrowse}
                  </button>
                </div>
              </motion.div>
            </div>

            <div className="col-lg-6 position-relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="hero-image-wrapper"
              >
                <motion.div
                  className="floating-card glass-card top-left shadow-lg d-none d-md-flex align-items-center gap-3 p-3 rounded-4 z-3"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 5 }}
                >
                  <div className="icon-circle bg-success text-white">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <div className="fw-bolder theme-text small text-uppercase tracking-wider">
                      {t.secureTitle}
                    </div>
                    <div className="small theme-muted fw-medium">
                      {t.secureDesc}
                    </div>
                  </div>
                </motion.div>

                <div className="image-swapper rounded-5 shadow-2xl overflow-hidden border border-4 border-opacity-25 theme-border bg-dark">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentImg}
                      src={heroImages[currentImg]}
                      initial={{ opacity: 0, filter: "blur(10px)", scale: 1.1 }}
                      animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1 }}
                      className="w-100 h-100 object-fit-cover position-absolute top-0 start-0"
                      alt="Pharmacy Hero"
                    />
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INFINITE MARQUEE (TRUST STRIP) */}
      <div className="marquee-container py-3 shadow-sm border-top border-bottom">
        <div className="marquee-wrapper">
          <div className="marquee-content d-flex align-items-center">
            {Array(4)
              .fill(t.marqueeItems)
              .flat()
              .map((feature, i) => (
                <div key={i} className="d-flex align-items-center gap-2 mx-5">
                  <CheckCircle2 size={20} className="text-accent" />
                  <span
                    className="fw-bold fs-5 theme-text"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {feature}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* 5. NUMBERS THAT SPEAK */}
      <section className="stats-section py-5">
        <div className="container py-4">
          <div className="row text-center gy-4 align-items-center divider-row">
            {t.stats.map((stat, i) => (
              <div className="col-6 col-md-3 stat-block" key={i}>
                <h2 className="display-4 fw-black text-gradient mb-0">
                  {stat.num}
                </h2>
                <span className="theme-muted fw-bold text-uppercase tracking-wider small">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. PLATFORM SHOWCASE (Replaces Video with Image Swapping) */}
      <section className="showcase-section py-5 position-relative overflow-hidden">
        <div className="container py-5 z-2 position-relative">
          <div className="row align-items-center g-5">
            <div className="col-lg-5 order-lg-2">
              <h2 className="display-5 fw-black theme-text mb-4 font-playfair">
                {t.showcaseTitle}
              </h2>
              <p className="fs-5 theme-muted mb-5 lh-lg">{t.showcaseDesc}</p>
              <button
                className="btn btn-accent rounded-pill px-5 py-3 fw-bold d-inline-flex align-items-center gap-3 shadow-lg hover-lift"
                onClick={() => navigate("/register")}
              >
                {t.showcaseBtn} <ArrowRight size={20} />
              </button>
            </div>

            <div className="col-lg-7 order-lg-1">
              <div
                className="showcase-thumbnail rounded-5 overflow-hidden shadow-2xl border border-secondary border-opacity-25 position-relative bg-dark"
                style={{ height: "450px" }}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentShowcaseImg}
                    src={showcaseImages[currentShowcaseImg]}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-100 h-100 object-fit-cover position-absolute top-0 start-0"
                    alt="Platform Showcase"
                  />
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FEATURES GRID (Masonry Style) */}
      <section className="features-section py-5">
        <div className="container py-5">
          <div className="text-center mb-5 pb-3">
            <h2 className="display-5 fw-black theme-text mb-3 font-playfair">
              {t.featuresTitle}
            </h2>
            <p className="fs-5 theme-muted max-w-2xl mx-auto">
              {t.featuresDesc}
            </p>
          </div>
          <div className="row g-4">
            {t.features.map((f, i) => (
              <div className="col-md-6 col-lg-3" key={i}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className="feature-card glass-card p-4 rounded-5 h-100 d-flex flex-column text-center align-items-center"
                >
                  <div className="feature-icon bg-accent text-white rounded-circle d-flex align-items-center justify-content-center mb-4 shadow">
                    <f.icon size={28} />
                  </div>
                  <h4 className="fw-bold theme-text mb-3">{f.title}</h4>
                  <p className="theme-muted small mb-0 lh-lg">{f.desc}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQ ACCORDION (Modern) */}
      <section className="faq-section py-5 position-relative">
        <div className="container py-5" style={{ maxWidth: "800px" }}>
          <div className="text-center mb-5">
            <div className="d-inline-flex bg-accent bg-opacity-10 text-accent p-3 rounded-circle mb-3">
              <MessageCircle size={32} />
            </div>
            <h2 className="display-5 fw-black theme-text mb-4 font-playfair">
              {t.faqTitle}
            </h2>
            <div
              className="position-relative mx-auto search-bar rounded-pill shadow-sm"
              style={{ maxWidth: "500px" }}
            >
              <Search
                className="position-absolute top-50 start-0 translate-middle-y ms-4 theme-muted"
                size={20}
              />
              <input
                type="text"
                className="form-control form-control-lg ps-5 rounded-pill border-0 bg-transparent theme-text py-3"
                placeholder={t.faqSearch}
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="faq-list d-flex flex-column gap-3">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-4 theme-muted">{t.noFaq}</div>
            ) : (
              filteredFaqs.map((item, index) => (
                <div
                  key={index}
                  className={`faq-item glass-card rounded-4 overflow-hidden transition-all ${activeFaq === index ? "active border-accent" : ""}`}
                >
                  <button
                    className="faq-btn w-100 border-0 p-4 d-flex justify-content-between align-items-center text-start bg-transparent theme-text fw-bold"
                    onClick={() =>
                      setActiveFaq(activeFaq === index ? null : index)
                    }
                  >
                    <span className="fs-5 pe-3">{item.q}</span>
                    <div
                      className={`faq-icon flex-shrink-0 d-flex align-items-center justify-content-center rounded-circle ${activeFaq === index ? "bg-accent text-white" : "bg-secondary bg-opacity-10 theme-muted"}`}
                    >
                      <ChevronDown
                        size={20}
                        className={`transition-all ${activeFaq === index ? "rotate-180" : ""}`}
                      />
                    </div>
                  </button>
                  <AnimatePresence>
                    {activeFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-4 pb-4"
                      >
                        <div className="pt-3 border-top border-secondary border-opacity-10">
                          <p className="theme-muted mb-0 fs-6 lh-lg">
                            {item.a}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* CUSTOM STYLES */}
      {/* ========================================== */}
      <style>{`
        /* Global Variables */
        .theme-light {
          --bg-primary: #f8fafc;
          --bg-secondary: #ffffff;
          --text-primary: #0f172a;
          --text-muted: #64748b;
          --accent-color: #047857; /* Deep Emerald */
          --accent-hover: #059669;
          --border-color: rgba(0,0,0,0.08);
          --glass-bg: rgba(255,255,255,0.8);
        }
        .theme-dark {
          --bg-primary: #0f172a;
          --bg-secondary: #1e293b;
          --text-primary: #f8fafc;
          --text-muted: #94a3b8;
          --accent-color: #10b981; /* Bright Emerald */
          --accent-hover: #34d399;
          --border-color: rgba(255,255,255,0.08);
          --glass-bg: rgba(30,41,59,0.8);
        }

        .custom-home-wrapper {
          background-color: var(--bg-primary);
          color: var(--text-primary);
          overflow-x: hidden;
        }

        /* Typography */
        .theme-text { color: var(--text-primary) !important; }
        .theme-muted { color: var(--text-muted) !important; }
        .text-accent { color: var(--accent-color) !important; }
        .bg-accent { background-color: var(--accent-color) !important; }
        .font-playfair { font-family: 'Playfair Display', serif; letter-spacing: -1px; }
        .text-gradient {
          background: linear-gradient(90deg, var(--accent-color), #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* Buttons & Interactions */
        .btn-accent {
          background-color: var(--accent-color);
          color: white;
          border: none;
        }
        .btn-accent:hover { background-color: var(--accent-hover); color: white; }
        .btn-glass {
          background: var(--glass-bg);
          backdrop-filter: blur(10px);
          border: 1px solid var(--border-color);
        }
        .btn-lang {
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          background: transparent;
        }
        .btn-lang:hover { background: var(--bg-secondary); }
        .hover-lift { transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s; }
        .hover-lift:hover { transform: translateY(-4px); box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important; }

        /* Glassmorphism */
        .glass-nav {
          background: var(--glass-bg);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
        .glass-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
        }
        .badge-glass {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
        }

        /* Hero Shapes */
        .hero-section { position: relative; }
        .hero-blob-1 {
          position: absolute; top: -10%; left: -10%; width: 500px; height: 500px;
          background: var(--accent-color); opacity: 0.1; filter: blur(100px); border-radius: 50%; z-index: 1;
        }
        .hero-blob-2 {
          position: absolute; bottom: -10%; right: -5%; width: 600px; height: 600px;
          background: #3b82f6; opacity: 0.08; filter: blur(120px); border-radius: 50%; z-index: 1;
        }
        
        .hero-image-wrapper { position: relative; height: 550px;}
        .image-swapper { position: absolute; inset: 0; }
        .top-left { position: absolute; top: 30px; left: -40px; }
        .icon-circle { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }

        /* Search Bar */
        .search-bar { background: var(--bg-secondary); border: 1px solid var(--border-color); }
        .search-bar input::placeholder { color: var(--text-muted); opacity: 0.7; }
        .search-bar input:focus { outline: none; }

        /* Promo Banner */
        .promo-banner { background-color: var(--accent-color); }

        /* Logo */
        .logo-icon { background: var(--accent-color); width: 40px; height: 40px; border-radius: 10px; }

        /* Marquee */
        .marquee-container { background: var(--bg-secondary); border-color: var(--border-color) !important; }
        .marquee-wrapper { overflow: hidden; white-space: nowrap; width: 100%; display: flex; align-items: center; }
        .marquee-content { animation: marquee 25s linear infinite; }
        .marquee-content:hover { animation-play-state: paused; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

        /* Stats */
        .divider-row > div:not(:last-child) { border-right: 1px solid var(--border-color); }
        @media (max-width: 768px) { .divider-row > div { border-right: none !important; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; } }

        /* Features */
        .feature-icon { width: 60px; height: 60px; }

        /* FAQs */
        .faq-item { border: 1px solid var(--border-color); }
        .faq-item.active { border-color: var(--accent-color); }
        .faq-btn:focus { outline: none; }
        .faq-icon { width: 32px; height: 32px; }

        /* Utilities */
        .transition-all { transition: all 0.3s ease; }
      `}</style>
    </div>
  );
};

export default Home;
