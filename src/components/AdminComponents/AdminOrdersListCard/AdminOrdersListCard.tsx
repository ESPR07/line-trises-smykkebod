import { OrderItem } from "../../../@types/Database";
import { dateFormatting } from "../../utils/dateFormatting";
import style from "./AdminOrdersListCard.module.css";

function AdminOrdersListCard({
  orderItem,
}: {
  orderItem: OrderItem | undefined;
}) {

  if(!orderItem) return

  return (
    <div className={style.listItem}>
      <span className={style.orderId}>{orderItem.order_id}</span>
      <span className={style.date}>{dateFormatting(orderItem.meta.createdAt)}</span>
      <span className={style.customerName}>{`${orderItem.customer_firstName} ${orderItem.customer_lastName}`}</span>
      <span className={style.adress}>{orderItem.customer_adress}</span>
      <span className={style.amount}>{orderItem.totals.verifiedTotal}</span>
      <div className={style.status}>
        {orderItem.status === "pending" ? <span className={style.pending}>Venter</span> : ""}
        {orderItem.status === "complete" ? <span className={style.complete}>Fullført</span> : ""}
      </div>
    </div>
  );
}

export default AdminOrdersListCard;
