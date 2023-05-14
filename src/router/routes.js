let displayMode = process.env.PROD ? 'browser tab' : 'standalone'

window.matchMedia('(display-mode: standalone)').addListener((evt) => {
  if (evt.matches) { displayMode = 'standalone' }
})
if (navigator.standalone) { displayMode = 'standalone-ios' }
if (window.matchMedia('(display-mode: standalone)').matches) { displayMode = 'standalone' }

const routes = [
  {
    path: '/', name:'index', component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name:'dashboard', component: () => import('pages/IndexPage.vue'), meta:{ label:'Dashboard',section:'main',color:'purple',text:'white',icon:'insights' } },
      { path: 'voters/:voterId?', name:'voters', component: () => import('pages/VotersPage.vue'), props: true, meta:{ title:'Voters',label:'Voters',section:'main',color:'blue',text:'white',icon:'ballot' }, },
      { path: 'search', name:'search', component: () => import('pages/SearchPage.vue'), meta:{ title:'Search Voters',label:'Search',section:'main',color:'lime',text:'white',icon:'manage_search' }, },
      { path: 'Status/:state', name:'list_status', component: () => import('pages/StatusList.vue'),props: true },
      { path: 'SDPI/:type', name:'list_sdpi', component: () => import('pages/SDPIList.vue'),props: true },
      { path: 'Relation/:relation/:type?', name:'list_relation', component: () => import('pages/RelationList.vue'),props: true },
      { path: 'Party/:party/:type?', name:'list_party', component: () => import('pages/PartyList.vue'),props: true },
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
