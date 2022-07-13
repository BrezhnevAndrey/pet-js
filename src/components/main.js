import { ShowButton } from "./modules/ShowButton/ShowButton.js";
import { Helper } from "./modules/Helper/Helper.js";
import { TableAction, sortArray } from "./modules/TableAction/TableAction.js";
import { Sorting } from "./modules/Sorting/Sorting.js";
import { ServerAction } from "./modules/ServerAction/ServerAction.js";
import { Modal } from "./modules/Modal/Modal.js";
import { changeBtnLoading } from "./modules/ShowButton/ShowButton.js";

export const table = {};

(async function () {
  if (window.performance) window.location.hash = "";

  table.table = await new TableAction().tableReload(
    "http://localhost:3000/api/clients"
  );

  const sorting = new Sorting();

  await sorting.sorting(document.getElementById("id"), "id");

  sorting.bindSort("fullName", "fullName");
  sorting.bindSort("id", "id");
  sorting.bindSort("createdAt", "createdAt");
  sorting.bindSort("updatedAt", "updatedAt");

  const search = document.getElementById("search");

  function timeout() {
    return setTimeout(async () => {
      if (!search.value)
        await new TableAction().tableReload(
          "http://localhost:3000/api/clients"
        );
      else
        sortArray.value = await new ServerAction().getDataWithQParam(
          search.value
        );
      await sorting.sorting(document.getElementById("id"), "id");
    }, 300);
  }

  if (search) {
    let x = null;
    search.addEventListener("input", () => {
      if (x) clearTimeout(x);
      x = timeout();
    });
  }

  window.addEventListener("hashchange", async () => {
    const id = window.location.hash.slice(1, window.location.hash.length);
    if (id) {
      const modal = await new Modal("change", id).modal;
      changeBtnLoading.cancelLoading();
      document.body.append(modal);
      modal.querySelector(".close-btn").focus();
      setTimeout(() => modal.classList.add("modal--open"), 1);
    }
  });

  const clientBtn = new ShowButton("create");
  new Helper().appendElementId("clientsList", clientBtn.btn);
})();
