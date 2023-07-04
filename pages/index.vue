<script setup>
  const { data: _tasks, refresh } = await useFetch('/api/task', {key: "tasks"})
  let tasks = _tasks
  const newTask = ref('')

  async function addTask() {
    await useFetch('/api/create', { method: "post", body: [{
      "title": newTask.value,
      "completed": false
    }],
    async onResponse() {
      await refreshNuxtData("tasks")
    }})
  }

  async function completeTask(todo) {
    await useFetch('/api/task', { method: "put", body: [{
      "_uuid": todo._uuid,
      "completed": true
    }],
    async onResponse() {
      await refreshNuxtData("tasks")
    }})
  }

  async function deleteTask(uuid) {
    await useFetch('/api/task', { method: "delete",body: { uuid }, async onResponse() {
      await refreshNuxtData("tasks")
    }})
  }

  useHead({
    title: 'ToDo App',
    meta: [
      {
        name: 'description',
        content: 'Nuxt 3 ToDo App with Composition API'
      }
    ]
  })

  watchEffect(() => {
    refresh();
  });
</script>

<template>
  <h1>Tasks App</h1>
  <form>
    <label>New task </label>
    <input v-model="newTask" name="newTask" autocomplete="off" />
    <button @click="addTask()">Add</button>
  </form>

  <h2>Task List</h2>
  <ul>
    <li v-for="(task, index) in tasks" :key="index">
      <span>{{ task.completed ? "COMP" : task.title  }}</span>
      <button @click="deleteTask(task._uuid)">Delete</button>
      <button @click="completeTask(task)">Complete</button>
    </li>
  </ul>

  <h4 v-if="Object.keys(tasks).length === 0">No tasks found</h4>
</template>
