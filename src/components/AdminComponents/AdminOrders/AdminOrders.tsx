import { JSX, useContext, useState } from "react";
import AdminOrdersListCard from "../AdminOrdersListCard/AdminOrdersListCard";
import style from "./AdminOrders.module.css"
import { ordersResult } from "../../../App";

function AdminOrders() {
  const { allOrders, loading, error, fetchOrders } = useContext(ordersResult);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [ascending, setAscending] = useState<boolean>(true);

  function handleSort(column: string) {
    if (sortColumn === column) {
      setAscending(!ascending);
      fetchOrders(column, !ascending);
    } else {
      setSortColumn(column);
      setAscending(true);
      fetchOrders(column, true);
    }
  }

  const renderArrow = (field: string): JSX.Element => {
  if (sortColumn !== field) {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" className={style.arrow}>
        <path d="M7 4L10 7H4L7 4Z" fill="currentColor" opacity="0.3"/>
        <path d="M7 10L4 7H10L7 10Z" fill="currentColor" opacity="0.3"/>
      </svg>
    );
  }
  
  if (ascending) {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" className={style.arrow}>
        <path d="M7 4L10 7H4L7 4Z" fill="currentColor"/>
      </svg>
    );
  }
  
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" className={style.arrow}>
      <path d="M7 10L4 7H10L7 10Z" fill="currentColor"/>
    </svg>
  );
};

  if (loading) {
    return (
      <article className={style.adminOrdersContainer}>
        <h2>Laster...</h2>
      </article>
    )
  }

  if (error) {
    return (
      <article className={style.adminOrdersContainer}>
        <h2>Noe gikk galt</h2>
      </article>
    )
  }

  if(allOrders?.length === 0) {
    return (
      <article className={style.adminOrdersContainer}>
      <h2>Bestillinger</h2>

      <div className={style.adminOrdersHeader}>
        <span onClick={() => handleSort("order_id")} className={style.orderId}>
          Ordre ID{renderArrow("order_id")}
        </span>
        <span onClick={() => handleSort("meta->created_at")} className={style.date}>
          Dato{renderArrow("meta->created_at")}
        </span>
        <span onClick={() => handleSort("customer_firstName")} className={style.customerName}>
          Kundenavn{renderArrow("customer_firstName")}
        </span>
        <span onClick={() => handleSort("customer_adress")} className={style.adress}>
          Adresse{renderArrow("customer_adress")}
        </span>
        <span className={style.amount}>
          Sum
        </span>
        <span onClick={() => handleSort("status")} className={style.status}>
          Status{renderArrow("status")}
        </span>
      </div>

      <h3 className={style.noOrders}>Ingen bestillinger akkurat nå</h3>
    </article>
    )
  }

  return (
    <article className={style.adminOrdersContainer}>
      <h2>Bestillinger</h2>

      <div className={style.adminOrdersHeader}>
        <span onClick={() => handleSort("order_id")} className={style.orderId}>
          Ordre ID{renderArrow("order_id")}
        </span>
        <span onClick={() => handleSort("meta->created_at")} className={style.date}>
          Dato{renderArrow("meta->created_at")}
        </span>
        <span onClick={() => handleSort("customer_firstName")} className={style.customerName}>
          Kundenavn{renderArrow("customer_firstName")}
        </span>
        <span onClick={() => handleSort("customer_adress")} className={style.adress}>
          Adresse{renderArrow("customer_adress")}
        </span>
        <span className={style.amount}>
          Sum
        </span>
        <span onClick={() => handleSort("status")} className={style.status}>
          Status{renderArrow("status")}
        </span>
      </div>

      <div className={style.adminOrdersListContainer}>
        {allOrders?.map((order) => (
          <AdminOrdersListCard key={order.id} orderItem={order}/>
        ))}
      </div>
    </article>
  )
}

export default AdminOrders;
