import { useState } from "react";
import EditIcon from "../../../assets/svg_components/EditIcon";
import TrashIcon from "../../../assets/svg_components/TrashIcon";
import { FetchResult } from "../../../types/Database";
import style from "./AdminProductColumn.module.css"
import DeleteBox from "../DeleteBox/DeletBox";
import UpdateBox from "../UpdateBox/UpdateBox";

interface ProductCardProps {
  data: FetchResult;
}

function AdminProductColumn({ data }: ProductCardProps) {
  const [deleteBox, setDeleteBox] = useState<boolean>(false);
  const [updateBox, setUpdateBox] = useState<boolean>(false);

  return (
    <div className={style.productColumnContainer}>
      <img src={data.image_url} alt={data.name} />
      <h3>{data.name}</h3>
      {data.discount ? <h3>{data.discount_amount}</h3> : <h3>{data.price}</h3>}
      <h3>Aktiv</h3>
      <div className={style.columnInteractions}>
        <TrashIcon removeValue={deleteBox} removeItem={setDeleteBox}/>
        <EditIcon updateValue={updateBox} updateItem={setUpdateBox}/>
      </div>
      {deleteBox ? <DeleteBox id={data.id} deleteBoxValue={deleteBox} toggleDeleteBox={setDeleteBox}/> : ""}
      {updateBox ? <UpdateBox id={"2"} deleteBoxValue={deleteBox} toggleDeleteBox={setDeleteBox}/> : ""}
    </div>
  );
}

export default AdminProductColumn;
