<script lang="ts">
	export let placeholder: string | undefined = undefined;
	import { fade } from 'svelte/transition';
	export let type: 'text' | 'number';
	export let value: any;
	export let unit: string | undefined = undefined; // TODO: Implement.
	export let absolute: boolean = false;
	let isFocused = false;
	const onFocus = () => (isFocused = true);
	const onBlur = () => (isFocused = false);
</script>

{#if type === 'text'}
	<input
		bind:value
		class="text-lg bg-transparent w-full {isFocused
			? 'placeholder:text-slate-100 text-slate-100'
			: 'placeholder:text-slate-400 text-slate-300'}"
		{placeholder}
		type="text"
		on:focus={onFocus}
		on:blur={onBlur}
	/>
	<div class="h-1.5">
		<div
			class="mt-1 transition-all duration-200 {isFocused
				? 'bg-gray-600 w-full h-1.5 ml-0'
				: value !== ''
				? 'bg-gray-800 w-full h-1'
				: 'bg-gray-800 w-1/4 h-1.5 ml-1'}"
		/>
	</div>
{:else if type === 'number'}
	<div class="flex">
		<input
			bind:value
			class="text-lg bg-transparent w-full {unit && 'pr-11'} {isFocused
				? 'placeholder:text-slate-100 text-slate-100'
				: 'placeholder:text-slate-400 text-slate-300'}"
			{placeholder}
			type="number"
			on:focus={onFocus}
			on:blur={onBlur}
			min={absolute ? '0' : undefined}
		/>
		{#if unit && (isFocused || value)}
			<p
				transition:fade={{ duration: 150 }}
				class="whitespace-nowrap overflow-hidden -ml-10 mt-0.5 text-slate-400"
			>
				{unit}
			</p>{/if}
	</div>
	<div class="h-1.5">
		<div
			class="mt-1 transition-all duration-200 {isFocused
				? 'bg-gray-600 w-full h-1.5 ml-0'
				: value !== null
				? 'bg-gray-800 w-full h-1'
				: 'bg-gray-800 w-1/4 h-1.5 ml-1'}"
		/>
	</div>
{/if}
