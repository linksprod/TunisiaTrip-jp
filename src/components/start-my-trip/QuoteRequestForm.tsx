
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TranslateText } from '@/components/translation/TranslateText';
import { useTranslation } from '@/hooks/use-translation';
import { toast } from 'sonner';
import { Mail, User, Phone, Users, Send, MapPin, Calendar, Hotel } from 'lucide-react';

interface QuoteRequestFormProps {
  trigger: React.ReactNode;
  selectedActivities: string[];
  selectedHotels: string[];
  selectedGuestHouses: string[];
  selectedDays: number;
}

export function QuoteRequestForm({ 
  trigger, 
  selectedActivities, 
  selectedHotels, 
  selectedGuestHouses, 
  selectedDays 
}: QuoteRequestFormProps) {
  const { currentLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    numberOfPeople: 1
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'numberOfPeople' ? parseInt(value) || 1 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error(<TranslateText text="Please fill in all required fields" language={currentLanguage} />);
      setIsSubmitting(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error(<TranslateText text="Please enter a valid email address" language={currentLanguage} />);
      setIsSubmitting(false);
      return;
    }

    // Simulate sending quote request
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(
        <TranslateText text="Quote request sent successfully!" language={currentLanguage} />,
        {
          description: <TranslateText text="We will contact you within 24 hours" language={currentLanguage} />
        }
      );
      
      setIsOpen(false);
      setFormData({ name: '', email: '', phone: '', numberOfPeople: 1 });
    } catch (error) {
      toast.error(<TranslateText text="Error sending request. Please try again." language={currentLanguage} />);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPhonePlaceholder = () => {
    return currentLanguage === 'JP' ? '+81 90 1234 5678' : '+33 1 23 45 67 89';
  };

  const getEmailPlaceholder = () => {
    return currentLanguage === 'JP' ? 'あなた@email.com' : 'votre@email.com';
  };

  const getNamePlaceholder = () => {
    return currentLanguage === 'JP' ? 'あなたの氏名' : 'Votre nom complet';
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            <TranslateText text="Request a Quote" language={currentLanguage} />
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Trip Summary Card */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader className="pb-3">
              <div className="text-center">
                <p className="text-gray-700 text-sm font-medium mb-2">
                  <TranslateText text="Get a personalized quote for your Tunisia trip" language={currentLanguage} />
                </p>
                <div className="flex justify-center items-center gap-6 text-sm">
                  <div className="flex items-center gap-1 text-blue-600">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">{selectedDays}</span>
                    <TranslateText text="days" language={currentLanguage} />
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <MapPin className="h-4 w-4" />
                    <span className="font-medium">{selectedActivities.length}</span>
                    <TranslateText text="activities" language={currentLanguage} />
                  </div>
                  <div className="flex items-center gap-1 text-purple-600">
                    <Hotel className="h-4 w-4" />
                    <span className="font-medium">{selectedHotels.length + selectedGuestHouses.length}</span>
                    <TranslateText text="accommodations" language={currentLanguage} />
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Contact Form */}
          <Card className="border-0 shadow-sm">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2 text-gray-700">
                      <User className="h-4 w-4 text-blue-500" />
                      <TranslateText text="Full Name" language={currentLanguage} />
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder={getNamePlaceholder()}
                      required
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="numberOfPeople" className="flex items-center gap-2 text-gray-700">
                      <Users className="h-4 w-4 text-blue-500" />
                      <TranslateText text="Number of People" language={currentLanguage} />
                    </Label>
                    <Input
                      id="numberOfPeople"
                      name="numberOfPeople"
                      type="number"
                      min="1"
                      max="20"
                      value={formData.numberOfPeople}
                      onChange={handleInputChange}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2 text-gray-700">
                    <Mail className="h-4 w-4 text-blue-500" />
                    <TranslateText text="Email" language={currentLanguage} />
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={getEmailPlaceholder()}
                    required
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2 text-gray-700">
                    <Phone className="h-4 w-4 text-blue-500" />
                    <TranslateText text="Phone" language={currentLanguage} />
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder={getPhonePlaceholder()}
                    required
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-3 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <TranslateText text="Cancel" language={currentLanguage} />
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                        <TranslateText text="Sending..." language={currentLanguage} />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        <TranslateText text="Send Request" language={currentLanguage} />
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
