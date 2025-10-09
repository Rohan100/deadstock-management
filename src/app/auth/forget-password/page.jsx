"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { set } from 'react-hook-form';
import { Card } from '@/components/ui/card';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {

    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/auth/forget-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        setStatus('success');
      } else {
        const data = await response.json();
        setStatus(`error: ${data.message}`);
      }
    } catch (error) {
      setStatus(`error: ${error.message}`);
    }finally{
      setLoading(false);
    }
  };

  return (
    <Card className="container mx-auto max-w-md mt-10 p-6 rounded-xl shadow ">
      <h1 className="text-2xl font-bold mb-6">Forgot Password</h1>
      
      {status === 'success' ? (
        <div className="bg-green-100 p-4 rounded mb-4">
          <p>If an account with that email exists, we've sent password reset instructions.</p>
          <Link href="/auth/login"
            className="mt-4  py-2 px-4 rounded"
          >
            Return to Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
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
            {loading ? "Loading..." : "Send Reset Link"}
          </Button>
        </form>
      )}
    </Card>
  );
}