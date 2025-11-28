import style from "./UpdateBox.module.css"

function UpdateBox({id, updateBoxValue, toggleUpdateBox} : any) {
  return (
    <div className={style.updateModal}>
      <div className={style.updateBox}>
        <button className={style.closeButton} type="button" onClick={() => {toggleUpdateBox(!updateBoxValue)}}>X</button>
        <p>Er du helt sikker på at du vil slette produktet, dette er ikke reverserbart!</p>
        <button className={style.updateButton} type="button">Jeg er sikker</button>
      </div>
    </div>
  );
}

export default UpdateBox;