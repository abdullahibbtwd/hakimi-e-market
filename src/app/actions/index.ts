"use server"
import { signIn,signOut } from "@/auth";
type ProviderId = string;

export async function doSocialLogin(formData: FormData): Promise<void> {
    const action = formData.get('action');
//     await signIn(action,{redirectTo:"/home"})
        
    if (action) {
        await signIn(action as ProviderId, { redirectTo: "/home" });
    } else {
       
        console.error("Action is missing");
    }
}
export async function doLogout() {
    await signOut({redirectTo:"/"}) 
}

