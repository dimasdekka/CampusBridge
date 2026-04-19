// Mocks Native Modules for Web Preview 
module.exports = new Proxy(
  {},
  {
    get: function (target, prop) {
      if (prop === '__esModule') return true;
      if (prop === 'default') return () => null;
      // Define specific mocks if needed
      if (prop === 'StreamVideo' || prop === 'OverlayProvider' || prop === 'Chat') {
        return ({ children }) => children || null; // Render children if they exist to not break layouts
      }
      return () => null;
    },
  }
);
