

class ApiFetcher {
  static get(objectPath, objectId) {
    const apiRequest = new Request(`http://localhost:8000/api/${objectPath}/${objectId}`, {
      credentials: 'include'
    });

    return fetch(apiRequest).then(resp => {
      return resp.json();
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
      return resp.json();
    });
  }
}


export {
  ApiFetcher,
  ReportFetcher
};