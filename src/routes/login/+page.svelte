<script lang="ts">
	import AuthButton from '../../components/ui/AuthButton.svelte';
</script>

<!-- 
<svelte:head>
	<script src="https://apis.google.com/js/platform.js" async defer></script>
</svelte:head> -->
<div class="flex justify-center my-20 w-full">
	<div class="flex flex-col w-96 grow-1 bg-gray-300 flex items-center py-10 space-y-5">
		<h1 class="text-5xl my-2">LOG IN</h1>
		<!-- <AuthButton>Login With Google</AuthButton> -->
		<div class="g-signin2" data-onsuccess="onSignIn" />
		what?
		<!-- <AuthButton>Login With Emial</AuthButton> -->
	</div>
</div>
