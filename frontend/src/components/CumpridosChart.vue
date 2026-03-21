<template>
  <div>
    <v-skeleton-loader v-if="loading" type="image" height="200"></v-skeleton-loader>
    <Bar
      v-else
      :data="chartData"
      :options="chartOptions"
    />
  </div>
</template>

<script setup>
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

defineProps({
  chartData: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0 
      }
    }
  }
};
</script>