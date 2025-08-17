// Form create product category
const formCreateProductCategory = document.querySelector("#form-create-products-category");

if(formCreateProductCategory) {
  formCreateProductCategory.addEventListener("submit", (e) => {
    e.preventDefault();

    const redirectUrl = window.location.pathname + window.location.search;
    formCreateProductCategory.action += `?redirect=${encodeURIComponent(redirectUrl)}`;

    formCreateProductCategory.submit();
  })
}
// End form create product category

