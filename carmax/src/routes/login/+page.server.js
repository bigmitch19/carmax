import { error, redirect } from '@sveltejs/kit';

export const actions = {
	login: async ({ request, locals }) => {
		const body = Object.fromEntries(await request.formData());

		try {
			await locals.pb.collection('users').authWithPassword(body.email, body.password);
			if (!locals.pb?.authStore?.model?.verified) {
				locals.pb.authStore.clear();
				return {
					notVerified: true
				};
			}
		} catch (err) {
<<<<<<< HEAD
			console.error('Error', err);
			throw error(500, 'Login failed');
		}
=======
			console.log('Error: ', err);
			throw error(500, 'Something went wrong logging in');
		}

>>>>>>> 48381b85b8c2ab25bab4af5394935adbad64dc6a
		throw redirect(303, '/');
	}
};
