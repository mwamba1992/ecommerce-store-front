<template>
  <div class="max-w-[1184px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
    <Breadcrumbs :crumbs="crumbs" class="mb-6" />

    <header class="max-w-3xl mb-12">
      <h1 class="title text-4xl sm:text-5xl mb-4">About Global Authentic TZ</h1>
      <p class="text-xl text-gray-600 leading-relaxed">Your trusted partner for authentic international products in Tanzania</p>
    </header>

    <!-- Our Story -->
    <section class="card p-6 sm:p-10 mb-12">
      <h2 class="text-[22px] leading-8 font-semibold text-gray-900 mb-4">Our story</h2>
      <div class="space-y-4 text-gray-700 leading-relaxed max-w-3xl">
        <p>
          Global Authentic TZ was founded with a simple mission: to bring authentic international smartwatches and wearables to Tanzania. We believe that everyone deserves access to genuine, quality products at fair prices.
        </p>
        <p>
          What started as a passion for technology has grown into a trusted e-commerce platform serving customers across Tanzania. We carefully source every product directly from manufacturers to ensure authenticity and quality.
        </p>
        <p>
          Our commitment to customer satisfaction drives everything we do. From verifying product authenticity to providing responsive customer service via WhatsApp, we're here to make your shopping experience exceptional.
        </p>
      </div>
    </section>

    <!-- Our Values -->
    <section class="mb-12">
      <h2 class="text-[22px] leading-8 font-semibold text-gray-900 mb-2">Our values</h2>
      <p class="text-gray-600 mb-6">These core principles guide our business and shape every decision we make</p>
      <ul class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <li v-for="value in values" :key="value.title" class="card p-6">
          <span class="w-11 h-11 rounded-full bg-gray-100 text-gray-900 flex items-center justify-center mb-4">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="value.icon" /></svg>
          </span>
          <h3 class="text-base font-semibold text-gray-900 mb-1.5">{{ value.title }}</h3>
          <p class="text-[15px] text-gray-600 leading-relaxed">{{ value.body }}</p>
        </li>
      </ul>
    </section>

    <!-- Why Choose Us -->
    <section class="mb-12">
      <h2 class="text-[22px] leading-8 font-semibold text-gray-900 mb-2">Why choose Global Authentic TZ?</h2>
      <p class="text-gray-600 mb-6">We offer more than just products – we provide a complete shopping experience</p>
      <ul class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <li v-for="reason in reasons" :key="reason.title" class="card p-6 flex gap-4">
          <span class="w-11 h-11 rounded-full bg-gray-100 text-gray-900 flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="reason.icon" /></svg>
          </span>
          <div>
            <h3 class="text-base font-semibold text-gray-900 mb-1.5">{{ reason.title }}</h3>
            <p class="text-[15px] text-gray-600 leading-relaxed">{{ reason.body }}</p>
          </div>
        </li>
      </ul>
    </section>

    <!-- Contact CTA -->
    <section class="rounded-tile bg-gray-900 text-white p-8 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h2 class="text-2xl font-semibold mb-2">Ready to start shopping?</h2>
        <p class="text-gray-300">Browse our collection of authentic smartwatches and wearables</p>
      </div>
      <div class="flex flex-col sm:flex-row gap-3 flex-shrink-0">
        <NuxtLink to="/products" class="btn-secondary">Browse products</NuxtLink>
        <a href="https://wa.me/255789947608" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center h-[52px] px-7 rounded-md border border-white text-white hover:bg-white hover:text-gray-900 transition-colors">Contact us on WhatsApp</a>
      </div>
    </section>
  </div>
</template>

<script setup>
import { breadcrumbJsonLd } from '#shared/utils/seo'

const crumbs = [
  { name: 'Home', path: '/' },
  { name: 'About us', path: '/about' }
]

const values = [
  { title: '100% Authentic', body: 'All products are sourced directly from authorized distributors. We guarantee authenticity on every purchase.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  { title: 'Customer Focused', body: 'Your satisfaction is our priority. Fast WhatsApp support and responsive service for every customer.', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  { title: 'Fair Pricing', body: 'Honest pricing with no hidden fees. What you see is what you pay – simple and transparent.', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
]

const reasons = [
  { title: 'Fast Delivery Across Tanzania', body: 'Quick processing and reliable delivery to all major cities in Tanzania. Track your order every step of the way.', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' },
  { title: 'Flexible Payment Options', body: 'Pay on delivery or via mobile money (M-Pesa, Tigo Pesa, Airtel Money). Choose what works best for you.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  { title: 'WhatsApp Support', body: 'Get instant help via WhatsApp. Our team responds quickly to answer questions and assist with orders.', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
  { title: 'Quality Guarantee', body: "Every product is verified for authenticity. If you're not satisfied, we'll make it right.", icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' }
]

useSeo({
  title: 'About Us | Global Authentic TZ',
  description: 'Learn about Global Authentic TZ and our commitment to bringing authentic international smartwatches and wearables to Tanzania.',
  path: '/about',
  jsonLd: [breadcrumbJsonLd(crumbs, useSiteUrl())]
})
</script>
