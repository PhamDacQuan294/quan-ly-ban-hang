// Change status
const buttonsChangeStatus = document.querySelectorAll("[button-change-status]");
if(buttonsChangeStatus.length > 0) {
  const formChangeStatus = document.querySelector("#form-change-status");
  const path = formChangeStatus.getAttribute("data-path");

  buttonsChangeStatus.forEach(button => {
    button.addEventListener("click", () => {
      const statusCurrent = button.getAttribute("data-status");
      const id = button.getAttribute("data-id");

      let statusChange = statusCurrent == "active" ? "inactive" : "active";

      formChangeStatus.action = path + `/${statusChange}/${id}`;

      const redirectUrl = window.location.pathname + window.location.search;
      formChangeStatus.action += `?_method=PATCH&redirect=${encodeURIComponent(redirectUrl)}`;

      formChangeStatus.submit();
    })
  })
}
// End change status

// Delete item
const buttonsDelete = document.querySelectorAll("[button-delete]");

if(buttonsDelete.length > 0) {
  const formDeleteItem = document.querySelector("#form-delete-item");
  const path = formDeleteItem.getAttribute("data-path");

  buttonsDelete.forEach(button => {
    button.addEventListener("click", () => {
      const isConfirm = confirm("Bạn có chắc muốn xoá sản phẩm này không?");

      if(isConfirm) {
        const id = button.getAttribute("data-id");

        const action = `${path}/${id}`;
        formDeleteItem.action = action;

        const redirectUrl = window.location.pathname + window.location.search;
        formDeleteItem.action += `?_method=DELETE&redirect=${encodeURIComponent(redirectUrl)}`;

        formDeleteItem.submit();
      }
    })
  })
}
// End delete item