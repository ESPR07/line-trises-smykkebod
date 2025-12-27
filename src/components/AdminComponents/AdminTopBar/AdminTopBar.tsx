import { useContext, useState, useEffect, useRef } from "react";
import NotificationIcon from "../../../assets/svg_components/NotificationIcon";
import SearchIcon from "../../../assets/svg_components/SearchIcon";
import style from "./AdminTopBar.module.css";
import { APIResult, ordersResult } from "../../../App";
import UpdateBox from "../UpdateBox/UpdateBox";
import OrderStatusModal from "../OrderStatusModal/OrderStatusModal";
import { Database } from "../../../@types/Database";

type Product = Database["public"]["Tables"]["products"]["Row"];
type Order = Database["public"]["Tables"]["orders"]["Row"];

function AdminTopBar() {
  const { allProducts, searchQuery: productQuery, setSearchQuery: setProductQuery } = useContext(APIResult);
  const { allOrders, searchQuery: orderQuery, setSearchQuery: setOrderQuery } = useContext(ordersResult);

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const combinedQuery = productQuery || orderQuery;

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setDropdownVisible(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setProductQuery(value);
    setOrderQuery(value);
    setDropdownVisible(true);
  };

  const filteredProducts = allProducts?.filter(p =>
    p.name.toLowerCase().includes(combinedQuery.toLowerCase())
  );

  const filteredOrders = allOrders?.filter(o =>
    o.customer_firstName.toLowerCase().includes(combinedQuery.toLowerCase()) ||
    o.customer_lastName.toLowerCase().includes(combinedQuery.toLowerCase()) ||
    o.order_id.toLowerCase().includes(combinedQuery.toLowerCase())
  );

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setSelectedOrder(null);
    setModalOpen(true);
    setDropdownVisible(false);
  };

  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
    setSelectedProduct(null);
    setModalOpen(true);
    setDropdownVisible(false);
  };

  return (
    <article className={style.adminTopBarContainer} ref={wrapperRef}>
      <div className={style.searchBar}>
        <SearchIcon />
        <input
          type="text"
          placeholder="Søk produkter eller bestillinger"
          value={combinedQuery}
          onChange={handleInputChange}
        />
        {dropdownVisible && combinedQuery && (
          <div className={style.searchDropdown}>
            {filteredProducts?.slice(0, 5).map(p => (
              <div
                key={p.id}
                className={style.dropdownItem}
                onClick={() => handleSelectProduct(p)}
              >
                Produkt: {p.name}
              </div>
            ))}
            {filteredOrders?.slice(0, 5).map(o => (
              <div
                key={o.id}
                className={style.dropdownItem}
                onClick={() => handleSelectOrder(o)}
              >
                Bestilling: {o.order_id} – {o.customer_firstName} {o.customer_lastName}
              </div>
            ))}
            {filteredProducts?.length === 0 && filteredOrders?.length === 0 && (
              <div className={style.dropdownItem}>Ingen resultater</div>
            )}
          </div>
        )}
      </div>

      <div className={style.interactions}>
        <NotificationIcon />
      </div>

      {/* Modals */}
      {selectedProduct && modalOpen && (
        <UpdateBox
          product={selectedProduct}
          updateBoxValue={modalOpen}
          toggleUpdateBox={setModalOpen}
        />
      )}

      {selectedOrder && modalOpen && (
        <OrderStatusModal
          order={selectedOrder}
          modalOpen={modalOpen}
          toggleModal={setModalOpen}
        />
      )}
    </article>
  );
}

export default AdminTopBar;
