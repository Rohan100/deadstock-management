"use client"
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password", "");

  const onSubmit = async (data) => {
    try {
      await axios.post('/api/reset-password', {
        token,
        password: data.password,
      });
      setStatus('success');
    } catch (error) {
      setStatus(`error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <Card className="container mx-auto max-w-md mt-10 p-6  rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Reset Password</h1>

      {status === 'success' ? (
        <div className="bg-green-100 p-4 rounded mb-4">
          <p>Your password has been successfully reset.</p>
          <Button
            className="mt-4"
            onClick={() => router.push('/login')}
          >
            Go to Login
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <Label htmlFor="password" className="mb-2">New Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters"
                  },
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                    message: "Password must contain at least one letter and one number"
                  }
                })}
                className={`pr-10 ${errors.password ? 'border-red-500' : ''}`}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="mb-4">
            <Label htmlFor="confirmPassword" className="mb-2">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: value =>
                    value === password || "Passwords do not match"
                })}
                className={`pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          {status.startsWith('error') && (
            <div className="bg-red-100 p-4 rounded mb-4">
              {status.substring(7)}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
          >
            Reset Password
          </Button>
        </form>
      )}
    </Card>
  );
}