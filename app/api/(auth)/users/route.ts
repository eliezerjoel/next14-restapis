import connect from "../../../../lib/db"
import User from "../../../../lib/models/user"
import { NextResponse } from "next/server"
import { Types } from "mongoose"


const ObjectId = require('mongoose').Types.ObjectId

export const GET = async() =>{
    try{
        await connect()
        const users = await User.find()
        return new NextResponse(JSON.stringify(users), {status: 200})
    }catch(err: any){
        return new NextResponse("Error when fetching users" + err.message, {status: 500})
    }
    
}

export const POST = async(request: Request) =>{
    try {
        const body = await request.json()
        await connect()
        const newUser = new User(body)
        await newUser.save()

        return new NextResponse(JSON.stringify({message: "User is created", user: newUser}), {status: 200})
        
    } catch (error: any) {
        return new NextResponse("Error in creating new user" + error.message, {status: 500})
        
    }
}

export const PATCH = async(request: Request) =>{
    try {
        const body = await request.json()
        await connect()
        const {userId, newUsername} = body

        if(!userId || !newUsername){
            return new NextResponse(JSON.stringify({message: "User ID or New username error"}), {status: 400})
        }
        if(!Types.ObjectId.isValid(userId)){
            return new NextResponse(JSON.stringify({message: "User ID error"}), {status: 400})
        }

        const updatedUser = await User.findOneAndUpdate(
            {_id: new ObjectId(userId)},
            {username: newUsername},
            {new: true}
        )
        if(!updatedUser){
            return new NextResponse(JSON.stringify({message: "An error occured when updating the user"}), {status:400})
        }

        return new NextResponse(JSON.stringify({message: "Username updated successfully", user: updatedUser}), {status: 200})
        
        
    } catch (error: any) {
        return new NextResponse("An error occured when updating the user" + error.message, {status: 400});
        
    }
}

export const DELETE = async (request: Request)=>{
    try {
        const {searchParams} = new URL(request.url)
        const userId = searchParams.get("userId")

        if(!userId){
            return new NextResponse(JSON.stringify({message: "User ID not found"}), {status: 400})
        }

        if(!Types.ObjectId.isValid(userId)){
            return new NextResponse(JSON.stringify({message: "User ID not valid"}), {status: 400})
        }

        await connect()

        const deletedUser = await User.findByIdAndDelete(new Types.ObjectId(userId))
        
        if(!deletedUser){
            return new NextResponse(JSON.stringify({message: "User delete request failed"}), {status: 400})
        }
        return new NextResponse(JSON.stringify({message: "User deleted succesfully", user: deletedUser}), {status: 200})
    } catch (error) {
        return new NextResponse("An error occured when deleteing the user" + error.message, {status: 500});
    }
}