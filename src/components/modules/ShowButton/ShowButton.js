export { ShowButton, changeBtnLoading };

import { Modal } from "../Modal/Modal.js";
import { Loading } from "../Loading/Loading.js";

let changeBtnLoading = {};

class ShowButton {
  constructor(typeModal, id = null) {
    try {
      if (
        typeModal !== "create" &&
        typeModal !== "change" &&
        typeModal !== "delete"
      )
        throw new SyntaxError(
          "Допустимые значения аргумента: create, change, delete."
        );
      this.typeModal = typeModal;
      this.btn = this.createBtn(typeModal);
      this.id = id;
    } catch (error) {
      if (error.name === "SyntaxError")
        console.error(`${error.name}: ${error.message}`);
      else throw error;
    }
  }

  createBtn(type) {
    const btnContainer = document.createElement('div');
    btnContainer.classList.add("btns-container");
    const btn = document.createElement("button");
    btnContainer.append(btn);
    switch (type) {
      case "create": {
        btn.className = "add-btn outline";
        btn.innerText = "Добавить клиента";
        break;
      }
      case "change": {
        btn.className = "show-btn change-btn";
        btn.innerText = "Изменить";
        break;
      }
      case "delete": {
        btn.className = "show-btn delete-btn";
        btn.innerText = "Удалить";
        break;
      }
    }

    btn.addEventListener("click", async () => {
      if (this.typeModal === "change") {
        const loading = new Loading("btn", btn);
        changeBtnLoading = loading;
        loading.applyLoading();      
      }
      await this.click(this.typeModal, this.id);
    });

    return btnContainer;
  }

  async click(value, id) {
    switch (value) {
      case "create":
      case "delete":
        const modal = await new Modal(value, id).modal;
        document.body.append(modal);
        modal.querySelector(".close-btn").focus();
        setTimeout(() => {
          modal.classList.add("modal--open");
        }, 1);
        break;
      case "change":
        window.location.hash = id;
    }
  }
}
