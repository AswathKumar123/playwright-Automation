class RequestHandler {
  url(url) {
    this.baseUrl = url;
    return this;
  }

  path(path) {
    this.apiPath = path;
    return this;
  }

  params(params) {
    this.queryParams = params;
    return this;
  }

  headers(headers) {
    this.apiHeaders = headers;
    return this;
  }

  body(body) {
    this.apiBody = body;
    return this;
  }
}

exports.RequestHandler = RequestHandler;