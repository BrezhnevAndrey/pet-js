export { InputText };

import { Helper } from "../Helper/Helper.js";

class InputText extends Helper {
  constructor(value1, value2, value3) {
    super();
    this.surname = this.createInputText(value1, true);
    this.name = this.createInputText(value2, true);
    this.middlename = this.createInputText(value3, true);
    this.inputGroup = this.createInputTextGroup(value1, value2, value3);
  }

  createInputText(text, container = false) {
    const input = this.createMyElement("input", "contact__input");

    if (container) {
      const container = this.createMyElement("div", "input-container");

      const helpText = this.createMyElement(
        "span",
        "help-text input-container__help-text",
        text
      );

      input.className = "input-text";
      input.addEventListener("input", () => {
        if (input.value) helpText.classList.add("input-text--active");
        else helpText.classList.remove("input-text--active");
      });

      [helpText, input].forEach((element) => {
        container.append(element);
      });

      return { container, input, helpText };
    }

    return input;
  }

  createInputTextGroup() {
    const inputContainer = this.createMyElement("div", "inputs-container");

    [
      this.surname.container,
      this.name.container,
      this.middlename.container,
    ].forEach((element) => {
      inputContainer.append(element);
    });

    return inputContainer;
  }
}
