<script>
	import '../styles/app.css';
	// import { onMount } from 'svelte';
	// import { initFirebase } from '../lib/firebase';
	// import { auth as authStore } from '../stores/auth';
	// import { onAuthStateChanged } from 'firebase/auth';

	// onMount(initFirebase);
	// onMount(() => {
	// 	const { auth } = initFirebase();
	// 	onAuthStateChanged(auth, authStore.set);
	// });
</script>

<slot />
