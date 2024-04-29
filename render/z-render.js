// Todo: handle styling via style attribute and style element using stylie

// Cautious Note: handling template literal strings should address security concerns with using innerHtml
/**
 * Creates a new HTML element with the specified options.
 *
 * @param {Object} options - An object containing properties for the element:
 * @param {string} [options.element] - The type of element to create, one of any valid html tag elements or types (e.g., 'button', 'div', 'p') etc. Defaults to 'section'.
 * @param {*} options.children - The content of the element, either a string, template literal or HTML element or an array of those variants or a function that returns html template string and an onLoad function eg. const componentFunction = () => {html, onLoad}. onLoad can be null and is optional.
 * @param {string} [options.classNames] - A string containing space-separated class names to apply to the element classList.
 * @param {Event} [options.onEvent] - An event descriptor used to create event listener functions, where keys are event names prefixed with `on` (e.g., 'onClick', 'onChange') etc and values are the corresponding functions to be invoked when those events occur. eg. options.onClick: () => doSomething();
 * @param {Attr} [options.any] - Any other attribute or attributes to set on the element.
 *
 * @returns {HTMLElement} The newly created HTML element that can be appended into parent eg parentElement.appendChild(HTMLElement).
 */

export const createElement = (options) => {
  const element = document.createElement(options.element || 'section');

  const handleChild = (child, parentElement = element) => {
    // don't work on undeifned and null children
    if (!child || child === null) return;

    if (typeof child === 'function') {
      const { html, onLoad } = child();
      let template = document.createElement('template');
      // innerHTML cause this is probably template literals markup
      template.innerHTML = html;
      const fragment = template.content;
      element.appendChild(fragment);
      onLoad && onLoad(element);
    } else if (child instanceof HTMLElement || child instanceof Node) {
      parentElement.appendChild(child);
    } else {
      // use append to not loose existing elements
      let template = document.createElement('template');
      template.innerHTML = child;
      const fragment = template.content;
      element.appendChild(fragment);
    }
  };

  // Set attributes (including event listeners)
  for (const attribute in options) {
    // don't work on undeifned and null attributes
    if (!attribute || attribute === null) return;

    if (attribute === 'children' && options.children) {
      const children = options.children;
      if (Array.isArray(children)) {
        children.forEach((child) => handleChild(child));
      } else {
        handleChild(children);
      }
    } else if (attribute === 'classNames') {
      // don't work on undeifned and null classNames
      if (!options.classNames || options.classNames === null) return;
      // Handle multiple classes
      options.classNames
        .split(' ')
        .forEach((className) => element.classList.add(className));
    } else if (attribute.startsWith('on')) {
      const eventName = attribute.slice(2).toLowerCase();
      element.addEventListener(eventName, options[attribute]);
    } else {
      attribute !== 'element' &&
        element.setAttribute(attribute, options[attribute]);
    }
  }

  // assign element a unique Z id
  let newId = generateUniqueId('z');
  element.setAttribute('_id', newId);

  return element;
};

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
