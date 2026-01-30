import { useState, useEffect } from "react";
import { useCustomOptions } from "../../../API/useCustomOptions";
import { useUpdateCustomOptions } from "../../../API/useUpdateCustomOptions";
import style from "./AdminCustomOptions.module.css";
import { CustomOptionGroup } from "../../../@types/Database";
import { useCreateCustomOption } from "../../../API/useCreateCustomOptions";
import { useDeleteCustomOption } from "../../../API/useDeleteCustomOptions";

interface CustomOptionRow {
  id: number;
  type: string;
  type_options: CustomOptionGroup[];
  base_price: number;
}

function AdminCustomOptions() {
  const { options, isLoading, isError, fetchCustomOptions } =
    useCustomOptions();
  const { updateCustomOptions } = useUpdateCustomOptions();
  const { createCustomOption } = useCreateCustomOption();
  const { deleteCustomOption } = useDeleteCustomOption();

  const [allOptions, setAllOptions] = useState<CustomOptionRow[]>([]);
  const [newProductType, setNewProductType] = useState("");
  const [newProductTypeBasePrice, setNewProductTypeBasePrice] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  // Fetch options on mount
  useEffect(() => {
    fetchCustomOptions();
  }, []);

  useEffect(() => {
    if (options) {
      setAllOptions(options);
    }
  }, [options]);

  const addProductType = async () => {
    if (!newProductType.trim()) return;

    const basePrice = Number(newProductTypeBasePrice) || 0;

    const newOption = await createCustomOption({
      type: newProductType.trim(),
      type_options: [],
      base_price: basePrice,
    });

    if (newOption) {
      setAllOptions([...allOptions, newOption]);
      setNewProductType("");
      setNewProductTypeBasePrice("");
    }
  };

  const removeProductType = async (id: number) => {
    const confirmed = window.confirm(
      "Er du sikker på at du vil slette denne produkttypen?",
    );
    if (!confirmed) return;

    const success = await deleteCustomOption(id);
    if (success) {
      setAllOptions(allOptions.filter((opt) => opt.id !== id));
    } else {
      alert("Kunne ikke slette produkttype. Prøv igjen.");
    }
  };

  const addOptionCategory = (productId: number, categoryKey: string) => {
    if (!categoryKey.trim()) return;

    setAllOptions(
      allOptions.map((product) => {
        if (product.id === productId) {
          const exists = product.type_options.some(
            (opt) => opt.key.toLowerCase() === categoryKey.toLowerCase(),
          );
          if (exists) {
            alert("Denne kategorien finnes allerede!");
            return product;
          }
          return {
            ...product,
            type_options: [
              ...product.type_options,
              { key: categoryKey.trim(), options: [] },
            ],
          };
        }
        return product;
      }),
    );
  };

  const removeOptionCategory = (productId: number, key: string) => {
    setAllOptions(
      allOptions.map((product) => {
        if (product.id === productId) {
          return {
            ...product,
            type_options: product.type_options.filter((opt) => opt.key !== key),
          };
        }
        return product;
      }),
    );
  };

  const addOptionValue = (
    productId: number,
    categoryKey: string,
    valueName: string,
    price: number = 0,
  ) => {
    if (!valueName.trim()) return;

    setAllOptions(
      allOptions.map((product) => {
        if (product.id === productId) {
          return {
            ...product,
            type_options: product.type_options.map((opt) => {
              if (opt.key === categoryKey) {
                const exists = opt.options.some(
                  (o) => o.name.toLowerCase() === valueName.toLowerCase(),
                );
                if (exists) {
                  alert("Dette alternativet finnes allerede!");
                  return opt;
                }
                return {
                  ...opt,
                  options: [
                    ...opt.options,
                    {
                      id: valueName.toLowerCase().replace(/\s+/g, "-"),
                      name: valueName.trim(),
                      price: price,
                    },
                  ],
                };
              }
              return opt;
            }),
          };
        }
        return product;
      }),
    );
  };

  const removeOptionValue = (
    productId: number,
    categoryKey: string,
    optionId: string,
  ) => {
    setAllOptions(
      allOptions.map((product) => {
        if (product.id === productId) {
          return {
            ...product,
            type_options: product.type_options.map((opt) => {
              if (opt.key === categoryKey) {
                return {
                  ...opt,
                  options: opt.options.filter((o) => o.id !== optionId),
                };
              }
              return opt;
            }),
          };
        }
        return product;
      }),
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setError(false);
    setSuccess(false);

    try {
      // Update all modified options in the database
      const updatePromises = allOptions.map((option) =>
        updateCustomOptions(option.id, {
          type: option.type,
          type_options: option.type_options,
        }),
      );

      const results = await Promise.all(updatePromises);

      // Check if all updates were successful
      const allSuccessful = results.every((result) => result !== null);

      if (allSuccessful) {
        setSuccess(true);
        // Refresh the data from the server
        await fetchCustomOptions();
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 5000);
      }
    } catch (err) {
      console.error("Save failed:", err);
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 5000);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <article className={style.adminCustomOptionsContainer}>
        <h2>Lag din egen</h2>
        <div className={style.loadingState}>
          <div className={style.spinner}></div>
          <p>Laster alternativer...</p>
        </div>
      </article>
    );
  }

  if (isError) {
    return (
      <article className={style.adminCustomOptionsContainer}>
        <h2>Lag din egen</h2>
        <div className={style.errorState}>
          <div className={style.errorIcon}>⚠️</div>
          <h3>Kunne ikke laste alternativer</h3>
          <p>Det oppstod et problem ved henting av data fra databasen.</p>
          <button
            className={style.retryButton}
            onClick={() => fetchCustomOptions()}
          >
            Prøv igjen
          </button>
        </div>
      </article>
    );
  }

  if (!options) {
    return (
      <article className={style.adminCustomOptionsContainer}>
        <h2>Lag din egen</h2>
        <div className={style.errorState}>
          <div className={style.errorIcon}>❌</div>
          <h3>Ingen data tilgjengelig</h3>
          <p>Alternativene kunne ikke lastes inn.</p>
          <button
            className={style.retryButton}
            onClick={() => fetchCustomOptions()}
          >
            Last inn på nytt
          </button>
        </div>
      </article>
    );
  }

  return (
    <article className={style.adminCustomOptionsContainer}>
      <h2>Lag din egen</h2>

      {/* Add new product type */}
      <div className={style.addCategorySection}>
        <label>
          Legg til ny produkttype (f.eks. "Halskjede", "Armbånd"):
          <div className={style.inputWithButton}>
            <input
              type="text"
              value={newProductType}
              onChange={(e) => setNewProductType(e.target.value)}
              placeholder="Produkttype navn..."
              onKeyPress={(e) => e.key === "Enter" && addProductType()}
            />
            <input
              type="text"
              value={newProductTypeBasePrice}
              onChange={(e) =>
                setNewProductTypeBasePrice(
                  e.target.value.replace(/[^0-9]/g, ""),
                )
              }
              placeholder="Basisspris..."
              onKeyPress={(e) => e.key === "Enter" && addProductType()}
            />
            <button
              type="button"
              className={style.addButton}
              onClick={addProductType}
            >
              + Legg til produkttype
            </button>
          </div>
        </label>
      </div>

      {/* Existing product types */}
      <div className={style.productTypesContainer}>
        {allOptions.map((productType) => (
          <ProductTypeSection
            key={productType.id}
            productType={productType}
            onRemoveProductType={removeProductType}
            onAddCategory={addOptionCategory}
            onRemoveCategory={removeOptionCategory}
            onAddValue={addOptionValue}
            onRemoveValue={removeOptionValue}
          />
        ))}

        {allOptions.length === 0 && (
          <p className={style.emptyState}>
            Ingen produkttyper lagt til ennå. Legg til en produkttype ovenfor.
          </p>
        )}
      </div>

      {error && (
        <div className={style.errorBanner}>
          <span className={style.errorIcon}>⚠️</span>
          <div>
            <strong>Lagring mislyktes</strong>
            <p>Kunne ikke lagre endringene. Vennligst prøv igjen.</p>
          </div>
        </div>
      )}

      {success && (
        <div className={style.successBanner}>
          <span className={style.successIcon}>✓</span>
          <div>
            <strong>Vellykket!</strong>
            <p>Alternativene ble lagret.</p>
          </div>
        </div>
      )}

      <button
        className={style.saveButton}
        type="button"
        disabled={saving}
        onClick={handleSave}
      >
        {saving ? "Lagrer..." : "Lagre endringer"}
      </button>
    </article>
  );
}

interface ProductTypeSectionProps {
  productType: CustomOptionRow;
  onRemoveProductType: (id: number) => Promise<void>;
  onAddCategory: (productId: number, categoryKey: string) => void;
  onRemoveCategory: (productId: number, key: string) => void;
  onAddValue: (
    productId: number,
    categoryKey: string,
    valueName: string,
    price: number,
  ) => void;
  onRemoveValue: (
    productId: number,
    categoryKey: string,
    optionId: string,
  ) => void;
}

function ProductTypeSection({
  productType,
  onRemoveProductType,
  onAddCategory,
  onRemoveCategory,
  onAddValue,
  onRemoveValue,
}: ProductTypeSectionProps) {
  const [newCategoryKey, setNewCategoryKey] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleAddCategory = () => {
    if (newCategoryKey.trim()) {
      onAddCategory(productType.id, newCategoryKey);
      setNewCategoryKey("");
    }
  };

  return (
    <div className={style.productTypeCard}>
      <div className={style.productTypeHeader}>
        <div className={style.productTypeTitle}>
          <button
            type="button"
            className={style.collapseButton}
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Utvid" : "Kollaps"}
          >
            {isCollapsed ? "▶" : "▼"}
          </button>
          <h3>{productType.type}</h3>
          <h3>|</h3>
          <h3>Basis Pris: {productType.base_price || 0} kr</h3>
        </div>
        <button
          type="button"
          className={style.removeProductTypeButton}
          onClick={() => onRemoveProductType(productType.id)}
          title="Fjern produkttype"
        ></button>
      </div>

      {!isCollapsed && (
        <>
          {/* Add category to this product type */}
          <div className={style.addSubCategorySection}>
            <div className={style.inputWithButton}>
              <input
                type="text"
                value={newCategoryKey}
                onChange={(e) => setNewCategoryKey(e.target.value)}
                placeholder="Ny kategori (f.eks. 'Materiale', 'Størrelse')..."
                onKeyPress={(e) => e.key === "Enter" && handleAddCategory()}
              />
              <button
                type="button"
                className={style.addButton}
                onClick={handleAddCategory}
              >
                + Legg til kategori
              </button>
            </div>
          </div>

          {/* Categories for this product type */}
          <div className={style.categoriesContainer}>
            {productType.type_options.map((category) => (
              <CategorySection
                key={category.key}
                productId={productType.id}
                category={category}
                onRemoveCategory={onRemoveCategory}
                onAddValue={onAddValue}
                onRemoveValue={onRemoveValue}
              />
            ))}

            {productType.type_options.length === 0 && (
              <p className={style.emptyValues}>
                Ingen kategorier lagt til for denne produkttypen.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

interface CategorySectionProps {
  productId: number;
  category: CustomOptionGroup;
  onRemoveCategory: (productId: number, key: string) => void;
  onAddValue: (
    productId: number,
    categoryKey: string,
    valueName: string,
    price: number,
  ) => void;
  onRemoveValue: (
    productId: number,
    categoryKey: string,
    optionId: string,
  ) => void;
}

function CategorySection({
  productId,
  category,
  onRemoveCategory,
  onAddValue,
  onRemoveValue,
}: CategorySectionProps) {
  const [newValue, setNewValue] = useState("");
  const [newPrice, setNewPrice] = useState("");

  const handleAddValue = () => {
    if (newValue.trim()) {
      const price = Number(newPrice) || 0;
      onAddValue(productId, category.key, newValue, price);
      setNewValue("");
      setNewPrice("");
    }
  };

  const handlePriceInput = (value: string) => {
    if (value === "") {
      setNewPrice("");
      return;
    }
    let sanitized = value.replace(/[^0-9.]/g, "");
    const parts = sanitized.split(".");
    if (parts.length > 2) sanitized = parts[0] + "." + parts[1];
    if (parts[1]?.length > 2) sanitized = parts[0] + "." + parts[1].slice(0, 2);
    sanitized = sanitized.replace(/^0+(\d)/, "$1");
    setNewPrice(sanitized);
  };

  return (
    <div className={style.categoryCard}>
      <div className={style.categoryHeader}>
        <h4>{category.key}</h4>
        <button
          type="button"
          className={style.removeCategoryButton}
          onClick={() => onRemoveCategory(productId, category.key)}
          title="Fjern kategori"
        ></button>
      </div>

      <div className={style.addValueSection}>
        <div className={style.inputWithButton}>
          <input
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Nytt alternativ..."
            onKeyPress={(e) => e.key === "Enter" && handleAddValue()}
          />
          <input
            type="text"
            value={newPrice}
            onChange={(e) => handlePriceInput(e.target.value)}
            placeholder="Pris (kr)"
            className={style.priceInput}
            onKeyPress={(e) => e.key === "Enter" && handleAddValue()}
          />
          <button
            type="button"
            className={style.addValueButton}
            onClick={handleAddValue}
          >
            + Legg til
          </button>
        </div>
      </div>

      <div className={style.valuesList}>
        {category.options.map((opt) => (
          <div key={opt.id} className={style.valueChip}>
            <span className={style.optionName}>{opt.name}</span>
            {opt.price > 0 && (
              <span className={style.optionPrice}>+{opt.price} kr</span>
            )}
            <button
              type="button"
              className={style.removeValueButton}
              onClick={() => onRemoveValue(productId, category.key, opt.id)}
              title="Fjern alternativ"
            >
              x
            </button>
          </div>
        ))}
        {category.options.length === 0 && (
          <p className={style.emptyValues}>Ingen alternativer lagt til ennå</p>
        )}
      </div>
    </div>
  );
}

export default AdminCustomOptions;
