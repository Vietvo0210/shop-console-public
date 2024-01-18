<template>
  <a-form :model="formState" layout="vertical" @finish="onLogin" class="flex flex-col gap-4">
    <form-item name="username" label="Tên đăng nhập" required>
      <a-input v-model:value="formState.username">
        <template #prefix>
          <icon-fe type="user" />
        </template>
      </a-input>
    </form-item>

    <form-item name="password" label="Mật khẩu" required>
      <a-input type="password" v-model:value="formState.password">
        <template #prefix>
          <icon-fe type="lock" />
        </template>
      </a-input>
    </form-item>

    <btn :loading="submitting" type="submit" theme="primary" icon="log-in" text="Đăng nhập" class="w-full" />
  </a-form>
</template>

<script setup>
import FormItem from '@/components/Form/Item'
import Btn from '@/components/Button'
import IconFe from '@/components/Icon/Fe'
import { provide, reactive, ref } from 'vue'
import { toggleState } from '@/utils/toggle'
import { useStore } from 'vuex'
import notice from '@/utils/notice'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const formState = reactive({
  username: '',
  password: '',
})

const errors = ref({})
provide('errors', errors)
const submitting = ref(false)

const onLogin = () => {
  toggleState(() => {
    const payload = {
      username: formState.username,
      password: formState.password,
    }

    return store
      .dispatch('user/LOGIN', payload)
      .then(user => {
        notice.success('Đăng nhập thành công', { description: 'Xin chào, ' + user.name })
        return router.push('/')
      })
      .catch(({ message, errors: e }) => {
        notice.error(message)
        errors.value = e
      })
  }, submitting)
}
</script>
