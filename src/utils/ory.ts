import { Configuration, FrontendApi } from '@ory/client';
import type {
  UpdateLoginFlowBody,
  UpdateRegistrationFlowBody,
} from '@ory/client';

const frontend = new FrontendApi(
  new Configuration({ basePath: process.env.API_URL })
);

export const createRegistration = async () => {
  const res = await frontend.createBrowserRegistrationFlow();
  return res.data;
};

export const updateRegistration = async (
  id: string,
  body: UpdateRegistrationFlowBody
) => {
  const res = await frontend.updateRegistrationFlow({
    flow: id,
    updateRegistrationFlowBody: body,
  });
  return res.data;
};

export const getCurrentSession = async () => {
  const session = await frontend.toSession();
  return session;
};

export const createLogin = async (aal?: string, refresh?: boolean) => {
  const res = await frontend.createBrowserLoginFlow({ aal, refresh });
  return res.data;
};

export async function submitLogin(id: string, body: UpdateLoginFlowBody) {
  const res = await frontend.updateLoginFlow({
    flow: id,
    updateLoginFlowBody: body,
  });
  return res.data;
}
export const createLogout = async () => {
  const res = await frontend.createBrowserLogoutFlow();
  return res.data;
};
