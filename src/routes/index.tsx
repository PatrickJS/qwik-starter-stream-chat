import {
  component$,
  useStore,
  $,
  JSXOutput,
  useSignal,
  useVisibleTask$
} from '@builder.io/qwik';
import { server$ } from '@builder.io/qwik-city';

export default component$(() => {
  const output = useStore<JSXOutput[]>([]);
  const startStreaming = $(async () => {
    const stream = await severStream();
    for await (const jsx of stream) {
      if (output && jsx) {
        output.push(jsx);
      }
    }
  });
  return (
    <>
      <button onClick$={startStreaming}>start</button>
      <div>{output.map((jsx) => jsx)}</div>
    </>
  );
});

const Counter = component$(() => {
  const count = useSignal(123);
  return <button onClick$={() => count.value++}>{count.value}</button>;
});

const Greeter = component$<{ name: string }>(({ name }) => {
  return <span>Hello {name}!</span>;
});

const Clock = component$(() => {
  const now = useSignal('');
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    const update = () => (now.value = new Date().toLocaleTimeString());
    update();
    setInterval(update, 1000);
  });
  return <span>Time: {now.value}</span>;
});

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
let count = 0;
const severStream = server$(async function* () {
  const yo = count++;
  yield (
    <>
    <div>
      {yo}:{' '}
      <span>Check out how streaming works in Qwik! </span>
    </div>
    <br />
    </>);
  await delay(500);
  yield (
    <>
    <div>
      {yo}:{' '}
      <span>You can even stream components: </span>
    </div>
    <br />
    </>
  );
  yield (
    <>
    <div>
      {yo}:{' '}
      <Greeter name="World" />
    </div>
    <br />
    </>
  );
  await delay(500);
  yield (
    <>
    <div>
      {yo}:{' '}
      <span>Or interactive components: </span>
    </div>
    <br />
    </>
  );
  yield (
    <>
    <div>
      {yo}:{' '}
      <Counter />
    </div>
    <br />
    </>
  );
  yield (
    <>
    <div>
      {yo}:{' '}
      <span>! </span>
    </div>
    <br />
    </>
  );
  await delay(500);
  yield (
    <>
    <div>
      {yo}:{' '}
      <span>Or event self runnig ones: </span>
    </div>
    <br />
    </>
  );
  yield (
    <>
    <div>
      {yo}:{' '}
      <Clock />
    </div>
    <br />
    </>
  );
  yield (
    <>
    <div>
      {yo}:{' '}
      <span>! </span>
    </div>
    <br />
    </>
  );
  await delay(500);
  yield (
    <>
    <div>
      {yo}:{' '}
      <span>
        Ohh, and all of the code streams into the client (loads lazily)!
      </span>
    </div>
    <br />
    </>
  );
});
