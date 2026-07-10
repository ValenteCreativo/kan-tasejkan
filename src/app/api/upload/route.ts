import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { validateSessionToken, SESSION_COOKIE_NAME } from '../../../lib/session';

export async function POST(request: Request): Promise<NextResponse> {
    // Verify admin session
    const cookieStore = await cookies();
    const session = cookieStore.get(SESSION_COOKIE_NAME);
    if (!session?.value) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    const { valid } = await validateSessionToken(session.value);
    if (!valid) {
        return NextResponse.json({ error: 'Sesión expirada' }, { status: 401 });
    }

    const body = (await request.json()) as HandleUploadBody;

    try {
        const jsonResponse = await handleUpload({
            body,
            request,
            onBeforeGenerateToken: async () => {
                return {
                    allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
                    tokenPayload: JSON.stringify({}),
                };
            },
            onUploadCompleted: async ({ blob }) => {
                console.log('blob uploaded', blob.url);
            },
        });

        return NextResponse.json(jsonResponse);
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 400 },
        );
    }
}
