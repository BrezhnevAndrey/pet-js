export { Modal };

import { InputText } from "../InputText/InputText.js";
import { Helper } from "../Helper/Helper.js";
import { ServerAction } from "../ServerAction/ServerAction.js";
import { ContactsContainer } from "../ContactsContainer/ContactsContainer.js";
import { Contact } from "../Contact/Contact.js";
import { TableAction, sortArray } from "../TableAction/TableAction.js";
import { Validation } from "../Validation/Validation.js";
import { TableRow } from "../TableRow/TableRow.js";
import { Loading } from "../Loading/Loading.js";

import { table } from "../../main.js";

class Modal extends Helper {
  constructor(typeModal, clientID) {
    super();
    this.typeModal = typeModal;
    this.clientID = clientID;
    this.titleText = this.typeDefine(this.typeModal);
    this.modal = this.createModal(clientID, this.titleText, this.typeModal);
  }
  url = "http://localhost:3000/api/clients";
  idContainer = this.createMyElement("span", "modal-id");
  inputsContainer = new InputText("Фамилия", "Имя", "Отчество");
  errorContainer = this.createMyElement(
    "p",
    "error-container modal__error-container"
  );

  typeDefine(type) {
    let text = null;
    try {
      switch (type) {
        case "create":
          text = "Новый клиент";
          break;

        case "change":
          text = "Изменить данные";
          break;

        case "delete":
          text = "Удалить клиента";
          break;

        default: {
          throw new SyntaxError(
            "Введёно не допустимое значение аргумента функции. Допустимые значения: create, delete, change"
          );
        }
      }
    } catch (error) {
      if ((error.name = SyntaxError)) {
        console.log(error.name + ": " + error.message);
      } else throw error;
    }
    return text;
  }

  modalAction(modal, action) {
    try {
      switch (action) {
        case "close":
          modal.classList.remove("modal--open");
          setTimeout(() => {
            modal.remove();
          }, 300);
          window.location.hash = "";
          break;
        case "open":
          setTimeout(() => {
            modal.classList.add("modal--open");
          }, 1);
          break;
        case "reload":
          modal.classList.remove("modal--open");
          setTimeout(async () => {
            modal.remove();
            window.location.hash = "";
            await new TableAction().tableReload(this.url);
          }, 300);
          break;
        default: {
          const error = new SyntaxError("Неверное значение аргументов");
          error.identifier = "mySyntaxError";
          throw error;
        }
      }
    } catch (error) {
      if (error.identifier === "mySyntaxError")
        console.error(`${error.name}: ${error.message}`);
      else throw error;
    }
  }

  async createModal(clientID, titleText, typeModal) {
    const modal = this.createMyElement("div", "modal");
    modal.addEventListener("click", (e) => {
      if (e.target === modal) this.modalAction(modal, "close");
    });

    const container = this.createMyElement("div", "modal-container");

    const closeBtnContainer = this.createMyElement("div", "modal__close-btn");
    const closeBtn = this.createMyElement("button", "close-btn");
    closeBtn.addEventListener("click", async () =>
      this.modalAction(modal, "close")
    );
    closeBtnContainer.append(closeBtn);

    const title = this.createMyElement(
      "h3",
      "subtitle modal__subtitle",
      titleText
    );
    title.append(this.idContainer);
    if (typeModal === "delete") title.classList.add("text-center");
    const content = await this.createContent(typeModal, clientID);

    [closeBtnContainer, title].forEach((element) => container.append(element));
    content.forEach((element) => container.append(element));
    modal.append(container);

    return modal;
  }

  async createContent(typeModal, clientID) {
    const btnContainer = this.createMyElement("div", "modal-button-container");
    const inputsValidation = [
      this.inputsContainer.surname.input,
      this.inputsContainer.name.input,
    ];
    const validation = new Validation(inputsValidation, this.errorContainer);

    const contactsContainer = new ContactsContainer(
      this.errorContainer,
      validation
    );

    [
      this.inputsContainer.surname.helpText,
      this.inputsContainer.name.helpText,
    ].forEach((element) => validation.showObligatory(element));

    inputsValidation.forEach((element) => {
      validation.bindEvent(element);
    });

    if (typeModal === "create" || typeModal === "change") {
      const initialsInputs = this.inputsContainer.inputGroup;
      const inputsInitialsArray = [
        this.inputsContainer.surname,
        this.inputsContainer.name,
        this.inputsContainer.middlename,
      ];
      const mainBtn = this.createMyElement(
        "button",
        "modal-main-btn outline",
        "Сохранить"
      );
      const secondaryBtn = this.createMyElement(
        "button",
        "modal-secondary-btn outline"
      );
      [mainBtn, secondaryBtn].forEach((element) =>
        btnContainer.append(element)
      );

      switch (typeModal) {
        case "create":
          mainBtn.addEventListener("click", async () => {
            const loading = new Loading("btn", mainBtn, inputsInitialsArray);
            loading.applyLoading();
            let valid = [];
            const obj = [];

            inputsInitialsArray.forEach((element) => {
              const input = element.input;
              if (inputsValidation.includes(input))
                if (!validation.check(input)) {
                  valid.push(false);
                }
              obj.push(input.value.trim());
            });

            const contacts = [];
            contactsContainer.contacts.forEach((element) => {
              const contact = {};
              const val = validation.check(element.input);
              valid.push(val);

              if (val) {
                contact.type = element.selectObject.value;
                contact.value = element.input.value;
                contacts.push(contact);
              }
            });
            obj.push(contacts);

            if (valid.includes(false)) {
              loading.cancelLoading();
              return;
            }
            const clientObj = this.createDataFromArray(obj);
            const request = await new ServerAction().postData(clientObj);

            if (request instanceof Error) {
              this.errorContainer.innerText = `${request.name}: ${request.message}`;
              loading.cancelLoading();
              return;
            }

            const modal = await this.modal;
            const row = new TableRow().addRow(request);
            table.table.prepend(row);
            sortArray.value.push(request);
            loading.cancelLoading();
            this.modalAction(modal, "close");
          });

          secondaryBtn.textContent = "Отмена";
          secondaryBtn.addEventListener("click", async () => {
            const modal = await this.modal;
            this.modalAction(modal, "close");
          });

          break;

        case "change":
          const clientData = await new ServerAction().getData(
            this.url,
            this.clientID
          );

          this.idContainer.innerText = `ID: ${clientData.id}`;
          this.inputsContainer.name.input.value = clientData.name;
          this.inputsContainer.surname.input.value = clientData.surname;
          if (clientData.lastName)
            this.inputsContainer.middlename.input.value = clientData.lastName;
          if (clientData.contacts.length > 0) {
            for (const cliContact of clientData.contacts) {
              const clientContact = new Contact(
                contactsContainer,
                validation.inputs
              );
              clientContact.selectObject.value = cliContact.type;
              clientContact.input.value = cliContact.value;
              clientContact.selectText = cliContact.type;
              contactsContainer.contacts.push(clientContact);
              if (contactsContainer.contacts.length >= 10)
                contactsContainer.addBtn.classList.add(
                  "add-contact-btn--disactive"
                );
              contactsContainer.contactsBox.append(clientContact.container);
            }
          }

          [
            this.inputsContainer.name,
            this.inputsContainer.surname,
            this.inputsContainer.middlename,
          ].forEach((element) => {
            if (element.input.value) {
              element.helpText.classList.add("input-text--active");
            }
          });
          mainBtn.addEventListener("click", async () => {
            const loading = new Loading("btn", mainBtn, inputsInitialsArray);
            loading.applyLoading();
            const obj = [];
            const valid = [];
            const contacts = [];

            inputsInitialsArray.forEach((element) => {
              const input = element.input;
              if (inputsValidation.includes(input))
                valid.push(validation.check(input));
              obj.push(input.value.trim());
            });

            const contactsArray = contactsContainer.contacts;

            if (contactsArray.length > 0) {
              contactsArray.forEach((element) => {
                const contact = {};
                const select = element.select;
                const input = element.input;
                const val = validation.check(input);
                valid.push(val);
                contact.type = element.selectObject.value;
                contact.value = input.value;
                contacts.push(contact);
              });
            }
            obj.push(contacts);

            if (valid.includes(false)) {
              loading.cancelLoading();
              return;
            }

            const request = await new ServerAction().patchData(
              clientID,
              this.createDataFromArray(obj)
            );

            if (request instanceof Error) {
              this.errorContainer.innerText = `${request.name}: ${request.message}`;
              loading.cancelLoading();
              return;
            }

            const rowArray = Array.from(table.table.children);
            const user = rowArray.find(
              (element) => element.children[0].innerText === request.id
            );
            const patchRow = new TableRow().addRow(request);
            user.replaceWith(patchRow);
            const sortIndex = sortArray.value.findIndex(
              (element) => element.id === request.id
            );
            sortArray.value[sortIndex] = request;
            const modal = await this.modal;
            loading.cancelLoading();
            window.location.hash = "";
            modal.remove();
          });

          secondaryBtn.textContent = "Удалить клиента";
          secondaryBtn.addEventListener("click", async () => {
            const rowArray = Array.from(table.table.children);
            const row = rowArray.find(
              (element) => element.children[0].innerText === clientID
            );
            const userIndex = sortArray.value.findIndex(
              (element) => element.id === clientID
            );
            await new ServerAction().deleteData(clientID);
            sortArray.value.splice(userIndex, 1);
            row.remove();
            const modal = await this.modal;
            modal.remove();
          });

          break;
      }

      return [
        initialsInputs,
        contactsContainer.container,
        this.errorContainer,
        btnContainer,
      ];
    } else if (typeModal === "delete") {
      const text = this.createMyElement(
        "p",
        "modal-text text-center modal__modal-text",
        "Вы действительно хотите удалить данного клиента?"
      );

      const mainBtn = this.createMyElement(
        "button",
        "modal-main-btn",
        "Удалить"
      );
      mainBtn.addEventListener("click", async () => {
        const rowArray = Array.from(table.table.children);
        const row = rowArray.find(
          (element) => element.children[0].innerText === clientID
        );
        const userIndex = sortArray.value.findIndex(
          (element) => element.id === clientID
        );
        await new ServerAction().deleteData(clientID);
        sortArray.value.splice(userIndex, 1);
        row.remove();
        const modal = await this.modal;
        modal.remove();
      });

      const secondaryBtn = this.createMyElement(
        "button",
        "modal-secondary-btn",
        "Отмена"
      );
      secondaryBtn.addEventListener("click", async () => {
        const modal = await this.modal;
        this.modalAction(modal, "close");
      });

      [mainBtn, secondaryBtn].forEach((element) =>
        btnContainer.append(element)
      );

      return [text, btnContainer];
    } else return false;
  }
}
