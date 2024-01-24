import {
  Configuration,
  FrontendApi,
  UpdateRegistrationFlowBody,
} from '@ory/client';

const frontend = new FrontendApi(
  new Configuration({
    basePath: process.env.API_URL,
  })
);

export async function createRegistration() {
  const resp = await frontend.createBrowserRegistrationFlow();
  return resp.data;
}

export async function updateRegistration(
  id: string,
  body: UpdateRegistrationFlowBody
) {
  const resp = await frontend.updateRegistrationFlow({
    flow: id,
    updateRegistrationFlowBody: body,
  });
  return resp.data;
}

export async function getCurrentSession() {
  const session = await frontend.toSession();
  return session;
}
