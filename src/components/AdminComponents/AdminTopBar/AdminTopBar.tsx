import { useState, useEffect, useRef } from "react";
import NotificationIcon from "../../../assets/svg_components/NotificationIcon";
import SearchIcon from "../../../assets/svg_components/SearchIcon";
import style from "./AdminTopBar.module.css";
import UpdateBox from "../UpdateBox/UpdateBox";
import OrderStatusModal from "../OrderStatusModal/OrderStatusModal";
import { Database } from "../../../@types/Database";
import { useProductList } from "../../../API/useProducts";
import { useGetOrders } from "../../../API/useGetOrders";

// Debounce hook
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

type Product = Database["public"]["Tables"]["products"]["Row"];
type Order = Database["public"]["Tables"]["orders"]["Row"];

function AdminTopBar() {
  const { productList, fetchProducts } = useProductList();
  const { orderList, fetchOrders } = useGetOrders();

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300); // 300ms delay
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

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

  // Fetch data on search (debounced)
  useEffect(() => {
    fetchProducts(1, undefined, debouncedSearch);
    fetchOrders(1, undefined, true, debouncedSearch);
    setDropdownVisible(true);
  }, [debouncedSearch]);

  // Filter JSON fields (customer names) client-side
  const filteredOrders = orderList?.filter(order =>
    order.customer_info.customer_firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer_info.customer_lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.order_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

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
          value={searchQuery}
          onChange={handleInputChange}
        />
        {dropdownVisible && searchQuery && (
          <div className={style.searchDropdown}>
            {productList?.slice(0, 5).map(product => (
              <div
                key={product.id}
                className={style.dropdownItem}
                onClick={() => handleSelectProduct(product)}
              >
                Produkt: {product.name}
              </div>
            ))}
            {filteredOrders?.slice(0, 5).map(order => (
              <div
                key={order.id}
                className={style.dropdownItem}
                onClick={() => handleSelectOrder(order)}
              >
                Bestilling: {order.order_id} – {order.customer_info.customer_firstName} {order.customer_info.customer_lastName}
              </div>
            ))}
            {(!productList?.length && !filteredOrders?.length) && (
              <div className={style.dropdownItem}>Ingen resultater</div>
            )}
          </div>
        )}
      </div>

      <div className={style.interactions}>
        <NotificationIcon />
      </div>

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
