export { Loading };

class Loading {
  constructor(type, replacementElement = null, inputsToDisable = null) {
    this.type = type;
    this.replacementElement = replacementElement;
    this.loading = this.addLoading(this.type);
    this.inputsToDisable = inputsToDisable;
  }

  addLoading() {
    const loadingContainer = document.createElement("div");
    loadingContainer.classList.add("loading-container");
    const loading = document.createElement("div");
    switch (this.type) {
      case "page":
        loading.classList.add("loading-page");
        break;
      case "btn":
        loading.classList.add("loading-btn");
        break;
      default:
        return;
    }
    if (this.replacementElement) {
      loadingContainer.style.width = this.getWidthElement();
      loadingContainer.style.height = this.getHeightElement();
    }
    loadingContainer.append(loading);
    return loadingContainer;
  }

  getWidthElement() {
    if (this.replacementElement)
      return (
        this.replacementElement.offsetWidth +
        parseInt(getComputedStyle(this.replacementElement).marginLeft) +
        parseInt(getComputedStyle(this.replacementElement).marginRight) +
        "px"
      );
  }

  getHeightElement() {
    if (this.replacementElement)
      return (
        this.replacementElement.offsetHeight +
        parseInt(getComputedStyle(this.replacementElement).marginTop) +
        parseInt(getComputedStyle(this.replacementElement).marginBottom) +
        "px"
      );
  }

  applyLoading() {
    if (this.replacementElement) {
      this.replacementElement.replaceWith(this.loading);
      if (this.inputsToDisable)
        this.inputsToDisable.forEach((element) => {
          element.input.disabled = true;
        });
    }
  }

  cancelLoading() {
    if (this.replacementElement) {
      this.loading.replaceWith(this.replacementElement);
      if (this.inputsToDisable)
        this.inputsToDisable.forEach((element) => (element.input.disabled = false));
    }
  }
}
