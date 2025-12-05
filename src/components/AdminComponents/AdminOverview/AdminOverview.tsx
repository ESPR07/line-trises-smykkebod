import AdminOrders from "../AdminOrders/AdminOrders";
import AdminProducts from "../AdminProducts/AdminProducts";
import AdminSalesStats from "../AdminSalesStats/AdminSalesStats";

function AdminOverview() {
  return (
    <>
      <AdminSalesStats/>
      <AdminProducts/>
      <AdminOrders/>
    </>
  )
}

export default AdminOverview;