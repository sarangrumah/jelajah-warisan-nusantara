import { useEffect, useRef } from 'react';

// =================================================================================================
// Centralized Scroll-Reveal Hook
//
// This hook creates a single, highly-efficient IntersectionObserver and a MutationObserver
// to manage scroll-reveal animations for the entire application. It's designed to be
// initialized once in the root `App.tsx` component.
//
// How it works:
// 1. IntersectionObserver:
//    - Watches for elements with the `.scroll-reveal` class to enter the viewport.
//    - When an element is intersecting (i.e., visible), it adds the `.revealed` class,
//      triggering the CSS animation.
//    - To optimize performance, it immediately stops observing the element after it has
//      been revealed.
//
// 2. MutationObserver:
//    - Monitors the entire `body` for changes to the DOM (e.g., new elements being added).
//    - When mutations are detected, it scans the newly added nodes for any elements with
//      the `.scroll-reveal` class.
//    - Any new, un-revealed elements are then registered with the IntersectionObserver.
//
// This architecture ensures:
// - A single observer, which is highly performant.
// - Automatic handling of dynamically loaded content from API calls or other async operations.
// - Clean, centralized logic that replaces scattered, inconsistent implementations.
// =================================================================================================
export const useScrollReveal = () => {
  // Use a ref to store the observer instances so they persist across re-renders
  // without causing the useEffect to re-run.
  const observerRef = useRef<{
    intersectionObserver: IntersectionObserver | null;
    mutationObserver: MutationObserver | null;
  }>({
    intersectionObserver: null,
    mutationObserver: null
  });

  useEffect(() => {
    // ====================================================================
    // 1. Setup the IntersectionObserver
    // ====================================================================
    observerRef.current.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            // Once the element is revealed, we no longer need to observe it
            observerRef.current.intersectionObserver?.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1, // Element is considered visible if 10% is seen
        rootMargin: '0px 0px -50px 0px' // Adjust the viewport for early detection
      }
    );

    // ====================================================================
    // 2. Setup the MutationObserver
    // ====================================================================
    observerRef.current.mutationObserver = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          // Check any newly added nodes for the scroll-reveal class
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement) {
              // If the added node itself is a scroll-reveal element
              if (node.matches('.scroll-reveal') && !node.matches('.revealed')) {
                observerRef.current.intersectionObserver?.observe(node);
              }
              // Query for any scroll-reveal elements within the added node
              const newElements = node.querySelectorAll<HTMLElement>('.scroll-reveal:not(.revealed)');
              newElements.forEach((el) => observerRef.current.intersectionObserver?.observe(el));
            }
          });
        }
      }
    });

    // ====================================================================
    // 3. Initial Scan and Start Observing
    // ====================================================================
    // Find all initial scroll-reveal elements on the page
    const initialElements = document.querySelectorAll<HTMLElement>('.scroll-reveal:not(.revealed)');
    initialElements.forEach((el) => observerRef.current.intersectionObserver?.observe(el));

    // Start observing the document body for mutations (dynamic content)
    observerRef.current.mutationObserver.observe(document.body, {
      childList: true, // Watch for nodes being added or removed
      subtree: true    // Watch the entire DOM tree
    });

    // ====================================================================
    // 4. Cleanup on Unmount
    // ====================================================================
    return () => {
      observerRef.current.intersectionObserver?.disconnect();
      observerRef.current.mutationObserver?.disconnect();
    };
  }, []); // The empty dependency array ensures this effect runs only once
};