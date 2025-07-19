import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useUserData } from '@/hooks/useUserData';
import { User, Settings, CreditCard, Bell } from 'lucide-react';

const Account = () => {
  const { user } = useAuth();
  const { profile } = useUserData();
  const [displayName, setDisplayName] = useState(profile?.display_name || '');

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-cloud bg-clip-text text-transparent mb-2">
            Account Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account preferences and subscription
          </p>
        </div>

        <div className="grid gap-6">
          {/* Profile Information */}
          <Card className="bg-card/70 backdrop-blur-sm border-border/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div>
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your display name"
                  />
                </div>
              </div>
              <Button variant="primary" className="mt-4">
                Save Changes
              </Button>
            </CardContent>
          </Card>

          {/* Subscription */}
          <Card className="bg-card/70 backdrop-blur-sm border-border/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Subscription
              </CardTitle>
              <CardDescription>
                Manage your subscription and billing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-medium">Current Plan</p>
                  <Badge variant="secondary" className="mt-1">
                    {profile?.subscription_tier || 'Free'}
                  </Badge>
                </div>
                <Button variant="secondary">
                  Upgrade Plan
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                {profile?.subscription_tier === 'free' 
                  ? 'Upgrade to unlock unlimited story generation and premium features.'
                  : 'Thank you for supporting DreamTales AI!'
                }
              </p>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card className="bg-card/70 backdrop-blur-sm border-border/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Preferences
              </CardTitle>
              <CardDescription>
                Customize your DreamTales experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive updates about new features and stories
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  <Bell className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Account;