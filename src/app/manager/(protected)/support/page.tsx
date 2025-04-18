"use client"

import type React from "react"

import { useState } from "react"
import { FiMessageSquare, FiHelpCircle, FiPhone, FiChevronDown, FiChevronUp } from "react-icons/fi"
import { toast } from "sonner"

interface FAQ {
  id: string
  question: string
  answer: string
  isOpen: boolean
}

export default function SupportPage() {
  const [message, setMessage] = useState("")
  const [subject, setSubject] = useState("")
  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      id: "faq1",
      question: "How do I add a new menu item?",
      answer:
        'Go to the Manage Menu page, select the appropriate service, and click on "Add New Item". Fill in the details and save the new menu item.',
      isOpen: false,
    },
    {
      id: "faq2",
      question: "How can I update the restaurant information?",
      answer:
        'Navigate to the Settings page and select "Restaurant Profile". You can update your restaurant information there including name, address, and contact details.',
      isOpen: false,
    },
    {
      id: "faq3",
      question: "How do I create a new tag for menu items?",
      answer:
        'Go to the Tags page and click on "Add New Tag". Enter the tag name, description, and optionally an icon. Then save the new tag.',
      isOpen: false,
    },
    {
      id: "faq4",
      question: "Can I export my menu as a PDF?",
      answer:
        'Yes, go to the PDFs page and click on "Generate Menu PDF". You can customize the layout and then download the generated PDF.',
      isOpen: false,
    },
    {
      id: "faq5",
      question: "How do I set up online ordering?",
      answer:
        'Online ordering can be enabled in the Settings page under "Ordering Options". You can configure payment methods, delivery areas, and other settings there.',
      isOpen: false,
    },
  ])

  const toggleFAQ = (id: string) => {
    setFaqs(faqs.map((faq) => (faq.id === id ? { ...faq, isOpen: !faq.isOpen } : faq)))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim() || !message.trim()) {
      toast.error("Please fill in all fields")
      return
    }

    toast.success("Support request submitted successfully")
    setSubject("")
    setMessage("")
  }

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-800">Support Center</h1>
        <p className="text-sm text-gray-500 mt-1">Get help with your restaurant management system</p>
      </div>

      {/* Support options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-lg p-6 bg-white">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <FiMessageSquare className="text-blue-600" size={20} />
          </div>
          <h2 className="text-lg font-medium mb-2">Chat Support</h2>
          <p className="text-sm text-gray-500 mb-4">
            Chat with our support team in real-time for immediate assistance.
          </p>
          <button className="text-sm text-blue-600 font-medium">Start Chat</button>
        </div>

        <div className="border rounded-lg p-6 bg-white">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <FiPhone className="text-green-600" size={20} />
          </div>
          <h2 className="text-lg font-medium mb-2">Phone Support</h2>
          <p className="text-sm text-gray-500 mb-4">Call our dedicated support line for personalized assistance.</p>
          <a href="tel:+18001234567" className="text-sm text-green-600 font-medium">
            +1 (800) 123-4567
          </a>
        </div>

        <div className="border rounded-lg p-6 bg-white">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <FiHelpCircle className="text-purple-600" size={20} />
          </div>
          <h2 className="text-lg font-medium mb-2">Knowledge Base</h2>
          <p className="text-sm text-gray-500 mb-4">Browse our comprehensive guides and tutorials.</p>
          <button className="text-sm text-purple-600 font-medium">View Articles</button>
        </div>
      </div>

      {/* Contact form */}
      <div className="border rounded-lg p-6 bg-white">
        <h2 className="text-lg font-medium mb-4">Send us a message</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <input
              id="subject"
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="What's your question about?"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Describe your issue or question"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800">
            Submit Request
          </button>
        </form>
      </div>

      {/* FAQs */}
      <div className="border rounded-lg p-6 bg-white">
        <h2 className="text-lg font-medium mb-4">Frequently Asked Questions</h2>
        <div className="space-y-2">
          {faqs.map((faq) => (
            <div key={faq.id} className="border rounded-md overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 text-left bg-gray-50 hover:bg-gray-100"
                onClick={() => toggleFAQ(faq.id)}
              >
                <span className="font-medium">{faq.question}</span>
                {faq.isOpen ? <FiChevronUp className="text-gray-500" /> : <FiChevronDown className="text-gray-500" />}
              </button>
              {faq.isOpen && (
                <div className="p-4 bg-white">
                  <p className="text-sm text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

