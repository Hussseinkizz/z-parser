import { css, html } from './tag-parser.js';

export const Home = () => {
  let count = 0;
  const name = 'Z js Framework!';

  function handleInput(event) {
    console.log('Input value changed!', event.target.value);
  }

  const styledInput = css`
    width: 50%;
    border: 1px solid #ccc;
    padding: 0.5rem;
    margin-bottom: 1rem;
    font-size: 1.2rem;
    color: tomato;
  `;

  return html`<div>
    <h1>${name}</h1>
    <input
      type="text"
      class="${styledInput}"
      placeholder="awesome kizz"
      onInput="${handleInput}" />
    <!-- Button Component Usage -->
    <div class="flex-item">${Button('Styled Button Component', count)}</div>
  </div>`;
};

const Button = (children, count) => {
  const buttonClass = css`
    background-color: tomato;
    color: #fff;
    display: flex;
    gap: 1rem;
    border-radius: 4px;
    padding: 0.5rem 1rem;
    transition: background-color 0.2s;
    margin-top: 1rem;

    &:hover {
      background-color: crimson;
    }
  `;

  const clickButton = () => {
    console.log('button clicked:', count + 1);
  };

  return html`<button class="${buttonClass}" onClick="${clickButton}">
    ${children}
  </button>`;
};

document.body.appendChild(Home());
