import React, { useState, useContext } from "react";
import styles from "./MakeYourOwnPage.module.css";
import { CartContext, CartItemMinimal } from "../App";
import { v4 as uuidv4 } from 'uuid';

interface Option {
  id: string;
  name: string;
  price: number;
}

interface JewelryConfig {
  chains?: Option[];
  lengths?: Option[];
  pendants?: Option[];
  materials?: Option[];
  sizes?: Option[];
  stones?: Option[];
  finishes?: Option[];
}

const jewelryOptions: Record<string, JewelryConfig> = {
  necklace: {
    chains: [
      { id: "normal", name: "Vanlig Lenke", price: 0 },
      { id: "delicate", name: "Delikat Lenk", price: 200 },
      { id: "medium", name: "Medium Lenke", price: 300 },
      { id: "chunky", name: "Robust Lenke", price: 400 },
    ],
    lengths: [
      { id: "40cm", name: "40 cm", price: 0 },
      { id: "45cm", name: "45 cm", price: 50 },
      { id: "50cm", name: "50 cm", price: 100 },
    ],
    pendants: [
      { id: "random", name: "Tilfeldig anheng", price: 0 },
      { id: "pearl", name: "Perle anheng", price: 250 },
      { id: "crystal", name: "Krystall anheng", price: 300 },
      { id: "flower", name: "Blomst anheng", price: 350 },
    ],
    materials: [
      { id: "silver", name: "Sølv", price: 0 },
      { id: "gold", name: "Gull", price: 500 },
      { id: "rosegold", name: "Rosé gull", price: 500 },
    ],
  },
  armband: {
    chains: [
      { id: "thin", name: "Tynn lenke", price: 150 },
      { id: "braided", name: "Flettet", price: 200 },
      { id: "chain", name: "Kjedearmband", price: 250 },
    ],
    sizes: [
      { id: "small", name: "Liten (16 cm)", price: 0 },
      { id: "medium", name: "Medium (18 cm)", price: 0 },
      { id: "large", name: "Stor (20 cm)", price: 50 },
    ],
    stones: [
      { id: "none", name: "Ingen", price: 0 },
      { id: "single", name: "Enkelt stein", price: 200 },
      { id: "multiple", name: "Flere steiner", price: 400 },
    ],
    materials: [
      { id: "silver", name: "Sølv", price: 0 },
      { id: "gold", name: "Gull", price: 400 },
      { id: "leather", name: "Lær", price: 150 },
    ],
  },
  rings: {
    materials: [
      { id: "silver", name: "Sølv", price: 0 },
      { id: "gold", name: "Gull", price: 600 },
      { id: "platinum", name: "Platina", price: 1000 },
    ],
    sizes: [
      { id: "16", name: "Størrelse 16", price: 0 },
      { id: "17", name: "Størrelse 17", price: 0 },
      { id: "18", name: "Størrelse 18", price: 0 },
      { id: "19", name: "Størrelse 19", price: 0 },
    ],
    stones: [
      { id: "none", name: "Ingen stein", price: 0 },
      { id: "diamond", name: "Diamant", price: 800 },
      { id: "sapphire", name: "Safir", price: 600 },
      { id: "emerald", name: "Smaragd", price: 700 },
    ],
    finishes: [
      { id: "polished", name: "Polert", price: 0 },
      { id: "matte", name: "Matt", price: 50 },
      { id: "hammered", name: "Hamret", price: 100 },
    ],
  },
  buttons: {
    materials: [
      { id: "pearl", name: "Perlemor", price: 0 },
      { id: "silver", name: "Sølv", price: 200 },
      { id: "gold", name: "Gull", price: 400 },
    ],
    sizes: [
      { id: "small", name: "Liten (10 mm)", price: 0 },
      { id: "medium", name: "Medium (12 mm)", price: 50 },
      { id: "large", name: "Stor (15 mm)", price: 100 },
    ],
    finishes: [
      { id: "smooth", name: "Glatt", price: 0 },
      { id: "engraved", name: "Graverad", price: 150 },
      { id: "textured", name: "Teksturert", price: 100 },
    ],
  },
};

const typeOptions = [
  { id: "necklace", name: "Halskjede", icon: "📿" },
  { id: "armband", name: "Armbånd", icon: "💫" },
  { id: "rings", name: "Ringer", icon: "💍" },
  { id: "buttons", name: "Skjorteknapper", icon: "🔘" },
];

const MakeYourOwn: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>("necklace");
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [basePrice] = useState(599);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const { state: _cart, dispatch } = useContext(CartContext);

  const handleAddToCart = () => {
    setIsAdding(true);

    setTimeout(() => {
      setIsAdding(false);
      setIsAdded(true);

      const metadata: Record<string, string> = {};
      Object.keys(jewelryOptions[selectedType]).forEach((category) => {
        metadata[category] = selections[category] ?? "none";
      });

      const id = uuidv4();


      const customProduct: CartItemMinimal = {
        id,
        quantity: 1,
        name: `Lag Din Egen`,
        price: calculateTotal(),
        metadata,
      };

      dispatch({ type: "addToCart", payload: customProduct });

      setTimeout(() => setIsAdded(false), 2000);
    }, 600);
  };

  const handleTypeChange = (typeId: string) => {
    setSelectedType(typeId);
    setSelections({});
  };

  const handleOptionChange = (category: string, optionId: string) => {
    setSelections((prev) => ({
      ...prev,
      [category]: optionId,
    }));
  };

  const calculateTotal = (): number => {
    let total = basePrice;
    const config = jewelryOptions[selectedType];

    Object.entries(selections).forEach(([category, optionId]) => {
      const categoryOptions = config[category as keyof JewelryConfig];
      if (categoryOptions) {
        const option = categoryOptions.find((opt) => opt.id === optionId);
        if (option) total += option.price;
      }
    });

    return total;
  };

  const renderOptionRow = (category: string, options: Option[]) => {
    const categoryNames: Record<string, string> = {
      chains: "Lenke",
      lengths: "Lengde",
      pendants: "Anheng",
      materials: "Materiale",
      sizes: "Størrelse",
      stones: "Steiner",
      finishes: "Finish",
    };

    return (
      <div key={category} className={styles.optionRow}>
        <h3 className={styles.categoryTitle}>{categoryNames[category]}</h3>
        <div className={styles.optionsGrid}>
          {options.map((option) => (
            <button
              key={option.id}
              className={`${styles.optionButton} ${
                selections[category] === option.id ? styles.selected : ""
              }`}
              onClick={() => handleOptionChange(category, option.id)}
            >
              <span className={styles.optionName}>{option.name}</span>
              {option.price > 0 && (
                <span className={styles.optionPrice}>+{option.price} kr</span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Lag Ditt Eget Smykke</h1>
        <p className={styles.subtitle}>
          Velg type og tilpass etter dine ønsker
        </p>
      </div>

      <div className={styles.typeSelector}>
        <h2 className={styles.sectionTitle}>Velg Type</h2>
        <div className={styles.typeGrid}>
          {typeOptions.map((type) => (
            <button
              key={type.id}
              className={`${styles.typeButton} ${
                selectedType === type.id ? styles.selectedType : ""
              }`}
              onClick={() => handleTypeChange(type.id)}
            >
              <span className={styles.typeIcon}>{type.icon}</span>
              <span className={styles.typeName}>{type.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.customizationSection}>
        <h2 className={styles.sectionTitle}>Tilpass Ditt Valg</h2>
        {Object.entries(jewelryOptions[selectedType]).map(
          ([category, options]) => renderOptionRow(category, options)
        )}
      </div>

      <div className={styles.summary}>
        <div className={styles.summaryContent}>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Basisspris:</span>
            <span className={styles.summaryValue}>{basePrice} kr</span>
          </div>
          {Object.entries(selections).map(([category, optionId]) => {
            const config = jewelryOptions[selectedType];
            const categoryOptions = config[category as keyof JewelryConfig];
            if (!categoryOptions) return null;

            const option = categoryOptions.find((opt) => opt.id === optionId);
            if (!option || option.price === 0) return null;

            return (
              <div key={category} className={styles.summaryRow}>
                <span className={styles.summaryLabel}>{option.name}:</span>
                <span className={styles.summaryValue}>+{option.price} kr</span>
              </div>
            );
          })}
          <div className={styles.summaryDivider} />
          <div className={`${styles.summaryRow} ${styles.total}`}>
            <span className={styles.summaryLabel}>Totalpris:</span>
            <span className={styles.summaryValue}>{calculateTotal()} kr</span>
          </div>
        </div>
        <button
          className={`${styles.addToCartButton} ${
            isAdding ? styles.adding : ""
          } ${isAdded ? styles.added : ""}`}
          onClick={handleAddToCart}
          disabled={isAdding || isAdded}
        >
          {isAdded && <span className={styles.buttonIcon}>✓</span>}
          {!isAdding && !isAdded && "Legg til i handlekurv"}
          {isAdding && "Legger til..."}
          {isAdded && "Lagt til!"}
        </button>
      </div>
    </div>
  );
};

export default MakeYourOwn;
