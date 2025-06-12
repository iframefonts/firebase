
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-background text-foreground py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="flex flex-col md:flex-row gap-12 md:gap-16">
          <div className="md:w-1/4 text-left">
            <h3 className="text-xl font-domine mb-4">LogoDrop</h3>
            <p className="text-muted-foreground">Making logo organization simple for designers and agencies worldwide.</p>
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
            <div className="text-left">
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground text-sm font-medium font-inter">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground text-sm font-medium font-inter">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground text-sm font-medium font-inter">API</a></li>
              </ul>
            </div>
            <div className="text-left">
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground text-sm font-medium font-inter">About</a></li>
                <li><a href="#" className="hover:text-foreground text-sm font-medium font-inter">Blog</a></li>
                <li><a href="#" className="hover:text-foreground text-sm font-medium font-inter">Careers</a></li>
              </ul>
            </div>
            <div className="text-left">
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground text-sm font-medium font-inter">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground text-sm font-medium font-inter">Contact</a></li>
                <li><a href="#" className="hover:text-foreground text-sm font-medium font-inter">Privacy</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full border-t border-border mt-12 pt-8 px-4 sm:px-6 lg:px-8">
        <p className="text-muted-foreground text-left">&copy; 2025 LogoDrop. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
