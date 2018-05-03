

class ApiFetcher {
  constructor() {
    this.baseApiUrl = 'http://localhost:8000/api/';
  }

  static get(path) {
    const apiRequest = new Request(`${this.baseApiUrl}/${path}`, {
      credentials: 'same-origin'
    });

    fetch(apiRequest).then((resp) => {
      return resp;
    })
  }
}

export default ApiFetcher;