
import React from "react";
import Header from "../components/Header";

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container py-8">
        <section className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-medblue-600 to-medcyan-500 bg-clip-text text-transparent">
            About MediCompare
          </h1>
          
          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold mt-8 mb-4">ABSTRACT</h2>
            <p className="mb-4">
              Medicompare's goal is to enhance healthcare accessibility and 
              affordability through a platform that assists individuals in comparing 
              medication prices and discovering choices.
            </p>
            
            <ul className="space-y-4 list-disc pl-6">
              <li>
                <strong>Approach:</strong> The user-friendly interface enables individuals to 
                personalize their searches according to factors, like cost and product 
                availability.
              </li>
              <li>
                <strong>Current Status:</strong> Key features, such as searching for medications and 
                comparing prices, have been thoroughly evaluated during the app 
                development process. Initial user testing has shown the app to be 
                efficient.
              </li>
              <li>
                <strong>List of accomplishments:</strong> Established a database containing more 
                than 10 thousand medications. The feedback, from beta testing has 
                been greater than 85 % of users are satisfied, with the product.
              </li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">INTRODUCTION</h2>
            <ul className="space-y-4 list-disc pl-6">
              <li>
                <strong>Background:</strong> Online medicine shopping has grown significantly, but users often 
                struggle with comparing prices and availability across multiple platforms. Many face 
                delays and increased costs due to the lack of a unified comparison tool.
              </li>
              <li>
                <strong>Objective:</strong> The goal of MediCompare is to provide users with an easy-to-use platform 
                to compare medicine prices, check availability, and suggest alternative medicines of 
                stockouts.
              </li>
              <li>
                <strong>Scope:</strong> MediCompare will target users in India, focusing on price comparison, 
                availability tracking, and alternative medicine suggestions across multiple online 
                pharmacies and e-commerce sites.
              </li>
              <li>
                <strong>Significance:</strong> This project aims to improve accessibility, affordability, and convenience 
                for users, ultimately helping them make informed and cost-effective healthcare 
                decisions.
              </li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">LITERATURE SURVEY</h2>
            <ul className="space-y-4 list-disc pl-6">
              <li>
                <strong>Review of existing work:</strong> Services such as GoodRx and 1mg have made it easier 
                for people to compare medicine prices and check availability through their tools. 
                Moreover, studies underline the impact of medications in cutting down healthcare 
                expenses with research indicating potential cost reductions of up to 80% upon 
                transitioning from branded to generic drugs (as reported by the World Health 
                Organization in 2020).
              </li>
              <li>
                <strong>Comparative analysis:</strong> Though current platforms excel enough in some aspects, 
                they can be somewhat restricted in their reach and capabilities at times for instance 
                GoodRx excels in price comparisons but does not provide alternative suggestions 
                for cheaper medications, limiting user flexibility.
              </li>
            </ul>
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

export default About;
