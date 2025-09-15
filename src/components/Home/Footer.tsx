import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"
import Image from "next/image"

const usefulLinks = [
  "Blog",
  "Privacy",
  "Terms",
  "FAQs",
  "Security",
  "Contact",
  "Partner",
  "Franchise",
  "Seller",
  "Warehouse",
  "Deliver",
  "Resources",
  "Recipes",
  "Bistro",
]

const categories = [
  "Vegetables & Fruits",
  "Cold Drinks & Juices",
  "Bakery & Biscuits",
  "Dry Fruits, Masala & Oil",
  "Paan Corner",
  "Pharma & Wellness",
  "Personal Care",
  "Beauty & Cosmetics",
  "Electronics & Electricals",
  "Toys & Games",
  "Rakhi Gifts",
  "Dairy & Breakfast",
  "Instant & Frozen Food",
  "Sweet Tooth",
  "Sauces & Spreads",
  "Organic & Premium",
  "Cleaning Essentials",
  "Ice Creams & Frozen Desserts",
  "Fashion & Accessories",
  "Stationery Needs",
  "Print Store",
  "Munchies",
  "Tea, Coffee & Health Drinks",
  "Atta, Rice & Dal",
  "Chicken, Meat & Fish",
  "Baby Care",
  "Home & Office",
  "Pet Care",
  "Kitchen & Dining",
  "Books",
  "E-Gift Cards",
]

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-10">
      {/* Top Links */}
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 py-10 px-6">
        {/* Useful Links */}
        <div>
          <h3 className="font-bold mb-4">Useful Links</h3>
          <div className="grid grid-cols-2 gap-y-2 text-gray-600 text-sm">
            {usefulLinks.map((link, idx) => (
              <span key={idx} className="cursor-pointer hover:text-black">
                {link}
              </span>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="md:col-span-2">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            Categories{" "}
            <span className="text-green-600 text-sm cursor-pointer hover:underline">
              see all
            </span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-2 gap-x-6 text-gray-600 text-sm">
            {categories.map((cat, idx) => (
              <span key={idx} className="cursor-pointer hover:text-black">
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t py-4 text-center text-sm text-gray-500 flex flex-col md:flex-row items-center justify-between container mx-auto px-6">
        <p>© Blink Commerce Private Limited, 2016-2025</p>

        {/* App + Social */}
        <div className="flex items-start md:items-end gap-4">
          {/* Social media icons */}
          <div className="flex gap-4 text-xl text-gray-600">
            <div className="bg-[#000] rounded-xl p-2 hover:bg-[#fff] hover:text-[#000]"><Facebook size={20} /></div>
            <div className="bg-[#000] rounded-xl p-2 hover:bg-[#fff] hover:text-[#000]"><Twitter size={20} /></div>
            <div className="bg-[#000] rounded-xl p-2 hover:bg-[#fff] hover:text-[#000]"><Instagram size={20} /></div>
            <div className="bg-[#000] rounded-xl p-2 hover:bg-[#fff] hover:text-[#000]"><Linkedin size={20} /></div>
          </div>
        </div>
       
      </div>
    </footer>
  )
}
