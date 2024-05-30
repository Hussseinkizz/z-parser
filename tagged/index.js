import { html } from './tag-parser.js';

export const Home = () => {
  let count = 1;
  const name = 'Z js Framework!';

  const handleClick = () => {
    console.log('Button clicked!', count + 1);
  };

  function handleInput(event) {
    console.log('Input value changed!', event.target.value);
  }

  return html`<div>
    <h1>${name}</h1>
    <button class="btn btn-primary" onClick="${handleClick}">
      click
      <span style="color: red;">me</span>
    </button>
    <input
      type="text"
      style="margin-left: 0.5rem;"
      placeholder="awesome kizz"
      onInput="${handleInput}" />
  </div>`;
};

document.body.appendChild(Home());
