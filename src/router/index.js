import { createRouter, createWebHashHistory } from 'vue-router'

const PatientWorkbenchView = () => import('../views/patient-workbench/index.vue')
const SymptomAnalysisView = () => import('../views/patient-workbench/symptom-analysis/index.vue')
const KnowledgeBaseView = () => import('../views/knowledge-base/index.vue')

const routes = [
    {
        path: '/',
        redirect: '/patient-workbench'
    },
    {
        path: '/patient-workbench',
        name: 'PatientWorkbench',
        component: PatientWorkbenchView
    },
    {
        path: '/patient-workbench/symptom-analysis',
        name: 'SymptomAnalysis',
        component: SymptomAnalysisView
    },
    {
        path: '/knowledge-base',
        name: 'KnowledgeBase',
        component: KnowledgeBaseView
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
