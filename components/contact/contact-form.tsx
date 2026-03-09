'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema } from '@/lib/validators';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

export function ContactForm() {
  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      message: '',
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error('Request failed');
      toast.success('Message sent. We will reply shortly.');
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error('Unable to send message. Please WhatsApp us instead.');
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="text-sm text-gray-600">Full name</label>
        <Input {...form.register('fullName')} />
      </div>
      <div>
        <label className="text-sm text-gray-600">Phone</label>
        <Input {...form.register('phone')} />
      </div>
      <div>
        <label className="text-sm text-gray-600">Email</label>
        <Input {...form.register('email')} />
      </div>
      <div>
        <label className="text-sm text-gray-600">Message</label>
        <Textarea rows={4} {...form.register('message')} />
      </div>
      <Button type="submit" className="w-full">
        Send message
      </Button>
    </form>
  );
}
