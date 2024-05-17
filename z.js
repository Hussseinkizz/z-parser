import { jsx } from './parser/index.js';
import { createElement } from './render/z-render.js';
import { StateRadio } from './node_modules/state-radio/dist/state-radio.js';

/**
 * Parses JSX input and returns the html element or DOM representation.
 * @param {string} jsxInput - A string containing JSX syntax enclosed in backticks.
 * @returns {HTMLElement | null} The first HTMLElement from the parsed JSX, or null if the parsing fails.
 */
export function html(jsxInput) {
  let ast = jsx(jsxInput, { useEval: true });
  let collection = [];
  handleNode(collection, ast);
  // console.log('dom:::', collection);

  return collection[0];
}

function handleNode(collection, node, depth = 1) {
  let childElements = [];
  let newElement = null;
  // evaluate and parse childrens recursively
  handleNodeChildren(childElements, node.children, depth);

  if (node.props) {
    newElement = createElement({
      element: node.type,
      children: childElements,
      classNames: node.props?.className ?? null,
      ...node.props,
    });
  } else {
    newElement = createElement({
      element: node.type,
      children: childElements,
    });
  }

  // add subtree to collection
  // console.log('--newElement--', newElement);
  collection.push(newElement);
}

// Todo: add max depth when traversing nested trees, using depthIndex!
function handleNodeChildren(childCollection, children, depthIndex) {
  if (children && children.length !== 0) {
    if (children.length === 1 && typeof children[0] !== 'object') {
      childCollection.push(children[0]);
    } else {
      // single object / node with possible children / array of kids
      children.forEach((child, index) =>
        handleNode(childCollection, child, depthIndex)
      );
    }
  }
}

/**
 * Renders a component function to a parent element.
 *
 * @param {HTMLElement} parentElement - The parent element to render the component to.
 * @param {Function} componentFunction - The component function to render.
 */
export function render(parentElement, componentFunction) {
  parentElement.innerHTML = '';
  parentElement.appendChild(componentFunction());
}

// state management
const { channels } = new StateRadio();

export const store = channels;

export function useEffect(newFn, dependentStateChannels) {
  dependentStateChannels.forEach((channel) => {
    let targetChannel = store.getChannel(channel);
    if (!targetChannel) {
      console.error('channel not found', channel);
      return;
    }
    targetChannel.subscribe(newFn);
  });
}

export function useState(name, initialState) {
  let channel = channels.addChannel(name, initialState);

  const state = channel.getState();
  const setState = channel.setState;

  return [state, setState, channel];
}
