import { AxiosError } from 'axios';
import { Configuration, FrontendApi } from '@ory/client';
import { Notify } from 'quasar';
import { i18n } from 'boot/i18n';
import Router from 'src/router';
import type {
  UpdateLoginFlowBody,
  UpdateRegistrationFlowBody,
} from '@ory/client';

const frontend = new FrontendApi(
  new Configuration({ basePath: process.env.API_URL })
);
const { t: $t } = i18n.global;

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

export const submitLogin = async (id: string, body: UpdateLoginFlowBody) => {
  const res = await frontend.updateLoginFlow({
    flow: id,
    updateLoginFlowBody: body,
  });
  return res.data;
};
export const createLogout = async () => {
  const res = await frontend.createBrowserLogoutFlow();
  return res.data;
};

export const handleOryError = (e: AxiosError) => {
  const errorId = e.response?.data.error.id;
  switch (errorId) {
    case 'session_already_available':
      Notify.create({ message: $t('auth.already_logged_in') });
      Router.push({ name: 'index' });
      break;
    default:
      Notify.create({ message: $t('auth.error_occurred'), type: 'negative' });
  }
};
