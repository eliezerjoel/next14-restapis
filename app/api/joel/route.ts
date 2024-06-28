import {NextResponse} from 'next/server'

export const GET = async ()=>{
    return new NextResponse(JSON.stringify({message: "This is Kagu's first api complete in Nextjs and deployed on Vercel"}))
}
export const POST = async (request: Request)=>{
    const body = await request.json()
    const name = body.name

    return new NextResponse(name)
}