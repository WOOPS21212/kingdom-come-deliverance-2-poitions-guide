import { useState, useEffect } from "react";
import potions from "./data/potions-data-final-updated.json";

// Helper function to get ingredient icon
const getIngredientIcon = (ingredient) => {
  // Remove quantities (e.g., "2x " from "2x Herb")
  const cleanIngredient = ingredient.replace(/^\d+x\s+/, '').trim().toLowerCase();
  const base = "/kingdom-come-deliverance-2-potions/icons/";
  
  // Map ingredient names to their icon filenames
  const ingredientToIcon = {
    'henbane': 'henbane-alchemy-item-kcd2-wiki-guide.png',
    'ginger': 'ginger-alchemy-item-kcd2-wiki-guide.png',
    'elderberry leaves': 'elderberry-leaves-alchemy-item-kcd2-wiki-guide.png',
    'feverfew': 'feverfew-alchemy-item-kcd2-wiki-guide.png',
    'poppy': 'poppy-alchemy-item-kcd2-wiki-guide.png',
    'herb paris': 'herb-paris-alchemy-item-kcd2-wiki-guide.png',
    'charcoal': 'charcoal-blacksmithing-item-kcd2-wiki-guide.png',
    'thistle': 'thistle-alchemy-item-kcd2-wiki-guide.png',
    'nettle': 'nettle-alchemy-item-kcd2-wiki-guide.png',
    'mint': 'mint-alchemy-item-kcd2-wiki-guide.png',
    'valerian': 'valerian-alchemy-item-kcd2-wiki-guide.png',
    "st john's wort": 'st-johns-wort-alchemy-item-kcd2-wiki-guide.png',
    'st. john\'s wort': 'st-johns-wort-alchemy-item-kcd2-wiki-guide.png',
    'eyebright': 'eyebright-alchemy-item-kcd2-wiki-guide.png',
    'amanita muscaria': 'amanita-muscaria-blacksmithing-item-kcd2-wiki-guide.png',
    'sage': 'sage-alchemy-item-kcd2-wiki-guide.png',
    'wormwood': 'wormwood-alchemy-item-kcd2-wiki-guide.png',
    'marigold': 'marigold-alchemy-item-kcd2-wiki-guide.png',
    'dandelion': 'dandelion-alchemy-item-kcd2-wiki-guide.png',
    "boar's tusk": 'boars-tusk-blacksmithing-item-kcd2-wiki-guide.png',
    'comfrey': 'comfrey-alchemy-item-kcd2-wiki-guide.png',
    'belladonna': 'belladona-alchemy-item-kcd2-wiki-guide.png',
    'chamomile': 'chamomile-alchemy-item-kcd2-wiki-guide.png',
    'cobweb': 'cobweb-blacksmithing-item-kcd2-wiki-guide.png'
  };

  // Try exact match first
  if (ingredientToIcon[cleanIngredient]) {
    return `${base}${ingredientToIcon[cleanIngredient]}`;
  }

  // If no exact match, try to find a partial match
  for (const [key, value] of Object.entries(ingredientToIcon)) {
    if (cleanIngredient.includes(key) || key.includes(cleanIngredient)) {
      return `${base}${value}`;
    }
  }

  // If no match found, return null
  return null;
};

// Helper function to get potion icon
const getPotionIcon = (name) => {
  const base = "/kingdom-come-deliverance-2-potions/icons/";
  const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '_');
  
  // Map potion names to their icon filenames
  const potionToIcon = {
    'nighthawk': 'potion_nighthawk_icon-kcd2-wiki-guide-64px.png',
    'hair o dog': 'potion_hair_o_dog_icon-kcd2-wiki-guide-64px.png',
    'fox': 'potion_fox_icon-kcd2-wiki-guide-64px.png',
    'embrocation': 'potion_embrocation_icon-kcd2-wiki-guide-64px.png',
    'dollmaker poison': 'dollmaker__poison_icon-kcd2-wiki-guide-64px.png',
    'digestive': 'potion_digestive__icon-kcd2-wiki-guide-64px.png',
    'cockerel': 'potion_cockerel_icon-kcd2-wiki-guide-64px.png',
    'bucks blood': 'potion_bucksblood_icon-kcd2-wiki-guide-64px.png',
    'bowmans brew': 'potion_bowmans_brew_icon-kcd2-wiki-guide-64px.png',
    'bane poison': 'bane_poison_icon-kcd2-wiki-guide-64px.png',
    'artemisia': 'potion_artemisia_icon-kcd2-wiki-guide-64px.png',
    'aqua vitalis': 'potion_aquavitalis_icon-kcd2-wiki-guide-64px.png',
    'aesop': 'potion_aesop_icon-kcd2-wiki-guide-64px.png',
    'chamomile decoction': 'potion_chamomile_decoction_icon-kcd2-wiki-guide-64px.png'
  };

  // Try to find a matching potion icon
  for (const [potionName, iconFile] of Object.entries(potionToIcon)) {
    if (name.toLowerCase().includes(potionName)) {
      return `${base}${iconFile}`;
    }
  }
  
  return null;
};

// Helper function to load Buy Me a Coffee script
const loadBuyMeCoffeeScript = () => {
  const script = document.createElement('script');
  script.src = 'https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js';
  script.async = true;
  script.onload = () => {
    // Create button after script loads
    if (typeof window.BuyMeACoffee !== 'undefined') {
      window.BuyMeACoffee.createButton({
        name: "bmc-button",
        slug: "404found.art",
        color: "#40DCA5",
        emoji: "",
        font: "Cookie",
        text: "Buy me a coffee",
        outline_color: "#000000",
        font_color: "#ffffff",
        coffee_color: "#FFDD00"
      });
    }
  };
  document.body.appendChild(script);
  return script;
};

export default function App() {
  const [selectedPotion, setSelectedPotion] = useState(null);
  const [sort, setSort] = useState("alphabetical");
  const [columns, setColumns] = useState(getColumnCount());
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [cardsVisible, setCardsVisible] = useState(false);
  const [modalAnimation, setModalAnimation] = useState(""); // "entering", "entered", "exiting", "exited"
  const [isMobile, setIsMobile] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Add responsive font styles
  const responsiveFontStyles = `
    :root {
      font-size: 16px;
      scroll-behavior: smooth;
    }
    
    @media (max-width: 768px) {
      :root {
        font-size: 14px;
      }
    }
    
    @media (max-width: 480px) {
      :root {
        font-size: 12px;
      }
    }
    
    /* Prevent horizontal scrolling */
    body {
      overflow-x: hidden;
      width: 100%;
      max-width: 100vw;
      scroll-behavior: smooth;
    }
    
    /* Responsive text styles */
    .long-text {
      word-break: break-word;
      overflow-wrap: break-word;
    }

    /* Section highlight animation */
    .section-highlight {
      animation: highlight 1.5s ease-out;
    }

    @keyframes highlight {
      0% {
        box-shadow: 0 0 0 rgba(255, 152, 0, 0);
      }
      50% {
        box-shadow: 0 0 30px rgba(255, 152, 0, 0.5);
      }
      100% {
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      }
    }
  `;
  
  // Mobile menu styles
  const mobileMenuStyles = `
    .mobile-menu {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      background: rgba(0, 0, 0, 0.95);
      z-index: 1000;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      transform: translateY(-100%);
      transition: transform 0.3s ease-in-out;
      padding: 20px;
    }
    
    .mobile-menu.open {
      transform: translateY(0);
    }
    
    .mobile-menu-link {
      color: white;
      font-size: 1.5rem;
      margin: 15px 0;
      text-decoration: none;
      position: relative;
      padding: 5px 0;
    }
    
    .mobile-menu-link:after {
      content: '';
      position: absolute;
      width: 0;
      height: 2px;
      bottom: 0;
      left: 0;
      background-color: #FF9800;
      transition: width 0.3s ease;
    }
    
    .mobile-menu-link:hover:after {
      width: 100%;
    }
    
    .mobile-menu-close {
      position: absolute;
      top: 20px;
      right: 20px;
      background: transparent;
      border: none;
      color: white;
      font-size: 1.5rem;
      cursor: pointer;
    }
  `;
  
  // Smooth scrolling function
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      // Close mobile menu if open
      if (mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
      
      // Add highlight class
      section.classList.add('section-highlight');
      
      // Remove the highlight class after animation completes
      setTimeout(() => {
        section.classList.remove('section-highlight');
      }, 1500);
      
      // Set active section
      setActiveSection(sectionId);
      
      // Scroll to section
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Load Buy Me a Coffee script
  useEffect(() => {
    const script = loadBuyMeCoffeeScript();
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Listen for resize events
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Function to determine column count based on screen width
  function getColumnCount() {
    if (typeof window === 'undefined') return "repeat(auto-fill, minmax(250px, 1fr))";
    
    const width = window.innerWidth;
    if (width > 2400) return "repeat(auto-fill, minmax(300px, 1fr))";
    if (width > 1800) return "repeat(auto-fill, minmax(280px, 1fr))";
    if (width > 1200) return "repeat(auto-fill, minmax(250px, 1fr))";
    if (width > 768) return "repeat(auto-fill, minmax(220px, 1fr))";
    if (width > 480) return "repeat(2, 1fr)"; // 2 columns for small tablets
    return "repeat(1, 1fr)"; // Single column for phones
  }
  
  // Update columns when window is resized
  useEffect(() => {
    const handleResize = () => {
      setColumns(getColumnCount());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animation effect for cards
  useEffect(() => {
    // Set cards to visible after a small delay for the animation
    const timer = setTimeout(() => {
      setCardsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const getImageSrc = (name) => {
    const base = "/kingdom-come-deliverance-2-potions/potion-recipes/";
    const filename = `KCD2-${name.replace(/ /g, "-")}.jpg`;
    return `${base}${filename}`;
  };

  // Get difficulty badge color
  const getDifficultyColor = (difficulty) => {
    if (!difficulty || difficulty.trim() === "") return "#666"; // default gray
    
    switch(difficulty.toLowerCase()) {
      case "easy": return "#4caf50"; // green
      case "medium": return "#ff9800"; // orange
      case "hard": return "#f44336"; // red
      case "very hard": return "#9c27b0"; // purple
      default: return "#666"; // default gray
    }
  };

  // Get difficulty display text
  const getDifficultyText = (difficulty) => {
    return difficulty && difficulty.trim() !== "" ? difficulty : "Unknown";
  };

  // Filter and sort potions based on current criteria
  const sortedPotions = [...potions]
    .filter((potion) => {
      // Filter based on search term
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        potion.name.toLowerCase().includes(term) ||
        potion.effects.toLowerCase().includes(term) ||
        potion.ingredients.toLowerCase().includes(term)
      );
    })
    .sort((a, b) => {
      // Sort based on selected criteria and direction
      let compareResult = 0;
      
      switch (sort) {
        case "alphabetical":
          compareResult = a.name.localeCompare(b.name);
          break;
        case "ingredients":
          const aLength = a.ingredients.split(",").length;
          const bLength = b.ingredients.split(",").length;
          compareResult = aLength - bLength;
          break;
        case "difficulty":
          // Define difficulty order: empty/unknown (lowest) -> easy -> medium -> hard -> very hard (highest)
          const difficultyOrder = {
            "": 0,
            "easy": 1,
            "medium": 2,
            "hard": 3, 
            "very hard": 4
          };
          const aDiff = (a.difficulty || "").toLowerCase();
          const bDiff = (b.difficulty || "").toLowerCase();
          compareResult = (difficultyOrder[aDiff] || 0) - (difficultyOrder[bDiff] || 0);
          break;
        case "baseliquid":
          // Compare base liquids, empty values last
          const aBase = (a.baseLiquid || "").toLowerCase();
          const bBase = (b.baseLiquid || "").toLowerCase();
          
          // Handle empty base liquids - put them at the end when sorting ascending
          if (!aBase && !bBase) compareResult = 0;
          else if (!aBase) compareResult = sortDirection === "asc" ? 1 : -1;
          else if (!bBase) compareResult = sortDirection === "asc" ? -1 : 1;
          else compareResult = aBase.localeCompare(bBase);
          break;
        default:
          compareResult = 0;
      }
      
      // Apply sort direction
      return sortDirection === "asc" ? compareResult : -compareResult;
    });

  // Add a style block to the component to define hover styles
  const cardStyle = {
    background: "#222", 
    borderRadius: "8px", 
    cursor: "pointer", 
    overflow: "hidden",
    transition: "transform 0.2s ease-out, box-shadow 0.2s ease-out, opacity 0.5s ease-in-out",
    transform: "scale(1)",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  };

  const hoverStyles = `
    .potion-card {
      background: #222;
      border-radius: 8px;
      cursor: pointer;
      overflow: hidden;
      transition: transform 0.2s ease-out, box-shadow 0.2s ease-out, opacity 0.5s ease-in-out;
      transform: scale(1);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .potion-card:hover {
      transform: scale(1.05);
      box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
    }
  `;

  // Add animation style for the modal
  const modalStyles = `
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.9);
      color: #fff;
      z-index: 1000;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease-out, visibility 0.3s ease-out;
      width: 100vw;
      max-width: 100vw;
    }
    
    .modal-overlay.entering {
      opacity: 0;
      visibility: visible;
    }
    
    .modal-overlay.entered {
      opacity: 1;
      visibility: visible;
    }
    
    .modal-overlay.exiting {
      opacity: 0;
      visibility: visible;
    }
    
    .modal-content {
      max-width: 1200px;
      width: 100%;
      margin: 0 auto;
      padding: 20px;
      background: rgba(20, 20, 20, 0.8);
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
      transform: scale(0.95);
      opacity: 0;
      transition: transform 0.3s ease-out, opacity 0.3s ease-out;
      overflow-x: hidden;
      box-sizing: border-box;
      position: relative;
    }
    
    .modal-overlay.entered .modal-content {
      transform: scale(1);
      opacity: 1;
    }
    
    .modal-overlay.entering .modal-content {
      transform: scale(0.95);
      opacity: 0;
    }
    
    .modal-close-btn {
      position: absolute;
      top: 12px;
      right: 12px;
      background: rgba(50, 50, 50, 0.7);
      border: none;
      color: white;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 18px;
      z-index: 1100;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    }
    
    .modal-close-btn:hover {
      background: rgba(70, 70, 70, 0.9);
    }
    
    /* Make modal more responsive on mobile */
    @media (max-width: 768px) {
      .modal-content {
        padding: 40px 15px 15px;
        max-height: 100vh;
        overflow-y: auto;
      }
      
      .modal-img {
        max-height: 30vh !important; 
      }
      
      .modal-text {
        font-size: 0.95rem !important;
      }
      
      .modal-heading {
        font-size: 1.2rem !important;
        margin-bottom: 8px !important;
      }
      
      .modal-title {
        font-size: 1.6rem !important;
        margin-bottom: 12px !important;
      }
    }
    
    @media (max-width: 480px) {
      .modal-content {
        padding: 40px 10px 10px;
      }
      
      .modal-img {
        max-height: 25vh !important;
      }
    }
  `;

  // Update handlers for opening and closing potion detail modal
  const openPotionDetail = (potion) => {
    setSelectedPotion(potion);
    setModalAnimation("entering");
    
    // Two-step animation for smooth transition
    setTimeout(() => {
      setModalAnimation("entered");
    }, 50);
  };

  const closePotionDetail = (e) => {
    e.stopPropagation();
    
    setModalAnimation("exiting");
    
    // Wait for animation to complete before removing modal
    setTimeout(() => {
      setSelectedPotion(null);
      setModalAnimation("exited");
    }, 300);
  };

  return (
    <div style={{ 
      background: "#111", 
      color: "#fff", 
      minHeight: "100vh", 
      padding: "20px", 
      fontFamily: "sans-serif", 
      width: "100%", 
      boxSizing: "border-box",
      overflowX: "hidden",
      maxWidth: "100vw"
    }}>
      {/* Add style tags */}
      <style>{hoverStyles}</style>
      <style>{modalStyles}</style>
      <style>{responsiveFontStyles}</style>
      <style>{mobileMenuStyles}</style>
      
      {/* Navigation Bar */}
      <nav style={{
        position: "sticky",
        top: 0,
        background: "rgba(17, 17, 17, 0.95)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid #333",
        zIndex: 100,
        padding: "15px 20px",
        marginBottom: "30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        boxSizing: "border-box",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)"
      }}>
        <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#FF9800" }}>
          KCD2 Alchemy
        </div>
        
        <div style={{ 
          display: isMobile ? "none" : "flex", 
          gap: "20px", 
          alignItems: "center"
        }}>
          <a 
            onClick={() => scrollToSection('potions')} 
            style={{ 
              color: activeSection === 'potions' ? "#FF9800" : "#fff", 
              textDecoration: "none", 
              padding: "5px 0",
              borderBottom: activeSection === 'potions' ? "2px solid #FF9800" : "2px solid transparent",
              transition: "all 0.3s ease",
              cursor: "pointer"
            }}
            onMouseOver={(e) => e.target.style.borderColor = "#FF9800"}
            onMouseOut={(e) => e.target.style.borderColor = activeSection === 'potions' ? "#FF9800" : "transparent"}
          >
            Potions
          </a>
          <a 
            onClick={() => scrollToSection('basics')} 
            style={{ 
              color: activeSection === 'basics' ? "#FF9800" : "#fff", 
              textDecoration: "none", 
              padding: "5px 0",
              borderBottom: activeSection === 'basics' ? "2px solid #FF9800" : "2px solid transparent",
              transition: "all 0.3s ease",
              cursor: "pointer"
            }}
            onMouseOver={(e) => e.target.style.borderColor = "#FF9800"}
            onMouseOut={(e) => e.target.style.borderColor = activeSection === 'basics' ? "#FF9800" : "transparent"}
          >
            Basics
          </a>
          <a 
            onClick={() => scrollToSection('ingredients')} 
            style={{ 
              color: activeSection === 'ingredients' ? "#FF9800" : "#fff", 
              textDecoration: "none", 
              padding: "5px 0",
              borderBottom: activeSection === 'ingredients' ? "2px solid #FF9800" : "2px solid transparent",
              transition: "all 0.3s ease",
              cursor: "pointer"
            }}
            onMouseOver={(e) => e.target.style.borderColor = "#FF9800"}
            onMouseOut={(e) => e.target.style.borderColor = activeSection === 'ingredients' ? "#FF9800" : "transparent"}
          >
            Ingredients
          </a>
          <a 
            onClick={() => scrollToSection('advanced')} 
            style={{ 
              color: activeSection === 'advanced' ? "#FF9800" : "#fff", 
              textDecoration: "none", 
              padding: "5px 0",
              borderBottom: activeSection === 'advanced' ? "2px solid #FF9800" : "2px solid transparent",
              transition: "all 0.3s ease",
              cursor: "pointer"
            }}
            onMouseOver={(e) => e.target.style.borderColor = "#FF9800"}
            onMouseOut={(e) => e.target.style.borderColor = activeSection === 'advanced' ? "#FF9800" : "transparent"}
          >
            Advanced
          </a>
        </div>
        
        {isMobile && (
          <button
            onClick={() => setMobileMenuOpen(true)}
            style={{
              background: "transparent",
              border: "none",
              color: "#fff",
              fontSize: "1.5rem",
              cursor: "pointer"
            }}
          >
            ☰
          </button>
        )}
      </nav>
      
      <div style={{ 
        maxWidth: "1800px", 
        margin: "0 auto", 
        width: "100%", 
        overflowX: "hidden" 
      }}>
        <h1 id="potions" style={{ fontSize: "2rem", marginBottom: "20px", textAlign: "center" }}>Kingdom Come Deliverance 2 Alchemy Guide</h1>
        
        <div style={{
          display: "flex",
          flexDirection: window.innerWidth > 768 ? "row" : "column",
          gap: "30px",
          alignItems: "flex-start",
          marginBottom: "30px",
          width: "100%"
        }}>
          {/* Left Column - Description */}
          <div style={{ 
            flex: "1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%"
          }}>
            <p className="long-text" style={{ 
              fontSize: "1.2rem", 
              color: "#ccc", 
              lineHeight: "1.6",
              padding: "0 20px",
              maxWidth: "100%"
            }}>
              Discover the complete alchemy and potion brewing database for Kingdom Come Deliverance 2. Our comprehensive guide features every potion recipe, ingredient location, and brewing instruction you need. Perfect for both beginner alchemists learning the basics and expert brewers seeking advanced recipes. Find detailed step-by-step guides for crafting every potion in the game.
            </p>
          </div>

          {/* Right Column - Support Section */}
          <div style={{
            flex: "1",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
            padding: "0 20px",
            width: "100%"
          }}>
            {/* Buy Me a Coffee Button */}
            <div id="buy-me-a-coffee-container" />
            
            {/* Separator Line */}
            <div style={{
              width: "100%",
              height: "1px",
              background: "#333",
              margin: "10px 0"
            }} />

            {/* QR Code - hide on mobile */}
            {!isMobile && (
              <img 
                src="/kingdom-come-deliverance-2-potions/images/bmc_qr.png"
                alt="Buy Me a Coffee QR Code"
                style={{
                  width: "min(200px, 100%)",
                  maxWidth: "100%",
                  height: "auto",
                  aspectRatio: "1/1",
                  borderRadius: "10px"
                }}
              />
            )}

            {/* Buy Me a Coffee Button */}
            <a href="https://www.buymeacoffee.com/404found.art" target="_blank">
              <img 
                src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" 
                alt="Buy Me A Coffee" 
                style={{ 
                  height: "60px", 
                  width: "min(217px, 100%)",
                  maxWidth: "100%" 
                }} 
              />
            </a>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "30px" }}>
          <input
            type="text"
            placeholder="Search potions by name or effects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              padding: "15px 20px", // Increased padding
              borderRadius: "8px", // Larger border radius
              background: "#333", 
              color: "#fff", 
              border: "1px solid #444",
              width: "100%",
              maxWidth: "600px", // Increased from 400px
              fontSize: "1.2rem", // Larger font
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)", // Added shadow for emphasis
              margin: "0 auto 10px", // Center the search bar
              transition: "all 0.2s ease"
            }}
          />
          
          <div style={{ 
            display: "flex", 
            gap: "10px", 
            alignItems: "center", 
            flexWrap: "wrap",
            justifyContent: window.innerWidth <= 768 ? "center" : "flex-start" // Center on mobile
          }}>
            <select 
              onChange={(e) => setSort(e.target.value)} 
              value={sort}
              style={{ 
                padding: "10px 15px", // Increased padding
                borderRadius: "6px", // Larger border radius
                background: "#333", 
                color: "#fff", 
                border: "1px solid #444",
                fontSize: "1rem" // Slightly larger font
              }}
            >
              <option value="alphabetical">Sort A-Z</option>
              <option value="ingredients">Sort by Ingredients Count</option>
              <option value="difficulty">Sort by Difficulty</option>
              <option value="baseliquid">Sort by Base Liquid</option>
            </select>
            
            <button
              onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
              style={{ 
                padding: "10px 15px", // Increased padding
                borderRadius: "6px", // Larger border radius
                background: "#333", 
                color: "#fff", 
                border: "1px solid #444",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1rem" // Slightly larger font
              }}
            >
              {sortDirection === "asc" ? "↑" : "↓"}
            </button>
          </div>
        </div>
        
        <div 
          style={{ 
            display: "grid", 
            gridTemplateColumns: columns,
            gap: window.innerWidth <= 480 ? "30px" : "20px", // Increased gap for single column
            marginTop: "20px",
            width: "100%",
            maxWidth: "100%",
            overflowX: "hidden"
          }}
        >
          {sortedPotions.map((potion, i) => (
            <div
              key={i}
              onClick={() => openPotionDetail(potion)}
              className="potion-card"
              style={{
                opacity: cardsVisible ? 1 : 0,
                animationDelay: `${i * 0.05}s`,
                transitionDelay: `${i * 0.05}s`,
                maxWidth: "100%",
                // Center card on mobile single column view for better appearance
                margin: window.innerWidth <= 480 ? "0 auto" : "0",
                width: window.innerWidth <= 480 ? "95%" : "100%"
              }}
            >
              <div style={{ position: "relative" }}>
                {/* Difficulty badge */}
                {potion.difficulty && (
                  <div style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    backgroundColor: getDifficultyColor(potion.difficulty),
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "0.8rem",
                    fontWeight: "bold",
                    zIndex: 2,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.3)"
                  }}>
                    {getDifficultyText(potion.difficulty)}
                  </div>
                )}
                
                <img
                  src={getPotionIcon(potion.name) || getImageSrc(potion.name)}
                  onError={(e) => (e.target.src = "/kingdom-come-deliverance-2-potions/potion-recipes/temp.png")}
                  alt={potion.name}
                  style={{ 
                    width: "100%", 
                    aspectRatio: window.innerWidth <= 480 ? "4/3" : "16/9", // Better aspect ratio for single column
                    objectFit: "cover"
                  }}
                />
                <h2 style={{ 
                  position: "absolute", 
                  bottom: "10px", 
                  left: "10px", 
                  margin: 0,
                  fontSize: window.innerWidth <= 480 ? "1.5rem" : "clamp(1rem, 3vw, 1.3rem)", // Larger font on mobile
                  color: "white",
                  textShadow: "0 2px 4px rgba(0,0,0,0.8)",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  padding: "5px 10px",
                  borderRadius: "4px",
                  maxWidth: "calc(100% - 20px)", // Prevent text from overflowing
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap"
                }}>
                  {potion.name}
                </h2>
              </div>
              <div style={{ padding: window.innerWidth <= 480 ? "16px" : "12px" }}>
                <p className="long-text" style={{ 
                  fontSize: window.innerWidth <= 480 ? "1.1rem" : "1rem", 
                  color: "#ccc", 
                  marginBottom: "12px",
                  overflowWrap: "break-word",
                  wordWrap: "break-word"
                }}>
                  {potion.effects}
                </p>
                
                {potion.baseLiquid && potion.baseLiquid.trim() !== "" && (
                  <div style={{ 
                    fontSize: window.innerWidth <= 480 ? "1rem" : "0.95rem", 
                    color: "#aaa", 
                    marginBottom: "10px",
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap" // Allow wrapping on narrow screens
                  }}>
                    <span style={{ marginRight: "5px" }}>💧</span>
                    <strong>Base:</strong> <span className="long-text" style={{ 
                      marginLeft: "5px",
                      overflowWrap: "break-word",
                      wordWrap: "break-word"
                    }}>
                      {potion.baseLiquid}
                    </span>
                  </div>
                )}
                
                <div style={{ 
                  fontSize: window.innerWidth <= 480 ? "1rem" : "0.95rem", 
                  color: "#aaa", 
                  borderTop: "1px solid #333",
                  paddingTop: "10px",
                  marginTop: "5px"
                }}>
                  <strong>Ingredients:</strong>
                  <ul style={{ 
                    listStyleType: "none", 
                    padding: "0", 
                    margin: "8px 0 0 0" 
                  }}>
                    {potion.ingredients.split(',').map((ingredient, index) => {
                      const trimmedIngredient = ingredient.trim();
                      const quantityMatch = trimmedIngredient.match(/^(\d+)x\s+(.+)$/);
                      
                      if (quantityMatch) {
                        const quantity = parseInt(quantityMatch[1]);
                        const item = quantityMatch[2];
                        const iconSrc = getIngredientIcon(item);
                        
                        return (
                          <li key={index} style={{ 
                            marginBottom: window.innerWidth <= 480 ? "10px" : "5px", 
                            display: "flex", 
                            alignItems: "center",
                            flexWrap: "wrap" // Allow wrapping for long ingredient names
                          }}>
                            <div style={{ display: "flex", marginRight: "5px", flexShrink: 0 }}>
                              {[...Array(quantity)].map((_, i) => (
                                <span key={i} style={{ marginRight: "4px" }}>
                                  {iconSrc ? (
                                    <img 
                                      src={iconSrc} 
                                      alt={item}
                                      style={{ 
                                        width: window.innerWidth <= 480 ? "30px" : "24px", 
                                        height: window.innerWidth <= 480 ? "30px" : "24px",
                                        verticalAlign: "middle"
                                      }}
                                    />
                                  ) : (
                                    <span style={{ fontSize: window.innerWidth <= 480 ? "1.5rem" : "1.2rem" }}>🧪</span>
                                  )}
                                </span>
                              ))}
                            </div>
                            <span className="long-text" style={{ 
                              fontSize: window.innerWidth <= 480 ? "1.1rem" : "0.9rem",
                              overflowWrap: "break-word",
                              wordWrap: "break-word",
                              hyphens: "auto"
                            }}>
                              {item}
                            </span>
                          </li>
                        );
                      }
                      
                      const iconSrc = getIngredientIcon(trimmedIngredient);
                      return (
                        <li key={index} style={{ 
                          marginBottom: window.innerWidth <= 480 ? "10px" : "5px", 
                          display: "flex", 
                          alignItems: "center",
                          flexWrap: "wrap" // Allow wrapping
                        }}>
                          <span style={{ marginRight: "6px", flexShrink: 0 }}>
                            {iconSrc ? (
                              <img 
                                src={iconSrc} 
                                alt={trimmedIngredient}
                                style={{ 
                                  width: window.innerWidth <= 480 ? "30px" : "24px", 
                                  height: window.innerWidth <= 480 ? "30px" : "24px",
                                  verticalAlign: "middle"
                                }}
                              />
                            ) : (
                              <span style={{ fontSize: window.innerWidth <= 480 ? "1.5rem" : "1.2rem" }}>🧪</span>
                            )}
                          </span>
                          <span className="long-text" style={{ 
                            fontSize: window.innerWidth <= 480 ? "1.1rem" : "0.9rem",
                            overflowWrap: "break-word",
                            wordWrap: "break-word",
                            hyphens: "auto"
                          }}>
                            {trimmedIngredient}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Multi-section Content */}
      <div className="guide-sections" style={{
        marginTop: "100px",
        borderTop: "1px solid #333",
        paddingTop: "50px",
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden"
      }}>
        <h2 style={{
          fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
          textAlign: "center",
          margin: "0 0 60px 0",
          color: "#fff",
          textTransform: "uppercase",
          letterSpacing: "2px",
          fontWeight: "600"
        }}>
          Complete Guide to Alchemy
        </h2>

        {/* Section 1: Alchemy Basics */}
        <section id="basics" style={{
          padding: "60px 0",
          margin: "0 auto",
          maxWidth: "1200px",
          display: "flex",
          flexDirection: window.innerWidth > 768 ? "row" : "column",
          alignItems: "center",
          gap: "40px",
          background: "rgba(20, 20, 20, 0.7)",
          borderRadius: "12px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
          overflow: "hidden",
          marginBottom: "100px",
          width: "95%",
          scrollMarginTop: "80px" // Offset for sticky header
        }}>
          <div style={{
            flex: window.innerWidth > 768 ? "1" : "auto",
            padding: "0 40px",
            order: window.innerWidth > 768 ? 1 : 2
          }}>
            <h3 style={{
              fontSize: "clamp(1.5rem, 4vw, 2rem)",
              marginBottom: "20px",
              color: "#FF9800"
            }}>Understanding Alchemy Basics</h3>
            <p className="long-text" style={{
              fontSize: "clamp(1rem, 3vw, 1.2rem)",
              lineHeight: "1.8",
              color: "#ddd",
              marginBottom: "20px"
            }}>
              Alchemy in Kingdom Come Deliverance 2 builds upon the intricate brewing system of its predecessor. 
              Players will discover that mastering this art requires understanding the properties of ingredients, 
              following precise brewing processes, and proper timing.
            </p>
            <p className="long-text" style={{
              fontSize: "clamp(1rem, 3vw, 1.2rem)",
              lineHeight: "1.8",
              color: "#ddd",
              marginBottom: "20px"
            }}>
              The game introduces new ingredients and recipes, allowing for more diverse potion effects. 
              From healing concoctions to combat enhancers, the possibilities are vast for those willing to 
              experiment with the cauldron.
            </p>
            <a href="/kingdom-come-deliverance-2-potions/alchemy-basics.html" style={{
              display: "inline-block",
              padding: "12px 25px",
              background: "#FF9800",
              color: "#111",
              textDecoration: "none",
              borderRadius: "5px",
              fontWeight: "bold",
              marginTop: "15px",
              transition: "background 0.3s ease"
            }}>
              Learn More About Basics
            </a>
          </div>
          <div style={{
            flex: window.innerWidth > 768 ? "1" : "auto",
            order: window.innerWidth > 768 ? 2 : 1,
            width: window.innerWidth > 768 ? "50%" : "100%",
            padding: window.innerWidth > 768 ? "0" : "0 40px"
          }}>
            <img 
              src="/kingdom-come-deliverance-2-potions/potion-recipes/temp.png" 
              alt="Alchemy Basics"
              style={{
                width: "100%",
                borderRadius: "8px",
                boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)"
              }}
            />
          </div>
        </section>

        {/* Section 2: Ingredient Locations */}
        <section id="ingredients" style={{
          padding: "60px 0",
          margin: "0 auto",
          maxWidth: "1200px",
          display: "flex",
          flexDirection: window.innerWidth > 768 ? "row" : "column",
          alignItems: "center",
          gap: "40px",
          background: "rgba(20, 20, 20, 0.7)",
          borderRadius: "12px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
          overflow: "hidden",
          marginBottom: "100px",
          width: "95%",
          scrollMarginTop: "80px" // Offset for sticky header
        }}>
          <div style={{
            flex: window.innerWidth > 768 ? "1" : "auto",
            padding: "0 40px",
            order: window.innerWidth > 768 ? 2 : 2
          }}>
            <h3 style={{
              fontSize: "clamp(1.5rem, 4vw, 2rem)",
              marginBottom: "20px",
              color: "#FF9800"
            }}>Ingredient Locations</h3>
            <p className="long-text" style={{
              fontSize: "clamp(1rem, 3vw, 1.2rem)",
              lineHeight: "1.8",
              color: "#ddd",
              marginBottom: "20px"
            }}>
              Finding rare alchemy ingredients is a crucial part of becoming a master alchemist in Kingdom Come Deliverance 2. 
              The expanded world offers various biomes where specific plants and materials can be gathered.
            </p>
            <p className="long-text" style={{
              fontSize: "clamp(1rem, 3vw, 1.2rem)",
              lineHeight: "1.8",
              color: "#ddd",
              marginBottom: "20px"
            }}>
              From dense forests where mushrooms and herbs thrive to mountain regions with rare minerals, 
              every area of the map holds specific ingredients. Learning where to find each component will 
              save you valuable time in your alchemical pursuits.
            </p>
            <a href="https://mapgenie.io/kingdom-come-deliverance-2/guides/recipes" style={{
              display: "inline-block",
              padding: "12px 25px",
              background: "#FF9800",
              color: "#111",
              textDecoration: "none",
              borderRadius: "5px",
              fontWeight: "bold",
              marginTop: "15px",
              transition: "background 0.3s ease"
            }}>
              View Ingredient Map
            </a>
          </div>
          <div style={{
            flex: window.innerWidth > 768 ? "1" : "auto",
            order: window.innerWidth > 768 ? 1 : 1,
            width: window.innerWidth > 768 ? "50%" : "100%",
            padding: window.innerWidth > 768 ? "0" : "0 40px"
          }}>
            <img 
              src="/kingdom-come-deliverance-2-potions/potion-recipes/temp.png" 
              alt="Ingredient Locations"
              style={{
                width: "100%",
                borderRadius: "8px",
                boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)"
              }}
            />
          </div>
        </section>

        {/* Section 3: Advanced Brewing Techniques */}
        <section id="advanced" style={{
          padding: "60px 0",
          margin: "0 auto",
          maxWidth: "1200px",
          display: "flex",
          flexDirection: window.innerWidth > 768 ? "row" : "column",
          alignItems: "center",
          gap: "40px",
          background: "rgba(20, 20, 20, 0.7)",
          borderRadius: "12px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
          overflow: "hidden",
          marginBottom: "100px",
          width: "95%",
          scrollMarginTop: "80px" // Offset for sticky header
        }}>
          <div style={{
            flex: window.innerWidth > 768 ? "1" : "auto",
            padding: "0 40px",
            order: window.innerWidth > 768 ? 1 : 2
          }}>
            <h3 style={{
              fontSize: "clamp(1.5rem, 4vw, 2rem)",
              marginBottom: "20px",
              color: "#9C27B0"
            }}>Advanced Brewing Techniques</h3>
            <p className="long-text" style={{
              fontSize: "clamp(1rem, 3vw, 1.2rem)",
              lineHeight: "1.8",
              color: "#ddd",
              marginBottom: "20px"
            }}>
              Once you've mastered the basics, it's time to explore advanced brewing techniques. 
              Kingdom Come Deliverance 2 introduces potion enhancement methods that allow you to amplify 
              effects, increase duration, or reduce negative side effects.
            </p>
            <p className="long-text" style={{
              fontSize: "clamp(1rem, 3vw, 1.2rem)",
              lineHeight: "1.8",
              color: "#ddd",
              marginBottom: "20px"
            }}>
              Techniques such as double distillation, essence extraction, and catalyst brewing open new 
              possibilities for creating potent concoctions that can give you an edge in the most challenging situations.
            </p>
            <a href="#" style={{
              display: "inline-block",
              padding: "12px 25px",
              background: "#9C27B0",
              color: "#fff",
              textDecoration: "none",
              borderRadius: "5px",
              fontWeight: "bold",
              marginTop: "15px",
              transition: "background 0.3s ease"
            }}>
              Master Advanced Techniques
            </a>
          </div>
          <div style={{
            flex: window.innerWidth > 768 ? "1" : "auto",
            order: window.innerWidth > 768 ? 2 : 1,
            width: window.innerWidth > 768 ? "50%" : "100%",
            padding: window.innerWidth > 768 ? "0" : "0 40px"
          }}>
            <img 
              src="/kingdom-come-deliverance-2-potions/potion-recipes/temp.png" 
              alt="Advanced Brewing Techniques"
              style={{
                width: "100%",
                borderRadius: "8px",
                boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)"
              }}
            />
          </div>
        </section>
        
        {/* Section navigation */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          margin: "50px 0 20px",
          flexWrap: "wrap",
          padding: "0 20px"
        }}>
          <a 
            onClick={() => scrollToSection('potions')}
            style={{
              padding: "10px 20px",
              background: "rgba(20, 20, 20, 0.7)",
              color: "#fff",
              textDecoration: "none",
              borderRadius: "5px",
              transition: "background 0.3s ease",
              textAlign: "center",
              cursor: "pointer"
            }}
            onMouseOver={(e) => e.target.style.background = "rgba(40, 40, 40, 0.7)"}
            onMouseOut={(e) => e.target.style.background = "rgba(20, 20, 20, 0.7)"}
          >
            Back to Potions
          </a>
          <a 
            onClick={() => scrollToSection('basics')}
            style={{
              padding: "10px 20px",
              background: "rgba(20, 20, 20, 0.7)",
              color: "#fff",
              textDecoration: "none",
              borderRadius: "5px",
              transition: "background 0.3s ease",
              textAlign: "center",
              cursor: "pointer"
            }}
            onMouseOver={(e) => e.target.style.background = "rgba(40, 40, 40, 0.7)"}
            onMouseOut={(e) => e.target.style.background = "rgba(20, 20, 20, 0.7)"}
          >
            Alchemy Basics
          </a>
          <a 
            onClick={() => scrollToSection('ingredients')}
            style={{
              padding: "10px 20px",
              background: "rgba(20, 20, 20, 0.7)",
              color: "#fff",
              textDecoration: "none",
              borderRadius: "5px",
              transition: "background 0.3s ease",
              textAlign: "center",
              cursor: "pointer"
            }}
            onMouseOver={(e) => e.target.style.background = "rgba(40, 40, 40, 0.7)"}
            onMouseOut={(e) => e.target.style.background = "rgba(20, 20, 20, 0.7)"}
          >
            Ingredient Locations
          </a>
          <a 
            onClick={() => scrollToSection('advanced')}
            style={{
              padding: "10px 20px",
              background: "rgba(20, 20, 20, 0.7)",
              color: "#fff",
              textDecoration: "none",
              borderRadius: "5px",
              transition: "background 0.3s ease",
              textAlign: "center",
              cursor: "pointer"
            }}
            onMouseOver={(e) => e.target.style.background = "rgba(40, 40, 40, 0.7)"}
            onMouseOut={(e) => e.target.style.background = "rgba(20, 20, 20, 0.7)"}
          >
            Advanced Techniques
          </a>
        </div>
      </div>

      {selectedPotion && (
        <div
          onClick={closePotionDetail}
          className={`modal-overlay ${modalAnimation}`}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Sticky close button */}
            <button 
              className="modal-close-btn"
              onClick={closePotionDetail}
              aria-label="Close"
            >
              ✕
            </button>
            
            <div style={{ 
              display: "flex", 
              flexDirection: window.innerWidth > 768 ? "row" : "column",
              gap: "20px",
              alignItems: "flex-start",
              maxWidth: "100%"
            }}>
              <div style={{ 
                width: window.innerWidth > 768 ? "40%" : "100%",
                maxWidth: "100%"
              }}>
                <img
                  src={getPotionIcon(selectedPotion.name) || getImageSrc(selectedPotion.name)}
                  onError={(e) => (e.target.src = "/kingdom-come-deliverance-2-potions/potion-recipes/temp.png")}
                  alt={selectedPotion.name}
                  className="modal-img"
                  style={{ 
                    width: "100%", 
                    objectFit: "cover", 
                    borderRadius: "10px",
                    maxHeight: window.innerWidth > 768 ? "60vh" : "30vh"
                  }}
                />
                <div style={{ marginTop: "10px" }}>
                  <h3 className="modal-heading" style={{ fontSize: "1.3rem", marginBottom: "10px" }}>Effects:</h3>
                  <p className="long-text modal-text" style={{ 
                    fontSize: "1.1rem", 
                    lineHeight: "1.4",
                    overflowWrap: "break-word",
                    wordWrap: "break-word"
                  }}>
                    {selectedPotion.effects}
                  </p>
                  
                  {selectedPotion.enhancedEffects && (
                    <div style={{ marginTop: "10px" }}>
                      <h3 className="modal-heading" style={{ fontSize: "1.3rem", marginBottom: "10px" }}>Enhanced Effects:</h3>
                      <p className="long-text modal-text" style={{ 
                        fontSize: "1.1rem", 
                        lineHeight: "1.4",
                        overflowWrap: "break-word",
                        wordWrap: "break-word"
                      }}>
                        {selectedPotion.enhancedEffects}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ flex: 1, maxWidth: "100%" }}>
                <h2 className="modal-title" style={{ 
                  fontSize: "clamp(1.5rem, 5vw, 2.2rem)", // Responsive font size
                  marginBottom: "20px",
                  overflowWrap: "break-word",
                  wordWrap: "break-word"
                }}>
                  {selectedPotion.name}
                </h2>
                
                {selectedPotion.baseLiquid && selectedPotion.baseLiquid.trim() !== "" && (
                  <div style={{ marginBottom: "15px" }}>
                    <h3 className="modal-heading" style={{ fontSize: "1.3rem", marginBottom: "8px" }}>Base Liquid:</h3>
                    <p className="long-text modal-text" style={{ 
                      fontSize: "1.1rem",
                      overflowWrap: "break-word",
                      wordWrap: "break-word"
                    }}>
                      {selectedPotion.baseLiquid}
                    </p>
                  </div>
                )}

                <div style={{ marginBottom: "15px" }}>
                  <h3 className="modal-heading" style={{ fontSize: "1.3rem", marginBottom: "8px" }}>Ingredients:</h3>
                  <ul style={{ 
                    listStyleType: "none", 
                    padding: "0", 
                    margin: "0",
                    fontSize: "1.1rem",
                    display: "grid",
                    gridTemplateColumns: window.innerWidth > 480 ? "repeat(2, 1fr)" : "1fr",
                    gap: "5px"
                  }}>
                    {selectedPotion.ingredients.split(',').map((ingredient, index) => {
                      const trimmedIngredient = ingredient.trim();
                      const quantityMatch = trimmedIngredient.match(/^(\d+)x\s+(.+)$/);
                      
                      if (quantityMatch) {
                        const quantity = parseInt(quantityMatch[1]);
                        const item = quantityMatch[2];
                        const iconSrc = getIngredientIcon(item);
                        
                        return (
                          <li key={index} style={{ 
                            marginBottom: "5px", 
                            display: "flex", 
                            alignItems: "center",
                            flexWrap: "wrap"
                          }}>
                            <div style={{ display: "flex", marginRight: "5px", flexShrink: 0 }}>
                              {[...Array(quantity)].map((_, i) => (
                                <span key={i} style={{ marginRight: "2px" }}>
                                  {iconSrc ? (
                                    <img 
                                      src={iconSrc} 
                                      alt={item}
                                      style={{ 
                                        width: "20px", 
                                        height: "20px",
                                        verticalAlign: "middle"
                                      }}
                                    />
                                  ) : (
                                    <span style={{ fontSize: "1rem" }}>🧪</span>
                                  )}
                                </span>
                              ))}
                            </div>
                            <span className="long-text modal-text" style={{ 
                              fontSize: "0.9rem",
                              overflowWrap: "break-word",
                              wordWrap: "break-word",
                              hyphens: "auto"
                            }}>
                              {item}
                            </span>
                          </li>
                        );
                      }
                      
                      const iconSrc = getIngredientIcon(trimmedIngredient);
                      return (
                        <li key={index} style={{ 
                          marginBottom: "5px", 
                          display: "flex", 
                          alignItems: "center",
                          flexWrap: "wrap"
                        }}>
                          <span style={{ marginRight: "6px", flexShrink: 0 }}>
                            {iconSrc ? (
                              <img 
                                src={iconSrc} 
                                alt={trimmedIngredient}
                                style={{ 
                                  width: "20px", 
                                  height: "20px",
                                  verticalAlign: "middle"
                                }}
                              />
                            ) : (
                              <span style={{ fontSize: "1rem" }}>🧪</span>
                            )}
                          </span>
                          <span className="long-text modal-text" style={{ 
                            fontSize: "0.9rem",
                            overflowWrap: "break-word",
                            wordWrap: "break-word",
                            hyphens: "auto"
                          }}>
                            {trimmedIngredient}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <h3 className="modal-heading" style={{ fontSize: "1.3rem", marginBottom: "8px" }}>Preparation Steps:</h3>
                  <ol style={{ 
                    paddingLeft: window.innerWidth > 480 ? "20px" : "16px", 
                    margin: "0", 
                    fontSize: "1.1rem",
                    lineHeight: "1.5"
                  }}>
                    {selectedPotion.steps.split('>').map((step, index) => (
                      <li key={index} style={{ marginBottom: "8px" }} className="modal-text">
                        {step.trim()}
                      </li>
                    ))}
                  </ol>
                </div>
                
                {selectedPotion.acquisition && (
                  <div style={{ marginBottom: "15px" }}>
                    <h3 className="modal-heading" style={{ fontSize: "1.3rem", marginBottom: "8px" }}>Where to Find:</h3>
                    <p className="modal-text" style={{ fontSize: "1.1rem", lineHeight: "1.4" }}>{selectedPotion.acquisition}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid #333",
        marginTop: "50px",
        padding: "20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "clamp(10px, 3vw, 30px)", // Responsive gap
        backgroundColor: "#1a1a1a",
        flexWrap: "wrap", // Allow wrapping on small screens
        width: "100%",
        boxSizing: "border-box",
        overflowX: "hidden"
      }}>
        <a 
          href="https://www.instagram.com/andrew_mcbride_atl/" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ color: "#ccc", fontSize: "24px", transition: "color 0.3s" }}
          onMouseOver={(e) => e.target.style.color = "#E1306C"}
          onMouseOut={(e) => e.target.style.color = "#ccc"}
        >
          <i className="fab fa-instagram"></i>
        </a>
        <a 
          href="https://vimeo.com/andrewmcbride" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ color: "#ccc", fontSize: "24px", transition: "color 0.3s" }}
          onMouseOver={(e) => e.target.style.color = "#00ADEF"}
          onMouseOut={(e) => e.target.style.color = "#ccc"}
        >
          <i className="fab fa-vimeo-v"></i>
        </a>
        <a 
          href="https://www.404found.art/" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            color: "#ccc", 
            textDecoration: "none", 
            fontSize: "16px",
            transition: "color 0.3s"
          }}
          onMouseOver={(e) => e.target.style.color = "#FF9800"}
          onMouseOut={(e) => e.target.style.color = "#ccc"}
        >
          404found.art
        </a>
        <a 
          href="https://motionographer.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            color: "#ccc", 
            textDecoration: "none", 
            fontSize: "16px",
            transition: "color 0.3s"
          }}
          onMouseOver={(e) => e.target.style.color = "#FF4D4D"}
          onMouseOut={(e) => e.target.style.color = "#ccc"}
        >
          Motionographer
        </a>
      </footer>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <button 
          className="mobile-menu-close" 
          onClick={() => setMobileMenuOpen(false)}
        >
          ✕
        </button>
        <a 
          className="mobile-menu-link" 
          onClick={() => scrollToSection('potions')}
        >
          Potions
        </a>
        <a 
          className="mobile-menu-link" 
          onClick={() => scrollToSection('basics')}
        >
          Alchemy Basics
        </a>
        <a 
          className="mobile-menu-link" 
          onClick={() => scrollToSection('ingredients')}
        >
          Ingredient Locations
        </a>
        <a 
          className="mobile-menu-link" 
          onClick={() => scrollToSection('advanced')}
        >
          Advanced Techniques
        </a>
      </div>
    </div>
  );
}
