export { SortArray };

import { Helper } from "../Helper/Helper.js";

class SortArray extends Helper {
  constructor(data) {
    super();
    this.data = data;
  }

  sort(type, ascending = true, data = this.data) {
    let result = null;
    switch (type) {
      case "fullName":
        result = data.sort((a, b) => {
          if (this.fullName(a) > this.fullName(b)) return 1;
          if (this.fullName(a) == this.fullName(b)) return 0;
          if (this.fullName(a) < this.fullName(b)) return -1;
        });
        break;
      case "id":
        result = data.sort((a, b) => {
          if (a.id > b.id) return 1;
          if (a.id == b.id) return 0;
          if (a.id < b.id) return -1;
        });
        break;
      case "createdAt":
        result = data.sort((a, b) => {
          console.log()
          if (new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime())
            return 1;
          if (
            new Date(a.createdAt).getTime() == new Date(b.createdAt).getTime()
          )
            return 0;
          if (new Date(a.createdAt).getTime() < new Date(b.createdAt).getTime())
            return -1;
        });
        break;
      case "updatedAt":
        result = data.sort((a, b) => {
          if (new Date(a.updatedAt).getTime() > new Date(b.updatedAt).getTime())
            return 1;
          if (new Date(a.updatedAt).getTime() == new Date(b.updatedAt).getTime())
            return 0;
          if (new Date(a.updatedAt).getTime() < new Date(b.updatedAt).getTime())
            return -1;
        });
        break;
    }
    if (ascending) return result;
    else return result.reverse();
  }
}
