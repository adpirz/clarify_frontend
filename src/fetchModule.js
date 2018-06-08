const BASE_URL = process.env.NODE_ENV === "production" ? process.env.REACT_APP_BASE_URL : 'http://localhost:8000/'


class ApiFetcher {
  static get(modelName, objectId) {
    const apiRequest = new Request(`${BASE_URL}api/${modelName}/${objectId || ''}`, {
      credentials: 'include'
    });

    return fetch(apiRequest).then(resp => {
      if (resp.status !== 404) {
        return resp.json().then((body) => ({
          status: resp.status,
          body,
        }));
      } else {
        return {
          status: resp.status,
          body: null,
        };
      }
    });
  }

  static post(modelName, objectProperties) {
    const postData = JSON.stringify(objectProperties);
    const apiRequest = new Request(`${BASE_URL}api/${modelName}/`, {
      credentials: 'include',
      method: 'POST',
      body: postData,
    });

    return fetch(apiRequest).then(resp => {
      if (resp.status !== 404 && resp.status !== 400) {
        return resp.json().then((body) => ({
          status: resp.status,
          body,
        }));
      } else {
        return {
          status: resp.status,
          body: null,
        };
      }
    });
  }

  static delete(modelName, objectId) {
    const apiRequest = new Request(`${BASE_URL}api/${modelName}/${objectId || ''}`, {
      credentials: 'include',
      method: 'DELETE',
    });

    return fetch(apiRequest).then(resp => {
      return resp.status === 200;
    });
  }

}

class ReportFetcher {
  static get(query) {
    if (Number.parseInt(query, 10)) {
      // Query is a report id
      query = `report_id=${query}`;
    }
    const reportRequest = new Request(`${BASE_URL}report/?${query}`, {
      credentials: 'include'
    });

    return fetch(reportRequest).then(resp => {
      if (resp.status === 200) {
        return resp.json();
      }
      else {
        return null;
      }
    });
  }
}


export {
  ApiFetcher,
  ReportFetcher
};