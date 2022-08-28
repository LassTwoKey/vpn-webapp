export function callApi(
    path,
    method = "GET",
    data = null,
    extraHeaders = {},
    useJson = true
  ) {
    const authToken = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxODQxNzQ1ODI0LCJqdGkiOiI0OWRmMjM2YTI5OTE0NzM5OWVlMzA0ZWU5OWM4MDRlNSIsInVzZXJfaWQiOjF9.A2tHALdd9ZXxCYMFK2SN1q5tFxJzqCmmVEAxOFUGSh4";
  
    const contentTypeHeader = {};
  
    if (useJson) {
      var body = data ? JSON.stringify(data) : null;
      contentTypeHeader["Content-Type"] = "application/json";
    } else {
      var body = data;
    }
  
    return fetch(
      path,
      Object.assign(
        {},
        {
          method: method || "GET",
          headers: {
            Authorization: `Token ${authToken}`,
            ...contentTypeHeader,
            ...extraHeaders,
          },
        },
        body === null ? {} : { body }
      )
    ).then((response) => {
      if (response.status === 204) {
        return { data: {}, response: response };
      }
      return response.json().then((data) => {
        return { data: data, response: response };
      });
    });
  }
  