import { useArc, useArcWrap } from "../../dist/index.js";

async function asyncRequest() {
  asyncRequest.calls = (asyncRequest.calls || 0) + 1;

  console.log("num calls", asyncRequest.calls);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...arguments]);
    }, 10);
  });
}

const useArcWrappedAsyncRequest = useArcWrap(asyncRequest);

export default function Home() {
  const [name, updateName] = useArc(asyncRequest, "Berthold");

  return (
    <>
      <p>num calls: {asyncRequest.calls}</p>
      <button onClick={updateName}>update</button>
      <p>{name}</p>
      {[...Array(20)].map((_, i) => (
        <Nested key={i} />
      ))}
      <Invalid />
    </>
  );
}

function Nested() {
  const [name] = useArcWrappedAsyncRequest("Berthold");

  return <p>{name}</p>;
}

function Invalid() {
  const [name] = useArcWrappedAsyncRequest(null);

  return <p>{name}</p>;
}
