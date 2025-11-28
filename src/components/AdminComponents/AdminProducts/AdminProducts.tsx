import { getProductList } from "../../../API/getProducts";
import AdminProductColumn from "../AdminProductColumn/AdminProductColumn";
import style from "./AdminProducts.module.css";

function AdminProducts() {
  const { productList, isLoading, isError } = getProductList();

  if (isLoading) {
    return (
      <article className={style.adminProductsContainer}>
        <h2>Laster...</h2>
      </article>
    );
  }

  if(isError) {
    return(
      <article className={style.adminProductsContainer}>
        <h2>Noe gikk galt</h2>
      </article>
    )
  }

  if(productList) {
    return (
    <article className={style.adminProductsContainer}>
      <h2>Produkter</h2>
      {productList?.map((product) => {
        return(
          <AdminProductColumn key={product.id} data={product}/>
        )
      })}
    </article>
  );
  }
}

export default AdminProducts;
