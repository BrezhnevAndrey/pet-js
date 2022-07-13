export { ContactsContainer };

import { Helper } from "../Helper/Helper.js";
import { Contact } from "../Contact/Contact.js";

class ContactsContainer extends Helper {
  constructor(errorContainer, inputsValidation) {
    super();
    this.inputsValidation = inputsValidation;
    this.errorContainer = errorContainer;
  }
  container = this.createMyElement("div", "contacts");
  contactsBox = this.createMyElement("div", "contacts-box");
  addBtn = this.addContactBtn();
  contacts = [];
  inputs = [];

  addContactBtn() {
    const btn = this.createMyElement(
      "button",
      "add-contact-btn outline",
      "Добавить контакт"
    );

    btn.addEventListener("click", () => {
      const contact = new Contact(this, this.inputsValidation.inputs);
      this.contacts.push(contact);
      this.inputsValidation.inputs.push(contact.input);
      this.inputsValidation.bindEvent(contact.input);
      this.inputs.push(contact.input);
      if (this.contacts.length >= 10)
        btn.classList.add("add-contact-btn--disactive");
      this.contactsBox.append(contact.container);
    });
    
    this.container.append(this.contactsBox);
    this.container.append(btn);

    return btn;
  }
}
