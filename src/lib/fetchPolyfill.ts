// Polyfill to prevent "Cannot set property fetch of #<Window> which has only a getter"
// in strict browser or iframe environments where window.fetch is getter-only.

(function initFetchPolyfill() {
  if (typeof window === 'undefined') return;

  try {
    let activeFetch = typeof window.fetch === 'function' ? window.fetch.bind(window) : undefined;

    const defineFetchProperty = (target: any) => {
      if (!target) return;
      try {
        const desc = Object.getOwnPropertyDescriptor(target, 'fetch');
        // If there's no setter or it's getter-only, re-define with both getter & setter
        if (!desc || desc.configurable || desc.set === undefined) {
          Object.defineProperty(target, 'fetch', {
            configurable: true,
            enumerable: true,
            get() {
              return activeFetch;
            },
            set(fn) {
              if (typeof fn === 'function') {
                activeFetch = fn;
              }
            },
          });
        }
      } catch (e) {
        // Continue to next target if definition fails
      }
    };

    // 1. Window.prototype (where getter-only fetch usually lives in iframe environments)
    const windowProto = Object.getPrototypeOf(window) || (typeof Window !== 'undefined' && Window.prototype);
    if (windowProto) {
      defineFetchProperty(windowProto);
    }

    // 2. window instance
    defineFetchProperty(window);

    // 3. globalThis if available
    if (typeof globalThis !== 'undefined') {
      defineFetchProperty(globalThis);
    }
  } catch (err) {
    // Safe error suppression
  }
})();

