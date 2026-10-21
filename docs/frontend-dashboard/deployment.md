# Admin dashboard deployment configuration

## Local development

The API base URL defaults to `http://localhost:3000`. It can be overridden at
Vite build/dev time:

```dotenv
VITE_API_URL=http://localhost:3000
```

## Runtime configuration and Kubernetes

Vite normally embeds environment variables during build. To reuse one frontend
image in multiple environments, the dashboard first reads runtime configuration
from `/config.js`:

```js
window.__PROTRAVEL_CONFIG__ = {
  apiUrl: "https://api.protravel.uz",
};
```

Resolution order is:

1. `window.__PROTRAVEL_CONFIG__.apiUrl`;
2. `VITE_API_URL` embedded by Vite;
3. `http://localhost:3000`.

Kubernetes can provide the file through a `ConfigMap` and mount it over the
web-server's `/usr/share/nginx/html/config.js`. A Deployment may also inject
backend settings into the backend container through `envFrom` with a ConfigMap
and Secret.

`config.js` is downloaded by every browser and is public. Never put database
passwords, JWT secrets or provider credentials in it. Such values belong only
in backend Kubernetes Secrets. Kubernetes service discovery may give the
backend an internal URL such as `http://backend-api:3000`; browser-facing
frontend configuration must use a URL resolvable by the user's browser, usually
an Ingress address such as `https://api.protravel.uz` or the same-origin `/api`.
