import type { ContextFunction, HTTPGraphQLRequest } from '@apollo/server';
import type { AppHost } from '@cellix/api-core';
import { HeaderMap } from '@apollo/server';
import type { HttpHandler, HttpRequest, InvocationContext } from '@azure/functions';
import type { ApplicationServices } from '@invt/application-services';
import type { GraphContext } from '@invt/graphql';
import type { ServiceApolloServer } from '@cellix/service-apollo-server';

export function graphHandlerCreator(apolloService: ServiceApolloServer<GraphContext>, applicationServicesHost: AppHost<ApplicationServices>): HttpHandler {
	return async (req: HttpRequest, invocation: InvocationContext) => {
		try {
			const graphRequest = await normalizeRequest(req);
			const context: ContextFunction<[], GraphContext> = async () => ({ applicationServices: await applicationServicesHost.forRequest() });
			const { body, headers, status } = await apolloService.server.executeHTTPGraphQLRequest({ httpGraphQLRequest: graphRequest, context });
			if (body.kind === 'chunked') return { status: 501, jsonBody: { errors: [{ message: 'Incremental delivery is not implemented.' }] } };
			return { status: status ?? 200, headers: Object.fromEntries(headers), body: body.string };
		} catch (error) {
			invocation.error('Failure processing GraphQL request', error);
			return { status: 400, body: (error as Error).message };
		}
	};
}

async function normalizeRequest(req: HttpRequest): Promise<HTTPGraphQLRequest> {
	if (!req.method) throw new Error('No method');
	const headers = new HeaderMap();
	req.headers.forEach((value, key) => headers.set(key, value));
	const isJsonPost = req.method === 'POST' && req.headers.get('content-type')?.startsWith('application/json');
	return { method: req.method, headers, search: new URL(req.url).search, body: isJsonPost ? await req.json() : null };
}
