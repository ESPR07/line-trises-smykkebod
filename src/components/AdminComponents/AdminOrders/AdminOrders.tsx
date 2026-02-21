import { JSX, useContext, useState, useEffect, useMemo } from "react";
import AdminOrdersListCard from "../AdminOrdersListCard/AdminOrdersListCard";
import style from "./AdminOrders.module.css";
import { ordersResult } from "../../../context/siteContexts";

function AdminOrders() {
  const {
    allOrders,
    loading,
    error,
    fetchOrders,
    currentPage,
    totalPages,
    setCurrentPage,
  } = useContext(ordersResult);

  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [ascending, setAscending] = useState<boolean>(true);

  // Fetch orders whenever page, sort column, or ascending changes
  useEffect(() => {
    // Server-side sort only for top-level fields
    const serverSortColumns = ["order_id", "status"];
    const sortForServer = sortColumn && serverSortColumns.includes(sortColumn) ? sortColumn : undefined;

    fetchOrders(currentPage, sortForServer, ascending);
  }, [currentPage, sortColumn, ascending]);

  // Handle sort click
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setAscending(!ascending);
      setCurrentPage(1); // reset to first page
    } else {
      setSortColumn(column);
      setAscending(true);
      setCurrentPage(1); // reset to first page
    }
  };

  // Pagination handlers
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Render sort arrows
  const renderArrow = (field: string): JSX.Element => {
    if (sortColumn !== field) {
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" className={style.arrow}>
          <path d="M7 4L10 7H4L7 4Z" fill="currentColor" opacity="0.3" />
          <path d="M7 10L4 7H10L7 10Z" fill="currentColor" opacity="0.3" />
        </svg>
      );
    }

    if (ascending) {
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" className={style.arrow}>
          <path d="M7 4L10 7H4L7 4Z" fill="currentColor" />
        </svg>
      );
    }

    return (
      <svg width="14" height="14" viewBox="0 0 14 14" className={style.arrow}>
        <path d="M7 10L4 7H10L7 10Z" fill="currentColor" />
      </svg>
    );
  };

  // Sorted orders (client-side for nested fields)
  const sortedOrders = useMemo(() => {
    if (!allOrders) return [];

    return allOrders.slice().sort((a, b) => {
      if (!sortColumn) return 0;

      let aValue: any;
      let bValue: any;

      switch (sortColumn) {
        case "customer_firstName":
          aValue = a.customer_info.customer_firstName.toLowerCase();
          bValue = b.customer_info.customer_firstName.toLowerCase();
          break;
        case "customer_adress":
          aValue = a.customer_info.customer_adress.toLowerCase();
          bValue = b.customer_info.customer_adress.toLowerCase();
          break;
        case "meta->created_at":
          aValue = new Date(a.meta.createdAt).getTime();
          bValue = new Date(b.meta.createdAt).getTime();
          break;
        case "order_id":
          aValue = a.order_id.toLowerCase();
          bValue = b.order_id.toLowerCase();
          break;
        case "status":
          aValue = a.status.toLowerCase();
          bValue = b.status.toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return ascending ? -1 : 1;
      if (aValue > bValue) return ascending ? 1 : -1;
      return 0;
    });
  }, [allOrders, sortColumn, ascending]);

  if (loading) {
    return (
      <article className={style.adminOrdersContainer}>
        <h2>Laster...</h2>
      </article>
    );
  }

  if (error) {
    return (
      <article className={style.adminOrdersContainer}>
        <h2>Noe gikk galt</h2>
      </article>
    );
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
        <span className={style.amount}>Sum</span>
        <span onClick={() => handleSort("status")} className={style.status}>
          Status{renderArrow("status")}
        </span>
      </div>

      <div className={style.adminOrdersListContainer}>
        {sortedOrders.length === 0 ? (
          <h3 className={style.noOrders}>Ingen bestillinger akkurat nå</h3>
        ) : (
          sortedOrders.map(order => (
            <AdminOrdersListCard key={order.id} orderItem={order} />
          ))
        )}
      </div>

      {/* Pagination Controls */}
      <div className={style.pagination}>
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className={style.paginationButton}
        >
          ‹ Forrige
        </button>

        <span className={style.pageInfo}>
          Side {currentPage} av {totalPages}
        </span>

        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className={style.paginationButton}
        >
          Neste ›
        </button>
      </div>
    </article>
  );
}

export default AdminOrders;
