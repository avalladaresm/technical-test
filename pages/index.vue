<script setup>
  const { data: tasks, refresh } = await useFetch('/api/task', { key: "tasks" })
  const newTask = ref('')
  const isCompleting = ref(false)
  const isCompletingUuid = ref("")
  const isDeleting = ref(false)
  const isDeletingUuid = ref("")
  const isAdding = ref(false)

  async function addTask() {
    isAdding.value = true
    await useFetch('/api/create', { method: "post", body: [{
      "title": newTask.value,
      "completed": false
    }],
    async onResponse() {
      await refreshNuxtData("tasks")
      newTask.value = ""
      isAdding.value = false
    }})
  }

  async function completeTask(todo) {
    isCompleting.value = true
    isCompletingUuid.value = todo._uuid
    await useFetch('/api/task', { method: "put", body: [{
      "_uuid": todo._uuid,
      "completed": true
    }],
    async onResponse() {
      isCompleting.value = false
      isCompletingUuid.value = ""
      await refreshNuxtData("tasks")
    }})
  }

  async function deleteTask(uuid) {
    isDeleting.value = true
    isDeletingUuid.value = uuid
    await useFetch('/api/task', { method: "delete", body: { uuid },
    async onResponse() {
      isDeleting.value = false
      isDeletingUuid.value = ""
      await refreshNuxtData("tasks")
    }})
  }

  useHead({ title: 'Technical test' })

  watchEffect(() => {
    refresh();
  });
</script>

<template>
  <div class="tasks-app-container">
    <h1>Tasks App</h1>
    <form @submit.prevent="addTask()">
      <label>New task </label>
      <input v-model="newTask" name="newTask" autocomplete="off" />
      <button type="submit" :disabled="newTask.length <= 0" >{{ isAdding ? "Adding task..." : "Add" }}</button>
    </form>
    
    <h2>Task List</h2>
    <ul>
      <li v-for="(task, index) in tasks || []" :key="index" v-bind:key="task._uuid">
        <span :class="task.completed ? 'completed-task': '' ">{{ task.title }}</span>
        <div class="action-buttons">
          <button class="complete" @click="completeTask(task)" v-if="!task.completed">{{ isCompleting && isCompletingUuid === task._uuid ? "Completing..." : "Complete" }}</button>
          <button class="delete" @click="deleteTask(task._uuid)">{{ isDeleting && isDeletingUuid === task._uuid ? "Deleting..." : "Delete" }}</button>
        </div>
      </li>
    </ul>

    <h4 v-if="Object.keys(tasks || {}).length === 0">No tasks found</h4>
  </div>
</template>

<style lang="scss">
  $border: 2px solid lightgray;
  $borderRadius: 6px;

  .tasks-app-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    h1, h2 {
      color: white;
      text-decoration: underline;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    
    h4 {
      color: white;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    form {
      display: flex;
      flex-direction: column;
      width: 600px;

      label {
        font-size: 14px;
        font-weight: bold;
        color: white;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }

      input,
      button {
        height: 40px;
        box-shadow: none;
        outline: none;
        padding-left: 16px;
        padding-right: 16px;
        border-radius: $borderRadius;
        font-size: 18px;
        margin-top: 8px;
        margin-bottom: 12px;
        color: black;

      }
      input {
        background-color: transparent;
        border: $border;
        color: white;
      }
    }
    button {
      cursor: pointer;
      color: black;
      font-weight: bold;
      outline: none;
      border-radius: $borderRadius;
      
      &:enabled {
        background-color: #DEF2C8;
        border: 1px solid #C5DAC1;
      }

      &:disabled {
        background-color: lightgray;
      }
      
    }

    ul {
      padding: 10px;
      width: 600px;
      li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: $border;
        padding: 12px 24px;
        border-radius: $borderRadius;
        margin-bottom: 12px;
        span {
          color: white;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .completed-task {
          text-decoration: line-through;
          color: lightgrey;
        }

        .action-buttons {
          justify-content: end;
          gap: 10px;

          .complete {
            margin-right: 10px;
            border: 1px solid #C5DAC1;
          }
          .delete {
            background-color: #EC5766;
            border: 1px solid #D91E36;
          }
        }
        button {
          font-size: 12px;
          padding: 6px;
        }
      }
    }
  }
</style>
