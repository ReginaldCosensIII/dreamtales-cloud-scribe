import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Cloud, Mail, Lock, User, Sparkles, Calendar, Check, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  const { user, signIn, signUp } = useAuth();
  const location = useLocation();
  const from = location.state?.from || '/';

  // Redirect if already authenticated
  if (user) {
    return <Navigate to={from} replace />;
  }

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    // Email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (isSignUp) {
      // First name validation
      if (!firstName.trim()) {
        errors.firstName = 'First name is required';
      }

      // Last name validation
      if (!lastName.trim()) {
        errors.lastName = 'Last name is required';
      }

      // Confirm password validation
      if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }

      // Birthday validation
      if (!birthday) {
        errors.birthday = 'Birthday is required';
      } else {
        const birthDate = new Date(birthday);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        
        if (birthDate > today) {
          errors.birthday = 'Birthday cannot be in the future';
        } else if (age < 13) {
          errors.birthday = 'You must be at least 13 years old to create an account';
        }
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFirstName('');
    setLastName('');
    setBirthday('');
    setValidationErrors({});
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password);
        if (error) {
          throw error;
        }
        setSuccess('Check your email for the confirmation link!');
        resetForm();
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          throw error;
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10 flex items-center justify-center p-4 -mt-16 pt-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Cloud className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold gradient-cloud bg-clip-text text-transparent">
              DreamTales AI
            </span>
          </div>
          <p className="text-muted-foreground">
            {isSignUp ? 'Create your account to start crafting magical stories' : 'Welcome back to your storytelling adventure'}
          </p>
        </div>

        <Card className="bg-card/70 backdrop-blur-md border-border/50 shadow-dreamy">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              {isSignUp ? 'Create Account' : 'Sign In'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="First name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                      {validationErrors.firstName && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <X className="h-3 w-3" />
                          {validationErrors.firstName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Last name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                      {validationErrors.lastName && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <X className="h-3 w-3" />
                          {validationErrors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birthday">Birthday</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="birthday"
                        type="date"
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
                        className="pl-10"
                        required
                        max={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    {validationErrors.birthday && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <X className="h-3 w-3" />
                        {validationErrors.birthday}
                      </p>
                    )}
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
                {validationErrors.email && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <X className="h-3 w-3" />
                    {validationErrors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                    minLength={6}
                  />
                </div>
                {validationErrors.password && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <X className="h-3 w-3" />
                    {validationErrors.password}
                  </p>
                )}
              </div>

              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    {password && confirmPassword && password === confirmPassword && (
                      <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                    )}
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`pl-10 ${password && confirmPassword && password === confirmPassword ? 'pr-10' : ''}`}
                      required
                    />
                  </div>
                  {validationErrors.confirmPassword && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <X className="h-3 w-3" />
                      {validationErrors.confirmPassword}
                    </p>
                  )}
                  {password && confirmPassword && password === confirmPassword && (
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      Passwords match
                    </p>
                  )}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                variant="accent"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                    {isSignUp ? 'Creating Account...' : 'Signing In...'}
                  </>
                ) : (
                  <>
                    <User className="mr-2 h-4 w-4" />
                    {isSignUp ? 'Create Account' : 'Sign In'}
                  </>
                )}
              </Button>
            </form>

            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                <Button
                  variant="link"
                  className="p-0 ml-1 h-auto font-normal"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    resetForm();
                  }}
                >
                  {isSignUp ? 'Sign In' : 'Create Account'}
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;