<template>
  <div class="graph-view">
    <div class="graph-controls">
      <div class="control-row">
        <span class="label">节点类型</span>
        <el-checkbox-group v-model="localFilters.nodeTypes" size="small">
          <el-checkbox label="symptom">症状</el-checkbox>
          <el-checkbox label="disease">疾病</el-checkbox>
          <el-checkbox label="test">检查</el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="control-row">
        <span class="label">边权阈值</span>
        <el-slider
          v-model="localFilters.threshold"
          :min="0"
          :max="1"
          :step="0.05"
          show-input
          @change="emitFilters"
        />
      </div>
    </div>

    <div class="graph-canvas">
      <svg :viewBox="viewBox" preserveAspectRatio="xMidYMid meet">
        <defs>
          <marker id="arrow" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#c0c4cc"></path>
          </marker>
        </defs>

        <g class="edges">
          <line
            v-for="edge in visibleEdges"
            :key="edge.source + '-' + edge.target"
            :x1="nodePositions[edge.source].x"
            :y1="nodePositions[edge.source].y"
            :x2="nodePositions[edge.target].x"
            :y2="nodePositions[edge.target].y"
            :stroke-width="Math.max(1.5, edge.weight * 6)"
            :stroke="edgeColor(edge)"
            marker-end="url(#arrow)"
            stroke-linecap="round"
            opacity="0.7"
          />
        </g>

        <g class="nodes">
          <g
            v-for="node in visibleNodes"
            :key="node.id"
            class="node"
            :transform="`translate(${nodePositions[node.id].x}, ${nodePositions[node.id].y})`"
            @click="handleNodeClick(node)"
          >
            <circle :r="radius(node)" :fill="nodeColor(node)" />
            <text class="label" dy="4" x="0">{{ node.label }}</text>
          </g>
        </g>
      </svg>
      <el-empty v-if="!visibleNodes.length" description="无可显示节点" />
    </div>
    <div class="legend">
      <div class="legend-item" v-for="item in legendItems" :key="item.type">
        <span class="dot" :style="{ backgroundColor: item.color }"></span>
        <span>{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

const TYPE_COLORS = {
  symptom: '#409EFF',
  disease: '#F56C6C',
  test: '#E6A23C',
  sign: '#9B59B6'
}

export default defineComponent({
  name: 'GraphView',
  props: {
    graphData: {
      type: Object,
      default: () => ({ nodes: [], edges: [] })
    },
    filters: {
      type: Object,
      default: () => ({ nodeTypes: [], threshold: 0.3 })
    }
  },
  data() {
    return {
      localFilters: { ...this.filters }
    }
  },
  computed: {
    viewBox() {
      return '0 0 800 480'
    },
    legendItems() {
      return [
        { type: 'symptom', label: '症状', color: TYPE_COLORS.symptom },
        { type: 'disease', label: '疾病', color: TYPE_COLORS.disease },
        { type: 'test', label: '检查/检验', color: TYPE_COLORS.test }
      ]
    },
    filteredNodes() {
      return this.graphData.nodes.filter(node => this.localFilters.nodeTypes.includes(node.type))
    },
    nodePositions() {
      const positions = {}
      const grouped = this.groupNodesByType(this.filteredNodes)
      const layerX = {
        symptom: 160,
        disease: 400,
        test: 640,
        sign: 520
      }
      Object.keys(grouped).forEach(type => {
        const nodes = grouped[type]
        const gap = 360 / (nodes.length + 1)
        nodes.forEach((node, index) => {
          positions[node.id] = {
            x: layerX[type] || 400,
            y: 60 + gap * (index + 1)
          }
        })
      })
      return positions
    },
    visibleEdges() {
      return this.graphData.edges.filter(edge => {
        const sourceNode = this.graphData.nodes.find(node => node.id === edge.source)
        const targetNode = this.graphData.nodes.find(node => node.id === edge.target)
        if (!sourceNode || !targetNode) return false
        const sourceIncluded = this.localFilters.nodeTypes.includes(sourceNode.type)
        const targetIncluded = this.localFilters.nodeTypes.includes(targetNode.type)
        return sourceIncluded && targetIncluded && edge.weight >= this.localFilters.threshold
      })
    },
    visibleNodes() {
      const nodeIds = new Set()
      this.visibleEdges.forEach(edge => {
        nodeIds.add(edge.source)
        nodeIds.add(edge.target)
      })
      return this.filteredNodes.filter(node => nodeIds.has(node.id))
    }
  },
  watch: {
    filters: {
      handler(val) {
        this.localFilters = { ...val }
      },
      deep: true
    },
    localFilters: {
      handler() {
        this.emitFilters()
      },
      deep: true
    }
  },
  methods: {
    groupNodesByType(nodes) {
      return nodes.reduce((acc, node) => {
        if (!acc[node.type]) acc[node.type] = []
        acc[node.type].push(node)
        return acc
      }, {})
    },
    nodeColor(node) {
      return TYPE_COLORS[node.type] || '#909399'
    },
    edgeColor(edge) {
      const targetNode = this.graphData.nodes.find(item => item.id === edge.target)
      return targetNode ? this.nodeColor(targetNode) : '#C0C4CC'
    },
    radius(node) {
      return 18 + (node.value || 0.3) * 8
    },
    handleNodeClick(node) {
      this.$emit('node-select', node)
    },
    emitFilters() {
      this.$emit('filters-change', { ...this.localFilters })
    }
  }
})
</script>

<style scoped lang="scss">
.graph-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 12px;

  .graph-controls {
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: #f8fafc;
    border-radius: 8px;
    padding: 12px 16px;

    .control-row {
      display: flex;
      align-items: center;
      gap: 12px;

      .label {
        flex: 0 0 80px;
        font-size: 13px;
        color: #606266;
      }

      :deep(.el-slider__runway) {
        margin-right: 12px;
      }
    }
  }

  .graph-canvas {
    flex: 1;
    position: relative;
    background: linear-gradient(180deg, #ffffff 0%, #f5f7fa 100%);
    border-radius: 12px;
    border: 1px solid #ebeef5;
    overflow: hidden;

    svg {
      width: 100%;
      height: 100%;
    }

    .node {
      cursor: pointer;
      transition: transform 0.2s ease;

      &:hover {
        transform: scale(1.05);
      }

      .label {
        font-size: 12px;
        text-anchor: middle;
        fill: #303133;
        font-weight: 600;
      }
    }
  }

  .legend {
    display: flex;
    gap: 16px;
    justify-content: flex-end;
    font-size: 12px;
    color: #606266;

    .legend-item {
      display: flex;
      align-items: center;
      gap: 6px;

      .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
      }
    }
  }
}
</style>
