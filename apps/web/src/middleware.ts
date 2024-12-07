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

    if (role && tokenUser && (pathname === '/user/login' || pathname === '/user/register' || pathname === '/admin/login' || pathname === '/admin/register')) {
        return NextResponse.redirect(new URL('/', req.url))
    }

    if(role && role != 'SUPER_ADMIN' && tokenUser && pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/', req.url))
    }

    if(!role && !tokenUser && pathname.startsWith('/admin') && pathname != '/admin/login') {
        return NextResponse.redirect(new URL('/', req.url))
    }

    return NextResponse.next()
}