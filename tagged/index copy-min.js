export const Home = () => {
  let count = 1;
  const handleClick = () => {
    console.log('Button clicked!', count + 1);
  };

  const name = 'Kizz';

  return html`<button onClick="${handleClick}" class="btn btn-primary">
    hello ${name}
    <span style="color: red;">foo bar</span>
  </button>`;
};

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

  // Extract the tag name, content, and attributes
  const element = doc.body.firstChild; // Assuming the root element is the button
  const tag = element.tagName.toLowerCase();
  const content = element.textContent.trim();

  // Extract attributes
  const attributes = {};
  Array.from(element.attributes).forEach((attr, index) => {
    if (attr.name === 'onclick') {
      console.log('entered 1');
      attributes[attr.name] = functions[index]; // Use the stored function reference
    } else {
      attributes[attr.name] = attr.value;
    }
  });

  return {
    type: tag,
    content: content,
    attributes: attributes,
  };
}

function createElement(structure) {
  const { type, content, attributes } = structure;

  // Create the element
  const element = document.createElement(type);

  // Set the content
  element.textContent = content;

  // Apply the attributes
  for (const [key, value] of Object.entries(attributes)) {
    if (key === 'onclick' && typeof value === 'function') {
      console.log('entered 2');
      element.addEventListener('click', value);
    } else {
      element.setAttribute(key, value);
    }
  }

  // Append the element to the body
  document.body.appendChild(element);
}

// Usage
const elementStructure = Home();
console.log('structure::', elementStructure);

createElement(elementStructure);
