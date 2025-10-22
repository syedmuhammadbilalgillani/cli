export function formatTitleCase(str) {
    return str
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
  
//   formatTitleCase("hello-world-again"); // "Hello World Again"
  