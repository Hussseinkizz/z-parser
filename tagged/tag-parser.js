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
