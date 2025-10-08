"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { UserPlus, Eye, EyeOff } from "lucide-react";
import axios from "axios";

export default function AddUser({setUsers}) {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button ><UserPlus /> Add User</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create User</DialogTitle>
          </DialogHeader>
          <SignupPage setUsers={setUsers}/>
        </DialogContent>
      </form>
    </Dialog>
  )
}

function SignupPage({setUsers}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors },reset } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    try {
      // Replace with your signup API endpoint
      const res = await axios.post("/api/user",{...data, isAdmin: false });
      setUsers(prev => [...prev,res.data]);
      reset()
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className=" w-full">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="mb-2">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Your full name"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="username" className="mb-2">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Choose a username"
              {...register("username", { required: "Username is required" })}
            />
            {errors.username && <p className="text-red-500 text-xs">{errors.username.message}</p>}
          </div>
          <div>
            <Label htmlFor="email" className="mb-2">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Your email address"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address"
                }
              })}
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
          </div>
          <div>
            <Label htmlFor="password" className="mb-2">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                {...register("password", { 
                  required: "Password is required", 
                  minLength: { value: 6, message: "Minimum 6 characters" } 
                })}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
          </div>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
        </div>
        <div className="mt-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Add User"}
          </Button>
        </div>
      </form>
    </div>
  );
}