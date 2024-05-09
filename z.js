import { jsx as _jsx } from './parser/index.js';
import { createElement } from './render/z-render.js';

export function jsx(jsxInput) {
  let ast = _jsx(jsxInput, { useEval: true });
  let collection = [];
  handleNode(collection, ast);
  console.log('dom:::', collection);

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

export function render(parentElement, componentFunction) {
  parentElement.appendChild(componentFunction());
}
