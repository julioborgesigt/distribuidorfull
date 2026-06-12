<template>
  <div>
    <v-skeleton-loader v-if="loading" height="200" type="image" />
    <Bar
      v-else
      :data="chartData"
      :options="chartOptions"
    />
  </div>
</template>

<script setup>
  import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip,
  } from 'chart.js'
  import { Bar } from 'vue-chartjs'

  ChartJS.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
  )

  defineProps({
    chartData: {
      type: Object,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  })

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  }
</script>
