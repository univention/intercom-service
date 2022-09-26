const massageCors = async (req, proxyRes, allowedRegEx) => {
  const origin = req.get("origin");
  if (origin && origin.match(allowedRegEx)) {
    proxyRes.headers["access-control-allow-origin"] = origin;
  }
};

module.exports = {
  massageCors,
};