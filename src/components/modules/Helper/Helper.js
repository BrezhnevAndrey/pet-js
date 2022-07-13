export { Helper };

class Helper {
  createMyElement(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (text) element.innerText = text;
    return element;
  }

  prependZero(number) {
    const str = String(number);
    if (str.length < 2) {
      return "0" + str;
    } else return number;
  }

  fullName(data) {
    try {
      if (!data.name && !data.surname)
        throw new SyntaxError(
          "Отсутствуют обязательные ключи name или surname"
        );
      let fullName = null;
      fullName = data.surname + " " + data.name;
      if (data.lastName) {
        fullName = fullName + " " + data.lastName;
      }
      return fullName;
    } catch (error) {
      if (error.name === "SyntaxError")
        console.log(`${error.name}: ${error.message}`);
      else throw error;
    }
  }

  formatedDate(stringDate) {
    const date = new Date(stringDate);
    const month = this.prependZero(date.getMonth() + 1);
    const day = this.prependZero(date.getDate());
    const fullDate = `${day}.${month}.${date.getFullYear()}`;

    const hours = this.prependZero(date.getHours());
    const minutes = this.prependZero(date.getMinutes());
    const fullTime = `${hours}:${minutes}`;

    const dateContainer = this.createMyElement("span", "", fullDate);
    const timeContainer = this.createMyElement("span", "text-light", fullTime);

    const container = this.createMyElement("span", "date-container");
    [dateContainer, timeContainer].forEach((element) =>
      container.append(element)
    );

    return container;
  }

  createDataFromArray([value1, value2, value3, value4]) {
    const obj = {
      surname: value1,
      name: value2,
      lastName: value3,
      contacts: value4,
    };

    return obj;
  }

  appendElementId(id, element) {
    try {
      const container = document.getElementById(id);
      if (container) {
        container.append(element);
      } else {
        throw new Error("С данным ID элементов не найдено");
      }
    } catch (error) {
      if (error.message === "С данным ID элементов не найдено")
        console.log(`${error} : ${error.message}`);
      else throw error;
    }
  }

  firstUpperCase(value) {
    let string = value.trim();
    let result = string[0].upperCase();
    for (i = 1; i <= string.length; i++) {
      result = result + string[i];
    }
    return result;
  }
}
