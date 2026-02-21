import { useContext, useState } from "react";
import style from "./OrderConfirmBox.module.css";
import { OrderItem } from "../../../@types/Database";
import { ordersResult } from "../../../context/siteContexts";

interface ShipOrderBoxProps {
  order: OrderItem;
  shipBoxValue: boolean;
  toggleShipBox: (val: boolean) => void;
  handleOrderComplete: () => Promise<void>;
}

function ShipOrderBox({
  order,
  shipBoxValue,
  toggleShipBox,
  handleOrderComplete,
}: ShipOrderBoxProps) {
  const [isShipping, setIsShipping] = useState(false);
  const [shipSuccess, setShipSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchOrders } = useContext(ordersResult);

  if (!shipBoxValue) return null;

  const handleShipClick = async () => {
    setIsShipping(true);
    setError(null);

    try {
      await handleOrderComplete();
      setShipSuccess(true);

      setTimeout(() => {
        toggleShipBox(false);
        setShipSuccess(false);
        fetchOrders();
      }, 1500);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Noe gikk galt under sending av bestillingen.");
    } finally {
      setIsShipping(false);
    }
  };

  return (
    <div className={style.shipBox}>
      {shipSuccess ? (
        <p>Bestillingen er markert som sendt ✅</p>
      ) : (
        <>
          <p>
            Er du sikker på at du vil markere denne bestillingen som sendt?
            <br />
            <strong>Ordre ID: {order.order_id}</strong>
          </p>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <div className={style.buttonGroup}>
            <button
              className={style.shipButton}
              type="button"
              disabled={isShipping}
              onClick={handleShipClick}
            >
              {isShipping ? "Sender..." : "Bekreft sending"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ShipOrderBox;
