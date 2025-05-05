// Jotihunt API Integration Script
// This script fetches real-time data from the Jotihunt API and updates the documentation

// Flag to track if we've already updated the note
let noteUpdatedSuccessfully = false;

// Define the update function in the global scope so it can be accessed from exported functions
const fetchSubscriptionData = async () => {
  try {
    const response = await fetch('https://jotihunt.nl/api/2.0/subscriptions');
    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Jotihunt subscription data:', error);
    return null;
  }
};

// Function to update the competing groups note - defined in global scope
const updateCompetingGroupsNote = async () => {
  // Skip if we've already successfully updated the note
  if (noteUpdatedSuccessfully) {
    return;
  }
  
  // Get data from the API
  const subscriptionData = await fetchSubscriptionData();
  
  // Find the note element using multiple selector strategies
  let noteElement = null;
  
  // Strategy 1: Find by ID
  noteElement = document.getElementById('groups_compeeting');
  
  // Strategy 2: Find by attribute selector for ID
  if (!noteElement) {
    noteElement = document.querySelector('[id="groups_compeeting"]');
  }
  
  // Strategy 3: Find by text content in Note-like elements
  if (!noteElement) {
    const allNotes = document.querySelectorAll('div[class*="Note"], div[class*="note"], [data-component="Note"], [class*="admonition"], [class*="callout"]');
    for (const note of allNotes) {
      if (note.textContent.includes('Total groups competing') || 
          note.textContent.includes('Total groups compeeting')) {
        noteElement = note;
        break;
      }
    }
  }
  
  // Strategy 4: Find ANY element with the specific text content
  if (!noteElement) {
    const treeWalker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node) {
          return (node.textContent.includes('Total groups competing') || 
                 node.textContent.includes('Total groups compeeting')) ? 
                 NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
        }
      }
    );

    let textNode;
    while ((textNode = treeWalker.nextNode()) && !noteElement) {
      noteElement = textNode.parentElement;
      // Travel up a few levels to try to find the container element
      for (let i = 0; i < 4 && noteElement; i++) {
        if (noteElement.tagName === 'DIV' || 
            noteElement.tagName === 'ASIDE' || 
            noteElement.tagName === 'SECTION') {
          break;
        }
        noteElement = noteElement.parentElement;
      }
    }
  }
  
  // Strategy 5: Check for elements with data attributes that might indicate a Note component
  if (!noteElement) {
    const dataElements = document.querySelectorAll('[data-note], [data-type="note"], [data-tip="note"], [data-kind="note"]');
    for (const element of dataElements) {
      if (element.textContent.includes('Total groups') || 
          element.textContent.includes('competing')) {
        noteElement = element;
        break;
      }
    }
  }
    // Enable debug mode
  const DEBUG = true;
  
  if (noteElement) {
    console.log('Note element found:', DEBUG ? noteElement : noteElement.tagName);
    
    // Log element details in debug mode
    if (DEBUG) {
      console.log('Element tag:', noteElement.tagName);
      console.log('Element classes:', noteElement.className);
      console.log('Element HTML:', noteElement.outerHTML);
    }
    
    // If we successfully got data from the API
    if (subscriptionData && subscriptionData.data) {
      // Count the number of groups
      const groupCount = subscriptionData.data.length;
      
      // Get current year
      const currentYear = new Date().getFullYear();
      
      try {        // Update the note content with real data
        noteElement.innerHTML = `Total groups competing <code>${groupCount}</code> (<code>${currentYear}</code>)`;
        console.log(`Updated competing groups count to ${groupCount} for year ${currentYear}`);
        // Mark as successfully updated
        noteUpdatedSuccessfully = true;
      } catch (e) {
        console.error('Failed to update innerHTML:', e);
        
        // Try textContent as a fallback
        try {          noteElement.textContent = `Total groups competing ${groupCount} (${currentYear})`;
          console.log('Fallback to textContent update succeeded');
          // Mark as successfully updated
          noteUpdatedSuccessfully = true;
        } catch (e2) {
          console.error('Failed to update textContent too:', e2);
        }
      }
    } else {
      // Get current year
      const currentYear = new Date().getFullYear();
      
      try {        // If API failed, show a fallback message
        noteElement.innerHTML = `Total groups competing <code>Unknown</code> (<code>${currentYear}</code>)`;
        console.log('Using fallback data for competing groups count');
        // Mark as successfully updated even with fallback data
        noteUpdatedSuccessfully = true;
      } catch (e) {
        console.error('Failed to update innerHTML for fallback:', e);
        
        // Try textContent as a fallback
        try {          noteElement.textContent = `Total groups competing Unknown (${currentYear})`;
          console.log('Fallback to textContent update succeeded');
          // Mark as successfully updated even with fallback method
          noteUpdatedSuccessfully = true;
        } catch (e2) {
          console.error('Failed to update textContent too:', e2);
        }
      }
    }
  } else {
    console.warn('Note element not found! Could not update competing groups information');
    
    // Log all potential elements that might be our target in debug mode
    if (DEBUG) {
      console.log('---- Debug: Searching for potential Note elements ----');
      
      // Look for elements with text containing "group"
      const potentialElements = [];
      const treeWalker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        { acceptNode: node => node.textContent.includes('group') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP }
      );
      
      let textNode;
      while (textNode = treeWalker.nextNode()) {
        potentialElements.push({
          text: textNode.textContent.trim(),
          parentTag: textNode.parentElement?.tagName,
          parentHtml: textNode.parentElement?.outerHTML.substring(0, 100) + '...'
        });
      }
      
      console.log('Found', potentialElements.length, 'elements containing "group"');
      console.log('Sample elements:', potentialElements.slice(0, 5));
    }
  }
};

// Initialize everything with an IIFE (Immediately Invoked Function Expression)
(function initJotihuntUpdater() {
  // Define the check and update function
  const checkAndUpdatePage = () => {
    // Check for the introduction page
    if (window.location.pathname.includes('/api-reference/jotihunt/introduction') ||
        window.location.pathname.includes('/jotihunt') ||
        window.location.pathname === '/' ||
        window.location.pathname === '') {
      updateCompetingGroupsNote();
    }
  };

  // Make the function available globally
  window.updateCompetingGroupsNote = updateCompetingGroupsNote;
  window.checkAndUpdatePage = checkAndUpdatePage;
  
  // Try to run immediately
  try {
    checkAndUpdatePage();
  } catch (e) {
    console.warn('Initial check failed:', e);
  }
  
  // Add event listeners for different navigation events
  window.addEventListener('popstate', checkAndUpdatePage);
  window.addEventListener('hashchange', checkAndUpdatePage);
  try {
    window.addEventListener('pushstate', checkAndUpdatePage);
    window.addEventListener('replacestate', checkAndUpdatePage);
  } catch (e) {
    // Silent fail for unsupported events
  }  // Set up retries with increasing delays to catch delayed DOM rendering
  // Limited number of attempts to avoid infinite updates
  const retryTimes = [100, 500, 1000, 2000, 5000, 7000, 10000, 15000];
  retryTimes.forEach(time => {
    setTimeout(() => {
      // Only try again if we haven't succeeded yet
      if (!noteUpdatedSuccessfully) {
        checkAndUpdatePage();
      }
    }, time);
  });
  
  // Set up a mutation observer to watch for the note being added to the DOM
  // but stop observing once we've successfully updated
  try {
    if (window.MutationObserver) {
      const observer = new MutationObserver(function(mutations) {
        // Don't process mutations if we've already updated successfully
        if (noteUpdatedSuccessfully) {
          observer.disconnect();
          return;
        }
        
        mutations.forEach(function(mutation) {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            // Check if our note element was added
            for (let node of mutation.addedNodes) {
              if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.id === 'groups_compeeting' || 
                    (node.querySelector && node.querySelector('[id="groups_compeeting"]')) ||
                    (node.textContent && (node.textContent.includes('Total groups competing') || 
                                        node.textContent.includes('Total groups compeeting')))) {
                  updateCompetingGroupsNote();
                  // If update was successful, disconnect the observer
                  if (noteUpdatedSuccessfully) {
                    observer.disconnect();
                  }
                  break;
                }
              }
            }
          }
        });
      });
      
      // Start observing once the body exists
      if (document.body) {
        observer.observe(document.body, { 
          childList: true, 
          subtree: true 
        });
      } else {
        // If body doesn't exist yet, wait for it
        const bodyCheckInterval = setInterval(() => {
          if (document.body) {
            // Only start observing if we haven't updated successfully yet
            if (!noteUpdatedSuccessfully) {
              observer.observe(document.body, { 
                childList: true, 
                subtree: true 
              });
            }
            clearInterval(bodyCheckInterval);
          }
        }, 50);
      }
    }
  } catch (e) {
    // Silent fail
  }
  
  // Also try to run when window loads completely, but only if not already updated
  window.addEventListener('load', function() {
    if (!noteUpdatedSuccessfully) {
      checkAndUpdatePage();
    }
  });
})();

// Make the refresh function available globally instead of using export
window.refreshJotihuntData = (forceUpdate = false) => {
  // Allow forcing an update even if we've already updated once before
  if (forceUpdate) {
    // Temporarily reset the flag
    noteUpdatedSuccessfully = false;
  }
  
  if (typeof updateCompetingGroupsNote === 'function') {
    updateCompetingGroupsNote();
  } else if (typeof window.updateCompetingGroupsNote === 'function') {
    window.updateCompetingGroupsNote();
  } else {
    console.error('updateCompetingGroupsNote function not available');
  }
};