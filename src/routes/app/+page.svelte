<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import Task from './Task.svelte';
	import StartingTime from './StartingTime.svelte';
	import Input from '../../components/ui/Input.svelte';
	import { UTCToTotalMinutes, format } from '../../util';
	import Cookies from 'js-cookie';
	type ErrorPortion = 'name' | 'duration' | '';
	let name = '';
	let duration: number | null = null;
	let errorText = '';
	let errorPortion: ErrorPortion = '';
	let copied = false,
		copiedJSON = false;
	let grabbing = false;
	let containerWidth: number;
	let startTime = Date.now();
	let use24HourTime = Cookies.get('use24HourFormat') === 'true';

	// Update start time every second...
	const startTimeInterval = setInterval(() => {
		startTime = Date.now();
	}, 1000);
	// ... until first task is appended...
	$: tasks[0] && clearInterval(startTimeInterval);
	// ...or component is destroyed
	onDestroy(() => {
		clearInterval(startTimeInterval);
	});

	let tasks: App.Task[] = [];

	function addTask() {
		copied = false;
		copiedJSON = false;
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
		if (duration % 1 !== 0) {
			errorText = 'Duration cannot include a decimal.';
			errorPortion = 'duration';
			return;
		}
		// Success, push to tasks
		const begin = tasks.length > 0 ? tasks[tasks.length - 1].end : UTCToTotalMinutes(startTime);
		const end = (begin + duration) % 1440;
		// const id = Date.now();
		tasks.push({ name, begin, end, duration });
		tasks = tasks;
		name = '';
		duration = null;
		console.log(tasks);
	}
	function popTask() {
		tasks.pop();
		tasks = tasks;
	}

	function copySchedule() {
		let text = '';
		for (const { name, begin, end, duration } of tasks) {
			const plural = !(duration === 1) ? 's' : '';
			text += `${format(begin, use24HourTime)} – ${format(
				end,
				use24HourTime
			)} (${duration} min${plural}): ${name}\n`;
		}
		navigator.clipboard.writeText(text);
		copiedJSON = false;
		copied = true;
	}
	function copyJSON() {
		navigator.clipboard.writeText(JSON.stringify(tasks));
		copiedJSON = true;
		copied = false;
	}
	function handleGrab(event: CustomEvent<number>) {
		grabbing = true;
	}

	function handleRelease(event: CustomEvent<number>) {
		grabbing = false;
	}
	function save24HourTime() {
		Cookies.set('use24HourFormat', use24HourTime.toString());
	}
</script>

<main class="grid grid-cols-2 gap-4 justify-center w-full h-screen bg-[#101010]">
	<div class="flex flex-col items-center w-full h-full p-4 space-y-3">
		<div class="flex-1 flex justify-end flex-col">
			{#if !tasks[0]}
				<div>
					<p class="text-xl">
						Initial Start Time: {format(UTCToTotalMinutes(startTime), use24HourTime)}
					</p>
				</div>
			{/if}
			<div>
				<p class="text-xl">
					Next Start Time: {format(
						(tasks[tasks.length - 1]?.end || UTCToTotalMinutes(startTime)) + (duration || 0),
						use24HourTime
					)}
				</p>
			</div>
		</div>
		<div class="max-w-xl grid grid-cols-4 w-full gap-2">
			<div class="col-span-3 p-2">
				<Input type="text" bind:value={name} placeholder="Name" />
			</div>
			<div class="col-span-1 p-2">
				<Input type="number" unit="min" absolute={true} bind:value={duration} placeholder="Dur." />
			</div>
		</div>
		<div class="grid grid-cols-2 w-full max-w-xl gap-4">
			<button
				class="rounded text-lg font-bold transition duration-75 hover:bg-gray-800 bg-gray-900 p-2 border-2 border-gray-800"
				on:click={addTask}>Add task</button
			>
			<button
				disabled={tasks.length === 0}
				class="rounded disabled:opacity-50 text-lg font-bold transition duration-75 enabled:hover:bg-gray-800 bg-gray-900 p-2 border-2 border-gray-800"
				on:click={popTask}>Delete last task</button
			>
		</div>
		<button
			on:click={copySchedule}
			class="w-full max-w-xl col-span-4 rounded text-lg font-bold transition duration-75 hover:bg-gray-800 bg-gray-900 p-2 border-2 border-gray-800"
			>{copied ? 'Copied!' : 'Copy schedule to text'}</button
		>
		<button
			on:click={copyJSON}
			class="w-full max-w-xl col-span-4 rounded text-lg font-bold transition duration-75 hover:bg-gray-800 bg-gray-900 p-2 border-2 border-gray-800"
			>{copiedJSON ? 'Copied!' : 'Copy schedule to JSON'}</button
		>
		<div class="form-control w-48">
			<label class="cursor-pointer label">
				<span class="label-text">Use 24-hour time</span>
				<input
					type="checkbox"
					class="toggle toggle-info"
					bind:checked={use24HourTime}
					on:change={save24HourTime}
				/>
			</label>
		</div>
		<div class="flex-1">
			<p class="text-sm !text-red-600 font-bold">{errorText}</p>
		</div>
	</div>
	<div class="overflow-y-auto h-auto w-full" bind:clientWidth={containerWidth}>
		{#each tasks as task}
			<Task
				{task}
				{containerWidth}
				on:grab={handleGrab}
				on:release={handleRelease}
				{use24HourTime}
			/>{/each}
	</div>
</main>

<style>
	* {
		color: rgb(226, 226, 226);
	}
</style>
