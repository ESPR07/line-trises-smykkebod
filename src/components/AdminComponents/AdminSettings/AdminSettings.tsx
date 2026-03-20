import AdminCustomOptions from "../AdminCustomOptions/AdminCustomOptions";
import MaterialsSettings from "../MaterialsSettings/MaterialsSettings";
import TypeSortSettings from "../TypeSortSettings/TypeSortSettings";


function AdminSettings() {
  return (
    <>
      <MaterialsSettings />
      <TypeSortSettings />
      <AdminCustomOptions />
    </>
  );
}

export default AdminSettings;