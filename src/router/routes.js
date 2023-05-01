import {auth} from "assets/scripts/firebase-auth";

let displayMode = 'browser tab'//standalone, browser tab
window.matchMedia('(display-mode: standalone)').addListener((evt) => {
  if (evt.matches) { displayMode = 'standalone' }
})
if (navigator.standalone) { displayMode = 'standalone-ios' }
if (window.matchMedia('(display-mode: standalone)').matches) { displayMode = 'standalone' }

const routes = [
  {
    path: '/', name:'index', component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name:'main_home', component: () => import('pages/IndexPage.vue') },
      { path: 'voters/:voterId?', name:'voters', component: () => import('pages/VotersPage.vue'), props: true, meta:{ title:'Voters',menu:'Voters',section:'main' }, },
      { path: 'search', name:'search', component: () => import('pages/SearchPage.vue'), meta:{ title:'Search Voters',menu:'Search',section:'main' }, },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default displayMode === 'standalone'
  ? routes
  : [{ path: '/',component: () => import('layouts/InstallLayout.vue') }]
