<script lang="ts">

</script>

<div data-story="book" class="layout">
  <main class="layout-root">
    <slot />
  </main>
</div>

<style lang="css">
.layout{
  --toolbar-width: 400px;
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
  padding-right: calc(40px + var(--toolbar-width, 400px));
  overflow-y: auto;
}
</style>
