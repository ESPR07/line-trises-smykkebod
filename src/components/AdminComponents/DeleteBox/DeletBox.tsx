import style from "./DeleteBox.module.css"

function DeleteBox({id, deleteBoxValue, toggleDeleteBox} : any) {
  return (
    <div className={style.deleteModal}>
      <div className={style.deleteBox}>
        <button className={style.closeButton} type="button" onClick={() => {toggleDeleteBox(!deleteBoxValue)}}>X</button>
        <p>Er du helt sikker på at du vil slette produktet, dette er ikke reverserbart!</p>
        <button className={style.deleteButton} type="button">Slett produktet</button>
      </div>
    </div>
  );
}

export default DeleteBox;
