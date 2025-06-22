import style from "./CartPage.module.css";

function CartPage() {
  return(
    <main className={style.cartPageContainer}>
      <h1 className={style.cartHeader}>Handlekurv</h1>
      <section className={style.contentContainer}>
        <article className={style.cartItemList}>
          <div className={style.item1}>
            <img src="/src/assets/pexels-gdtography-277628-6563393.jpg" alt="Product Image" />
            <div className={style.itemInfo}>
              <div className={style.cartItemText}>
                <h2>Produkt 1</h2>
                <p>kr 299</p>
              </div>
              <div className={style.cartItemInteraction}>
                <div className={style.amountSelection}>
                  <p>+</p>
                  <input type="number" name="itemAmount" id="itemAmount" placeholder="1" defaultValue={1}/>
                  <p>-</p>
                </div>
              </div>
            </div>
          </div>
        </article>
        <article className={style.cartInfo}>
          <h2>Oppsummering</h2>
        </article>
      </section>
    </main>
  )
}

export default CartPage;