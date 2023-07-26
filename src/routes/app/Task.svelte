<script lang="ts">
	import { format } from '../../util';
	import { createEventDispatcher } from 'svelte';

	export let task: App.Task;
	export let containerWidth: number;
	export let use24HourTime: boolean;
	let grabbingthis = false;
	// export let grabbing:boolean
	let x = 0;
	let y = 0;
	const dispatch = createEventDispatcher<{ grab: number; release: number }>();

	function handleMousedown(e: MouseEvent) {
		// Increase task gap; grab task;
		// TODO: rectangular outline on hovered locaiton; thick outline on last location; edit times respectively.
		// ensure "Copy schedule" isn't edited.
		y = e.pageY - 36;
		grabbingthis = true;
		console.log(x, y);
		// dispatch('grab', task.id);

		setTimeout(() => {}, 200);
	}
	function handleMousemove(e: MouseEvent) {
		if (!grabbingthis) return;
		y = e.pageY - 36;
		console.log(x, y);
	}
	function handleMouseup() {
		// Disable outlines; re-enable "Copy scheldule"
		grabbingthis = false;
		// dispatch('release', task.id);
	}
</script>

{#if grabbingthis}
	<div class="h-12 w-full" />
{/if}
<div
	class="flex my-2 items-center rounded-lg text-white gap-3 flex-nowrap bg-gray-900 overflow-hidden transform h-12 transition-transform {grabbingthis
		? 'cursor-grabbing duration-0'
		: ' duration-150 ease-in-out'}"
	style={grabbingthis
		? `position: absolute; --tw-translate-x: ${x - 12}px; --tw-translate-y: ${y}px; width:${
				containerWidth - 24
		  }px; cursor:grabbing!important`
		: ''}
>
	<div
		class="flex bg-gray-800 h-full items-center justify-center"
		style={use24HourTime ? 'width:130px' : 'width: 192px'}
	>
		<!-- <div
			class="p-4 h-12 flex items-center justify-center cursor-grab"
			on:mousedown={handleMousedown}
		>
		<iconify-icon icon="tabler:grip-vertical" /> 
		</div> -->
		<div class="flex items-center h-full cursor-pointer">
			<p class="font-bold whitespace-nowrap px-3">
				{format(task.begin, use24HourTime)} – {format(task.end, use24HourTime)}
			</p>
		</div>
	</div>

	<p class="">{task.name}</p>
</div>
