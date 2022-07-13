export { ServerAction };

const myUrl = "http://localhost:3000/api/clients";

class ServerAction {
  async getData(url = myUrl, id) {
    if (id) url = url + "/" + id;
    const request = await fetch(url);
    const error = this.checkRequestStatus(request);
    if (error) return error;
    const data = await request.json();
    return data;
  }

  async postData(obj, url = myUrl) {
    try {
      const request = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
      });
      const x = await request.json();
      const error = this.checkRequestStatus(request);
      if (error) throw error;
      else return x;
    } catch (error) {
      return error;
    }
  }

  async deleteData(id, url = myUrl) {
    try {
      const request = await fetch(`${url}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const error = this.checkRequestStatus(request);
      if (error) throw error;
    } catch (error) {
      return error;
    }
  }

  async patchData(id, obj, url = myUrl) {
    try {
      const request = await fetch(`${url}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
      });
      const error = this.checkRequestStatus(request);
      if (error) throw error;
      else {
        const result = await request.json();
        return result;
      }
    } catch (error) {
      return error;
    }
  }

  async getDataWithQParam(value, url = myUrl) {
    if (value) {
      const urlQuery = new URL(url);
      urlQuery.searchParams.set("search", value);
      const data = await this.getData(urlQuery);
      return data;
    }
  }

  checkRequestStatus(request) {
    if (request.status !== 200 && request.status !== 201) {
      if (request.statusText) {
        const error = new Error(`${request.status}: ${request.statusText}`);
        return error;
      } else {
        const error = new Error(`Что-то пошло не так`);
        return error;
      }
    }
  }
}
