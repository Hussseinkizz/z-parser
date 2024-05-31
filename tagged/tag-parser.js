export function html(strings, ...values) {
  // Construct the full string from the template literal parts
  const fullString = strings.reduce((acc, str, i) => {
    if (typeof values[i] === 'function') {
      return acc + str + `__FUNCTION_${i}__`;
    }
    return acc + str + (values[i] !== undefined ? values[i] : '');
  }, '');

  // Store functions separately for future use
  const functions = [];
  values.forEach((value, index) => {
    if (typeof value === 'function') {
      functions.push({
        name: `__FUNCTION_${index}__`,
        fn: value,
      });
    }
  });

  // console.log(values);
  // console.log(fullString);
  // console.log(functions);

  // Parse the HTML string using DOMParser
  const parser = new DOMParser();
  const doc = parser.parseFromString(fullString, 'text/html');
  // note: we could load all children in body to support multiple elements passed to html tag function but that is easy to mess up so we go with a single child and ignore the rest
  // console.log(doc.body);

  const rootElement = doc.body.firstChild;
  return createElement(buildStructure(rootElement, functions));
}

// Recursive function to build some kind of AST structure
function buildStructure(element, functions) {
  const tag = element.tagName.toLowerCase();
  const attributes = extractAttributes(element, functions);
  const content = Array.from(element.childNodes)
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .map((node) => node.textContent.trim())
    .join('');

  const children = Array.from(element.childNodes)
    .filter((node) => node.nodeType === Node.ELEMENT_NODE)
    .map((node) => buildStructure(node, functions));

  return {
    type: tag,
    content: content,
    attributes: attributes,
    children: children,
  };
}
// Function to create an element from the structure
export function createElement(structure) {
  const { type, content, attributes, children } = structure;

  // Create the element
  const element = document.createElement(type);

  // Set the content
  if (content) {
    element.textContent = content;
  }

  // Apply the attributes
  for (const [key, value] of Object.entries(attributes)) {
    if (key.startsWith('on')) {
      const eventType = key.slice(2).toLowerCase();
      element.addEventListener(eventType, value);
    } else {
      element.setAttribute(key, value);
    }
  }
  // Recursively create and append child elements
  if (children) {
    children.forEach((child) => {
      const childElement = createElement(child);
      element.appendChild(childElement);
    });
  }

  return element;
}

// Function to extract attributes and their values
function extractAttributes(element, functions) {
  const attributes = {};
  Array.from(element.attributes).forEach((attr) => {
    const attrValue = attr.value.trim();
    const functionPlaceholder = functions.find((f) => f.name === attrValue);
    if (functionPlaceholder) {
      attributes[attr.name] = functionPlaceholder.fn;
    } else {
      attributes[attr.name] = attr.value;
    }
  });
  return attributes;
}

// ### CSS Simple Parser ###
// DJB2 hash function for better distribution and fewer collisions
function hashString(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i);
  }
  return hash.toString(36);
}

const styleCache = new Map();
let styleSheet;

export function css(strings, ...values) {
  if (!styleSheet) {
    styleSheet = document.createElement('style');
    document.head.appendChild(styleSheet);
  }

  // Combine the strings and values into a single string of CSS
  const styleString = strings.reduce(
    (acc, str, i) => acc + str + (values[i] || ''),
    ''
  );

  // Generate a hash of the style string to ensure consistent class names
  const className = 'css-' + hashString(styleString);

  // Check if the style string is already in the cache
  if (styleCache.has(className)) {
    return styleCache.get(className);
  }

  // Create the CSS rule and append it to the style sheet
  const rule = `.${className} { ${styleString} }`;
  styleSheet.innerHTML += rule;

  // Cache the class name with the style string
  styleCache.set(className, className);

  // console.log('style cache::', styleCache);

  return className;
}
