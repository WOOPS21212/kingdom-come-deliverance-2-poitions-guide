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

export default function App() {
  const [selectedPotion, setSelectedPotion] = useState(null);
  const [sort, setSort] = useState("alphabetical");
  const [columns, setColumns] = useState(getColumnCount());
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [cardsVisible, setCardsVisible] = useState(false);
  const [modalAnimation, setModalAnimation] = useState(""); // "entering", "entered", "exiting", "exited"
  
  // Function to determine column count based on screen width
  function getColumnCount() {
    if (typeof window === 'undefined') return "repeat(auto-fill, minmax(250px, 1fr))";
    
    const width = window.innerWidth;
    if (width > 2400) return "repeat(auto-fill, minmax(300px, 1fr))";
    if (width > 1800) return "repeat(auto-fill, minmax(280px, 1fr))";
    if (width > 1200) return "repeat(auto-fill, minmax(250px, 1fr))";
    if (width > 768) return "repeat(auto-fill, minmax(220px, 1fr))";
    return "repeat(auto-fill, minmax(200px, 1fr))";
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
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease-out, visibility 0.3s ease-out;
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
    }
    
    .modal-overlay.entered .modal-content {
      transform: scale(1);
      opacity: 1;
    }
    
    .modal-overlay.entering .modal-content {
      transform: scale(0.95);
      opacity: 0;
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
    <div style={{ background: "#111", color: "#fff", minHeight: "100vh", padding: "20px", fontFamily: "sans-serif", width: "100%", boxSizing: "border-box" }}>
      {/* Add a style tag for the hover effects */}
      <style>{hoverStyles}</style>
      <style>{modalStyles}</style>
      
      <div style={{ maxWidth: "1800px", margin: "0 auto", width: "100%" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "20px" }}>Kingdom Come Deliverance 2</h1>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Search potions by name or effects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              padding: "8px 12px", 
              borderRadius: "4px", 
              background: "#333", 
              color: "#fff", 
              border: "1px solid #444",
              width: "100%",
              maxWidth: "400px"
            }}
          />
          
          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <select 
              onChange={(e) => setSort(e.target.value)} 
              value={sort}
              style={{ padding: "8px", borderRadius: "4px", background: "#333", color: "#fff", border: "1px solid #444" }}
            >
              <option value="alphabetical">Sort A-Z</option>
              <option value="ingredients">Sort by Ingredients Count</option>
              <option value="difficulty">Sort by Difficulty</option>
              <option value="baseliquid">Sort by Base Liquid</option>
            </select>
            
            <button
              onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
              style={{ 
                padding: "8px 12px", 
                borderRadius: "4px", 
                background: "#333", 
                color: "#fff", 
                border: "1px solid #444",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
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
            gap: "20px", 
            marginTop: "20px",
            width: "100%",
            maxWidth: "100%"
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
                transitionDelay: `${i * 0.05}s`
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
                  style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover" }}
                />
                <h2 style={{ 
                  position: "absolute", 
                  bottom: "10px", 
                  left: "10px", 
                  margin: 0,
                  fontSize: "1.3rem", 
                  color: "white",
                  textShadow: "0 2px 4px rgba(0,0,0,0.8)",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  padding: "5px 10px",
                  borderRadius: "4px"
                }}>
                  {potion.name}
                </h2>
              </div>
              <div style={{ padding: "12px" }}>
                <p style={{ fontSize: "1rem", color: "#ccc", marginBottom: "12px" }}>{potion.effects}</p>
                
                {potion.baseLiquid && potion.baseLiquid.trim() !== "" && (
                  <div style={{ 
                    fontSize: "0.95rem", 
                    color: "#aaa", 
                    marginBottom: "10px",
                    display: "flex",
                    alignItems: "center" 
                  }}>
                    <span style={{ marginRight: "5px" }}>💧</span>
                    <strong>Base:</strong> <span style={{ marginLeft: "5px" }}>{potion.baseLiquid}</span>
                  </div>
                )}
                
                <div style={{ 
                  fontSize: "0.95rem", 
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
                          <li key={index} style={{ marginBottom: "5px", display: "flex", alignItems: "center" }}>
                            {[...Array(quantity)].map((_, i) => (
                              <span key={i} style={{ marginRight: "4px" }}>
                                {iconSrc ? (
                                  <img 
                                    src={iconSrc} 
                                    alt={item}
                                    style={{ 
                                      width: "30px",
                                      height: "30px",
                                      verticalAlign: "middle",
                                      marginRight: "4px"
                                    }}
                                  />
                                ) : (
                                  <span style={{ marginRight: "4px", fontSize: "1.5rem" }}>🧪</span>
                                )}
                              </span>
                            ))}
                            <span style={{ fontSize: "1.05rem" }}>{item}</span>
                          </li>
                        );
                      }
                      
                      const iconSrc = getIngredientIcon(trimmedIngredient);
                      return (
                        <li key={index} style={{ marginBottom: "5px", display: "flex", alignItems: "center" }}>
                          {iconSrc ? (
                            <img 
                              src={iconSrc} 
                              alt={trimmedIngredient}
                              style={{ 
                                width: "30px",
                                height: "30px",
                                verticalAlign: "middle",
                                marginRight: "6px"
                              }}
                            />
                          ) : (
                            <span style={{ marginRight: "6px", fontSize: "1.5rem" }}>🧪</span>
                          )}
                          <span style={{ fontSize: "1.05rem" }}>{trimmedIngredient}</span>
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

      {selectedPotion && (
        <div
          onClick={closePotionDetail}
          className={`modal-overlay ${modalAnimation}`}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ 
              display: "flex", 
              flexDirection: window.innerWidth > 768 ? "row" : "column",
              gap: "30px",
              alignItems: "flex-start"
            }}>
              <div style={{ 
                width: window.innerWidth > 768 ? "40%" : "100%",
              }}>
                <img
                  src={getPotionIcon(selectedPotion.name) || getImageSrc(selectedPotion.name)}
                  onError={(e) => (e.target.src = "/kingdom-come-deliverance-2-potions/potion-recipes/temp.png")}
                  alt={selectedPotion.name}
                  style={{ 
                    width: "100%", 
                    objectFit: "cover", 
                    borderRadius: "10px",
                    maxHeight: "60vh"
                  }}
                />
                <div style={{ marginTop: "15px" }}>
                  <h3 style={{ fontSize: "1.3rem", marginBottom: "10px" }}>Effects:</h3>
                  <p style={{ fontSize: "1.1rem", lineHeight: "1.5" }}>{selectedPotion.effects}</p>
                  
                  {selectedPotion.enhancedEffects && (
                    <div style={{ marginTop: "15px" }}>
                      <h3 style={{ fontSize: "1.3rem", marginBottom: "10px" }}>Enhanced Effects:</h3>
                      <p style={{ fontSize: "1.1rem", lineHeight: "1.5" }}>{selectedPotion.enhancedEffects}</p>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: "2.2rem", marginBottom: "20px" }}>{selectedPotion.name}</h2>
                
                {selectedPotion.baseLiquid && selectedPotion.baseLiquid.trim() !== "" && (
                  <div style={{ marginBottom: "20px" }}>
                    <h3 style={{ fontSize: "1.3rem", marginBottom: "10px" }}>Base Liquid:</h3>
                    <p style={{ fontSize: "1.1rem" }}>{selectedPotion.baseLiquid}</p>
                  </div>
                )}

                <div style={{ marginBottom: "20px" }}>
                  <h3 style={{ fontSize: "1.3rem", marginBottom: "10px" }}>Ingredients:</h3>
                  <ul style={{ 
                    listStyleType: "none", 
                    padding: "0", 
                    margin: "0",
                    fontSize: "1.1rem"
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
                            marginBottom: "12px", 
                            display: "flex", 
                            alignItems: "center" 
                          }}>
                            {[...Array(quantity)].map((_, i) => (
                              <span key={i} style={{ marginRight: "5px" }}>
                                {iconSrc ? (
                                  <img 
                                    src={iconSrc} 
                                    alt={item}
                                    style={{ 
                                      width: "36px",
                                      height: "36px",
                                      verticalAlign: "middle",
                                      marginRight: "4px"
                                    }}
                                  />
                                ) : (
                                  <span style={{ 
                                    marginRight: "5px", 
                                    fontSize: "1.8rem"
                                  }}>🧪</span>
                                )}
                              </span>
                            ))}
                            <span style={{ fontSize: "1.8rem" }}>{item}</span>
                          </li>
                        );
                      }
                      
                      const iconSrc = getIngredientIcon(trimmedIngredient);
                      return (
                        <li key={index} style={{ 
                          marginBottom: "12px", 
                          display: "flex", 
                          alignItems: "center"
                        }}>
                          {iconSrc ? (
                            <img 
                              src={iconSrc} 
                              alt={trimmedIngredient}
                              style={{ 
                                width: "36px",
                                height: "36px",
                                verticalAlign: "middle",
                                marginRight: "8px"
                              }}
                            />
                          ) : (
                            <span style={{ marginRight: "8px", fontSize: "1.8rem" }}>🧪</span>
                          )}
                          <span style={{ fontSize: "1.8rem" }}>{trimmedIngredient}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <h3 style={{ fontSize: "1.3rem", marginBottom: "10px" }}>Preparation Steps:</h3>
                  <ol style={{ 
                    paddingLeft: "20px", 
                    margin: "0", 
                    fontSize: "1.1rem",
                    lineHeight: "1.6"
                  }}>
                    {selectedPotion.steps.split('>').map((step, index) => (
                      <li key={index} style={{ marginBottom: "12px" }}>
                        {step.trim()}
                      </li>
                    ))}
                  </ol>
                </div>
                
                {selectedPotion.acquisition && (
                  <div style={{ marginBottom: "20px" }}>
                    <h3 style={{ fontSize: "1.3rem", marginBottom: "10px" }}>Where to Find:</h3>
                    <p style={{ fontSize: "1.1rem", lineHeight: "1.5" }}>{selectedPotion.acquisition}</p>
                  </div>
                )}
                
                <button 
                  onClick={closePotionDetail}
                  style={{
                    marginTop: "20px",
                    padding: "12px 24px",
                    background: "#333",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    transition: "background-color 0.2s ease-out",
                    fontSize: "1.1rem"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#444"}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#333"}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
