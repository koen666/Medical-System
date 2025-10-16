<template>
  <div class="medical-knowledge-graph">
    <header>
      <h1>医学知识图谱推理演示</h1>
    </header>

    <div class="error" v-if="error" id="errorMessage">{{ error }}</div>

    <div class="loading" v-if="loading" id="loadingIndicator">
      <p>正在查询知识图谱，请稍候...</p>
    </div>

    <div class="visualization">
      <div ref="graph" id="graph"></div>
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
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'FullGraphModule',
  data() {
    return {
      API_BASE: 'http://localhost:5000/api',
      loading: false,
      error: null,
      Graph: null
    }
  },
  mounted() {
    this.initializeVisualization()
  },
  methods: {
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
          const fontSize = Math.max(1, 0.5 / globalScale)
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

          const nodeRadius = Math.max(5, 5 / globalScale)

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
          this.Graph.graphData(data)
        }
      } catch (error) {
        console.error('获取全图失败:', error)
        this.showError(`加载全图失败: ${error.message}`)
      } finally {
        this.setLoading(false)
      }
    }
  }
})
</script>

<style scoped lang="scss">
.medical-knowledge-graph {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f8f9fa;
  padding: 20px;

  header {
    text-align: center;
    margin-bottom: 30px;
    padding-bottom: 15px;
    border-bottom: 1px solid #eaeaea;

    h1 {
      color: #2c3e50;
      margin-bottom: 10px;
    }
  }

  .error {
    color: #e74c3c;
    padding: 10px;
    background-color: #fadbd8;
    border-radius: 4px;
    margin-bottom: 15px;
  }

  .loading {
    text-align: center;
    padding: 20px;

    p {
      margin: 0;
    }
  }

  .visualization {
    display: flex;
    flex-direction: column;
    height: 600px;
    border: 1px solid #ddd;
    border-radius: 6px;
    overflow: hidden;
    margin-bottom: 20px;

    #graph {
      flex: 1;
      background-color: #fff;
    }

    .legend {
      display: flex;
      justify-content: center;
      padding: 10px;
      background-color: #f8f9fa;
      border-top: 1px solid #ddd;

      .legend-item {
        display: flex;
        align-items: center;
        margin: 0 15px;

        .legend-color {
          width: 15px;
          height: 15px;
          border-radius: 50%;
          margin-right: 5px;
        }
      }
    }
  }

  .node-info {
    position: absolute;
    background: white;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    max-width: 300px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    z-index: 100;

    h3 {
      margin: 0 0 8px 0;
      font-size: 14px;
      color: #2c3e50;
    }

    p {
      margin: 4px 0;
      font-size: 12px;
    }

    ul {
      margin: 5px 0;
      padding-left: 15px;

      li {
        margin-bottom: 2px;
        font-size: 11px;
      }
    }
  }
}
</style>
