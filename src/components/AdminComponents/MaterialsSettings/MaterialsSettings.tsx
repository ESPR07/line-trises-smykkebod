import { useState, useEffect } from "react";
import style from "./CategoriesSettings.module.css";
import { useCreateCategory } from "../../../API/useCreateCategory";
import { useDeleteCategory } from "../../../API/useDeleteCatgory";
import { useMaterials } from "../../../API/useMaterials";

function MaterialsSettings() {
  const { categories, isLoading, isError, fetchMaterials } = useMaterials();
  const { createCategory } = useCreateCategory();
  const { deleteCategory } = useDeleteCategory();

  const [allCategories, setAllCategories] = useState(categories);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    fetchMaterials();
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

    const created = await createCategory(trimmed);
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

    const ok = await deleteCategory(id);
    if (ok) {
      setAllCategories(allCategories.filter((c) => c.id !== id));
    } else {
      alert("Kunne ikke slette kategorien. Prøv igjen.");
    }
  };

  if (isLoading) {
    return (
      <div className={style.categoriesSettingsContainer}>
        <h2>Kategorier</h2>
        <div className={style.loadingState}>
          <div className={style.spinner} />
          <p>Laster kategorier...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={style.categoriesSettingsContainer}>
        <h2>Kategorier</h2>
        <div className={style.errorState}>
          <div className={style.errorIcon}>⚠️</div>
          <h3>Kunne ikke laste kategorier</h3>
          <p>Det oppstod et problem ved henting av data.</p>
          <button className={style.retryButton} onClick={fetchMaterials}>
            Prøv igjen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={style.categoriesSettingsContainer}>
      <h2>Kategorier</h2>

      {/* Add new category */}
      <div className={style.addSection}>
        <label>
          Legg til ny kategori (f.eks. "Ring", "Øredobber"):
          <div className={style.inputWithButton}>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Kategorinavn..."
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
            Ingen kategorier lagt til ennå. Legg til en ovenfor.
          </p>
        ) : (
          allCategories.map((cat) => (
            <div key={cat.id} className={style.categoryChip}>
              <span className={style.categoryName}>{cat.name}</span>
              <button
                type="button"
                className={style.removeButton}
                onClick={() => removeCategory(cat.id)}
                title="Fjern kategori"
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MaterialsSettings;