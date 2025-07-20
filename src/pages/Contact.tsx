import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  Instagram,
  Twitter,
  Youtube,
  Facebook,
  CheckCircle,
  MessageSquare,
  Users,
  Briefcase,
  HelpCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
}

const Contact = () => {
  const [form, setForm] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name || !form.email || !form.subject || !form.category || !form.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSubmitted(true);
      toast({
        title: "Message Sent!",
        description: "We'll respond within 1-2 hours with a direct resolution within 24 hours."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        
        <div className="relative container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-4xl font-bold mb-4 gradient-cloud bg-clip-text text-transparent">
                Message Sent Successfully!
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Thank you for contacting DreamTales AI. We've received your message and will respond within 1-2 hours with a direct resolution within 24 hours.
              </p>
            </div>

            <Alert className="mb-8 text-left">
              <Mail className="h-4 w-4" />
              <AlertDescription>
                <strong>What happens next:</strong>
                <br />
                • You'll receive an email confirmation shortly
                • Our support team will review your message within 1-2 hours
                • We'll provide a direct response and resolution within 24 hours
                <br /><br />
                For urgent matters, you can also reach us directly at{" "}
                <a href="mailto:support@dreamtalesai.com" className="text-primary hover:underline">
                  support@dreamtalesai.com
                </a>
              </AlertDescription>
            </Alert>

            <div className="flex justify-center space-x-4 mb-8">
              <a href="#" className="group relative">
                <Instagram className="h-6 w-6 text-muted-foreground group-hover:text-transparent transition-all duration-300" />
                <Instagram className="h-6 w-6 absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 gradient-cloud bg-clip-text text-transparent" style={{ backgroundImage: 'var(--gradient-cloud)' }} />
              </a>
              <a href="#" className="group relative">
                <Twitter className="h-6 w-6 text-muted-foreground group-hover:text-transparent transition-all duration-300" />
                <Twitter className="h-6 w-6 absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 gradient-cloud bg-clip-text text-transparent" style={{ backgroundImage: 'var(--gradient-cloud)' }} />
              </a>
              <a href="#" className="group relative">
                <Youtube className="h-6 w-6 text-muted-foreground group-hover:text-transparent transition-all duration-300" />
                <Youtube className="h-6 w-6 absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 gradient-cloud bg-clip-text text-transparent" style={{ backgroundImage: 'var(--gradient-cloud)' }} />
              </a>
              <a href="#" className="group relative">
                <Facebook className="h-6 w-6 text-muted-foreground group-hover:text-transparent transition-all duration-300" />
                <Facebook className="h-6 w-6 absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 gradient-cloud bg-clip-text text-transparent" style={{ backgroundImage: 'var(--gradient-cloud)' }} />
              </a>
            </div>

            <Button onClick={() => setIsSubmitted(false)} variant="secondary">
              Send Another Message
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      
      <div className="relative container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 gradient-cloud bg-clip-text text-transparent">
            Contact Us
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions about DreamTales AI? Need help with your account? We're here to help you create magical stories.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Send us a Message
              </CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you within 1-2 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={form.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="technical">Technical Support</SelectItem>
                      <SelectItem value="billing">Billing & Account</SelectItem>
                      <SelectItem value="partnership">Partnership Opportunities</SelectItem>
                      <SelectItem value="feedback">Feedback & Suggestions</SelectItem>
                      <SelectItem value="bug">Bug Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    value={form.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    placeholder="Brief description of your inquiry"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={form.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Tell us more about your inquiry..."
                    rows={5}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Response Times
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">Initial Response</p>
                    <p className="text-sm text-muted-foreground">Within 1-2 hours</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Resolution</p>
                    <p className="text-sm text-muted-foreground">Within 24 hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Direct Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">General Support</p>
                    <a href="mailto:support@dreamtalesai.com" className="text-sm text-muted-foreground hover:text-primary">
                      support@dreamtalesai.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Briefcase className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Business Inquiries</p>
                    <a href="mailto:business@dreamtalesai.com" className="text-sm text-muted-foreground hover:text-primary">
                      business@dreamtalesai.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Partnerships</p>
                    <a href="mailto:partners@dreamtalesai.com" className="text-sm text-muted-foreground hover:text-primary">
                      partners@dreamtalesai.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Technical Issues</p>
                    <a href="mailto:tech@dreamtalesai.com" className="text-sm text-muted-foreground hover:text-primary">
                      tech@dreamtalesai.com
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Follow Us</CardTitle>
                <CardDescription>
                  Stay updated with the latest DreamTales AI news and features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <a href="#" className="group relative">
                    <Instagram className="h-6 w-6 text-muted-foreground group-hover:text-transparent transition-all duration-300" />
                    <Instagram className="h-6 w-6 absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 gradient-cloud bg-clip-text text-transparent" style={{ backgroundImage: 'var(--gradient-cloud)' }} />
                  </a>
                  <a href="#" className="group relative">
                    <Twitter className="h-6 w-6 text-muted-foreground group-hover:text-transparent transition-all duration-300" />
                    <Twitter className="h-6 w-6 absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 gradient-cloud bg-clip-text text-transparent" style={{ backgroundImage: 'var(--gradient-cloud)' }} />
                  </a>
                  <a href="#" className="group relative">
                    <Youtube className="h-6 w-6 text-muted-foreground group-hover:text-transparent transition-all duration-300" />
                    <Youtube className="h-6 w-6 absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 gradient-cloud bg-clip-text text-transparent" style={{ backgroundImage: 'var(--gradient-cloud)' }} />
                  </a>
                  <a href="#" className="group relative">
                    <Facebook className="h-6 w-6 text-muted-foreground group-hover:text-transparent transition-all duration-300" />
                    <Facebook className="h-6 w-6 absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 gradient-cloud bg-clip-text text-transparent" style={{ backgroundImage: 'var(--gradient-cloud)' }} />
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;