// Extend Acorn parser with JSX
const acorn = require('acorn');
const jsx = require('acorn-jsx');
const parser = acorn.Parser.extend(jsx());

// Extend Acorn walk with JSX
const walk = require('acorn-walk');
const { extend } = require('acorn-jsx-walk');

extend(walk.base);

// Create AST from source containing JSX
const source = `
  const a = 2
  const fn = () => {
    const el = <div>Hello world!</div>
    return el
  }
`;
const ast = parser.parse(source);

// Finally...
walk.simple(ast, {
  JSXElement(node) {
    console.log(`Found a ${node.type}!`);
  },
});
