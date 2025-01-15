import { NextRequest, NextResponse } from "next/server"
import CryptoJS from 'crypto-js'

const secret_key = process.env.NEXT_PUBLIC_CRYPTO_SECRET_KEY as string || ''
export const middleware = (req: NextRequest) => {
    const tokenUser = req.cookies.get('__toksed')?.value
    const roleUser = req.cookies.get('__rolx')?.value
    const pathname = req.nextUrl.pathname

    let role;
    if (roleUser) {
        role = CryptoJS.AES.decrypt(roleUser, secret_key).toString(CryptoJS.enc.Utf8)
    }

    if (role && tokenUser &&
        (pathname === '/user/login'
            || pathname === '/user/register'
            || pathname === '/worker/login')) {
        return NextResponse.redirect(new URL('/', req.url))
    }

    if (role && role != 'SUPER_ADMIN' && tokenUser && pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/', req.url))
    }

    if (role && role != 'OUTLET_ADMIN' && tokenUser && pathname.startsWith('/worker/admin-outlet')) {
        return NextResponse.redirect(new URL('/', req.url))
    }

    if (role && role != 'WASHING_WORKER' && tokenUser && pathname.startsWith('/worker/washing-worker')) {
        return NextResponse.redirect(new URL('/', req.url))
    }

    if (role && role != 'IRONING_WORKER' && tokenUser && pathname.startsWith('/worker/ironing-worker')) {
        return NextResponse.redirect(new URL('/', req.url))
    }

    if (role && role != 'DRIVER' && tokenUser && pathname.startsWith('/worker/driver')) {
        return NextResponse.redirect(new URL('/', req.url))
    }

    if (role && role != 'PACKING_WORKER' && tokenUser && pathname.startsWith('/worker/packing-worker')) {
        return NextResponse.redirect(new URL('/', req.url))
    }

    if (role && role != 'CUSTOMER' && tokenUser && pathname.startsWith('/user/dashboard')) {
        return NextResponse.redirect(new URL('/', req.url))
    }

    if (!role && !tokenUser &&
        (pathname.startsWith('/admin')
            || pathname.startsWith('/worker/admin-outlet')
            || pathname.startsWith('/worker/driver')
            || pathname.startsWith('/worker/ironing-worker')
            || pathname.startsWith('/worker/packing-worker')
            || pathname.startsWith('/worker/washing-worker'))) {
        return NextResponse.redirect(new URL('/worker/login', req.url))
    }

    if (!role && !tokenUser && (pathname.startsWith('/user/dashboard'))) {
        return NextResponse.redirect(new URL('/user/login', req.url))
    }

    return NextResponse.next()
}