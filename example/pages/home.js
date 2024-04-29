import { jsx } from '../../z.js';

export default function Home() {
  const name = 'Kizz';
  const handleClick = () => {
    console.log('clicked');
  };

  return jsx(`
    <div>
    <button onClick={${handleClick}}>${name}</button>
      <p>hello ${name}</p>
      <h1>Hello World</h1>
    </div>
  `);
}
