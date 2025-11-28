import NotificationIcon from "../../../assets/svg_components/NotificationIcon";
import SearchIcon from "../../../assets/svg_components/SearchIcon";
import style from "./AdminTopBar.module.css";

function AdminTopBar() {
  return (
    <article className={style.adminTopBarContainer}>
      <div className={style.searchBar}>
        <SearchIcon/>
        <input type="text" placeholder="Søk"/>
      </div>
      <div className={style.interactions}>
        <NotificationIcon/>
      </div>
    </article>
  );
}

export default AdminTopBar;