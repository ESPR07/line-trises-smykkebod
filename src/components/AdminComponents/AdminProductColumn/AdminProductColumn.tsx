import { useState } from "react";
import EditIcon from "../../../assets/svg_components/EditIcon";
import TrashIcon from "../../../assets/svg_components/TrashIcon";
import { FetchResult } from "../../../@types/Database";
import style from "./AdminProductColumn.module.css"
import DeleteBox from "../DeleteBox/DeletBox";
import UpdateBox from "../UpdateBox/UpdateBox";

interface ProductCardProps {
  data: FetchResult;
  canEdit?: boolean
}

function AdminProductColumn({ data, canEdit = true }: ProductCardProps) {
  const [deleteBox, setDeleteBox] = useState<boolean>(false);
  const [updateBox, setUpdateBox] = useState<boolean>(false);

  if(canEdit === false) {
    return (
    <>
      <div className={style.productColumnContainer}>
        <div className={style.imageWrapper}>
          <img src={data.image_url} alt={data.name} />
        </div>
        
        <div className={style.productName}>
          <h3>{data.name}</h3>
        </div>
        
        <div className={style.productPrice}>
          {data.discount ? (
            <>
              <span className={style.discountPrice}>
                {data.discount_amount?.toLocaleString('nb-NO')} kr
              </span>
              <span className={style.originalPrice}>
                {data.price.toLocaleString('nb-NO')} kr
              </span>
            </>
          ) : (
            <span className={style.regularPrice}>
              {data.price.toLocaleString('nb-NO')} kr
            </span>
          )}
        </div>
      </div>
    </>
  );
  }
  
  return (
    <>
      <div className={style.productColumnContainer}>
        <div className={style.imageWrapper}>
          <img src={data.image_url} alt={data.name} />
        </div>
        
        <div className={style.productName}>
          <h3>{data.name}</h3>
        </div>
        
        <div className={style.productPrice}>
          {data.discount ? (
            <>
              <span className={style.discountPrice}>
                {data.discount_amount?.toLocaleString('nb-NO')} kr
              </span>
              <span className={style.originalPrice}>
                {data.price.toLocaleString('nb-NO')} kr
              </span>
            </>
          ) : (
            <span className={style.regularPrice}>
              {data.price.toLocaleString('nb-NO')} kr
            </span>
          )}
        </div>
        
        <div className={style.productStatus}>
          <span className={data.active_status ? style.statusActive : style.statusInactive}>
            {data.active_status ? "Aktiv" : "Inaktiv"}
          </span>
        </div>
        
        <div className={style.columnInteractions}>
          <button 
            className={style.editButton}
            onClick={() => setUpdateBox(true)}
            aria-label="Rediger produkt"
          >
            <EditIcon updateValue={updateBox} updateItem={setUpdateBox}/>
          </button>
          <button 
            className={style.deleteButton}
            onClick={() => setDeleteBox(true)}
            aria-label="Slett produkt"
          >
            <TrashIcon removeValue={deleteBox} removeItem={setDeleteBox}/>
          </button>
        </div>
      </div>
      
      {deleteBox && (
        <DeleteBox 
          id={data.id} 
          imageUrl={data.image_url} 
          deleteBoxValue={deleteBox} 
          toggleDeleteBox={setDeleteBox}
        />
      )}
      {updateBox && (
        <UpdateBox 
          product={data} 
          updateBoxValue={updateBox} 
          toggleUpdateBox={setUpdateBox}
        />
      )}
    </>
  );
}

export default AdminProductColumn;