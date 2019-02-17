import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import customEnLocale from './en'
import customZhLocale from './zh'

Vue.use(VueI18n)

const messages = {
  en: {
    ...customEnLocale
  },
  zh: {
    ...customZhLocale
  }
}

const i18n = new VueI18n({
  locale: Cookies.get('language') || 'zh', // set locale
  messages // set locale messages
})

export default i18n
