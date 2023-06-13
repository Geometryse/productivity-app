<script lang="ts">
	import Task from './Task.svelte';
	import { format } from '../../util';
	type ErrorPortion = 'name' | 'duration' | '';
	let name = '';
	let duration = 0;
	let errorText = '';
	let errorPortion: ErrorPortion = '';
	let copied = false;
	let grabbing = false;
	let containerWidth: number;
	const startTime = Date.now();
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
		// console.log(tasks);
		name = '';
		duration = 0;
	}
	function copySchedule() {
		copied = true;
		let text = '';
		for (const { name, begin, end, duration } of tasks) {
			text += `\n${format(begin)} – ${format(end)} (${duration} mins): ${name}`;
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
	<div class="flex flex-col justify-center items-center w-full h-full">
		<div class="grid grid-cols-4 p-4 max-w-xl gap-2">
			<input
				type="text"
				bind:value={name}
				class="p-2 text-lg rounded border-2 border-gray-800 bg-gray-900 col-span-3 {errorPortion ===
				'name'
					? 'border-red-700 border-2'
					: ''}"
				placeholder="Name"
			/>
			<input
				type="number"
				bind:value={duration}
				class="p-2 text-lg rounded border-2 border-gray-800 bg-gray-900 col-span-1 {errorPortion ===
				'duration'
					? 'border-red-700 border-2'
					: ''}"
				placeholder="Minutes"
			/>
			<!-- <div class="flex-grow grid grid-cols-4" /> -->
			<button
				class="rounded text-lg font-bold transition duration-75 hover:bg-gray-800 bg-gray-900 p-2 border-2 border-gray-800 col-span-4"
				on:click={addTask}>Add Task</button
			>
			<button
				on:click={copySchedule}
				class="my-3 col-span-4 rounded text-lg font-bold transition duration-75 hover:bg-gray-800 bg-gray-900 p-2 border-2 border-gray-800"
				>{copied ? 'Copied!' : 'Copy schedule'}</button
			>
		</div>

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
	input[type='number'] {
		-moz-appearance: textfield;
		appearance: textfield;
	}
</style>
