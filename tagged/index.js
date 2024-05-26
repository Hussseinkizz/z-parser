function html(strings, ...values) {
  // Construct the full string from the template literal parts
  const fullString = strings.reduce(
    (acc, str, i) => acc + str + (values[i] !== undefined ? values[i] : ''),
    ''
  );

  // Store functions separately
  const functions = values.filter((value) => typeof value === 'function');

  // Parse the HTML string using DOMParser
  const parser = new DOMParser();
  const doc = parser.parseFromString(fullString, 'text/html');

  // Function to extract attributes and their values
  function extractAttributes(element) {
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

  // Recursive function to build the structure
  function buildStructure(element) {
    const tag = element.tagName.toLowerCase();
    const attributes = extractAttributes(element);
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

  const rootElement = doc.body.firstChild;
  return buildStructure(rootElement);
}

function createElement(structure) {
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

// Usage
export const Home = () => {
  let count = 1;
  const handleClick = () => {
    console.log('Button clicked!', count + 1);
  };

  const name = 'Kizz';

  return html`<button class="btn btn-primary">
    hello ${name}
    <div>
      Hello nested!
      <span style="color: red;" onClick="${handleClick}">foo bar</span>
    </div>
  </button>`;
};

const elementStructure = Home();
console.log('structure::', elementStructure);

const element = createElement(elementStructure);
document.body.appendChild(element);
