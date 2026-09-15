> **Note:** Snapshot of untested capability gaps at the tip of `test/strengthen-dialog-calendar-presence`; will age as coverage lands and `main` moves.

# Destyler 未测能力表（Untested Capability Table）

**Repo:** `destyler/destyler`  
**Tip:** `47922a20e7a427a2acf474bbf684416b84170078`（`test/strengthen-dialog-calendar-presence`；尚未合入 `main` @ `4518b55`）  
**Local tree:** `/workspace/destyler-pr101`  
**Date:** 2026-09-15（Asia/Shanghai）  
**Method:** 对照 `packages/components/<name>/src/types.ts` + `props.ts` + machine defaults / connect 行为，与现有 `test/*.spec.ts`|`*.test.ts` 的 `describe`/`it` 覆盖；仅列 machine 已存在的能力缺口（非臆测功能）。

---

## Strategy gaps（横切）

| Gap | 说明 |
| --- | --- |
| **Vanilla-only host** | 几乎所有 browser spec 只 `import { render } from '../examples/vanilla/…'`；`examples/{react,vue,solid,svelte,lit}` 存在但无 `*.browser.spec` canary。 |
| **Chromium-only** | `vitest.browser.config.ts` 仅启用 `{ browser: 'chromium' }`；firefox/webkit 注释掉。 |
| **缺 connect / machine 单测** | 除 `presence/test/presence.test.ts`（node machine+connect）外，深扫组件几乎没有 node 层 connect/props 断言；ARIA/`data-*` 回归全靠 browser E2E。 |
| **无 framework canary** | `vitest.browser.config.ts` include 了 `react|vue|solid|svelte.browser.spec`，仓库内 **0** 个匹配文件 → 适配层零冒烟。 |
| **Controls 与 prop 名漂移** | 例：`popoverControls.closeOnEsc` vs machine `closeOnEscape` → 控制面板开关可能根本进不了 context（本身也未测）。 |
| **Collapse 用例命名/断言错位** | `collapsible` control 默认 `true`，但有用例标题写 “should not close”；`multiple=true` 标题写 “should close the previous” 却断言两者都开。覆盖语义需重写，勿只加断言。 |

---

## Deep pass

| Component | Covered now (brief) | Untested / weak | Priority | Suggested test type |
| --- | --- | --- | --- | --- |
| **calendar** | Trigger 打开 / `data-state=open`；日格子可见；点选更新 selected + clear；Escape 关闭 | **P0** `selectionMode`=`range`/`multiple`（含 hover range、`aria-multiselectable`）；表格键盘 `Arrow*` / `PageUp|Down` / `Home|End`；`view` month/year + viewTrigger/prev/next。**P1** `min`/`max`、`isDateUnavailable`（`data-unavailable`）、`closeOnSelect=false`、`disabled`/`readOnly`、`numOfMonths`、`open`/`open.controlled`。**P2** `startOfWeek`、`fixedWeeks`、自定义 `format`/`parse`、`translations`、presetTrigger、input `fixOnBlur`、positioning | P0 | browser vanilla（主）+ node connect（cell state / aria） |
| **menu** | 点击开关；Escape / outside click；`closeOnSelect` true/false；ArrowUp/Down 打开并高亮；`loopFocus`；typeahead；Enter 选中 | **P0** submenu（`setParent`/`setChild` / triggerItem）；context menu（`getContextTriggerProps` + `anchorPoint`）；`getOptionItemProps` checkbox/radio + `onCheckedChange`。**P1** `typeahead=false`、`composite=false`（`role`/`aria-haspopup`）、`navigate` 锚点、`disabled` item、`onSelect`/`onHighlightChange`。**P2** `reposition`、`aria-label`、`open.controlled`、positioning | P0 | both |
| **scroll-area** | root/viewport/content/scrollbar/thumb 渲染与 `data-scope`/`data-part`；virtual 列表节点 smoke | **P0** `type`=`auto`/`always`/`scroll`/`hover` 显隐；thumb 拖拽改 `scrollTop`/`scrollLeft`；`onScroll`。**P1** `scrollTo` / `scrollToIndex` / `measureItem`；`scrollHideDelay`；`dir=rtl`。**P2** corner（双轴 overflow）；virtual `onRangeChange` / 动态 `itemSize` | P0 | browser vanilla |
| **dialog** | 打开聚焦首可聚焦 + Escape 回 trigger；content `data-state`；默认/`modal=false` 的 `aria-modal`；close trigger；`aria-expanded`；`closeOnInteractOutside`；`closeOnEscape=false` | **P0** `role=alertdialog`；`trapFocus=false`；`preventScroll` 行为断言。**P1** `initialFocusEl` / `finalFocusEl` / `restoreFocus`；`modal=false` 时无 pointer block / 下方不 `aria-hidden`。**P2** `persistentElements`；dismiss handlers（`onEscapeKeyDown`/`onInteractOutside`）；`aria-label`；`open.controlled` | P0 | browser vanilla（主）+ 少量 node connect |
| **presence** | node：`present` 启停；无动画立即 unmount + `onExitComplete`；`unmount()`；`setNode`；flip 后 `skip=false` | **P0** `unmountSuspended`：真实 animation → `animationend`/`animationcancel`。**P1** `immediate=false`（rAF 路径）；`ANIMATION_DURATION` 超时兜底；`skip=true`（`!initial && present`）。**P2** `visibilityState=hidden` 强制 UNMOUNT | P0 | node connect（已有基线，继续加厚） |
| **checkbox** | unchecked→checked 点击切换；Tab focus + Space；`disabled` attrs/不可聚焦；`readOnly` 不切换 | **P0** `checked='indeterminate'` → `data-state=indeterminate` + hidden input `.indeterminate`。**P1** `invalid`/`required`（`data-invalid`/`aria-invalid`/`required`）；hidden input `name`/`value`/`form`；fieldset → `fieldsetDisabled`。**P2** `setChecked` / `toggleChecked` API | P0 | both |
| **switch** | 同 checkbox 的 click/Space/disabled/readOnly/`data-state` | **P0** `invalid`/`required`（`data-invalid`/`aria-invalid`）。**P1** `name`/`value`/`form`；fieldsetDisabled；`label` a11y 字符串。**P2** `setChecked` API | P0 | both |
| **radio** | `role=radiogroup` + `aria-orientation`；click 选中；clear；Space；group `disabled`；`readOnly` 仍可聚焦；箭头切换；已选项 Tab 聚焦 | **P0** item `invalid`；`orientation=horizontal`（Left/Right + indicator 轴向）。**P1** hidden input `name`/`form`；单 item `disabled`（非整组）；indicator rect / transition。**P2** `setValue` API；ssr 分支 | P0 | browser vanilla |
| **tooltip** | hover 打开；`aria-describedby`；同时仅一个打开（store）；focus/blur；Escape | **P0** `interactive=true`（content 可悬停保持）；`disabled`；`openDelay`/`closeDelay`。**P1** `closeOnPointerDown`/`closeOnScroll`/`closeOnClick`/`closeOnEscape`=false。**P2** `open.controlled`；`reposition`；`aria-label` | P0 | browser vanilla |
| **hover-card** | 默认隐藏；hover/focus 打开；blur 关闭；指针打开后 blur 仍开；trigger→content 移动保持；离开 content 关闭 | **P0** `openDelay`/`closeDelay` 时序。**P1** `open`/`open.controlled`。**P2** `reposition` / positioning（无 Escape 关闭逻辑，勿造缺口） | P1 | browser vanilla |
| **popover** | 开关 `aria-expanded`/`data-state`；`autoFocus` true/false；Enter/Escape；modal Tab trap；non-modal Tab/Shift-Tab；close trigger；trigger click；外部可聚焦不回焦 | **P0** `portalled=false`（挂载父节点 / tab 代理）；`closeOnEscape=false`（且修 controls `closeOnEsc`→`closeOnEscape`）。**P1** `initialFocusEl`；`closeOnInteractOutside=false`；`persistentElements`。**P2** `open.controlled`；title/description `aria-labelledby`/`aria-describedby`；`reposition` | P0 | browser vanilla |
| **collapsible** | 默认 closed；click / Enter / Space 打开；程序化 open/close；关闭时 content 不可 Tab；`disabled` | **P0** `onExitComplete`（有/无 exit animation 的 `closing`→`closed`）。**P1** `open.controlled`；`dir`；`measureSize`。**P2** CSS 宽高 CSS vars（`--height`/`--width`） | P1 | both |
| **collapse** | 单选：Arrow/Home/End 焦点；展开 `aria-expanded`；另项互斥；`multiple=true` 可同时开 + 键盘 | **P0** **`collapsible=false`**（机默认：已开项不可再关）— 现 control 默认 `true` 且用例标题/断言错位，需重写。**P1** `orientation=horizontal`（`ArrowLeft`/`ArrowRight`）；group/item `disabled`；`onValueChange`/`onFocusChange`。**P2** indicator props | P0 | browser vanilla |
| **toggle** | single：`radiogroup`/`aria-checked`；click 选/取消；Space；multiple：`aria-pressed`；`disabled` | **P0** 键盘 roving：`Arrow*` / `Home`/`End` + `loopFocus`。**P1** `rovingFocus=false`；`orientation=vertical`；toolbar 内 `isWithinToolbar`（`currentLoopFocus`）。**P2** `onValueChange`；`setValue` API | P0 | browser vanilla |

---

## Skim pass

| Component | Gap summary | Priority |
| --- | --- | --- |
| **aspect-ratio** | 仅 “renders correctly”；未测 `ratio` / `setRatio` 与 style 输出。作 smoke 可接受，补 1 条即可。 | P2 |
| **image** | 仅 render smoke；未测 `loading`→`loaded`/`error` 与 `onStatusChange`。 | P1 |
| **slider** | 键盘/拖拽主路径有；弱：`disabled`/`readOnly`/`invalid`、多 thumb、`orientation=vertical`、`origin`/`thumbAlignment`、`dir=rtl`、form `name`。 | P1 |
| **color-picker** | 输入/打开/色相 alpha/键盘焦点有；弱：`disabled`/`readOnly`/`required`/`invalid`、`closeOnSelect`、`format` 切换、controlled `open`。 | P1 |
| **file-upload** | 选/删/拖放/`maxFiles`/`accept`/`disabled` 有；弱：`validate` reject、`maxFileSize`/`minFileSize`、`directory`/`capture`、`required`/`invalid`、`preventDocumentDrop`。 | P1 |
| **floating-panel** | open/esc/min/max/箭头/`persistRect`/`resizable`/`draggable` 有；弱：`lockAspectRatio`、`minSize`/`maxSize`/`gridSize`、`strategy`、`getBoundaryEl`、`disabled`。 | P2 |
| **toast** | create/success/close/dismissAll/`max`/promise 有；弱：`placement`/`overlap`/`pauseOnPageIdle`/`duration`/`removeDelay`、action button、`onStatusChange`。 | P1 |
| **timer** | countdown/autoStart/pause/resume/reset 有；弱：非 countdown、`targetMs`、`interval`、`onComplete`/`onTick` 断言精度。 | P2 |
| **signature** | draw/clear/`disabled`/`readOnly` 有；弱：`drawing.size`/`simulatePressure`、`required`/`name`、`onDraw`/`onDrawEnd`。 | P2 |
| **edit** | focus/blur/commit/esc/`maxLength`/`activationMode` 有；弱：`submitMode` 矩阵、`edit.controlled`、`invalid`/`required`、`finalFocusEl`、`autoResize`。 | P1 |
| **otp-input** | type/backspace/arrow/paste/clear 有；弱：`mask`/`otp`/`blurOnComplete`/`type` 变体、`invalid`/`required`/`readOnly`、`onValueComplete`/`onValueInvalid`。 | P1 |
| **steps** | linear/jump/next-prev/orientation/indicator 有；弱：`onStepComplete`、越界 `step`、`count` 动态。 | P2 |
| **tabs** | automatic/manual/Home/End/`loopFocus`/`deselectable` 有；弱：`orientation=vertical`、`dir=rtl`、`composite`、`navigate`。 | P1 |
| **carousel** | autoplay/indicator/scroll/loop/next-prev 有；弱：`slidesPerPage`/`slidesPerMove`、`allowMouseDrag`、`orientation`、`snapType`。 | P1 |
| **qr-code** | value/ecc/boostEcc/download 有；弱：`onValueChange`、错误空值。 | P2 |
| **pagination** | page/next/prev/current 有；弱：`siblingCount` 省略号、`pageSize`/`onPageSizeChange`、`type`（button/link）。 | P1 |
| **clipboard** | copy click/Enter/copy event 有；弱：`timeout` 复位、`onStatusChange` 失败路径。 | P2 |
| **breadcrumbs** | nav 语义/current/separator/`data-hover`/`data-focus` 有；弱：动态 `items`、自定义 separator。 | P2 |
| **progress** | determinate/indeterminate/clamp/dir/circular zero 有；弱：`translations`、`onValueChange`、`min`≠0。 | P2 |
| **splitter** | 渲染/orientation/dir/箭头/HomeEnd/Enter 有；弱：多 panel、`onSizeChangeEnd`、键盘以外拖拽精度。 | P2 |
| **number-input** | clamp/箭头/home-end/shift-ctrl/inc-dec 有；弱：`disabled`/`readOnly`/`invalid`/`required`、`allowMouseWheel`、`formatOptions`/`locale`、`spinOnPress`。 | P1 |
| **select** | 开关/导航/typeahead/loop/escape/enter/`closeOnSelect`/outside 等厚；弱：`multiple`、`readOnly`、`invalid`/`required`、`dir=rtl`、form `name`。 | P1 |
| **combobox** | 打开/键盘 loop/selectionBehavior/clear/custom enter 厚；弱：`multiple`、`disabled`/`readOnly`/`invalid`、`allowCustomValue` 全矩阵、`openOnKeyPress=false`。 | P1 |
| **tree** | expand/select/键盘/typeahead 很厚；弱：`dir=rtl`、`expandOnClick=false`、受控 `expandedValue`/`selectedValue`。 | P2 |
| **navigation-menu** | click/hover/键盘/content 厚；弱：`disableClickTrigger`/`disableHoverTrigger`/`disablePointerLeaveClose`、`orientation=vertical`、受控 `value`。 | P1 |
| **dynamic** | add/delete/edit/paste/`addOnPaste` 厚；弱：`max`/`allowOverflow`/`validate`、`blurBehavior`、`invalid`/`required`、`delimiter`。 | P1 |
| **tour** | start/esc/steps/spotlight/keyboard/outside/`preventInteraction` 有；弱：`spotlightOffset`/`spotlightRadius`、自定义 `translations`、多 target step 边角。 | P2 |

---

## Recommended next PR waves（ordered）

### Wave 1 — Dialog / Presence / Calendar 收口（延续 strengthen 分支）
1. **dialog:** `role=alertdialog`；`trapFocus=false`；`preventScroll` 行为；`initialFocusEl`/`finalFocusEl`
2. **presence:** `unmountSuspended` + `animationend`；`immediate=false`；timeout fallback
3. **calendar:** `selectionMode=range|multiple`；表格键盘导航；month/year view

### Wave 2 — Overlay 家族（menu / popover / tooltip）
1. **menu:** submenu；context menu；optionItem checkbox/radio
2. **popover:** `portalled=false`；修 `closeOnEsc`→`closeOnEscape` 并测 false；`initialFocusEl`
3. **tooltip:** `interactive`；`disabled`；delay；`closeOnPointerDown|Scroll|Click=false`

### Wave 3 — Form controls 补全（checkbox / switch / radio）+ toggle 键盘
1. **checkbox:** `indeterminate`；`invalid`/`required`；`name`/`value`/`form`
2. **switch:** `invalid`/`required`；form attrs
3. **radio:** item `invalid`；`orientation=horizontal`；**toggle:** roving `Arrow*`/`loopFocus`/`rovingFocus=false`

### Wave 4 — Scroll-area 行为化 + Collapse 正确性
1. **scroll-area:** `type` 显隐矩阵；thumb drag；`onScroll`；`scrollTo`/`scrollToIndex`
2. **collapse:** 重写 `collapsible=false` / `multiple` 用例（修标题与断言）；`orientation=horizontal`；disabled item
3. **collapsible:** `onExitComplete` + closing animation；`open.controlled`

### Wave 5 — Skim P1 扫射 + 策略基建
1. **image** status；**select/combobox** `multiple`+`readOnly`；**tabs** vertical/rtl；**pagination** siblingCount；**otp-input**/`edit`/`number-input` 校验态
2. 加 **1 个 framework canary**（任选 dialog 或 checkbox 的 `react.browser.spec` + `vue.browser.spec`）
3. 为 calendar/menu 补 **node connect** 抽样（cell/option state），降低纯 Chromium E2E 依赖

---

## Notes for implementers

- 优先测 **types/machine 已声明** 的 props；不要为 demo-only UI 写测试。
- Browser 用例继续挂 vanilla example + `testHook`；新 prop 先确认 `shared/src/controls.ts` 键名与 machine 一致。
- Presence 保持 **node** 单测风格；动画路径可用 jsdom + stub `getComputedStyle` / 派发 `AnimationEvent`。
- 合入 `main` 前以 tip `47922a20` 为准；若已 merge，以 `main` HEAD 复跑本表（dialog `aria-modal` 已在 strengthen 覆盖）。
