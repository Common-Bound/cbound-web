const endpoint = {
  url:
    process.env.NODE_ENV === "production"
      ? "http://localhost:8000"
      : "https://cbound.herokuapp.com:8000"
};

module.exports = endpoint;
