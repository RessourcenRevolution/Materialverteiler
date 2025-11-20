/**
 * Verifies using a Mutation Observer and a verifying callback function,
 * if certain child elements are defined or not.
 *
 * @param el The element of which to check its children
 * @param verify Callback function to verify if the right child elements are available
 * @param maxTime Max time to wait for the right child elements
 * @returns {Promise}
 */
export function verifyChildList(el: HTMLElement, verify: () => boolean, maxTime: number = 100) {
  return new Promise<void>((resolve, reject) => {
    // Start timeout as fallback error
    const timeout = setTimeout(() => {
      reject(new Error("Correct child list not found"));
    }, maxTime);

    if (el.children.length && verify()) {
      // There are already children, verify directly
      clearTimeout(timeout);
      resolve();
      return;
    } else {
      // Otherwise keep watching the childlist of the element
      const observer = new MutationObserver(() => {
        if (verify()) {
          observer.disconnect();
          clearTimeout(timeout);
          resolve();
          return;
        }
      });
      observer.observe(el, { childList: true });
    }
  });
}
