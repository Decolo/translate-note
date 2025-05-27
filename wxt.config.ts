import { defineConfig } from 'wxt';
import tailwindcss from "@tailwindcss/vite";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  vite: () => ({
    plugins: [tailwindcss()],
    server: {
      open: false,
    },
  }),
  manifest: {
    permissions: ['storage', 'sidePanel', 'identity'],
    action: {
      default_title: "AI Translator",
      // 不设置 default_popup，这样点击就会触发 onClicked 事件
    },
    oauth2: {
      client_id: "<client ID>",
      scopes: ["openid", "email", "profile"],
    },
  },
});
