import PocketBase from 'pocketbase';
import { serializeNonPOJOs } from '$lib/utils';

const setupUser = (event) => {
	event.locals.pb = new PocketBase('http://localhost:8090');
	event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

	if (event.locals.pb.authStore.isValid) {
		event.locals.user = serializeNonPOJOs(event.locals.pb.authStore.model);
	} else {
		event.locals.user = undefined;
	}
};

const handleResponse = async (event, resolve) => {
	const response = await resolve(event);

	response.headers.set('set-cookie', event.locals.pb.authStore.exportToCookie({ secure: false }));
	return response;
};

export const handle = async ({ event, resolve }) => {
	setupUser(event);
	return handleResponse(event, resolve);
};
