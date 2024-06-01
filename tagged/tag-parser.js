/**
 * Processes a tagged template literal and returns an HTML element.
 *
 * @param {TemplateStringsArray} strings - Template literal strings.
 * @param {...*} values - Template literal values.
 * @returns {HTMLElement} The created HTML element.
 */
export function html(strings, ...values) {
  // Construct the full string from the template literal parts
  const fullString = strings.reduce((acc, str, i) => {
    if (typeof values[i] === 'function') {
      return acc + str + `__FUNCTION_${i}__`;
    } else if (values[i] instanceof HTMLElement) {
      const uniqueId =
        values[i].getAttribute('_id') || generateUniqueId('ELEMENT');
      values[i].setAttribute('_id', uniqueId);
      return acc + str + `<div _id="${uniqueId}"></div>`;
    }
    return acc + str + (values[i] !== undefined ? values[i] : '');
  }, '');

  // Store functions and elements separately for future use
  const functions = [];
  const elements = [];
  values.forEach((value, index) => {
    if (typeof value === 'function') {
      functions.push({
        name: `__FUNCTION_${index}__`,
        fn: value,
      });
    } else if (value instanceof HTMLElement) {
      const uniqueId = value.getAttribute('_id') || generateUniqueId('ELEMENT');
      value.setAttribute('_id', uniqueId);
      elements.push({
        name: uniqueId,
        element: value,
      });
    }
  });

  // Parse the HTML string using DOMParser
  const parser = new DOMParser();
  const doc = parser.parseFromString(fullString, 'text/html');
  const rootElement = doc.body.firstChild;
  return createElement(buildStructure(rootElement, functions, elements));
}

/**
 * Recursively builds an abstract syntax tree (AST) structure from a DOM element.
 *
 * @param {HTMLElement} element - The DOM element to process.
 * @param {Array} functions - List of functions to associate with the element.
 * @param {Array} elements - List of elements to associate with the element.
 * @returns {Object} The AST structure representing the element.
 */
function buildStructure(element, functions, elements) {
  const tag = element.tagName.toLowerCase();
  const attributes = extractAttributes(element, functions, elements);
  const content = Array.from(element.childNodes)
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .map((node) => node.textContent.trim())
    .join('');

  const children = Array.from(element.childNodes)
    .filter((node) => node.nodeType === Node.ELEMENT_NODE)
    .map((node) => buildStructure(node, functions, elements));

  return {
    type: tag,
    content: content,
    attributes: attributes,
    children: children,
    elements: elements,
  };
}

/**
 * Creates an HTML element from an AST structure.
 *
 * @param {Object} structure - The AST structure representing the element.
 * @returns {HTMLElement} The created HTML element.
 */
export function createElement(structure) {
  const { type, content, attributes, children, elements } = structure;

  // Create the element
  const element = document.createElement(type);

  // Set a unique _id attribute if not already present
  if (!element.hasAttribute('_id')) {
    const uniqueId = generateUniqueId('ELEMENT');
    element.setAttribute('_id', uniqueId);
  }

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

  // Replace placeholders with actual elements
  Array.from(element.querySelectorAll('div[_id]')).forEach((placeholder) => {
    const id = placeholder.getAttribute('_id');
    const elementPlaceholder = elements.find((e) => e.name === id);
    if (elementPlaceholder) {
      placeholder.replaceWith(elementPlaceholder.element);
    }
  });

  return element;
}

/**
 * Extracts attributes and their values from a DOM element.
 *
 * @param {HTMLElement} element - The DOM element to process.
 * @param {Array} functions - List of functions to associate with the element.
 * @param {Array} elements - List of elements to associate with the element.
 * @returns {Object} An object representing the element's attributes.
 */
function extractAttributes(element, functions, elements) {
  const attributes = {};
  Array.from(element.attributes).forEach((attr) => {
    const attrValue = attr.value.trim();
    const functionPlaceholder = functions.find((f) => f.name === attrValue);
    if (functionPlaceholder) {
      attributes[attr.name] = functionPlaceholder.fn;
    } else {
      const elementPlaceholder = elements.find((e) => e.name === attrValue);
      if (elementPlaceholder) {
        attributes[attr.name] = elementPlaceholder.name;
      } else {
        attributes[attr.name] = attr.value;
      }
    }
  });
  return attributes;
}

/**
 * Hashes a string using the DJB2 algorithm.
 *
 * @param {string} str - The string to hash.
 * @returns {string} The hashed string.
 */
function hashString(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i);
  }
  return hash.toString(36);
}

const styleCache = new Map();
let styleSheet;

/**
 * Creates a CSS class with the given styles.
 *
 * @param {TemplateStringsArray} strings - Template literal strings.
 * @param {...*} values - Template literal values.
 * @returns {string} The generated class name.
 */
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

  return className;
}

/**
 * Generates a unique ID.
 *
 * @param {string} [keyword=''] - A keyword to include in the ID.
 * @param {number} [length=6] - The length of the random part of the ID.
 * @returns {string} The generated unique ID.
 */
export function generateUniqueId(keyword = '', length = 6) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '1234567890';
  let id = keyword;
  const timestamp = Date.now(); // Get the current timestamp in milliseconds
  const randomChar = characters.charAt(
    Math.floor(Math.random() * characters.length)
  );
  const randomNum = numbers.charAt(Math.floor(Math.random() * numbers.length));

  // Generate random letters for the specified length
  if (!keyword) {
    for (let i = 0; i < length; i++) {
      id += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  }

  // Append the timestamp and a random character to the ID
  id += `_${timestamp}${randomChar}${randomNum}`;

  return id;
}

// todo: add error handling
