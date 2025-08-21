"use client";

import Link from "next/link";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { useState } from "react";
import LoginModal from "@/components/LoginModal"; // Ensure modal import

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);

  const openLoginModal = () => {
    setShowLogin(true);
  };

  return (
    <div className="w-full min-h-screen bg-bg font-montserrat text-text">
      {/* Hero Section */}
      <section className="hero relative">
        <div className="container hero-inner grid md:grid-cols-2 gap-12 py-16 items-center">
          
          {/* Left Column */}
          <div className="hero-copy space-y-6">
            <h1 className="text-5xl font-bold leading-tight text-gray-900">
              Earn money by taking surveys & playing games
            </h1>
            <p className="lead text-gray-700 max-w-xl mt-4">
              Fast payouts, fair rewards. Join a global community completing surveys and light games from trusted partners.
            </p>

            <div className="hero-cta flex gap-4 mt-8">
              <Button onClick={openLoginModal} variant="gradient" large>
                Get started — it’s free
              </Button>
              <Button onClick={openLoginModal} variant="secondary" large>
                I already have an account
              </Button>
            </div>

            <ul className="hero-points list-disc ml-5 mt-6 text-muted space-y-1 text-gray-600">
              <li>✔ Average survey time: 5–15 minutes</li>
              <li>✔ Multiple payout options</li>
              <li>✔ Fraud prevention to protect rewards</li>
            </ul>
          </div>

          {/* Right Column */}
          <div className="hero-visual flex justify-center">
            <Card className="stat max-w-sm w-full">
              <div className="stat-top flex justify-between items-center">
                <span className="stat-title text-gray-500">Total Paid</span>
                <span className="stat-amount font-bold text-2xl text-gray-900">$10000+</span>
              </div>
              <div className="stat-chart mt-4 h-36 bg-gradient-to-b from-blue-200/25 to-pink-200/15 rounded-lg" aria-hidden="true"></div>
              <div className="stat-bottom mt-2">
                <span className="tiny text-gray-500">Last updated just now</span>
              </div>
            </Card>
          </div>

        </div>
      </section>

      {/* Trust Section */}
      <section className="trust container py-16">
        <div className="trust-grid grid md:grid-cols-3 gap-6">
          <Card className="trust-item p-6">
            <h3 className="font-semibold mb-2">Fast payouts</h3>
            <p>Cash out once you reach the minimum threshold with PayPal, gift cards and more.</p>
          </Card>
          <Card className="trust-item p-6">
            <h3 className="font-semibold mb-2">Fair rewards</h3>
            <p>We share more of the value back to you. Your time matters.</p>
          </Card>
          <Card className="trust-item p-6">
            <h3 className="font-semibold mb-2">Anti-fraud</h3>
            <p>Multiple checks keep the platform clean and advertisers happy.</p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta container">
        <Card className="cta-card  gap-6">
          <h2 className="text-3xl font-bold text-gray-900">Ready to earn?</h2>
          <p>Create your free account and see available surveys tailored to you.</p>
          <Link href="/signup">
            <Button variant="gradient" fullWidth large>Sign up</Button>
          </Link>
        </Card>
      </section>

      {/* Footer removed! It is handled by SiteLayout */}
      
      {/* Login Modal */}
      {showLogin && (
        <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      )}
    </div>
  );
}
