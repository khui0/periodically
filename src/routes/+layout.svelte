<script lang="ts">
  import "../app.css";

  import { onMount } from "svelte";
  import { settings } from "$lib/settings";
  import "$lib/theme";
  import { fade } from "svelte/transition";

  import ThemeToggle from "$lib/components/ThemeToggle.svelte";

  import LucideCalendar from "~icons/lucide/calendar";
  import LucideCalendarDays from "~icons/lucide/calendar-days";
  import LucidePlus from "~icons/lucide/plus";
  import LucideCheck from "~icons/lucide/check";
  import LucideTrash from "~icons/lucide/trash";
  import LucideSettings from "~icons/lucide/settings";
  import LucideLogOut from "~icons/lucide/log-out";
  import LucideChevronLeft from "~icons/lucide/chevron-left";
  import LucideChevronRight from "~icons/lucide/chevron-right";

  let { children } = $props();

  let compact: boolean = $state(false);

  onMount(() => {
    compact = $settings.compact === "true";
  });

  $effect(() => {
    $settings.compact = compact ? "true" : "false";
  });
</script>

<svelte:head>
  <title>Periodically 5</title>
</svelte:head>

<div class="flex h-full">
  <div
    class="flex shrink-0 flex-col border-r border-base-200 {compact
      ? 'w-[4rem]'
      : 'w-[12.75rem]'} transition-[width]"
  >
    <header class="flex items-center p-3 {compact ? 'justify-center' : 'justify-between'}">
      {#if !compact}
        <h1
          in:fade={{ duration: 50 }}
          out:fade={{ duration: 50 }}
          class="ml-2 whitespace-nowrap text-xl font-bold"
        >
          Periodically 5
        </h1>
      {/if}
      <label class="btn btn-square btn-ghost swap btn-sm">
        <input type="checkbox" bind:checked={compact} />
        <span class="swap-on">
          <LucideChevronRight></LucideChevronRight>
        </span>
        <span class="swap-off">
          <LucideChevronLeft></LucideChevronLeft>
        </span>
      </label>
    </header>
    <div class="flex flex-1 flex-col">
      <ul class="menu gap-1">
        <li>
          <a href="/" class="whitespace-nowrap">
            <LucideCalendar></LucideCalendar>
            {#if !compact}
              Today
            {/if}
          </a>
        </li>
        <li>
          <a href="/" class="whitespace-nowrap">
            <LucideCalendarDays></LucideCalendarDays>
            {#if !compact}
              Next 7 days
            {/if}
          </a>
        </li>
      </ul>
      <ul class="menu gap-1">
        {#if !compact}
          <li class="menu-title">Lists</li>
        {/if}
        <li>
          <a href="/">
            <span class="text-center text-lg leading-[1rem]">📚</span>
            {#if !compact}
              School
              <span class="badge badge-sm">2</span>
            {/if}
          </a>
        </li>
        <li>
          <a href="/">
            <span class="text-center text-lg leading-[1rem]">🥳</span>
            {#if !compact}
              Personal
              <span class="badge badge-sm">3</span>
            {/if}
          </a>
        </li>
        <li><button class="justify-center"><LucidePlus></LucidePlus></button></li>
      </ul>
      <ul class="menu mt-auto">
        <li>
          <a href="/">
            <LucideCheck></LucideCheck>
            {#if !compact}
              Completed
            {/if}
          </a>
        </li>
        <li>
          <a href="/">
            <LucideTrash></LucideTrash>
            {#if !compact}
              Deleted
            {/if}
          </a>
        </li>
      </ul>
    </div>
    <footer class="grid place-items-center gap-2.5 p-5 {compact ? 'grid-cols-1' : 'grid-cols-3'}">
      <ThemeToggle class="btn btn-square btn-ghost btn-sm"></ThemeToggle>
      <button class="btn btn-square btn-ghost btn-sm">
        <LucideSettings></LucideSettings>
      </button>
      <button class="btn btn-square btn-ghost btn-sm">
        <LucideLogOut></LucideLogOut>
      </button>
    </footer>
  </div>
  <main class="p-5">
    {@render children()}
  </main>
</div>

<style>
  :global(html, body) {
    @apply h-full;
  }
</style>
