import { doSocialLogin } from "@/app/actions";
import React from "react";
import { FcGoogle } from "react-icons/fc";

interface MyComponentProps {
  register: boolean; // Assuming 'register' is a boolean
}
const SocialLogin: React.FC<MyComponentProps> = ({ register }) => {
    
   
  return (
    <div className="w-full md:w-[70%]">
      <form action={doSocialLogin} className="w-full" >
        <button
    
          type="submit"
          name="action"
          value="google"
          className="cursor-pointer w-full rounded-full hover:bg-green-200 duration-500 transition ease-in-out"

        >
          <div className="w-full py-2 rounded-full border-1 px-2 border-gray-500 flex items-center justify-center">
            <p className="flex gap-2 items-center">
              {register ? "SignUp with" : "Login with"}
              <FcGoogle className="text-2xl" />
            </p>
          </div>
        </button>
      </form>
    </div>
  );
};

export default SocialLogin;
