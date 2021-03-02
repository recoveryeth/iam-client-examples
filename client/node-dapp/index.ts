import axios from 'axios';
import { CacheServerClient, IAM } from 'iam-client-lib';

const USER_PRIVATE_KEY = 'bafe62d65126513025b683a5a78b48c7ad5b4cea5661cfc9e5463b192ce3d408';
const BACKEND_URL = 'https://did-auth-demo.energyweb.org';

(async () => {
  const cacheServerUrl = "https://identitycache-dev.energyweb.org";
  const cacheClient = new CacheServerClient({
    url: cacheServerUrl
  });

  const iam = new IAM({
    privateKey: USER_PRIVATE_KEY,
    rpcUrl: "https://volta-rpc.energyweb.org/",
    cacheClient,
  });
  const { identityToken } = await iam.initializeConnection();

  const httpClient = await axios.create({ baseURL: BACKEND_URL })
  const { data } = await httpClient.post<{ token: string }>(`${BACKEND_URL}/login`, {
    identityToken,
  });
  httpClient.defaults.headers.common[
    'Authorization'
  ] = `Bearer ${data.token}`
  const { data: roles } = await httpClient.get<Role[]>(`roles`)
  console.info(`your roles are:`, JSON.stringify(roles))
})();

type Role = {
  name: string
  namespace: string
}
