<script lang="ts">
  import { onMount } from "svelte";
  import { settings } from "$lib/settings";

  import LucideSun from "~icons/lucide/sun";
  import LucideMoon from "~icons/lucide/moon";

  let dark: boolean = $state(false);

  onMount(() => {
    dark = $settings.theme === "dark";
  });

  $effect(() => {
    $settings.theme = dark ? "dark" : "light";
  });

  const props = $props();
</script>

<label class="swap swap-rotate {props.class}">
  <input
    type="checkbox"
    bind:checked={dark}
    oninput={() => {
      dark = !dark;
    }}
  />
  <span class="swap-on">
    <LucideMoon></LucideMoon>
  </span>
  <span class="swap-off">
    <LucideSun></LucideSun>
  </span>
</label>
