import { jsx } from '../parser/index.js';
import { createElement } from './z-render.js';

export function render(parentElement, componentTree, options = {}) {
  let _element = createVirtualDom(componentTree());
  console.log('log::', _element, componentTree());
  parentElement.innerHtml = '';
  parentElement.appendChild(createVirtualDom(componentTree()));
}

function createVirtualDom(jsxInput) {
  // console.log(jsxInput);
  // let domTree = [];
  let ast = jsx(jsxInput);
  let node = ast.children[0];
  console.log('node::', node);

  // if (node.props) {
  //   let newElement = createElement({
  //     element: node.type,
  //     children: node.children[0], // evaluate if children needs to be parsed recursively
  //     classNames: node.props?.className ?? null,
  //     ...node.props,
  //   });
  //   return newElement;
  // }

  let newElement = createElement({
    element: node.type,
    children: node.children[0],
  });

  // domTree.push(element);
  return newElement;
}
