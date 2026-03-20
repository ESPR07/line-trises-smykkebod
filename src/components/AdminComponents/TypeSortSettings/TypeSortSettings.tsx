import { useState, useEffect } from "react";
import style from "./TypeSortSettings.module.css";
import { useCreateMaterial } from "../../../API/useCreateMaterial";
import { useDeleteMaterials } from "../../../API/useDeleteMaterials";
import { useTypeSort } from "../../../API/useTypeSort";

function TypeSortSettings() {
  const { categories, isLoading, isError, fetchTypeSort } = useTypeSort();
  const { createMaterial } = useCreateMaterial();
  const { deleteMaterial } = useDeleteMaterials();

  const [allCategories, setAllCategories] = useState(categories);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    fetchTypeSort();
  }, []);

  useEffect(() => {
    setAllCategories(categories);
  }, [categories]);

  const addCategory = async () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return;

    const alreadyExists = allCategories.some(
      (c) => c.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (alreadyExists) {
      alert("Denne kategorien finnes allerede!");
      return;
    }

    const created = await createMaterial(trimmed);
    if (created) {
      setAllCategories(
        [...allCategories, created].sort((a, b) => a.name.localeCompare(b.name))
      );
      setNewCategory("");
    } else {
      alert("Kunne ikke opprette kategorien. Prøv igjen.");
    }
  };

  const removeCategory = async (id: string) => {
    const confirmed = window.confirm(
      "Er du sikker på at du vil slette denne kategorien?"
    );
    if (!confirmed) return;

    const ok = await deleteMaterial(id);
    if (ok) {
      setAllCategories(allCategories.filter((c) => c.id !== id));
    } else {
      alert("Kunne ikke slette kategorien. Prøv igjen.");
    }
  };

  if (isLoading) {
    return (
      <div className={style.categoriesSettingsContainer}>
        <h2>Smykke Type</h2>
        <div className={style.loadingState}>
          <div className={style.spinner} />
          <p>Laster Typer...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={style.categoriesSettingsContainer}>
        <h2>Smykke Typer</h2>
        <div className={style.errorState}>
          <div className={style.errorIcon}>⚠️</div>
          <h3>Kunne ikke laste typer</h3>
          <p>Det oppstod et problem ved henting av data.</p>
          <button className={style.retryButton} onClick={fetchTypeSort}>
            Prøv igjen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={style.categoriesSettingsContainer}>
      <h2>Smykke Typer</h2>

      {/* Add new category */}
      <div className={style.addSection}>
        <label>
          Legg til ny type (f.eks. "Ring", "Øredobber"):
          <div className={style.inputWithButton}>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Type Navn..."
              onKeyPress={(e) => e.key === "Enter" && addCategory()}
            />
            <button
              type="button"
              className={style.addButton}
              onClick={addCategory}
            >
              + Legg til
            </button>
          </div>
        </label>
      </div>

      {/* Category chips */}
      <div className={style.chipList}>
        {allCategories.length === 0 ? (
          <p className={style.emptyState}>
            Ingen typer lagt til ennå. Legg til en ovenfor.
          </p>
        ) : (
          allCategories.map((cat) => (
            <div key={cat.id} className={style.categoryChip}>
              <span className={style.categoryName}>{cat.name}</span>
              <button
                type="button"
                className={style.removeButton}
                onClick={() => removeCategory(cat.id)}
                title="Fjern type"
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TypeSortSettings;