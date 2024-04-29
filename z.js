import { jsx as _jsx } from './parser/index.js';
import { createElement } from './render/z-render.js';

export function jsx(jsxInput) {
  let ast = _jsx(jsxInput);
  let node = ast.children[0];
  console.log('node::', node);

  if (node.props) {
    let newElement = createElement({
      element: node.type,
      children: node.children[0], // evaluate if children needs to be parsed recursively
      classNames: node.props?.className ?? '_',
      ...node.props,
    });
    console.log('newElement::', newElement);
    return newElement;
  }

  let newElement = createElement({
    element: node.type,
    children: node.children[0],
  });

  return newElement;
}

export function render(parentElement, componentFunction) {
  parentElement.appendChild(componentFunction());
}
