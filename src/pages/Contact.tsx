
import React from "react";
import Header from "../components/Header";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container py-8">
        <section className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-medblue-600 to-medcyan-500 bg-clip-text text-transparent">
            Contact Us
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
              <p className="text-muted-foreground mb-6">
                Have questions about MediCompare? We're here to help! Reach out to our team using any of the methods below.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-medblue-600 mt-1" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-muted-foreground">support@medicompare.com</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-medblue-600 mt-1" />
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p className="text-muted-foreground">+91 98765 43210</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-medblue-600 mt-1" />
                  <div>
                    <h3 className="font-medium">Address</h3>
                    <p className="text-muted-foreground">
                      MediCompare Technologies<br />
                      123 Health Street, Tech Park<br />
                      Bangalore 560001, India
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">Send us a Message</h2>
              
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="Your name" 
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="Your email" 
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                  <textarea 
                    id="message" 
                    rows={5} 
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="Your message" 
                  ></textarea>
                </div>
                
                <button 
                  type="submit"
                  className="bg-medblue-600 text-white px-4 py-2 rounded-md hover:bg-medblue-700 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t mt-16 py-8 bg-muted/40">
        <div className="container text-center text-sm text-muted-foreground">
          <p className="mb-2">© {new Date().getFullYear()} MediCompare. All rights reserved.</p>
          <p>MediCompare is for informational purposes only. Always consult with a healthcare professional.</p>
        </div>
      </footer>
    </div>
  );
};

export default Contact;
