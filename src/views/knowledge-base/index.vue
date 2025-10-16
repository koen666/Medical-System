<template>
  <div class="knowledge-base-container">
    <!-- 头部导航 -->
    <header class="page-header">
      <button class="btn-back" @click="goBack">
        <svg class="icon" viewBox="0 0 1024 1024" width="20" height="20">
          <path d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8c-16.4 12.8-16.4 37.5 0 50.3l450.8 352.1c5.2 4.1 12.9 0.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z" fill="currentColor"/>
        </svg>
        返回主页
      </button>
      <h1>知识库浏览</h1>
      <div class="header-actions">
        <button class="btn btn-primary" @click="refreshGraph">
          <svg class="icon" viewBox="0 0 1024 1024" width="16" height="16">
            <path d="M909.1 209.3l-56.4 44.1C775.8 155.1 656.2 92 521.9 92 290 92 102.3 279.5 102 511.5 101.7 743.7 289.8 932 521.9 932c181.3 0 335.8-115 394.6-276.1 1.5-4.1-.7-8.5-4.9-9.8l-63.5-22.6c-4.1-1.5-8.6.6-10.2 4.6C788.1 776.1 662.2 872 521.9 872c-192.5 0-349.9-157.4-350.1-349.9C171.6 329.6 329.1 172 521.9 172c99.9 0 184.7 41.6 246.7 108.2l-63.9 49.9c-4.1 3.2-4.9 9-.9 12.9 2.1 2.1 5 3.2 7.9 3.2h250.3c4.2 0 7.6-3.4 7.6-7.6V82.9c0-6.5-7.8-9.9-12.6-5.6z" fill="currentColor"/>
          </svg>
          刷新图谱
        </button>
      </div>
    </header>

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 左侧：知识图谱展示 -->
      <section class="graph-section">
        <div class="section-header">
          <h2>
            全局知识图谱
          </h2>
          <div class="stats">
            <span class="stat-item">节点: <strong>{{ nodeCount }}</strong></span>
            <span class="stat-item">关系: <strong>{{ linkCount }}</strong></span>
          </div>
        </div>
        
        <div class="error" v-if="error">{{ error }}</div>
        
        <div class="loading" v-if="loading">
          <div class="spinner"></div>
          <p>正在加载知识图谱...</p>
        </div>

        <div class="visualization">
          <div ref="graph" class="graph-container"></div>
          <div class="legend">
            <div class="legend-item">
              <div class="legend-color" style="background-color: #e74c3c;"></div>
              <span>症状</span>
            </div>
            <div class="legend-item">
              <div class="legend-color" style="background-color: #3498db;"></div>
              <span>疾病</span>
            </div>
            <div class="legend-item">
              <div class="legend-color" style="background-color: #f39c12;"></div>
              <span>治疗方法</span>
            </div>
            <div class="legend-item">
              <div class="legend-color" style="background-color: #9b59b6;"></div>
              <span>药物</span>
            </div>
          </div>
        </div>

        <div ref="nodeInfo" class="node-info" style="display: none;"></div>
      </section>

      <!-- 右侧上：思维链定制 -->
      <div class="right-sections">
        <section class="chain-section">
          <div class="section-header">
            <h2>
              <svg class="icon" viewBox="0 0 1024 1024" width="18" height="18">
                <path d="M924.8 385.6c-22.6-53.4-54.9-101.3-96-142.4-41.1-41.1-89-73.4-142.4-96C631.1 123.8 572.5 112 512 112s-119.1 11.8-174.4 35.2c-53.4 22.6-101.3 54.9-142.4 96-41.1 41.1-73.4 89-96 142.4C75.8 440.9 64 499.5 64 560c0 132.7 58.3 257.7 159.9 343.1l1.7 1.4c5.8 4.8 13.1 7.5 20.6 7.5h531.7c7.5 0 14.8-2.7 20.6-7.5l1.7-1.4C901.7 817.7 960 692.7 960 560c0-60.5-11.9-119.1-35.2-174.4zM761.4 836H262.6C184.4 765.5 140 665.6 140 560c0-99.4 38.7-192.8 109-263 70.3-70.3 163.7-109 263-109 99.4 0 192.8 38.7 263 109 70.3 70.3 109 163.7 109 263 0 105.6-44.4 205.5-122.6 276z" fill="currentColor"/>
                <path d="M623.5 421.5c-3.1-3.1-8.2-3.1-11.3 0L527.7 506c-18.7-5-39.4-.2-54.1 14.5-21.9 21.9-21.9 57.3 0 79.2 21.9 21.9 57.3 21.9 79.2 0 14.7-14.7 19.5-35.4 14.5-54.1l84.5-84.5c3.1-3.1 3.1-8.2 0-11.3l-28.3-28.3zM490 320h44c4.4 0 8-3.6 8-8v-80c0-4.4-3.6-8-8-8h-44c-4.4 0-8 3.6-8 8v80c0 4.4 3.6 8 8 8z" fill="currentColor"/>
              </svg>
              思维链定制
            </h2>
          </div>
          
          <div class="chain-content">
            <div class="chain-description">
              <p>选择预设的诊断推理流程，快速构建符合临床实践的思维链</p>
            </div>

            <!-- 思维链模板选择 -->
            <div class="template-grid">
              <div 
                v-for="template in chainTemplates" 
                :key="template.id"
                class="template-card"
                :class="{ active: selectedTemplate === template.id }"
                @click="selectTemplate(template.id)"
              >
                <div class="template-icon">{{ template.icon }}</div>
                <div class="template-info">
                  <h4>{{ template.name }}</h4>
                  <p>{{ template.description }}</p>
                  <div class="template-tags" v-if="template.tags">
                    <span v-for="tag in template.tags" :key="tag" class="tag">{{ tag }}</span>
                  </div>
                </div>
                <div class="template-check" v-if="selectedTemplate === template.id">
                  <svg viewBox="0 0 1024 1024" width="20" height="20">
                    <path d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474c-6.1-7.7-15.3-12.2-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1 0.4-12.8-6.3-12.8z" fill="currentColor"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 右侧下：知识库维护 -->
        <section class="maintenance-section">
          <div class="section-header">
            <h2>
              <svg class="icon" viewBox="0 0 1024 1024" width="18" height="18">
                <path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM513.1 518.1l-192 161c-5.2 4.4-13.1.7-13.1-6.1v-62.7c0-2.3 1.1-4.6 2.9-6.1L420.7 512l-109.8-92.2c-1.8-1.5-2.9-3.8-2.9-6.1V351c0-6.8 7.9-10.5 13.1-6.1l192 160.9c3.9 3.2 3.9 9.1 0 12.3zM716 673c0 4.4-3.4 8-7.5 8h-185c-4.1 0-7.5-3.6-7.5-8v-48c0-4.4 3.4-8 7.5-8h185c4.1 0 7.5 3.6 7.5 8v48z" fill="currentColor"/>
              </svg>
              知识库维护
            </h2>
          </div>

          <div class="maintenance-content">
            <div class="maintenance-grid">
              <!-- 内容更新 -->
              <div class="maintenance-card" @click="handleContentUpdate">
                <div class="card-icon update">
                  <svg viewBox="0 0 1024 1024" width="28" height="28">
                    <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-80 600c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V360c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v304zm200-176V360c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v128c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8zm0 176c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8v-48c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v48z" fill="currentColor"/>
                  </svg>
                </div>
                <div class="card-content">
                  <h3>内容更新</h3>
                  <p>同步最新医学知识、更新疾病信息、添加新的症状关联</p>
                  <div class="card-stats">
                    <span class="stat">
                      <svg viewBox="0 0 1024 1024" width="14" height="14">
                        <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm176.5 585.7l-28.6 39c-3.8 5.3-11.4 6.1-16.4 1.8L512 586.9l-131.5 103.6c-5 3.9-12.6 3.1-16.4-1.8l-28.6-39c-3.8-5.1-3.3-12.4 1.4-16.9l155.8-147.2-155.8-147.2c-4.7-4.4-5.2-11.7-1.4-16.9l28.6-39c3.8-5.3 11.4-6.1 16.4-1.8L512 385.1l131.5-103.6c5-3.9 12.6-3.1 16.4 1.8l28.6 39c3.8 5.1 3.3 12.4-1.4 16.9L531.3 486.4l155.8 147.2c4.6 4.5 5.1 11.8 1.4 16.9z" fill="currentColor"/>
                      </svg>
                      待更新: 23
                    </span>
                  </div>
                </div>
              </div>

              <!-- 知识发现 -->
              <div class="maintenance-card" @click="handleKnowledgeDiscovery">
                <div class="card-icon discovery">
                  <svg viewBox="0 0 1024 1024" width="28" height="28">
                    <path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6c3.2 3.2 8.4 3.2 11.6 0l43.6-43.5c3.2-3.2 3.2-8.4 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z" fill="currentColor"/>
                  </svg>
                </div>
                <div class="card-content">
                  <h3>知识发现</h3>
                  <p>从病历数据中挖掘新的疾病-症状关联模式</p>
                  <div class="card-stats">
                    <span class="stat">
                      <svg viewBox="0 0 1024 1024" width="14" height="14">
                        <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292c-12.7 17.7-39 17.7-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z" fill="currentColor"/>
                      </svg>
                      新发现: 8
                    </span>
                  </div>
                </div>
              </div>

              <!-- 信息审核 -->
              <div class="maintenance-card" @click="handleInformationReview">
                <div class="card-icon review">
                  <svg viewBox="0 0 1024 1024" width="28" height="28">
                    <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292c-12.7 17.7-39 17.7-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z" fill="currentColor"/>
                  </svg>
                </div>
                <div class="card-content">
                  <h3>信息审核</h3>
                  <p>审核新增知识条目、验证数据准确性、管理知识质量</p>
                  <div class="card-stats">
                    <span class="stat">
                      <svg viewBox="0 0 1024 1024" width="14" height="14">
                        <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359c-1.2-1.5-1.9-3.3-1.9-5.2 0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130.1 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z" fill="currentColor"/>
                      </svg>
                      待审核: 15
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'KnowledgeBase',
  data() {
    return {
      API_BASE: 'http://localhost:5000/api',
      loading: false,
      error: null,
      Graph: null,
      nodeCount: 0,
      linkCount: 0,
      selectedTemplate: 1,
      chainTemplates: [
        {
          id: 1,
          name: '标准诊断思维链',
          icon: '🏥',
          description: '通用诊断流程：症状分析 → 疾病匹配 → 鉴别诊断',
          tags: ['通用', '诊断']
        },
        {
          id: 2,
          name: '康复治疗思维链',
          icon: '🏃‍♂️',
          description: '康复流程：病情评估 → 治疗方法 → 药物选择 → 康复计划',
          tags: ['康复', '治疗', '药物']
        },
        {
          id: 3,
          name: '病理分析思维链',
          icon: '🧬',
          description: '深度分析：基因检测 → 病理机制 → 分子诊断 → 精准医疗',
          tags: ['病理', '基因', '精准']
        },
        {
          id: 4,
          name: '自定义思维链',
          icon: '⚙️',
          description: '根据需求自定义推理步骤和规则',
          tags: ['自定义']
        }
      ]
    }
  },
  mounted() {
    this.initializeVisualization()
  },
  methods: {
    goBack() {
      this.$router.push('/patient-workbench')
    },
    async initializeVisualization() {
      await this.loadD3Scripts()
      this.initGraph()
      await this.loadFullGraph()
    },
    loadD3Scripts() {
      return new Promise((resolve) => {
        if (window.d3) {
          this.loadForceGraphScript(resolve)
          return
        }

        const d3Script = document.createElement('script')
        d3Script.src = 'https://d3js.org/d3.v7.min.js'
        d3Script.onload = () => {
          this.loadForceGraphScript(resolve)
        }
        document.head.appendChild(d3Script)
      })
    },
    loadForceGraphScript(resolve) {
      if (window.ForceGraph) {
        resolve()
        return
      }

      const forceScript = document.createElement('script')
      forceScript.src = 'https://unpkg.com/force-graph'
      forceScript.onload = () => resolve()
      document.head.appendChild(forceScript)
    },
    showError(message) {
      this.error = message
      setTimeout(() => {
        this.error = null
      }, 5000)
    },
    setLoading(loading) {
      this.loading = loading
    },
    initGraph() {
      if (!this.$refs.graph || !window.ForceGraph) return

      const container = this.$refs.graph

      this.Graph = window.ForceGraph()(container)
        .nodeId('id')
        .nodeLabel('name')
        .nodeVal('value')
        .nodeAutoColorBy('type')
        .nodeCanvasObject((node, ctx, globalScale) => {
          const label = node.name
          const fontSize = Math.max(12, 14 / globalScale)
          ctx.font = `${fontSize}px Sans-Serif`
          const textWidth = ctx.measureText(label).width
          const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2)

          let color
          switch (node.type) {
            case '症状': color = '#e74c3c'; break
            case '疾病': color = '#3498db'; break
            case '治疗方法': color = '#f39c12'; break
            case '药物': color = '#9b59b6'; break
            default: color = '#95a5a6'
          }

          const nodeRadius = Math.max(5, 8 / globalScale)

          ctx.fillStyle = color
          ctx.beginPath()
          ctx.arc(node.x, node.y, nodeRadius, 0, 2 * Math.PI, false)
          ctx.fill()

          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
          ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions)

          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillStyle = '#000'
          ctx.fillText(label, node.x, node.y)
        })
        .linkLabel('relationship')
        .linkDirectionalParticles(2)
        .linkDirectionalParticleSpeed(0.005)
        .onNodeClick((node, event) => {
          this.showNodeInfo(node, event)
        })
        .onBackgroundClick(() => {
          if (this.$refs.nodeInfo) {
            this.$refs.nodeInfo.style.display = 'none'
          }
        })

      this.Graph.graphData({ nodes: [], links: [] })
    },
    showNodeInfo(node, event) {
      const infoDiv = this.$refs.nodeInfo
      if (!infoDiv) return

      let infoHTML = `<h3>${node.name}</h3><p>类型: ${node.type}</p>`

      if (node.properties) {
        infoHTML += '<p>属性:</p><ul>'
        for (const [key, value] of Object.entries(node.properties)) {
          if (!['id', 'labels', 'elementId'].includes(key)) {
            infoHTML += `<li>${key}: ${value}</li>`
          }
        }
        infoHTML += '</ul>'
      }

      infoDiv.innerHTML = infoHTML
      infoDiv.style.display = 'block'
      infoDiv.style.left = `${event.pageX + 10}px`
      infoDiv.style.top = `${event.pageY + 10}px`
    },
    async loadFullGraph() {
      try {
        this.setLoading(true)

        const response = await fetch(`${this.API_BASE}/graph/all`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (data.nodes && data.links && this.Graph) {
          this.nodeCount = data.nodes.length
          this.linkCount = data.links.length
          this.Graph.graphData(data)
        }
      } catch (error) {
        console.error('获取全图失败:', error)
        this.showError(`加载全图失败: ${error.message}`)
      } finally {
        this.setLoading(false)
      }
    },
    async refreshGraph() {
      await this.loadFullGraph()
    },
    selectTemplate(id) {
      this.selectedTemplate = id
      const template = this.chainTemplates.find(t => t.id === id)
      if (template) {
        console.log('选择思维链模板:', template.name)
        // 这里可以保存选择或者切换到相应的配置
      }
    },
    handleContentUpdate() {
      console.log('打开内容更新界面')
      // TODO: 实现内容更新功能
      alert('内容更新功能开发中...')
    },
    handleKnowledgeDiscovery() {
      console.log('打开知识发现界面')
      // TODO: 实现知识发现功能
      alert('知识发现功能开发中...')
    },
    handleInformationReview() {
      console.log('打开信息审核界面')
      // TODO: 实现信息审核功能
      alert('信息审核功能开发中...')
    }
  }
})
</script>

<style scoped lang="scss">
.knowledge-base-container {
  width: 100%;
  height: 100vh;
  background: #F5F7FA;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}


.page-header {
  background: #fff;
  color: #1f1f1f;
  padding: 20px 30px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border-bottom: 1px solid #e5e5e5;
  flex-shrink: 0;

  h1 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    flex: 1;
    color: #1f1f1f;
  }

  .btn-back {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: #f5f5f5;
    color: #1f1f1f;
    border: 1px solid #e5e5e5;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 14px;

    &:hover {
      background: #e5e5e5;
    }
  }

  .header-actions {
    display: flex;
    gap: 12px;
  }
}

.main-content {
  flex: 1;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 20px;
  padding: 20px;
  overflow: hidden;
}

.graph-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.right-sections {
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
}

.chain-section,
.maintenance-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.section-header {
  padding: 20px;
  border-bottom: 2px solid #E8EAF0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;

  h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #2C3E50;
    display: flex;
    align-items: center;
    gap: 8px;

    .icon {
      color: #1f1f1f;
    }
  }

  .stats {
    display: flex;
    gap: 20px;
    font-size: 14px;
    color: #5A6C7D;

    .stat-item {
      strong {
        color: #1f1f1f;
        font-size: 16px;
        margin-left: 4px;
      }
    }
  }
}

.error {
  background: #fadbd8;
  color: #e74c3c;
  padding: 12px 20px;
  border-radius: 6px;
  margin: 10px 20px;
}

.loading {
  text-align: center;
  padding: 40px 20px;
  color: #5A6C7D;

  .spinner {
    width: 40px;
    height: 40px;
    margin: 0 auto 16px;
    border: 3px solid #E8EAF0;
    border-top-color: #1f1f1f;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
}

.visualization {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  position: relative;
}

.graph-container {
  flex: 1;
  min-height: 0;
}

.legend {
  display: flex;
  justify-content: center;
  gap: 24px;
  padding: 16px;
  background: #F8F9FB;
  border-top: 1px solid #E8EAF0;

  .legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #5A6C7D;

    .legend-color {
      width: 16px;
      height: 16px;
      border-radius: 50%;
    }
  }
}

.node-info {
  position: fixed;
  background: white;
  border: 1px solid #E8EAF0;
  border-radius: 8px;
  padding: 16px;
  max-width: 300px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;

  h3 {
    margin: 0 0 8px 0;
    font-size: 16px;
    color: #2C3E50;
  }

  p {
    margin: 6px 0;
    font-size: 13px;
    color: #5A6C7D;
  }

  ul {
    margin: 8px 0;
    padding-left: 20px;

    li {
      margin-bottom: 4px;
      font-size: 12px;
      color: #5A6C7D;
    }
  }
}

.chain-content {
  padding: 20px;

  .chain-description {
    background: #f5f5f5;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 20px;
    border-left: 4px solid #1f1f1f;

    p {
      margin: 0;
      color: #5A6C7D;
      font-size: 14px;
    }
  }
}

.template-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  .template-card {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 16px;
    background: #F8F9FB;
    border: 2px solid #E8EAF0;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: #f5f5f5;
      border-color: #1f1f1f;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    &.active {
        background: #f5f5f5;
        border-color: #1f1f1f;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

        .template-icon {
          background: #E8EAF0;
          transform: scale(1.1);
        }
    }

    .template-icon {
      width: 48px;
      height: 48px;
      background: #E8EAF0;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      transition: all 0.3s ease;
    }

    .template-info {
      flex: 1;

      h4 {
        margin: 0 0 6px 0;
        font-size: 15px;
        font-weight: 600;
        color: #2C3E50;
      }

      p {
        margin: 0 0 8px 0;
        font-size: 12px;
        color: #8B8FA3;
        line-height: 1.5;
      }

      .template-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;

        .tag {
          padding: 3px 8px;
          background: #E8EAF0;
          color: #5A6C7D;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 500;
        }
      }
    }

    .template-check {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 28px;
      height: 28px;
      background: #1f1f1f;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      animation: checkPop 0.3s ease;
    }

    @keyframes checkPop {
      0% { transform: scale(0); }
      50% { transform: scale(1.2); }
      100% { transform: scale(1); }
    }
  }
}

.maintenance-content {
  padding: 20px;
}

.maintenance-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;

  .maintenance-card {
    display: flex;
    gap: 16px;
    padding: 20px;
    background: linear-gradient(135deg, #F8F9FB 0%, #FFFFFF 100%);
    border: 2px solid #E8EAF0;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      border-color: #1f1f1f;
      transform: translateX(4px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);

      .card-icon {
        transform: scale(1.1);
      }
    }

    .card-icon {
      width: 64px;
      height: 64px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;
      transition: all 0.3s ease;

      &.update {
        background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
      }

      &.discovery {
        background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
      }

      &.review {
        background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
      }
    }

    .card-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;

      h3 {
        margin: 0 0 8px 0;
        font-size: 16px;
        font-weight: 600;
        color: #2C3E50;
      }

      p {
        margin: 0 0 12px 0;
        font-size: 13px;
        color: #5A6C7D;
        line-height: 1.5;
      }

      .card-stats {
        display: flex;
        gap: 16px;

        .stat {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          background: #f5f5f5;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          color: #1f1f1f;

          svg {
            flex-shrink: 0;
            fill: currentColor;
          }
        }
      }
    }
  }
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .icon {
    flex-shrink: 0;
  }
}

.btn-primary {
  background: #1f1f1f;
  color: #fff;
  flex: 1;
  transition: background 0.2s;

  &:hover {
    background: #000;
  }
}

.btn-secondary {
  background: #E8EAF0;
  color: #5A6C7D;

  &:hover {
    background: #D0D3DC;
  }
}

@media (max-width: 1200px) {
  .main-content {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }

  .right-sections {
    max-height: none;
  }

  .template-grid {
    grid-template-columns: 1fr;
  }
}
</style>
