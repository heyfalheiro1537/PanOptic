"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Loader2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  name?: string;
}

type PasswordStrength = 'weak' | 'medium' | 'strong';

export default function AuthForms() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Mock user database
  const mockUsers = [
    { email: 'user@example.com', password: 'password123', name: 'John Doe' }
  ];

  // Calculate password strength
  const getPasswordStrength = (password: string): PasswordStrength => {
    if (password.length === 0) return 'weak';
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return 'weak';
    if (strength <= 4) return 'medium';
    return 'strong';
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = mockUsers.find(
      u => u.email === formData.email && u.password === formData.password
    );

    if (user) {
      router.push('/dashboard');
    } else {
      setErrors({ 
        email: 'Invalid credentials',
        password: 'Invalid credentials'
      });
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    mockUsers.push({
      email: formData.email,
      password: formData.password,
      name: formData.name
    });
    
    router.push('/dashboard');
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      if (isLogin) {
        await handleLogin();
      } else {
        await handleSignup();
      }
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: ''
    });
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  // Handle keyboard events
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 gap-8">
      <div className="animate-in fade-in slide-in-from-top-4 duration-500">
        <Image 
          src="/image.png" 
          alt="PanOptic Logo" 
          width={360} 
          height={100} 
          priority 
        />
      </div>
      <Card className="w-full max-w-md shadow-xl border-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <CardHeader className="space-y-2 pb-6">
          <CardTitle className="text-3xl font-bold text-center transition-all duration-300">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </CardTitle>
          <CardDescription className="text-center text-base">
            {isLogin 
              ? 'Enter your credentials to access your account' 
              : 'Enter your information to get started'}
          </CardDescription>
        </CardHeader>
        <CardContent onKeyPress={handleKeyPress}>
          <div className="space-y-5">
            {!isLogin && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <label htmlFor="name" className="text-sm font-medium leading-none">
                  Full Name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  className={`transition-all duration-200 ${errors.name ? 'border-destructive focus-visible:ring-destructive' : 'focus-visible:ring-2'}`}
                  autoComplete="name"
                />
                {errors.name && (
                  <p id="name-error" className="text-sm text-destructive flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                    <XCircle className="h-3 w-3" />
                    {errors.name}
                  </p>
                )}
              </div>
            )}

      <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleInputChange}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={`transition-all duration-200 ${errors.email ? 'border-destructive focus-visible:ring-destructive' : 'focus-visible:ring-2'}`}
                autoComplete="email"
              />
              {errors.email && (
                <p id="email-error" className="text-sm text-destructive flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                  <XCircle className="h-3 w-3" />
                  {errors.email}
                </p>
              )}
      </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium leading-none">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  className={`transition-all duration-200 pr-10 ${errors.password ? 'border-destructive focus-visible:ring-destructive' : 'focus-visible:ring-2'}`}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {!isLogin && formData.password && (
                <div className="space-y-1 animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="flex gap-1">
                    <div className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      passwordStrength === 'weak' ? 'bg-destructive' : 
                      passwordStrength === 'medium' ? 'bg-amber-500' : 'bg-success'
                    }`} />
                    <div className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      passwordStrength === 'medium' || passwordStrength === 'strong' ? 
                      passwordStrength === 'medium' ? 'bg-amber-500' : 'bg-success' : 'bg-muted'
                    }`} />
                    <div className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      passwordStrength === 'strong' ? 'bg-success' : 'bg-muted'
                    }`} />
                  </div>
                  <p className={`text-xs flex items-center gap-1 ${
                    passwordStrength === 'weak' ? 'text-destructive' : 
                    passwordStrength === 'medium' ? 'text-amber-600' : 'text-success'
                  }`}>
                    {passwordStrength === 'weak' && <><AlertCircle className="h-3 w-3" /> Weak password</>}
                    {passwordStrength === 'medium' && <><AlertCircle className="h-3 w-3" /> Medium strength</>}
                    {passwordStrength === 'strong' && <><CheckCircle2 className="h-3 w-3" /> Strong password</>}
                  </p>
                </div>
              )}
              {errors.password && (
                <p id="password-error" className="text-sm text-destructive flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                  <XCircle className="h-3 w-3" />
                  {errors.password}
                </p>
              )}
      </div>

            {!isLogin && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <label htmlFor="confirmPassword" className="text-sm font-medium leading-none">
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    aria-invalid={!!errors.confirmPassword}
                    aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
                    className={`transition-all duration-200 pr-10 ${errors.confirmPassword ? 'border-destructive focus-visible:ring-destructive' : 'focus-visible:ring-2'}`}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p id="confirm-password-error" className="text-sm text-destructive flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                    <XCircle className="h-3 w-3" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-end -mt-1">
                <button
                  type="button"
                  className="text-sm text-muted-foreground hover:text-foreground hover:underline transition-colors"
                  onClick={() => alert('Password reset functionality')}
                >
                  Forgot password?
                </button>
              </div>
            )}

            <Button 
              onClick={handleSubmit} 
              className="w-full h-11 text-base font-medium transition-all duration-200 hover:shadow-lg" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </Button>

            {isLogin && (
              <div className="text-center space-y-2">
                <p className="text-xs text-muted-foreground">
                  Demo credentials for testing:
                </p>
                <div className="text-xs bg-muted px-3 py-2 rounded-md font-mono">
                  <div>user@example.com</div>
                  <div>password123</div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                {isLogin ? "New to PanOptic?" : "Already have an account?"}
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={toggleForm}
            className="w-full transition-all duration-200 hover:bg-muted"
            disabled={isLoading}
          >
            {isLogin ? 'Create an account' : 'Sign in instead'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}