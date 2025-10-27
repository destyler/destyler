<script lang="ts">

</script>

<div class="layout">
  <main class="layout-root">
    <slot />
  </main>
</div>

<style lang="css">
.layout{
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.layout-root {
  flex: auto;
  display: flex;
  gap: 10px;
  position: relative;
  flex-direction: column;
  align-items: flex-start;
  padding: 40px;
  overflow-y: auto;
}
</style>
