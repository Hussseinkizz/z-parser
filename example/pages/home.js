import { jsx } from '../../z.js';

export default function Home() {
  const name = 'Kizz';
  const handleClick = () => {
    console.log('clicked');
  };

  return jsx(`
  <>
    <div>
    <button onClick={${handleClick}}>
    ${name}
    </button>
      <p>hello ${name}</p>
      <h1>Hello World</h1>
      <p style="color: red;">crazy fox jumps over a lazy dog!</p>
    </div>
    <section>
    <p>testing fragment</p>
    <span>ohh yes!</span>
    </section>
    </>
  `);
}
