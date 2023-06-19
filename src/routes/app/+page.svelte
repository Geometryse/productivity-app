<script lang="ts">
	import { onDestroy } from 'svelte';
	import Task from './Task.svelte';
	import StartingTime from './StartingTime.svelte';
	import Input from '../../components/ui/Input.svelte';
	import { format } from '../../util';
	type ErrorPortion = 'name' | 'duration' | '';
	let name = '';
	let duration: number | null = null;
	let errorText = '';
	let errorPortion: ErrorPortion = '';
	let copied = false;
	let grabbing = false;
	let containerWidth: number;
	let startTime = Date.now();

	// Update start time every second...
	let startTimeInterval = setInterval(() => {
		startTime = Date.now();
	}, 1000);
	// ... until first task is appended...
	$: tasks[0] && clearInterval(startTimeInterval);
	// ...or component is destroyed
	onDestroy(() => {
		clearInterval(startTimeInterval);
	});

	let tasks: App.Task[] = [
		// {
		// 	name: 'Example task',
		// 	begin: 1686487649778,
		// 	end: 1686488849778,
		// 	duration: 20,
		// 	id: 1686487649778
		// },
		// {
		// 	name: 'More tasks',
		// 	begin: 1686488849778,
		// 	end: 1686490649778,
		// 	duration: 30,
		// 	id: 1686488849778
		// },
		// {
		// 	name: 'I love tasks!',
		// 	begin: 1686490649778,
		// 	end: 1686490949778,
		// 	duration: 5,
		// 	id: 1686490649778
		// }
	];

	function addTask() {
		copied = false;
		errorText = '';
		errorPortion = '';
		// Error Handling
		if (name.length === 0) {
			errorText = 'Name cannot be empty.';
			errorPortion = 'name';
			return;
		}
		if (duration === null) {
			errorText = 'Duration cannot be empty and must be a number.';
			errorPortion = 'duration';
			return;
		}
		if (duration <= 0) {
			errorText = 'Duration must be greater than 0.';
			errorPortion = 'duration';
			return;
		}
		if (duration > 1440) {
			errorText = 'Duration cannot be greater than 1440min (1 day).';
			errorPortion = 'duration';
			return;
		}
		// Success, push to tasks
		const begin = tasks[tasks.length - 1] ? tasks[tasks.length - 1].end : startTime;
		const end = begin + duration * 60 * 1000;
		const id = Date.now();
		tasks.push({ name, begin, end, duration, id });
		tasks = tasks;
		name = '';
		duration = null;
	}
	function copySchedule() {
		copied = true;
		let text = '';
		for (const { name, begin, end, duration } of tasks) {
			const plural = !(duration === 1) ? 's' : '';
			text += `${format(begin)} – ${format(end)} (${duration} min${plural}): ${name}\n`;
		}
		navigator.clipboard.writeText(text);
	}

	function handleGrab(event: CustomEvent<number>) {
		grabbing = true;
	}

	function handleRelease(event: CustomEvent<number>) {
		grabbing = false;
	}
</script>

<main class="grid grid-cols-2 gap-4 justify-center w-full h-screen bg-[#101010]">
	<div class="flex flex-col justify-center items-center w-full h-full p-4 space-y-3">
		{#if !tasks[0]}
			<div><p class="text-xl">Initial Start Time: <StartingTime bind:startTime /></p></div>
		{:else}
			<div>
				<p class="text-xl">
					Next Start Time: {format(tasks[tasks.length - 1].end + (duration || 0) * 60 * 1000)}
				</p>
			</div>
		{/if}
		<div class="max-w-xl grid grid-cols-4 w-full gap-2">
			<div class="col-span-3 p-2">
				<Input type="text" bind:value={name} placeholder="Name" />
			</div>
			<div class="col-span-1 p-2">
				<Input type="number" unit="min" absolute={true} bind:value={duration} placeholder="Dur." />
			</div>
		</div>
		<button
			class="w-full max-w-xl rounded text-lg font-bold transition duration-75 hover:bg-gray-800 bg-gray-900 p-2 border-2 border-gray-800 col-span-4"
			on:click={addTask}>Add Task</button
		>
		<button
			on:click={copySchedule}
			class="w-full max-w-xl col-span-4 rounded text-lg font-bold transition duration-75 hover:bg-gray-800 bg-gray-900 p-2 border-2 border-gray-800"
			>{copied ? 'Copied!' : 'Copy schedule'}</button
		>
		<p class="text-sm text-red-600 font-bold">{errorText}</p>
	</div>
	<div
		class="flex flex-col {grabbing ? 'gap-4' : 'gap-2'} overflow-y-auto w-full p-3"
		bind:clientWidth={containerWidth}
	>
		{#each tasks as task (task.id)}
			<!-- <div class="h-2 w-full" />
			<div class="h-2 w-full" />
			<div class="h-2 w-full" /> -->
			<Task {task} {containerWidth} on:grab={handleGrab} on:release={handleRelease} />{/each}
		<!-- <div class="h-2 w-full bg-white" /> -->
	</div>
</main>

<style>
	* {
		color: rgb(226, 226, 226);
	}
</style>
