export { Sorting };

import { SortArray } from "../SortArray/SortArray.js";
import { TableRow } from "../TableRow/TableRow.js";

import { sortArray } from "../TableAction/TableAction.js";


class Sorting {
  async sorting(btn, type, obj = sortArray.value) {
    const data = obj.slice(0, obj.length);
    const activeBtn = document.querySelector(".sort-btn--active");
    if (activeBtn && activeBtn.id !== btn.id)
      activeBtn.classList.remove("sort-btn--active", "sort-btn--ascending");
    btn.classList.toggle("sort-btn--ascending");
    btn.classList.add("sort-btn--active");
    let sort = null;
    if (btn.classList.contains("sort-btn--ascending"))
      sort = new SortArray(data).sort(type);
    else sort = new SortArray(data).sort(type, false);
    table.innerHTML = "";
    const row = new TableRow(sort).row;
    row.forEach((element) => table.append(element));
  }

  bindSort(btnId, sortType) {
    const btn = document.getElementById(btnId);
    btn.addEventListener(
      "click",
      async () => await this.sorting(btn, sortType)
    );
  }
}
