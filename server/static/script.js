window.videoError = false;
window.imageError = false;

window.tests = {
  fails: [],
  successes: [],
  onSuccess(name) {
    console.log(`✅ ${name} request SUCCEEDED`)
    this.successes.push(name);
  },
  onFail(name, ...rest) {
    if (rest.length > 0) {
      console.error(`❌ ${name} request SUCCEEDED`, ...rest);
    } else {
      console.log(`❌ ${name} request SUCCEEDED`);
    }

    this.fails.push(name);
  }
}

const onSuccess = window.tests.onSuccess.bind(window.tests);
const onFail = window.tests.onFail.bind(window.tests);

const $image = document.querySelector('#img');
$image.addEventListener('error', () => {
  window.imageError = true;
});

const $vidContainer = document.querySelector('#vid');

const $video = document.createElement('video');
const $source = document.createElement('source');

if (window.location.hash !== '#noautoplay') {
  $video.setAttribute('autoplay', true);
}

$source.setAttribute('src', `jozin.mp4?r=${Math.random()}`);
$source.setAttribute('controls', true);

$video.addEventListener('error', () => {
  window.videoError = true;
}, true);

$video.appendChild($source);
$vidContainer.appendChild($video);

const methods = ['POST', 'GET', 'PUT', 'DELETE', 'PATCH'];

const makeRequest = async (
  url,
  body,
  {
    json = true,
    rawReturn,
    method = 'GET',
    options = {},
  } = {}
) => {
  const isGet = () => method === 'GET';

  const headers = json && !isGet()
    ? {
      'Content-Type': 'application/json',
    }
    : {}

  const p = fetch(
    url,
    {
      headers: {
        ...headers,
        ...options.headers
      },
      ...(
        !isGet()
          ? json
            ? {
              body: JSON.stringify(body)
            }
            : {
              body,
            }
          : {}
      ),
      method,
      ...options
    }
  )

  if (rawReturn) {
    return p;
  }

  if (!json) {
    return (await p).text()
  }

  return (await p).json()
}

methods.forEach(async (method) => {
  try {
    const body = method === 'GET' ? {} : { method };
    const res = await makeRequest(
      `/${method.toLowerCase()}`,
      body,
      { method }
    );

    if (JSON.stringify(res.body) === JSON.stringify(body)) {
      onSuccess(method);
    } else {
      onFail(method, JSON.stringify(res.body), JSON.stringify(body));
    }
  } catch (error) {
    onFail(method, error);
  }
});

(async () => {
  let flag = true;
  const delay = 500;

  const timeout = setTimeout(() => {
    onFail('Delay');
    flag = false;
  }, delay * 1.5);

  const r = () => makeRequest(
    '/delayed',
    { delay },
    { method: 'POST' }
  );

  await Promise.all([
    r(),
    r(),
  ])

  if (flag) {
    clearTimeout(timeout);
    onSuccess('Delay');
  }
})();

(async () => {
  const text = await makeRequest(
    '/manifesto.txt',
    undefined,
    {
      json: false,
    }
  );

  document.querySelector('#text').innerHTML = text;
})();

(async () => {
  const res = await makeRequest(
    '/content-type',
    undefined,
    {
      json: false,
      rawReturn: true,
      options: {
        headers: {
          'content-type': 'application/vnd+custom'
        }
      }
    }
  );

  if (res.headers.get('Content-Type').startsWith('application/json')) {
    onSuccess('Content Type');
  } else {
    onFail('Content Type');
  }
})();

(async () => {
  const { number: firstNumber } = await makeRequest('/random');
  const { number: secondNumber } = await makeRequest('/random');

  if (firstNumber === secondNumber) {
    onSuccess('Cache');
  } else {
    onFail('Cache');
  }
})();
