import { useState } from "react";
import { Link } from "react-router-dom";

const plans = [
    {
        id: "basic",
        name: "Basic",
        description: "Perfect for small events and intimate gatherings.",
        monthlyPrice: "Rp500K",
        yearlyPrice: "Rp4.800K",
        features: [
            "1 Photographer",
            "2 Hours Coverage",
            "20 Edited Photos",
            "Online Delivery",
        ],
        featured: false,
    },
    {
        id: "standard",
        name: "Standard",
        description: "Ideal for medium events that need full creative output.",
        monthlyPrice: "Rp1.200K",
        yearlyPrice: "Rp11.500K",
        features: [
            "2 Photographers",
            "5 Hours Coverage",
            "60 Edited Photos",
            "Highlight Album",
        ],
        featured: true,
    },
    {
        id: "premium",
        name: "Premium",
        description: "End-to-end full coverage experience for big occasions.",
        monthlyPrice: "Rp2.500K",
        yearlyPrice: "Rp24.000K",
        features: [
            "3 Photographers",
            "Full Day Coverage",
            "150+ Edited Photos",
            "Photo + Video",
        ],
        featured: false,
    },
];

const Reserve = () => {
    const [isYearly, setIsYearly] = useState(false);

    return (
        <section
            id="packages"
            className="min-h-screen bg-[#063D30] px-6 py-20"
        >
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <p className="text-[#f5d000] text-sm font-bold tracking-widest uppercase mb-3">
                        Pricing
                    </p>
                    <h1
                        className="text-[56px] md:text-[72px] leading-none font-black text-white"
                        style={{ fontFamily: "'Anton', sans-serif" }}
                    >
                        Affordable Plans <br /> For Everyone.
                    </h1>
                </div>

                {/* Toggle */}
                <div className="flex items-center justify-center gap-3 mb-12">
                    <span
                        className={`text-sm font-semibold ${
                            !isYearly ? "text-white" : "text-gray-400"
                        }`}
                    >
                        Monthly
                    </span>

                    <button
                        onClick={() => setIsYearly(!isYearly)}
                        className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${
                            isYearly ? "bg-[#f5d000]" : "bg-gray-500"
                        }`}
                        aria-label="Toggle billing period"
                    >
                        <span
                            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${
                                isYearly ? "translate-x-6" : "translate-x-0"
                            }`}
                        />
                    </button>

                    <span
                        className={`text-sm font-semibold ${
                            isYearly ? "text-white" : "text-gray-400"
                        }`}
                    >
                        Yearly
                    </span>
                </div>

                {/* Cards */}
                <div className="grid md:grid-cols-3 gap-6 items-stretch">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className="bg-[#f0ede6] rounded-2xl p-6 flex flex-col justify-between overflow-hidden"
                        >
                            {/* Top */}
                            <div>
                                <h3 className="text-xl font-bold text-[#063D30] mb-1">
                                    {plan.name}
                                </h3>
                                <p className="text-sm text-gray-500 mb-6 leading-snug">
                                    {plan.description}
                                </p>

                                {/* Price */}
                                <div className="flex items-baseline gap-1 mb-6 border-b border-gray-300 pb-6">
                                    <span
                                        className="text-4xl font-black text-[#063D30] leading-none"
                                        style={{
                                            fontFamily: "'Anton', sans-serif",
                                        }}
                                    >
                                        {isYearly
                                            ? plan.yearlyPrice
                                            : plan.monthlyPrice}
                                    </span>
                                    <span className="text-xs text-gray-500 ml-1">
                                        /{isYearly ? "year" : "month"}
                                    </span>
                                </div>

                                {/* Features */}
                                <ul className="space-y-2 text-sm text-gray-700 mb-8">
                                    {plan.features.map((feature) => (
                                        <li
                                            key={feature}
                                            className="flex items-center gap-2"
                                        >
                                            <span className="text-[#063D30] font-bold">
                                                ✓
                                            </span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* CTA */}
                            <Link
                                to={`/reserve/booking/${plan.id}`}
                                className={`block text-center py-3 rounded-full font-bold text-sm transition ${
                                    plan.featured
                                        ? "bg-[#f5d000] text-[#063D30] hover:brightness-95"
                                        : "border border-[#063D30] text-[#063D30] hover:bg-[#063D30] hover:text-white"
                                }`}
                            >
                                Book Now!
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Reserve;
