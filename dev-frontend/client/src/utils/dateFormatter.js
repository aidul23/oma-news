// Function to format the published date
export function formatPublishedDate(isoString) {
    const date = new Date(isoString);
    
    // Customize the format (e.g., "23 September, 2024")
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  }