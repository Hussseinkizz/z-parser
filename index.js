import { jsx } from './parser/index.js';

const jsxInput = `<div id="app">
  <h1 className="title">Hello, React!</h1>
  <p>This is a example of JSX.</p>
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
  </ul>
  <input type="text" value="Initial value" />
  <button onClick={() => console.log('Clicked!')}>Click me</button>
</div>`;

let ast = jsx(jsxInput);

// console.log(JSON.stringify(ast));
console.log(ast.children[0]);
