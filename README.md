# useArc (Async Requests Cache)

```javascript
import { useArc } from "use-arc";

async function asyncRequest() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...arguments]);
    }, 10);
  });
}

function Home() {
  const [name, updateName] = useArc(asyncRequest, "Blah");
  return <p>{name}</p>;
}
```

## Installation
```sh
npm i use-arc-query
```
