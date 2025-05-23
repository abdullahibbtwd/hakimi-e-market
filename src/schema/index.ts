import * as z from "zod"
export const RegisterSchema = z.object({
    email:z.string().email({
        message:"Email is required"
    }),
    password:z.string().min(8,{
        message:"Minumum 8 chracters required"
    }),
    name: z.string().min(3,{
        message:"Name is required"
    })
})