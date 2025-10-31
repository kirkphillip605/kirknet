"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { showLoading, showSuccess, showError } from "@/utils/toast";
import { ArrowLeft } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  businessName: z.string().optional(),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  service: z.enum(["msp", "app-development", "web-development", "software-development", "it-consultation", "other"]),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export function ContactPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      businessName: "",
      phone: "",
      email: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const toastId = showLoading("Sending your message...");

    const { error } = await supabase.functions.invoke("send-contact-email", {
        body: values,
    });

    if (error) {
        showError("Failed to send message. Please try again.");
        console.error("Error sending message:", error);
    } else {
        showSuccess("Message sent successfully! We'll be in touch soon.");
        form.reset();
    }
  }

  return (
    <div className="bg-white text-gray-800 font-sans">
        <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 border-b">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
            <Link to="/">
                <img src="/kirknetlogo.png" alt="KirkNetworks Logo" className="h-12" />
            </Link>
            </div>
        </header>
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="mb-8">
                <Link to="/" className="inline-flex items-center text-blue-700 hover:text-blue-800 transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Link>
            </div>
            <div className="max-w-2xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4 text-center">Contact Us</h1>
                <p className="text-lg text-gray-600 mb-8 text-center">
                    Have a question or ready to start a project? Fill out the form below and we'll get back to you shortly.
                </p>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="businessName"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Business Name (Optional)</FormLabel>
                                <FormControl>
                                <Input placeholder="Acme Inc." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                <Input placeholder="you@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                <Input placeholder="(555) 123-4567" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="service"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Service of Interest</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                <SelectValue placeholder="Select a service" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="msp">Managed Services (MSP)</SelectItem>
                                <SelectItem value="app-development">App Development</SelectItem>
                                <SelectItem value="web-development">Web Development</SelectItem>
                                <SelectItem value="software-development">Software Development</SelectItem>
                                <SelectItem value="it-consultation">IT Consultation</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                            <Textarea
                                placeholder="Tell us a little bit about your project or question..."
                                className="resize-none"
                                rows={6}
                                {...field}
                            />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white" size="lg">
                        Send Message
                    </Button>
                </form>
                </Form>
            </div>
        </main>
    </div>
  );
}