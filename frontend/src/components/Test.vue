<template>
  <!-- <h1>Test</h1>

  <h1>{{ counter }}</h1>
  <button @click="counter++">+</button>
  <button @click="counter--">-</button>

  <br><br>

  <h1>{{ test }} Nikolic</h1>
  <h1>Upisi tekst</h1>
  <input type="text" v-model="test">
  <br>
  <br>
  <h1>:Value</h1>
  <input type="text" :value="test2">
  <button @click="logName">Prikazi input</button> -->
</template>

<script setup lang="ts">
import { ref } from 'vue';

const counter = ref(0);
const test = ref('');

const test2 = ref('Milan');

function logName(){
    console.log('JS name:', test2.value);
    alert(test2.value);
}
</script>