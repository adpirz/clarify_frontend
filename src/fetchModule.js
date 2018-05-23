class ApiFetcher {
  static get(modelName, objectId) {
    const apiRequest = new Request(`http://localhost:8000/api/${modelName}/${objectId || ''}`, {
      credentials: 'include'
    });

    return fetch(apiRequest).then(resp => {
      if (resp.status !== 404) {
        return resp.json();
      } else {
        return 404;
      }
    });
  }

  static post(modelName, objectProperties) {
    const postData = JSON.stringify(objectProperties);
    const apiRequest = new Request(`http://localhost:8000/api/${modelName}/`, {
      credentials: 'include',
      method: 'POST',
      body: postData,
    });

    return fetch(apiRequest).then(resp => {
      return resp.json();
    });
  }

  static delete(modelName, objectId) {
    const apiRequest = new Request(`http://localhost:8000/api/${modelName}/${objectId || ''}`, {
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
    const reportRequest = new Request(`http://localhost:8000/report/?${query}`, {
      credentials: 'include'
    });

    return fetch(reportRequest).then(resp => {
      if (resp.status === 200) {
        return resp.json();
      }
      else {
        return {};
      }
    });
  }
}


export {
  ApiFetcher,
  ReportFetcher
};