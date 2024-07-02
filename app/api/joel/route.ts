import {NextResponse} from 'next/server'

export const GET = async ()=>{
    return new NextResponse(JSON.stringify({message: "An api complete in Nextjs and deployed on Vercel" + process.env.MONGODB_URI}))
}
export const POST = async (request: Request)=>{
    const {searchParams} = new URL(request.url)
    
    const name = searchParams.get("name")

    return new NextResponse(name)
}