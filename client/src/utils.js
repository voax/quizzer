export const checkFetchError = async response => {
  const json = await response.json();
  if (response.ok) {
    return json;
  }
  return Promise.reject(new Error(json.message));
};

export const fetchApi = (path, method = 'GET', opts = {}) => {
  return fetch(`${process.env.REACT_APP_API_URL}/${path}`, {
    method: method,
    credentials: 'include',
    mode: 'cors',
    cache: 'no-cache',
    ...opts,
  });
};

export const fetchApiSendJson = (path, method, data) => {
  return fetchApi(path, method, {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};
