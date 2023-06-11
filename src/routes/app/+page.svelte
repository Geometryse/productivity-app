<script lang="ts">
	interface Task {
		name: string;
		begin: number;
		end: number;
	}
	type ErrorPortion = 'name' | 'duration' | '';
	let name = '';
	let duration = 0;
	let errorText = '';
	let errorPortion: ErrorPortion = '';

	const startTime = Date.now();
	let tasks: Task[] = [];
	const format = (x: number) => {
		let mm = new Date(x).getMinutes().toString();
		let hh = new Date(x).getHours().toString();
		if (mm.length === 1) mm = '0' + mm;
		if (hh.length === 1) mm = '0' + mm;
		return hh + ':' + mm;
	};

	function addTask() {
		errorText = '';

		// Error Handling
		if (name.length === 0) {
			errorText = 'Name cannot be empty.';
			return;
		}
		if (duration <= 0) {
			errorText = 'Duration must be greater than 0.';
			return;
		}

		// Success, push to tasks
		const begin = tasks[tasks.length - 1] ? tasks[tasks.length - 1].end : startTime;
		const end = begin + duration * 60 * 1000;
		tasks.push({ name, begin, end });
		tasks = tasks;
		name = '';
		duration = 0;
	}
</script>

<main class="grid grid-cols-2 gap-4 justify-center w-full h-screen bg-[#101010]">
	<div class="flex flex-col justify-center items-center w-full h-full">
		<div class="grid grid-cols-4 h-32 p-4 max-w-xl gap-2">
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
		</div>
		<p class="text-sm text-red-600 font-bold">{errorText}</p>
	</div>
	<div class="flex flex-col gap-2 overflow-y-auto w-full">
		{#each tasks as task}
			<div class="flex text-white p-2 gap-4 flex-nowrap">
				<p class="font-bold whitespace-nowrap">
					{format(task.begin)}
					–
					{format(task.end)}
				</p>

				<p>{task.name}</p>
			</div>
		{/each}
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
