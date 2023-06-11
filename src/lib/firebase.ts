import { memoize } from 'lodash';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
	apiKey: 'AIzaSyAvHXjOa7PPLjI8841k1eTCdoLm8B-iXAw',
	authDomain: 'productivity-app-7170a.firebaseapp.com',
	projectId: 'productivity-app-7170a',
	storageBucket: 'productivity-app-7170a.appspot.com',
	messagingSenderId: '913023986895',
	appId: '1:913023986895:web:8abd3339cd75a009b5dbba',
	measurementId: 'G-6W3JEKW0ZC'
};

// Initialize Firebase

export const initFirebase = memoize(() => {
	const app = initializeApp(firebaseConfig);
	const analytics = getAnalytics(app);
	const auth = getAuth(app);
	return { app, analytics, auth };
});
