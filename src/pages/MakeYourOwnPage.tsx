import React, { useState, useContext, useEffect } from "react";
import styles from "./MakeYourOwnPage.module.css";
import { CustomOptionGroup } from "../@types/Database";
import { useCustomOptions } from "../API/useCustomOptions";
import { CartContext } from "../context/siteContexts";

const MakeYourOwn: React.FC = () => {
  const { options, fetchCustomOptions, isLoading } = useCustomOptions();
  const { dispatch } = useContext(CartContext);

  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    fetchCustomOptions();
  }, []);

  useEffect(() => {
    if (!selectedType && options?.length) {
      setSelectedType(options[0].type);
    }
  }, [options, selectedType]);

  const selectedTypeOptions = options?.find(
    (option) => option.type === selectedType,
  )?.type_options as CustomOptionGroup[] | undefined;

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

  const basePrice = React.useMemo(() => {
    const type = options?.find((o) => o.type === selectedType);
    return type?.base_price ?? 0;
  }, [options, selectedType]);

  const calculateTotal = (): number => {
    let total = basePrice;
    if (!selectedTypeOptions) return total;

    selectedTypeOptions.forEach((group) => {
      const selectedOptionId = selections[group.key];
      if (!selectedOptionId) return;

      const option = group.options.find((opt) => opt.id === selectedOptionId);

      if (option) total += option.price;
    });

    return total;
  };

  const handleAddToCart = async () => {
    if (!selectedTypeOptions || !selectedType) return;

    setIsAdding(true);

    try {
      // Build configuration JSON
      const configuration: Record<string, string> = {};
      selectedTypeOptions.forEach((group) => {
        configuration[group.key] = selections[group.key] ?? "none";
      });

      const payload = {
        type: selectedType,
        configuration,
        calculated_price: calculateTotal(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 1 day expiry
      };

      const res = await fetch("/.netlify/functions/createCustomProduct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        console.error("Failed to create custom product:", errData);
        alert("Kunne ikke lagre produktet. Prøv igjen.");
        setIsAdding(false);
        return;
      }

      const savedProduct = await res.json();

      dispatch({
        type: "addToCart",
        payload: {
          id: savedProduct.id,
          quantity: 1,
        },
      });

      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("En uventet feil oppsto. Prøv igjen.");
    } finally {
      setIsAdding(false);
    }
  };

  const renderOptionRow = (
    category: string,
    options: CustomOptionGroup["options"],
  ) => (
    <div key={category} className={styles.optionRow}>
      <h3 className={styles.categoryTitle}>{category}</h3>
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

  if (isLoading) {
    return (
      <div className={styles.container}>
        <h2>Laster valg...</h2>
      </div>
    );
  }

  if(options?.length === 0) {
    return (
      <div className={styles.container}>
        <h2>Lag din egen er ikke tilgjengelig akkurat nå.</h2>
      </div>
    );
  }

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
          {options?.map((type) => (
            <button
              key={type.id}
              className={`${styles.typeButton} ${
                selectedType === type.type ? styles.selectedType : ""
              }`}
              onClick={() => handleTypeChange(type.type)}
            >
              <span className={styles.typeName}>{type.type}</span>
            </button>
          ))}
        </div>
      </div>
      <div className={styles.customizationSection}>
        <h2 className={styles.sectionTitle}>Tilpass Ditt Valg</h2>
        {selectedTypeOptions?.map((group) =>
          renderOptionRow(group.key, group.options),
        )}
      </div>
      <div className={styles.summary}>
        <div className={styles.summaryContent}>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Basisspris:</span>
            <span className={styles.summaryValue}>{basePrice} kr</span>
          </div>

          {Object.entries(selections).map(([category, optionId]) => {
            const group = selectedTypeOptions?.find((g) => g.key === category);
            const option = group?.options.find((opt) => opt.id === optionId);

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
