import { getCookie } from './utils';


const BASE_URL = process.env.NODE_ENV === "production" ? process.env.REACT_APP_BASE_URL : 'http://localhost:8000/'


class ApiFetcher {
  static get(modelName, objectId) {
    const apiRequest = new Request(`${BASE_URL}api/${modelName}/${objectId || ''}`, {
      credentials: 'include'
    });

    return fetch(apiRequest).then(resp => {
      if (resp.status !== 404 && resp.status !== 400 && resp.status !== 500) {
        return resp.json().then((body) => ({
          status: resp.status,
          data: body.data,
        }));
      } else {
        return {
          status: resp.status,
          data: null,
        };
      }
    });
  }

  static post(modelName, objectProperties) {
    const postData = JSON.stringify(objectProperties);
    const csrfCookie = getCookie('csrftoken')

    const headers = new Headers({
        'x-csrftoken': csrfCookie
    });

    const apiRequest = new Request(`${BASE_URL}api/${modelName}/`, {
      credentials: 'include',
      method: 'POST',
      body: postData,
      headers,
    });

    return fetch(apiRequest).then(resp => {
      return resp.json().then((body) => ({
        status: resp.status,
        error: body.error || null,
        data: body.data || null,
      }));
    });
  }

  static put(modelName, objectProperties) {
    const postData = JSON.stringify(objectProperties);
    const csrfCookie = getCookie('csrftoken')

    const headers = new Headers({
        'x-csrftoken': csrfCookie
    });

    const apiRequest = new Request(`${BASE_URL}api/${modelName}/`, {
      credentials: 'include',
      method: 'PUT',
      body: postData,
      headers,
    });

    return fetch(apiRequest).then(resp => {
      return resp.json().then((body) => ({
        status: resp.status,
        error: body.error || null,
        data: body.data || null,
      }));
    });
  }

  static delete(modelName, objectId) {
    const csrfCookie = getCookie('csrftoken')
    const headers = new Headers({
        'x-csrftoken': csrfCookie
    });

    const apiRequest = new Request(`${BASE_URL}api/${modelName}/${objectId || ''}`, {
      credentials: 'include',
      method: 'DELETE',
      headers,
    });

    return fetch(apiRequest).then(resp => {
      const response = {
        status: resp.status,
      };

      if (resp.status !== 204) {
        resp.json().then((body) => {
          response.error = body.error
          return response;
        });
      } else {
        return response;
      }
    });
  }

}

export {
  ApiFetcher,
};