// 统一管理后端 API 基地址，避免在代码中硬编码
// 使用 VITE_API_BASE 环境变量（在 .env.development 或 CI 环境注入）

export const API_BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/+$/, '')

export function ensureApiAvailable(ElMessage) {
  if (!API_BASE) {
    ElMessage && ElMessage.error('未配置后端 API 地址（VITE_API_BASE）')
    return false
  }
  if (typeof window !== 'undefined' && window.location.protocol === 'https:' && API_BASE.startsWith('http://')) {
    ElMessage && ElMessage.error('当前页面为 HTTPS，后端为 HTTP 被浏览器拦截。请将 VITE_API_BASE 配置为 HTTPS 地址（例如通过反向代理/隧道提供 HTTPS）。')
    return false
  }
  return true
}

export function buildUrl(path) {
  if (!path) return API_BASE
  return `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`
}
