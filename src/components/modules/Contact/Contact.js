export { Contact };

import { Helper } from "../Helper/Helper.js";

const arrayForOptions = [
  ["phone", "Телефон"],
  ["email", "Email"],
  ["additional-phone", "Доп. телефон"],
  ["vk", "Vk"],
  ["facebook", "Facebook"],
  ["another", "Другое"],
];

class Contact extends Helper {
  constructor(contactsContainer, inputsValidation = null) {
    super();
    this.contactsContainer = contactsContainer;
    this.inputsValidation = inputsValidation;
  }

  selectObject = this.createUlSelect(arrayForOptions);
  selectContainer = this.selectObject.container;
  select = this.selectObject.showContainer;
  options = this.selectObject.optionsContainer;
  input = this.createInputText();
  delete = this.addDeleteBtn();
  container = this.createContainer();

  set selectText(type) {
    switch (type) {
      case "phone":
        this.select.innerText = "Телефон";
        break;
      case "additional-phone":
        this.select.innerText = "Доп. телефон";
        break;
      case "email":
        this.select.innerText = "Email";
        break;
      case "vk":
        this.select.innerText = "Vk";
        break;
      case "facebook":
        this.select.innerText = "Facebook";
        break;
      case "another":
        this.select.innerText = "Другое";
        break;
    }
  }

  createLiOption(value, text) {
    const option = {};
    option.value = value;
    option.text = text;
    option.container = this.createMyElement("li", "option", option.text);
    return option;
  }

  createUlSelect(array) {
    const select = {};
    select.container = this.createMyElement("div", "type-container");
    select.showContainer = this.createMyElement("button", "contact-type");
    select.optionsContainer = this.createMyElement("ul", "option-container");
    select.container.append(select.showContainer);
    select.container.append(select.optionsContainer);
    select.value = array[0][0];
    select.text = array[0][1];
    const options = array.map((element) => {
      const option = this.createLiOption(element[0], element[1]);
      option.container.tabIndex = 0;
      option.container.addEventListener("click", () => {
        select.value = element[0];
        select.text = element[1];
        select.showContainer.innerText = select.text;
      });
      return option;
    });
    options.forEach((element) =>
      select.optionsContainer.append(element.container)
    );
    select.showContainer.innerText =
      select.optionsContainer.children[0].innerText;

    select.showContainer.addEventListener("click", () => {
      select.optionsContainer.classList.toggle("option-container--open");
      select.showContainer.classList.toggle("contact-type--active");
      select.optionsContainer.style.width = `${select.showContainer.offsetWidth}px`;
    });

    document.body.addEventListener("click", (e) => {
      if (e.target !== select.showContainer) {
        select.optionsContainer.classList.remove("option-container--open");
        select.showContainer.classList.remove("contact-type--active");
      }
    });

    return select;
  }

  createInputText() {
    const input = this.createMyElement(
      "input",
      "contact-value",
      "Введите данные контакта"
    );
    input.placeholder = "Введите данные контакта";
    return input;
  }

  createContainer() {
    const container = this.createMyElement(
      "div",
      "contact-container contacts-box__contact-container"
    );
    [this.selectContainer, this.input, this.delete].forEach((element) =>
      container.append(element)
    );
    return container;
  }

  addDeleteBtn() {
    const deleteImg = this.createMyElement("div", "contact-delete-img");
    const deleteBtn = this.createMyElement(
      "button",
      "contact-delete-btn display-none"
    );
    deleteBtn.append(deleteImg);
    deleteBtn.addEventListener("click", () => {
      const index = this.contactsContainer.contacts.indexOf(this);
      if (this.inputsValidation) {
        const validIndex = this.inputsValidation.indexOf(this);
        this.inputsValidation.splice(validIndex, 1);
      }
      this.contactsContainer.contacts.splice(index, 1);
      if (this.contactsContainer.contacts.length < 10)
        this.contactsContainer.addBtn.classList.remove(
          "add-contact-btn--disactive"
        );
      this.container.remove();
    });
    return deleteBtn;
  }
}
