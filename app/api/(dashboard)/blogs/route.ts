import connect from "@/lib/db"
import User from "@/lib/models/user"
import Category from "@/lib/models/category"
import { NextResponse } from "next/server"
import { Types } from "mongoose"
import Blog from "@/lib/models/blog"

export const GET = async(request: Request)=>{
    try{
    const {searchParams} = new URL(request.url)
    const userId = searchParams.get("userId")
    const categoryId = searchParams.get("categoryId")
    const searchKeyword = searchParams.get("searchKeyword")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const page :any =  searchParams.get("page") || 1
    const limit :any=  searchParams.get("limit") || 10
    
    if(!userId || !Types.ObjectId.isValid(userId)){
        return new NextResponse(JSON.stringify({message: "Check userId and try again"}), {status: 400})
    }
    if(!categoryId || !Types.ObjectId.isValid(categoryId)){
        return new NextResponse(JSON.stringify({message: "Check categoryId and try again"}), {status: 400})
    }
    await connect()

    const user = await User.findById(userId)
    if(!user){
        return new NextResponse(JSON.stringify({message: "User not found"}), {status: 400})
    }
    const category = await Category.findOne({_id: categoryId, user: userId})

    if(!category){
        return new NextResponse(JSON.stringify({message: "Category not found"}), {status: 400})
    }

    const filter: any = {
        user: new Types.ObjectId(userId),
        category: new Types.ObjectId(categoryId)
    }
    if(searchKeyword){
        filter.$or = [
            {title: {$regex: searchKeyword, $options: "i"}},{description: {$regex: searchKeyword, $options: "i"}}
        ]
    }
    if(startDate && endDate){
        filter.createdAt = {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        }
    }else if(startDate){
        filter.createdAt = {
            $gte: new Date(startDate)
        }
    }else if(endDate){
        filter.createdAt = {
            $lte: new Date(endDate)
        }
    }
    const skip = (page - 1)*limit
    const blogs = await Blog.find(filter).skip(skip).limit(limit).sort({createdAt: "asc"})
    return new NextResponse(JSON.stringify(blogs), {status:200})
    }catch(err: any){
        return new NextResponse(err.message)
    }
    
}

export const POST = async(request: Request) =>{
try {
    
    const {searchParams} = new URL(request.url)
    const userId = searchParams.get("userId")
    const categoryId = searchParams.get("categoryId")

    const body = await request.json()
    const {title, description} = body
    
    if(!userId || !Types.ObjectId.isValid(userId)){
        return new NextResponse(JSON.stringify({message: "Check userId and try again"}), {status: 400})
    }
    if(!categoryId || !Types.ObjectId.isValid(categoryId)){
        return new NextResponse(JSON.stringify({message: "Check categoryId and try again"}), {status: 400})
    }
    await connect()

    const user = await User.findById(userId)
    if(!user){
        return new NextResponse(JSON.stringify({message: "User not found"}), {status: 400})
    }
    const category = await Category.findOne({_id: categoryId, user: userId})

    if(!category){
        return new NextResponse(JSON.stringify({message: "Category not found"}), {status: 400})
    }
    const newBlog = new Blog({
        title,
        description,
        user: new Types.ObjectId(userId),
        category: new Types.ObjectId(categoryId)
    })
    await newBlog.save()

    return new NextResponse(JSON.stringify(newBlog + " Created Successfully"), {status: 200})

} catch (error: any) {
    return new NextResponse("Error creating the blog " + error.message)
}
}