import connect from "@/lib/db"
import User from "@/lib/models/user"
import Category from "@/lib/models/category"
import { NextResponse } from "next/server"
import { Types } from "mongoose"
import Blog from "@/lib/models/blog"


export const GET = async (request: Request, context: {params : any}) =>{
    
    const blogId = context.params.blog
        
    try{
        const {searchParams} = new URL(request.url)
        const userId = searchParams.get("userId")
        const categoryId = searchParams.get("categoryId")

        if(!userId || !Types.ObjectId.isValid(userId)){
            return new NextResponse(JSON.stringify({message: "Check userId and try again"}), {status: 400})
        }
        if(!categoryId || !Types.ObjectId.isValid(categoryId)){
            return new NextResponse(JSON.stringify({message: "Check categoryId and try again"}), {status: 400})
        }
        if(!blogId || !Types.ObjectId.isValid(blogId)){
            return new NextResponse(JSON.stringify({message: "Check blogId and try again"}), {status: 400})
        }
        await connect()

        const user = await User.findById(userId)
        if(!user){
            return new NextResponse(JSON.stringify({message: "User not found"}), {status: 400})
        }
        const blog = await Blog.findOne({_id: blogId, user: userId})

        if(!blog){
            return new NextResponse(JSON.stringify({message: "Blog not found"}), {status: 400})
        }
        return new NextResponse(JSON.stringify(blog), {status: 200})
    }
    catch(err: any){
        return new NextResponse("Error fetching Blog" + err.message, {status:500})
    }
}
export const PATCH = async (request: Request, context: {params : any}) =>{
    
    const blogId = context.params.blog
        
    try{
        const body = await request.json()

        const {searchParams} = new URL(request.url)
        const userId = searchParams.get("userId")
        const categoryId = searchParams.get("categoryId")

        const {title, description} = body

        if(!userId || !Types.ObjectId.isValid(userId)){
            return new NextResponse(JSON.stringify({message: "Check userId and try again"}), {status: 400})
        }
        if(!categoryId || !Types.ObjectId.isValid(categoryId)){
            return new NextResponse(JSON.stringify({message: "Check categoryId and try again"}), {status: 400})
        }
        if(!blogId || !Types.ObjectId.isValid(blogId)){
            return new NextResponse(JSON.stringify({message: "Check blogId and try again"}), {status: 400})
        }
        await connect()

        const user = await User.findById(userId)
        if(!user){
            return new NextResponse(JSON.stringify({message: "User not found"}), {status: 400})
        }
        const blog = await Blog.findOne({_id: blogId, user: userId})

        if(!blog){
            return new NextResponse(JSON.stringify({message: "Blog not found"}), {status: 400})
        }
        const updatedBlog = await Blog.findByIdAndUpdate(blogId, {title, description}, {new: true})
        console.log(updatedBlog)
        return new NextResponse(JSON.stringify({message: "Blog updated successfully"}), {status: 200})
    }
    catch(err: any){
        return new NextResponse("Error updating Blog" + err.message, {status:500})
    }
}


export const DELETE = async (request: Request, context: {params : any}) =>{
    
    const blogId = context.params.blog
        
    try{
        
        const {searchParams} = new URL(request.url)
        const userId = searchParams.get("userId")

        if(!userId || !Types.ObjectId.isValid(userId)){
            return new NextResponse(JSON.stringify({message: "Check userId and try again"}), {status: 400})
        }
        if(!blogId || !Types.ObjectId.isValid(blogId)){
            return new NextResponse(JSON.stringify({message: "Check blogId and try again"}), {status: 400})
        }
        await connect()

        const user = await User.findById(userId)
        if(!user){
            return new NextResponse(JSON.stringify({message: "User not found"}), {status: 400})
        }
        const blog = await Blog.findOne({_id: blogId, user: userId})

        if(!Blog){
            return new NextResponse(JSON.stringify({message: "Blog not found"}), {status: 400})
        }
        const deletedBlog = await Blog.findByIdAndDelete(blogId)        
        return new NextResponse(JSON.stringify({message: "deletedBlog successfully"}), {status: 200})
    }
    catch(err: any){
        return new NextResponse("Error deleting Blog" + err.message, {status:500})
    }
}
