const endpoint = {
  url:
    process.env.NODE_ENV === "production"
      ? "http://localhost:8000"
      : "http://c-bound.io:8000"
};

module.exports = endpoint;
