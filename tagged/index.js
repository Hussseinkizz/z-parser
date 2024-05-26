import { createElement, html } from './tag-parser.js';

export const Home = () => {
  let count = 1;
  const handleClick = () => {
    console.log('Button clicked!', count + 1);
  };

  const name = 'Kizz';

  return html`<button class="btn btn-primary" onClick="${handleClick}">
    hello ${name}
    <div>
      Hello nested!
      <span style="color: red;">foo bar</span>
    </div>
  </button>`;
};

const Button = () => `<button>click me</button>`;

const elementStructure = Home();
console.log('structure::', elementStructure);

const element = createElement(elementStructure);
document.body.appendChild(element);
