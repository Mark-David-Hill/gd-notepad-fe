const apiCall = (endpoint, method, body = null, authToken = null) =>
  new Promise((resolve, reject) => {
    const payload = {};

    if (body) {
      payload.body = JSON.stringify(body);
    }
    payload.method = method;
    payload.headers = { "Content-Type": "application/json", auth: authToken };

    fetch(`http://localhost:8086${endpoint}`, payload)
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }

        return res.json();
      })

      .then(resolve)
      .catch(reject);
  });

const fetchWrapper = { apiCall };

export default fetchWrapper;
