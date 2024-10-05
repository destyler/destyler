<script setup lang="ts">

</script>

<template>
  <pre class="shiki vp-code rounded-lg border border-input dark:[background-color:#121212] [background-color:#f8f8f8]" tabindex="0"><code><span class="line"><span style="color:#666666;">&lt;</span><span style="color:#4D9375;">script</span><span style="color:#BD976A;"> setup</span><span style="color:#BD976A;"> lang</span><span style="color:#666666;">=</span><span style="color:#C98A7D77;">"</span><span style="color:#C98A7D;">ts</span><span style="color:#C98A7D77;">"</span><span style="color:#666666;">&gt;</span></span>
<span class="line"><span style="color:#CB7676;">  const </span><span style="color:#BD976A;">controlRef</span><span style="color:#666666;"> =</span><span style="color:#80A665;"> ref</span><span style="color:#666666;">(</span><span style="color:#C98A7D77;">'</span><span style="color:#C98A7D;">item-1</span><span style="color:#C98A7D77;">'</span><span style="color:#666666;">)</span></span>
<span class="line"><span style="color:#666666;">&lt;/</span><span style="color:#4D9375;">script</span><span style="color:#666666;">&gt;</span></span>
<span class="line" />
<span class="line"><span style="color:#666666;">&lt;</span><span style="color:#4D9375;">template</span><span style="color:#666666;">&gt;</span></span>
<span class="line"><span style="color:#666666;">  &lt;</span><span style="color:#4D9375;">CollapseRoot</span><span style="color:#80A665;"> v-model</span><span style="color:#666666;">=</span><span style="color:#666666;">"</span><span style="color:#BD976A;">controlRef</span><span style="color:#666666;">"</span><span style="color:#666666;">&gt;</span></span>
<span class="line"><span style="color:#758575DD;">    &lt;!-- css --&gt;</span></span>
<span class="line"><span style="color:#666666;">    &lt;</span><span style="color:#4D9375;">CollapseItem</span><span style="color:#BD976A;"> class</span><span style="color:#666666;">=</span><span style="color:#C98A7D77;">"</span><span style="color:#C98A7D;">CollapseItem</span><span style="color:#C98A7D77;">"</span><span style="color:#BD976A;"> value</span><span style="color:#666666;">=</span><span style="color:#C98A7D77;">"</span><span style="color:#C98A7D;">item-1</span><span style="color:#C98A7D77;">"</span><span style="color:#666666;"> /&gt;</span></span>
<span class="line"><span style="color:#758575DD;">    &lt;!-- atomic css --&gt;</span></span>
<span class="line"><span style="color:#666666;">    &lt;</span><span style="color:#4D9375;">CollapseItem</span><span style="color:#BD976A;"> class</span><span style="color:#666666;">=</span><span style="color:#C98A7D77;">"</span><span style="color:#C98A7D;">bg-white px-4 py-2</span><span style="color:#C98A7D77;">"</span><span style="color:#BD976A;">  value</span><span style="color:#666666;">=</span><span style="color:#C98A7D77;">"</span><span style="color:#C98A7D;">item-2</span><span style="color:#C98A7D77;">"</span><span style="color:#666666;"> /&gt;</span></span>
<span class="line"><span style="color:#666666;">  &lt;/</span><span style="color:#4D9375;">CollapseRoot</span><span style="color:#666666;">&gt;</span></span>
<span class="line"><span style="color:#666666;">&lt;/</span><span style="color:#4D9375;">template</span><span style="color:#666666;">&gt;</span></span>
<span class="line" />
<span class="line"><span style="color:#666666;">&lt;</span><span style="color:#4D9375;">style</span><span style="color:#BD976A;"> scoped</span><span style="color:#666666;">&gt;</span></span>
<span class="line"><span style="color:#666666;">.</span><span style="color:#BD976A;">CollapseItem</span><span style="color:#666666;"> {</span></span>
<span class="line"><span style="color:#B8A965;">  background-color</span><span style="color:#666666;">:</span><span style="color:#C99076;"> white</span><span style="color:#666666;">;</span></span>
<span class="line"><span style="color:#B8A965;">  padding</span><span style="color:#666666;">:</span><span style="color:#4C9A91;"> 0.5</span><span style="color:#CB7676;">rem</span><span style="color:#4C9A91;"> 1</span><span style="color:#CB7676;">rem</span><span style="color:#666666;">;</span></span>
<span class="line"><span style="color:#666666;">}</span></span>
<span class="line"><span style="color:#666666;">&lt;/</span><span style="color:#4D9375;">style</span><span style="color:#666666;">&gt;</span></span></code></pre>
</template>
