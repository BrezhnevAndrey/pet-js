export { Tooltip };

class Tooltip {
  images = {
    vk: "vk.svg",
    email: "email.svg",
    another: "another.svg",
    facebook: "facebook.svg",
    phone: "phone.svg",
    "additional-phone": "phone.svg",
  };

  constructor(type, value) {
    try {
      if (
        type !== "vk" &&
        type !== "email" &&
        type !== "another" &&
        type !== "facebook" &&
        type !== "phone" &&
        type !== "additional-phone"
      ) {
        const error = new Error("Не допустимое значение аргумента type");
        error.identifier = "Tooltip error";
        throw error;
      }
      this.type = type;
      this.value = value;
      this.container = this.createTooltip(this.type, this.value);    
    } catch (error) {
      if (error.identifier === "Tooltip error")
        console.error(`${error.name}(${error.identifier}): ${error.message}`);
      else throw error;
    }
  }

  async createTooltip(type, value) {
    const container = document.createElement("div");
    container.className = "tooltip-container";
    container.tabIndex = 0;

    const tooltip = document.createElement("div");
    tooltip.classList = "tooltip";

    const text = document.createElement("span");
    text.className = "tooltip-text";
    text.innerText = type + ": " + value;
    if (type === "another") text.innerText = value;

    tooltip.append(text);

    const icon = await import(`./images/${this.images[type]}`);
    const image = document.createElement("img");
    image.src = icon.default;

    container.append(image);
    container.append(tooltip);

    function handler(e) {
      const cordinate = e.target.getBoundingClientRect();
      tooltip.style.left =
        cordinate.left +
        window.pageXOffset -
        (text.offsetWidth - container.offsetWidth) / 2 +
        "px";
      tooltip.style.top = cordinate.top + window.pageYOffset - 35 + "px";
      tooltip.style.visibility = "visible";
    }

    container.addEventListener("mouseover", handler);
    container.addEventListener("focus", handler);

    container.addEventListener("mouseout", () => {
      tooltip.style = "visibility: hidden";
    });
    container.addEventListener("blur", () => {
      tooltip.style = "visibility: hidden";
    });

    return container;
  }

  static createWrapper(tooltips) {
    const wrapper = document.createElement("div");
    wrapper.classList.add('tooltips-wrapper');

    const btnContainer = document.createElement("div");
    btnContainer.style = "display: inline-block; line-height: 0; margin-left: 5px";

    const tooltipsContainer = document.createElement("div");
    tooltipsContainer.classList.add("tooltips-container");

    wrapper.append(tooltipsContainer);
    wrapper.append(btnContainer);

    const showAllBtn = document.createElement("button");
    showAllBtn.classList.add("tooltip-btn");

    showAllBtn.addEventListener("click", () => {
      tooltips.forEach(async (tooltip) =>
        tooltipsContainer.append(await tooltip.container)
      );
      showAllBtn.remove();
    });

    if (tooltips.length >= 6) {
      tooltips.forEach(async (tooltip, index) => {
        if (index <= 3) tooltipsContainer.append(await tooltip.container);
      });
      showAllBtn.innerText = `+${tooltips.length - 4}`;
      btnContainer.append(showAllBtn);
    } else
      tooltips.forEach(async (tooltip) =>
        tooltipsContainer.append(await tooltip.container)
      );

    return wrapper;
  }
}
