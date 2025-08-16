// Button Status
const butonsStatus = document.querySelectorAll("[button-status]");
if(butonsStatus.length > 0) {
  let url = new URL(window.location.href);

  butonsStatus.forEach(button => {
    button.addEventListener("click", () => {
      const status = button.getAttribute("button-status");

      if(status) {
        url.searchParams.set("status", status);
      } else {
        url.searchParams.delete("status");
      }
      window.location.href = url.href;
    })
  })
}
// End button Status

// Form Search
const formSearch = document.querySelector("#form-search");
if(formSearch) {
  let url = new URL(window.location.href);

  formSearch.addEventListener("submit", (e) => {
    e.preventDefault();

    const keyword = e.target.elements.keyword.value;

    if(keyword) {
      url.searchParams.set("keyword", keyword);
    } else {
      url.searchParams.delete("keyword");
    }
    window.location.href = url.href;
  })
}
// End form Search

// Pagination
const buttonsPagination = document.querySelectorAll("[button-pagination]");
if(buttonsPagination.length > 0) {
  let url = new URL(window.location.href);

  buttonsPagination.forEach(button => {
    button.addEventListener("click", () => {
      const page = button.getAttribute("button-pagination");
      if(page) {
        url.searchParams.set("page", page);
      } else {
        url.searchParams.delete("page");
      }
      window.location.href = url.href;
    })
  })
}
// End pagination

// Checkbox Multi
const checkboxMulti = document.querySelector("[checkbox-multi]");
if(checkboxMulti) {
  const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
  const inputsId = checkboxMulti.querySelectorAll("input[name='id']");

  inputCheckAll.addEventListener("click", () => {
    if(inputCheckAll.checked) {
      inputsId.forEach(input => {
        input.checked = true;
      })
    } else {
      inputsId.forEach(input => {
        input.checked = false;
      })
    }
  });

  inputsId.forEach(input => {
    input.addEventListener("click", () => {
      const countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length;

      if(countChecked == inputsId.length) {
        inputCheckAll.checked = true;
      } else {
        inputCheckAll.checked = false;
      }
    })
  })
}
// End checkbox Multi

// Form change multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if(formChangeMulti) {
  formChangeMulti.addEventListener("submit", (e) => {
    e.preventDefault();

    const checkboxMulti = document.querySelector("[checkbox-multi]");
    const inputsChecked = checkboxMulti.querySelectorAll("input[name='id']:checked");

    const typeChange = e.target.elements.type.value;
    
    if(typeChange == "delete-all") {
      const isConfirm = confirm("Bạn có chắc muốn xoá những sản phẩm này không?");

      if(!isConfirm) {
        return;
      }
    }

    if(inputsChecked.length > 0) {
      let ids = [];
      const inputIds = document.querySelector("input[name='ids']");

      inputsChecked.forEach(input => {
        const id = input.value;

        if(typeChange == "change-position") {
          const position = input.closest("tr").querySelector("input[name='position']").value;
          
          ids.push(`${id}-${position}`);
        } else {
          ids.push(id);
        }
      });

      inputIds.value = ids.join(", ");

      const redirectUrl = window.location.pathname + window.location.search;
      formChangeMulti.action += `?_method=PATCH&redirect=${encodeURIComponent(redirectUrl)}`;

      formChangeMulti.submit();
    } else {
      alert("Vui lòng chọn ít nhất một bản ghi!");
    }
  })
}
// End form change multi

// Show alert
const showAlert = document.querySelector("[show-alert]");
if(showAlert) {
  const time = parseInt(showAlert.getAttribute("data-time"));
  const closeAlert = showAlert.querySelector("[close-alert]");

  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);

  closeAlert.addEventListener("click", () => {
    showAlert.classList.add("alert-hidden");
  });
}
// end show alert