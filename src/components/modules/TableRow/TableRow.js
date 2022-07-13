export { TableRow };

import { ShowButton } from "../ShowButton/ShowButton.js";
import { Helper } from "../Helper/Helper.js";
import { Tooltip } from "../Tooltip/Tooltip.js";

class TableRow extends Helper {
  constructor(data = null) {
    super();
    this.data = data;
    if (data) this.row = this.rowsCreate(data);
  }

  addRow(obj) {
    const row = document.createElement("tr");
    const actionBtnsContainer = this.createMyElement(
      "div",
      "row-btns-container"
    );
    [
      new ShowButton("change", obj.id).btn,
      new ShowButton("delete", obj.id).btn,
    ].forEach((obj) => actionBtnsContainer.append(obj));
    
    const tooltips = obj.contacts.map((contact) => {
      return new Tooltip(contact.type, contact.value);
    });
    
    const tooltipsContainer = Tooltip.createWrapper(tooltips);

    [
      obj.id,
      (document.createElement("span").innerText = this.fullName(obj)),
      this.formatedDate(obj.createdAt),
      this.formatedDate(obj.updatedAt),
      tooltipsContainer,
      actionBtnsContainer,
    ].forEach((obj) => {
      const cell = document.createElement("td");
      cell.append(obj);
      row.append(cell);
    });

    return row;
  }

  rowsCreate(data) {
    const rowArray = [];
    data.forEach((element) => {
      const row = this.addRow(element);
      rowArray.push(row);
    });
    return rowArray;
  }
}
