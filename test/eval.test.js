import * as test from 'ava';
import { jsx } from '../parser/index.js';

test('handles injected object', (t) => {
  const res = jsx(`<div style={{ top : '5px', left : '-30px'}} />`, {
    useEval: true,
  });
  t.is(res.props.style.top, '5px');
  t.is(res.props.style.left, '-30px');
});

test('handles injected function', (t) => {
  const res = jsx(`<button onClick={()=>'success'} />`, { useEval: true });

  t.is(typeof res.props.onClick, 'function');
  t.is(res.props.onClick(), 'success');
});

test('edge case', (t) => {
  const res = jsx(
    `<Tabs selected='tab2' onSelect={(key) => alert(key)} options={
		{ unlimited : 'Unlimited', potential : 'Potential' }}>
</Tabs>`,
    { useEval: true }
  );

  t.is(res.props.options.unlimited, 'Unlimited');
  t.is(res.props.options.potential, 'Potential');
});
