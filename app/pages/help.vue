<template>
  <InfoPage title="Help Center" subtitle="Answers to the questions we hear most.">
    <div class="not-prose space-y-3">
      <details v-for="(faq, i) in faqs" :key="i" class="group bg-white rounded-xl border border-gray-200 overflow-hidden">
        <summary class="flex items-center justify-between cursor-pointer px-5 py-4 font-semibold text-gray-900 select-none">
          {{ faq.q }}
          <svg class="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div class="px-5 pb-5 text-gray-600 text-sm leading-relaxed" v-html="faq.a"></div>
      </details>
    </div>

    <div class="not-prose mt-10 text-center bg-gray-50 rounded-xl p-8">
      <h3 class="text-lg font-bold text-gray-900 mb-2">Still need help?</h3>
      <p class="text-gray-600 text-sm mb-5">Our team is a message away.</p>
      <NuxtLink to="/contact" class="inline-flex items-center px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-lg transition-colors">
        Contact Support
      </NuxtLink>
    </div>
  </InfoPage>
</template>

<script setup>
const faqs = [
  { q: 'How do I place an order?', a: 'Browse our products, add items to your cart, and proceed to checkout. Fill in your delivery details and choose a payment method — our team then confirms your order by phone or WhatsApp.' },
  { q: 'What payment methods do you accept?', a: 'We accept Cash on Delivery and Mobile Money (M-Pesa, Tigo Pesa, Airtel Money).' },
  { q: 'Are your products authentic?', a: 'Yes. Every item is 100% authentic and sourced from trusted international suppliers. Authenticity is guaranteed.' },
  { q: 'How long does delivery take?', a: 'Same or next day within Dar es Salaam, and 2–5 business days to other regions. See our <a href="/shipping" class="text-yellow-600">Shipping page</a> for details.' },
  { q: 'Can I return an item?', a: 'Yes, within 7 days if the item is unused and in original packaging. See our <a href="/returns" class="text-yellow-600">Returns policy</a>.' },
  { q: 'Do I need an account to shop?', a: 'No — you can check out as a guest. Creating an account lets you track orders and check out faster next time.' }
]

useHead({ title: 'Help Center - Global Authentic TZ' })
</script>
