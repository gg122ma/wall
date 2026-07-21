/**
 * Public integration configuration.
 * Never place private API secrets in this file.
 */
window.EchoConfig = Object.freeze({
  auth: {
    provider: "local-prototype",
  },
  translation: {
    endpoint: "",
    requestHeaders: {},
  },
  cloudinary: {
    cloudName: "",
    signatureEndpoint: "",
    uploadFolder: "echo-wall",
  },
  bisheng: {
    enabled: false,
    endpoint: "",
    appId: "",
    publicToken: "",
  },
});
