import { useContext, useEffect, useState } from "react";
import style from "../UpdateBox/UpdateBox.module.css";
import AdminProductColumn from "../AdminProductColumn/AdminProductColumn";
import { OrderItem, FetchResult } from "../../../@types/Database";
import { dateFormatting } from "../../utils/dateFormatting";
import { APIResult } from "../../../context/siteContexts";
import RefundBox from "../RefundBox/RefundBox";
import ShipOrderBox from "../OrderConfirmBox/OrderConfirmBox";

interface OrderStatusModalProps {
  order: OrderItem;
  modalOpen: boolean;
  toggleModal: (val: boolean) => void;
  isLoading?: boolean;
}

export default function OrderStatusModal({
  order,
  toggleModal,
  modalOpen,
}: OrderStatusModalProps) {
  const { allProducts } = useContext(APIResult);
  const [showRefundBox, setShowRefundBox] = useState(false);
  const [showShipBox, setShowShipBox] = useState(false);

  useEffect(() => {
    if (modalOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [modalOpen]);

  const cartItems: FetchResult[] = order.cart.map((item) => {
    const product = allProducts?.find((p) => p.id === item.id);
    return {
      id: item.id,
      name: product?.name || item.name,
      price: product?.price || item.unitPrice,
      discount: product?.discount || false,
      discount_amount: product?.discount_amount ?? 0,
      image_url: product?.image_url,
      short_description: product?.short_description,
      long_description: product?.long_description,
      active_status: product?.active_status ?? true,
    };
  });

  const handleCompleteOrder = async () => {
    try {
      const res = await fetch("/.netlify/functions/completeOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.order_id }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }
      toggleModal(false);
    } catch (err) {
      console.error(err);
      alert("Kunne ikke fullføre bestillingen.");
    }
  };

  return (
    <div className={style.updateModal}>
      <div className={style.updateBox}>
        <button
          className={style.closeButton}
          onClick={() => toggleModal(false)}
        />
        <h3>Bestilling</h3>

        {/* Order Details */}
        <div className={style.orderDetails}>
          <p>
            <strong>Ordre ID:</strong> {order.order_id}
          </p>
          <p>
            <strong>Kunde:</strong> {order.customer_info.customer_firstName}{" "}
            {order.customer_info.customer_lastName}
          </p>
          <p>
            <strong>Adresse:</strong> {order.customer_info.customer_adress}
          </p>
          <p>
            <strong>Sted:</strong> {order.customer_info.customer_place}
          </p>
          <p>
            <strong>Post Nummer:</strong> {order.customer_info.customer_postNr}
          </p>
          <p>
            <strong>E-post:</strong> {order.customer_info.customer_email}
          </p>
          <p>
            <strong>Mobilnummer:</strong> {order.customer_info.customer_phone}
          </p>
          <p>
            <strong>Sum:</strong>{" "}
            {order.totals.verifiedTotal.toLocaleString("nb-NO")} NOK
          </p>
          <p>
            <strong>Status:</strong>{" "}
            {order.status === "pending"
              ? "Venter"
              : order.status === "paid"
                ? "Betalt"
                : order.status === "completed"
                  ? "Fullført"
                  : order.status === "partially_refunded"
                    ? "Delvis refundert"
                    : "Refundert"}
          </p>
          <p>
            <strong>Opprettet:</strong> {dateFormatting(order.meta.createdAt)}
          </p>
        </div>

        {/* Order Products */}
        <div className={style.orderProducts}>
          <h4>Produkter i bestillingen:</h4>
          {cartItems.map((item) => (
            <AdminProductColumn currentPage={1} canEdit={false} key={item.id} data={item} />
          ))}
        </div>

        {/* Action Buttons */}
        {order.status !== "refunded" && (
          <div className={style.buttonContainer}>
            <div className={style.buttonGroup}>
              <button
                className={style.updateButton}
                onClick={() => {
                  setShowShipBox(true);
                  setShowRefundBox(false);
                }}
                disabled={order.status === "completed" || order.status === "refunded"}
              >
                Godkjenn
              </button>
              <button
                className={style.updateButton}
                onClick={() => {
                  setShowRefundBox(true);
                  setShowShipBox(false);
                }}
                disabled={order.status === "refunded"}
              >
                Refunder
              </button>
            </div>
            <div className={style.confimationContainer}>
              {showRefundBox && (
                <RefundBox
                  order={order}
                  refundBoxValue={showRefundBox}
                  toggleRefundBox={setShowRefundBox}
                />
              )}
              {showShipBox && (
                <ShipOrderBox
                  order={order}
                  shipBoxValue={showShipBox}
                  toggleShipBox={setShowShipBox}
                  handleOrderComplete={handleCompleteOrder}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
