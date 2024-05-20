const acorn = require('acorn');
const jsx = require('acorn-jsx');

let name = 'kizz';

const hanldeClick = () => {
  console.log('some name', name);
};

let ast = acorn.Parser.extend(jsx()).parse(
  `<button class='add-todo button enter' onClick={${hanldeClick}}>Enter ${name}</button>`
);
console.log(
  ast.body[0].expression.openingElement.attributes[1].value.expression.body
    .body[0].expression
);
