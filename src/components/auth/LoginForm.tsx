"use client";
import React, { useState } from "react";
import { MdEmail } from "react-icons/md";
import { CgNametag } from "react-icons/cg";
import { BiLock } from "react-icons/bi";
import Checkbox from "@mui/material/Checkbox";
import { FormControlLabel } from "@mui/material";
import axios from "axios"
import SocialLogin from "./SocialLogin";
import { useAppContext } from "@/context/AppContext";
import { toast } from "react-toastify";
const LoginForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [register, setRegister] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const {router} = useAppContext()

  // const {
  //   register: formRegister,
  //   handleSubmit,
  //   formState: { errors, isSubmitting },
  //   reset,
  //   watch,
  // } = useForm<LoginFormData | RegisterFormData>({
  //   resolver: zodResolver(isRegister ? registerSchema : loginSchema),
  // });
  
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if(register){
         try{
      const formData = new FormData(e.currentTarget)
      const name = formData.get('name')
      const email = formData.get('email')
      const password = formData.get('password')

      const response = await axios.post( `/api/register`,{name,email,password})

    if ( response.status === 201){
      toast.success("User Created");
      setRegister(false)
      setName("")
      setEmail("")
      setConfirmPassword("")
      setPassword("")
    } 
    }catch(error){
      console.log(error)
    }
    }else{
      const response = await axios.post("/api/login", { email, password });
    if (response.status === 201) {
    toast.success(response.data.message);
    router.push("/")
   
    } else{
      toast.error(response.data.message)
    }
    }
 
  }

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    setPasswordMatchError("");
  };

  const handleConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (register) {
      setConfirmPassword(event.target.value);
      if (password !== event.target.value) {
        setPasswordMatchError("Passwords do not match.");
      } else {
        setPasswordMatchError("");
      }
    } else {
    }
  };
  return (
    <div className="flex flex-col gap-2 h-screen items-center pt-5 rounded-md">
      <h2 className="my-font font-semibold tracking-wider">
        HAKIMI<span className="text-green-700">-e-</span>Market
      </h2>
      <form className="p-5 flex flex-col w-full  md:w-[50%] items-center justify-center gap-4"
      onSubmit={handleSubmit}>
        {register ? (
          <>
            <h1 className="text-2xl font-semibold my-font text-green-800">
              Register
            </h1>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-semibold my-font text-green-800">
              Login
            </h1>
          </>
        )}
        <div className="md:w-[80%] w-[90%] bg-gray-100 rounded-md p-2 gap-2 flex items-center ">
          <MdEmail className="text-2xl text-green-600" />
          <input
            type="email"
            className="h-full w-full bg-transparent  outline-none p-2 text-[15px]"
            placeholder="Email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>
        {register && (
          <div className="md:w-[80%] w-[90%] bg-gray-100 rounded-md p-2 gap-2 flex items-center ">
            <CgNametag className="text-2xl text-green-600" />
            <input
              type="text"
              name="name"
              className="h-full w-full bg-transparent  outline-none p-2 text-[15px]"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}
        <div className="md:w-[80%] w-[90%] bg-gray-100 rounded-md p-2 gap-2 flex items-center ">
          <BiLock className="text-2xl text-green-600" />
          <input
            type="password"
            className="h-full w-full bg-transparent  outline-none p-2 text-[15px]"
            placeholder="Password"
            value={password}
            id="password"
            onChange={handlePasswordChange}
          />
        </div>
        {register && (
          <div className="md:w-[80%] w-[90%] bg-gray-100 rounded-md p-2 gap-2 flex items-center ">
            <BiLock className="text-2xl text-green-600" />
            <input
              type="password"
              className="h-full w-full bg-transparent  outline-none p-2 text-[15px]"
              placeholder="Comfirm Password"
              id="confirmPassword"
              value={confirmPassword}
              name="password"
              onChange={register ? handleConfirmPasswordChange : undefined}
            />
          </div>
        )}
        {register ? (
          <></>
        ) : (
          <>
            {" "}
            <div className="flex items-center justify-between md:w-[80%] w-[90%]">
              <p className="text-sm text-blue-600 cursor-pointer">
                Forgot Password?
              </p>
              <div className="flex items-center gap-1">
                <FormControlLabel
                  label="Remember me"
                  control={<Checkbox color="success" defaultChecked={false} />}
                  labelPlacement="start"
                />
              </div>
            </div>
          </>
        )}

        <div className="md:w-[80%] w-[90%] flex justify-center items-center ">
          <button className="px-4 py-2 mb-2  w-max bg-green-600  text-white rounded-md cursor-pointer hover:bg-inherit hover:text-green-600 transition ease-in-out duration-500 " type="submit">
            {register ? "Register" : "Login"}
          </button>
        </div>
        {passwordMatchError && (
          <p style={{ color: "red" }}>{passwordMatchError}</p>
        )}

     
        {register ? (
          <>
            <p className="text-[15px] text-black ">
              Already have an account?{" "}
              <span
                onClick={() => setRegister(false)}
                className="text-blue-800 cursor-pointer "
              >
                login
              </span>{" "}
            </p>
          </>
        ) : (
          <>
            <p className="text-[15px] text-black ">
              Dont have an account{" "}
              <span
                onClick={() => setRegister(true)}
                className="text-blue-800 cursor-pointer "
              >
                signup
              </span>
            </p>
          </>
        )}
      </form>
      <div className="md:w-[80%] w-[90%] border-t-2 border-gray-200 flex items-center justify-center flex-col gap-2 ">
          <p className="text-gray-500 text-[15px]">Or</p>
          <SocialLogin  register={register} />
        </div>
    
    </div>
  );
};

export default LoginForm;
