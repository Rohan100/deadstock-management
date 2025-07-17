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
import { UserPlus } from "lucide-react";

export default function AddUser() {
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
          <SignupPage />
        </DialogContent>
      </form>
    </Dialog>
  )
}

function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    try {
      // Replace with your signup API endpoint
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.message || "Signup failed");
      } else {
        router.push("/login");
      }
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
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              {...register("password", { required: "Password is required", minLength: { value: 6, message: "Minimum 6 characters" } })}
            />
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