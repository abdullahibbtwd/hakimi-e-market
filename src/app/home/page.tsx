import {auth,signOut} from "@/auth"
import Logout from "@/components/auth/Logout";
import { redirect } from "next/navigation";

 

const Home = async () => {
    const session = await auth();
    if (!session?.user) redirect("/")

        return (
            <div>
                <h1>{session?.user?.name}</h1>
                <Logout/>
            </div>
        )
}
export default Home