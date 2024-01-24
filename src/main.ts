import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { DiceRollerDIKey, diceRoller } from './services/Services'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.provide(DiceRollerDIKey, diceRoller)

app.mount('#app')
