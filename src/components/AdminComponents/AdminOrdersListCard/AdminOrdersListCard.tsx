import { useState } from "react";
import { OrderItem } from "../../../@types/Database";
import { dateFormatting } from "../../utils/dateFormatting";
import style from "./AdminOrdersListCard.module.css";
import OrderStatusModal from "../OrderStatusModal/OrderStatusModal";

interface AdminOrdersListCardProps {
  orderItem: OrderItem | undefined;
}

export default function AdminOrdersListCard({ orderItem }: AdminOrdersListCardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  if (!orderItem) return null;

  return (
    <>
      <div
        className={style.listItem}
        onClick={() => setModalOpen(true)}
        style={{ cursor: "pointer" }}
      >
        <span className={style.orderId}>#{orderItem.order_id}</span>
        <span className={style.date}>{dateFormatting(orderItem.meta.createdAt)}</span>
        <span className={style.customerName}>
          {orderItem.customer_info.customer_firstName} {orderItem.customer_info.customer_lastName}
        </span>
        <span className={style.adress}>{orderItem.customer_info.customer_adress}</span>
        <span className={style.amount}>
          {orderItem.totals.verifiedTotal.toLocaleString("nb-NO")} kr
        </span>
        <div className={style.status}>
          {orderItem.status === "paid" && <span className={style.pending}>Venter</span>}
          {orderItem.status === "refunded" && <span className={style.refunded}>Refundert</span>}
          {orderItem.status === "complete" && <span className={style.complete}>Fullført</span>}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <OrderStatusModal
          order={orderItem}
          modalOpen={modalOpen}
          toggleModal={setModalOpen}
        />
      )}
    </>
  );
}
