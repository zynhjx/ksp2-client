import Image from "next/image";
import React from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import {ChevronRight} from "lucide-react";

const Section = ({ children, className, containerClassName, id } : { children: React.ReactNode, className?: string, containerClassName?: string, id?: string }) => {
    return (
        <section id={id} className={`py-16 md:py-24 px-6 flex justify-center items-center ${className || ""}`}>
            <div className={`w-full max-w-7xl ${containerClassName || ""}`}>
                {children}
            </div>
        </section>
    )
}

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => {
    return (
        <div className="p-8 rounded-2xl border border-gray-100 bg-white hover:border-blue-100 hover:shadow-xl hover:shadow-blue-50/50 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-theme-blue group-hover:text-white transition-colors duration-300 text-theme-blue">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
            <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
    )
}

const StatItem = ({ label, value }: { label: string, value: string }) => {
    return (
        <div className="flex flex-col items-center text-center">
            <span className="text-4xl md:text-5xl  text-theme-blue mb-2">{value}</span>
            <span className="text-sm uppercase tracking-widest font-semibold text-gray-500">{label}</span>
        </div>
    )
}

const LandingPage = () => {
    // const {user, isAuthenticated} =

    return (
        <div className="min-h-screen bg-white">
            <header className="sticky top-0 z-50 bg-white backdrop-blur-md border-b border-gray-100 flex items-center justify-center">
                <div className="relative flex items-center justify-between h-20 w-full max-w-7xl px-6">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <Image src="/dark-theme-logo.svg" alt="logo" loading={"eager"} width={140} height={45} className="w-auto h-8 md:h-10" />
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-8 text-sm font-medium text-gray-600">
                        <a href="#features" className="hover:text-theme-blue transition">Features</a>
                        <a href="#about" className="hover:text-theme-blue transition">About</a>
                        <a href="#impact" className="hover:text-theme-blue transition">Impact</a>
                    </nav>

                    {/* Right buttons */}
                    <div className="flex items-center gap-3">
                        <Link href="/auth/login" className="hidden sm:block px-5 py-2.5 rounded-xl bg-transparent text-gray-700 hover:bg-gray-100 transition cursor-pointer font-semibold text-sm">
                            Sign In
                        </Link>

                        <Link href="/auth/register" className="px-5 py-2.5 rounded-xl bg-theme-blue text-white cursor-pointer font-semibold text-sm hover:opacity-90 transition shadow-lg shadow-blue-900/20">
                            Get Started
                        </Link>
                    </div>
                </div>
            </header>

            <main>
                {/* Hero Section */}
                <Section className="relative overflow-hidden pt-12 md:pt-20">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full -z-10 opacity-10">
                        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-400 rounded-full blur-[120px]"></div>
                        <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-400 rounded-full blur-[120px]"></div>
                    </div>

                    <div className="flex flex-col items-center text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-theme-blue text-sm font-bold mb-8 animate-fade-in">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            Now supporting all West Coast Barangays
                        </div>

                        <h1 className="text-5xl md:text-7xl  tracking-tight font-bold text-gray-900 mb-8 max-w-4xl leading-[1.1]">
                            The Future of <span className="text-theme-blue">Youth Data</span> Management
                        </h1>

                        <p className="text-xl text-gray-600 max-w-2xl mb-12 leading-relaxed">
                            A comprehensive Youth Profiling System and PYDP Implementation Platform designed specifically for Sangguniang Kabataan officials.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                            {/*{isAuthenticated ? (*/}
                            {/*  <Link*/}
                            {/*    href={user.role === "official" ? "/dashboard" : "/youth/profile"}*/}
                            {/*    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-theme-blue flex items-center justify-center text-white font-bold text-lg hover:shadow-xl hover:shadow-blue-900/30 transition-all cursor-pointer text-center"*/}
                            {/*  >*/}
                            {/*      Go to Dashboard <ChevronRight className="ml-3" />*/}
                            {/*  </Link>*/}
                            {/*) : (*/}
                            {/*  <>*/}
                                  <Link
                                    href="/auth/register"
                                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-theme-blue flex items-center justify-center text-white font-bold text-lg hover:shadow-xl hover:shadow-blue-900/30 transition-all cursor-pointer text-center"
                                  >
                                      Become a Youth Member <ChevronRight className="ml-3" />
                                  </Link>
                                  <Link
                                    href="/auth/login"
                                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-gray-700 border border-gray-200 font-bold text-lg hover:bg-gray-50 transition cursor-pointer text-center"
                                  >
                                      Sign In to Dashboard
                                  </Link>
                            {/*  </>*/}
                            {/*)}*/}
                        </div>
                    </div>
                </Section>

                {/* Impact/Stats Section */}
                {/*<Section id="impact" className="bg-gray-50/50 border-y border-gray-100">*/}
                {/*    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">*/}
                {/*        <StatItem label="Registered Youth" value="12k+" />*/}
                {/*        <StatItem label="Barangays" value="48" />*/}
                {/*        <StatItem label="PYDP Projects" value="150+" />*/}
                {/*        <StatItem label="Satisfaction" value="99%" />*/}
                {/*    </div>*/}
                {/*</Section>*/}

                {/* Features Section */}
                <Section id="features">
                    <div className="flex flex-col items-center mb-16 text-center">
                        <h2 className="text-3xl md:text-5xl  font-bold text-gray-900 mb-6">Built for Youth Leaders</h2>
                        <div className="w-20 h-1.5 bg-theme-blue rounded-full mb-6"></div>
                        <p className="text-gray-600 max-w-2xl text-lg">
                            Everything you need to manage your community, monitor progress, and make data-driven decisions for your constituents.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>}
                            title="Statistical Profiling"
                            description="Automatically categorize and visualize youth data by age, education, and employment status."
                        />
                        <FeatureCard
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>}
                            title="PYDP Management"
                            description="Track your Local Youth Development Plan implementation with milestones and resource tracking."
                        />
                        <FeatureCard
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>}
                            title="Bank-Grade Security"
                            description="We use enterprise-level encryption to ensure all constituent data remains private and secure."
                        />
                        <FeatureCard
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>}
                            title="Automated Reporting"
                            description="Generate DILG-compliant reports with a single click, saving hours of manual paperwork."
                        />
                        <FeatureCard
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>}
                            title="Community Feedback"
                            description="Integrated survey tools to hear directly from the youth about your projects and initiatives."
                        />
                        <FeatureCard
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>}
                            title="Rapid Deployment"
                            description="Get your barangay set up and running in less than 30 minutes with our easy onboarding."
                        />
                    </div>
                </Section>

                {/* CTA Section */}
                <Section className="bg-theme-blue text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white/10 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-blue-400/20 rounded-full blur-[100px]"></div>

                    <div className="flex flex-col items-center text-center relative z-10 py-10">
                        <h2 className="text-3xl md:text-5xl  mb-8 font-bold max-w-3xl leading-tight">Ready to transform your youth governance?</h2>
                        <p className="text-xl text-blue-100 mb-12 max-w-2xl">
                            Join over 40 barangays already using the Kabataan Statistical Profile to serve their communities better.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/auth/register" className="px-10 py-5 rounded-2xl bg-white text-theme-blue font-bold text-xl hover:shadow-2xl hover:bg-blue-50 transition cursor-pointer text-center">
                                Get Started for Free
                            </Link>
                        </div>
                    </div>
                </Section>
            </main>

            <Footer />
        </div>
    );
};

export default LandingPage;