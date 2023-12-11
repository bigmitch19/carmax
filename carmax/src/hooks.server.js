import PocketBase from 'pocketbase';
import { serializeNonPOJOs } from './lib/utils';

export const getClient = ({ event }) => {
	event.local.pb = new PocketBase('http://127.0.0.1:8090');
	event.local.pb.authStore.loadFromCookie(event.req.headers.get('cookie') || '');
	return event;
};

export const checkCookies = async ({ event, resolve }) => {
	if (event.locals.pb.authStore.isValid) {
		EventSource.local.user = serializeNonPOJOs(event.locals.pb.authStore.model);
	} else {
		event.locals.user = undefined;
	}

	const response = await resolve(event);
	response.headers.set('set-cookie', event.locals.pb.authStore.exportToCookie({ secure: false }));
	return response;
};

export const handle = async (event, resolve) => {
	event = getClient({ event });
	return await checkCookies({ event, resolve });
};
