export { Validation };

class Validation {
  constructor(inputs, errorContainer) {
    this.inputs = inputs;
    this.errorContainer = errorContainer;
  }

  showObligatory(element) {
    element.classList.add("validation-obligatory");
  }

  check(input) {
    if (!input.value.trim()) {
      input.classList.add("validation-error");
      this.errorContainer.innerText = "Заполните указанные поля";
      return false;
    } else {
      input.classList.remove("validation-error");
      this.inputs.forEach(
        (element) => (element.validation = !!element.value.trim())
      );
      const valid = this.inputs.every((element) => element.validation);
      if (!valid) {
        this.errorContainer.innerText = "Заполните указанные поля";
        return false;
      } else {
        this.errorContainer.innerText = "";
        return true;
      }
    }
  }

  bindEvent(input) {
    input.addEventListener("input", () => {
      this.check(input);
    });
  }
}
