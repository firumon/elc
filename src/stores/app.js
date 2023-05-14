import { defineStore } from 'pinia';
export const useAppStore = defineStore('app', {
  state: () => ({
    page_title: '',
    page: ''
  }),
  getters: {
    title(state){ return (page) => page === state.page ? state.page_title : '' }
  },
  actions: {
    setTitle(text,page){
      this.page_title = text; this.page = page;
    }
  },
});
