import { defineStore } from 'pinia';
import type {
  SuccessfulNativeRegistration,
  SuccessfulNativeLogin,
} from '@ory/client';
import { getDateFromISO } from 'src/utils/common';

type AuthDetail = {
  userId: string | undefined;
  sessionId: string | undefined;
  email: string | undefined;
  nickname: string | undefined;
  expiresAt: Date | undefined;
};

export const useAuthStore = defineStore('auth', {
  state: (): AuthDetail => ({
    userId: undefined,
    sessionId: undefined,
    email: undefined,
    nickname: undefined,
    expiresAt: undefined,
  }),
  getters: {
    getAuthDetail: (state: AuthDetail) => state,
  },

  actions: {
    setAuthDetailFromReg(res: SuccessfulNativeRegistration) {
      this.userId = res.identity.id;
      this.email = res.identity.traits.email;
      this.nickname = res.identity.traits.nickname;
      if (res.session) {
        this.sessionId = res.session?.id;
        if (res.session.expires_at)
          this.expiresAt = getDateFromISO(res.session.expires_at);
      }
    },
    setAuthDetailFromLogin(res: SuccessfulNativeLogin) {
      if (res.session.identity) {
        this.userId = res.session.identity.id;
        this.email = res.session.identity.traits.email;
        this.nickname = res.session.identity.traits.nickname;
      }
      this.sessionId = res.session.id;
      if (res.session.expires_at)
        this.expiresAt = getDateFromISO(res.session.expires_at);
    },
    reset() {
      this.userId = undefined;
      this.sessionId = undefined;
      this.email = undefined;
      this.nickname = undefined;
      this.expiresAt = undefined;
    },
  },
  persist: true,
});
