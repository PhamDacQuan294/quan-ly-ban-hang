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