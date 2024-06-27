import connect from "../../../../../lib/db"
import User from "../../../../../lib/models/user"
import Category from "../../../../../lib/models/category"
import { NextResponse } from "next/server"
import { Types } from "mongoose"

export const PATCH = async (request: Request, context: {params : any}) =>{
    
    const categoryId = context.params.category
        
    try{
        const body = await request.json()
        console.log(body)
        const {title} = body
        console.log (title)

        const {searchParams} = new URL(request.url)
        const userId = searchParams.get("userId")

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
        const updatedCategory = await Category.findByIdAndUpdate(categoryId, {title}, {new: true})
        console.log(updatedCategory)
        return new NextResponse(JSON.stringify({message: "Category updated successfully"}), {status: 200})
    }
    catch(err: any){
        return new NextResponse("Error updating category" + err.message, {status:500})
    }
}


export const DELETE = async (request: Request, context: {params : any}) =>{
    
    const categoryId = context.params.category
        
    try{
        
        const {searchParams} = new URL(request.url)
        const userId = searchParams.get("userId")

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
        const deletedCategory = await Category.findByIdAndDelete(categoryId)
        console.log(deletedCategory)
        return new NextResponse(JSON.stringify({message: "deletedCategory successfully"}), {status: 200})
    }
    catch(err: any){
        return new NextResponse("Error updating category" + err.message, {status:500})
    }
}