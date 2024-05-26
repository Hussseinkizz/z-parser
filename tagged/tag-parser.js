export function html(strings, ...values) {
  // Construct the full string from the template literal parts
  const fullString = strings.reduce(
    (acc, str, i) => acc + str + (values[i] !== undefined ? values[i] : ''),
    ''
  );

  // Store functions separately
  const functions = values.filter((value) => typeof value === 'function');
  console.log(functions[0].name);

  // Parse the HTML string using DOMParser
  const parser = new DOMParser();
  const doc = parser.parseFromString(fullString, 'text/html');

  const rootElement = doc.body.firstChild;
  return buildStructure(rootElement, functions);
}

// Recursive function to build the structure
function buildStructure(element, functions) {
  const tag = element.tagName.toLowerCase();
  const attributes = extractAttributes(element, functions);
  const content = Array.from(element.childNodes)
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .map((node) => node.textContent.trim())
    .join('');

  const children = Array.from(element.childNodes)
    .filter((node) => node.nodeType === Node.ELEMENT_NODE)
    .map((node) => buildStructure(node));

  return {
    type: tag,
    content: content,
    attributes: attributes,
    children: children,
  };
}

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
    console.log('types of', key, typeof value);
    if (key.startsWith('on') && typeof value === 'function') {
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
    if (attrValue.startsWith('${') && attrValue.endsWith('}')) {
      const functionIndex = parseInt(attrValue.slice(2, -1), 10);
      attributes[attr.name] = functions[functionIndex];
    } else {
      attributes[attr.name] = attr.value;
    }
  });
  return attributes;
}
