<template>
  <!-- code from Pratik Patel, available at https://pratik227.hashnode.dev/creating-sign-in-page-using-quasar -->
  <q-page class="flex flex-center bg-grey-2">
    <q-card bordered class="q-pa-md shadow-2 my_card">
      <q-card-section class="text-center">
        <div class="text-grey-9 text-h5 text-weight-bold">
          {{ $t('auth.login') }}
        </div>
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="email"
          dense
          :label="$t('auth.email')"
          outlined
        ></q-input>
        <q-input
          v-model="password"
          class="q-mt-md"
          dense
          :label="$t('auth.password')"
          outlined
          type="password"
        ></q-input>
      </q-card-section>

      <q-card-section>
        <q-btn
          class="full-width"
          color="dark"
          :label="$t('auth.login')"
          no-caps
          rounded
          size="md"
          style="border-radius: 8px"
          @click="login"
        ></q-btn>
      </q-card-section>

      <q-card-section
        class="row items-center justify-center text-center q-pt-none"
      >
        <div class="text-grey-8">
          {{ $t('auth.register_caption') }}
        </div>
        <q-btn
          class="text-bold"
          dense
          flat
          :label="$t('auth.register')"
          no-caps
          rounded
          text-color="dark"
          to="register"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { createLogin } from 'src/utils/ory';
import { ref } from 'vue';

const email = ref('');
const password = ref('');
const loading = ref(false);
let loginFlow = undefined;

async function login() {
  loading.value = true;
  try {
    const res = await createLogin();
    loginFlow = res;
    console.log(res);
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.my_card {
  width: 25rem;
  border-radius: 8px;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1),
    0 8px 10px -6px rgb(0 0 0 / 0.1);
}
</style>
