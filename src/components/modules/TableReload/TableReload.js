export { TableReload };

import { ServerAction } from "../ServerAction/ServerAction.js";
import { TableRow } from "../TableRow/TableRow.js";
import { Loading } from "../Loading/Loading.js";

export let sortArray = {};

class TableReload {
  async tableReload(pageURL) {
    const table = document.getElementById("table");
    const loading = new Loading("page").addLoading();
    document.body.append(loading);
    table.innerHTML = "";
    const data = await new ServerAction().getData(pageURL);
    loading.remove();
    sortArray.value = data;
    const row = new TableRow(data).row;
    row.forEach((element) => table.append(element));

    return table;
  }
}
