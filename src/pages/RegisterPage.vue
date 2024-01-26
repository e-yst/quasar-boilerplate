<template>
  <!-- code from Pratik Patel, available at https://pratik227.hashnode.dev/creating-sign-in-page-using-quasar -->
  <q-page class="flex flex-center bg-grey-2">
    <q-card bordered class="q-pa-md shadow-2 my_card">
      <q-card-section class="text-center">
        <div class="text-grey-9 text-h5 text-weight-bold">
          {{ $t('auth.register') }}
        </div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="register">
          <q-input
            v-model.trim="email"
            dense
            :label="$t('auth.email')"
            lazy-rules
            outlined
            :rules="[(val) => !!val || $t('auth.field_is_required')]"
            type="email"
          ></q-input>
          <q-input
            v-model.trim="nickname"
            class="q-mt-sm"
            dense
            :label="$t('auth.nickname')"
            lazy-rules
            outlined
            :rules="[(val) => !!val || $t('auth.field_is_required')]"
          ></q-input>
          <q-input
            v-model="password"
            class="q-mt-sm"
            dense
            :label="$t('auth.password')"
            lazy-rules
            outlined
            :rules="[(val) => !!val || $t('auth.field_is_required')]"
            type="password"
          ></q-input>
          <q-input
            v-model="confirmPass"
            class="q-mt-sm"
            dense
            :label="$t('auth.confirm_password')"
            lazy-rules
            outlined
            :rules="[
              (val) => !!val || $t('auth.field_is_required'),
              (val) => val === password || $t('auth.password_not_match'),
            ]"
            type="password"
          ></q-input>

          <q-btn
            class="q-mt-sm full-width"
            color="dark"
            icon="sym_o_person_add"
            :label="$t('auth.register')"
            :loading="loading"
            no-caps
            rounded
            size="md"
            style="border-radius: 8px"
            type="submit"
          ></q-btn>
        </q-form>
      </q-card-section>

      <q-card-section
        class="row items-center justify-center text-center q-pt-none"
      >
        <div class="text-grey-8">
          {{ $t('auth.back_to') }}
        </div>
        <q-btn
          class="text-bold"
          dense
          flat
          :label="$t('auth.login')"
          no-caps
          rounded
          text-color="dark"
          to="login"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import {
  createRegistration,
  handleOryError,
  updateRegistration,
} from 'src/utils/ory';
import { getDateFromISO } from 'src/utils/common';
import { isAxiosError } from 'axios';
import { ref } from 'vue';
import { useAuthStore } from 'src/stores/auth';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import type { RegistrationFlow } from '@ory/client';

const router = useRouter();
const $q = useQuasar();
const authStore = useAuthStore();
const { t: $t } = useI18n();

const email = ref('');
const password = ref('');
const confirmPass = ref('');
const nickname = ref('');
const loading = ref(false);
const regFlow = ref<RegistrationFlow | undefined>(undefined);

const register = async () => {
  loading.value = true;
  try {
    await getRegFlow();
    if (!regFlow.value) throw Error;
    const csrfNode = regFlow.value.ui.nodes.find(
      (el) => el.attributes.name === 'csrf_token'
    );
    const regBody = {
      method: 'password',
      csrf_token: csrfNode?.attributes.value,
      'traits.email': email.value,
      'traits.nickname': nickname.value,
      password: password.value,
    };
    const res = await updateRegistration(regFlow.value.id, regBody);
    authStore.setAuthDetailFromReg(res);
    $q.notify({ message: $t('auth.register_succeed'), type: 'positive' });
    router.push({ name: 'index' });
  } catch (e) {
    if (isAxiosError(e)) handleOryError(e);
  } finally {
    loading.value = false;
  }
};

const getRegFlow = async () => {
  if (regFlow.value && getDateFromISO(regFlow.value.expires_at) > new Date())
    return;
  try {
    const res = await createRegistration();
    regFlow.value = res;
  } catch (e) {
    if (isAxiosError(e)) handleOryError(e);
  }
};
</script>

<style scoped>
.my_card {
  width: 25rem;
  border-radius: 8px;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1),
    0 8px 10px -6px rgb(0 0 0 / 0.1);
}
</style>
