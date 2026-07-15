<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
    <div class="text-center mb-10">
      <h1 class="text-3xl sm:text-4xl font-black text-gray-900">Get In <span class="text-yellow-500">Touch</span></h1>
      <p class="text-gray-600 mt-2">We usually reply within a few hours. Reach us on WhatsApp for the fastest response.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <!-- Contact info -->
      <div class="lg:col-span-2 space-y-4">
        <a href="https://wa.me/255789947608" target="_blank" rel="noopener noreferrer" class="flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-200 hover:border-yellow-400 transition-colors">
          <div class="w-11 h-11 rounded-lg bg-green-500 text-white flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487 3.181 1.309 3.181.873 3.753.819.572-.055 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
          </div>
          <div>
            <p class="font-bold text-gray-900">WhatsApp</p>
            <p class="text-sm text-gray-600">+255 789 947 608</p>
          </div>
        </a>
        <a href="tel:+255789947608" class="flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-200 hover:border-yellow-400 transition-colors">
          <div class="w-11 h-11 rounded-lg bg-gray-900 text-yellow-400 flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
          </div>
          <div>
            <p class="font-bold text-gray-900">Call Us</p>
            <p class="text-sm text-gray-600">+255 789 947 608</p>
          </div>
        </a>
        <a href="mailto:info@globalauthentic.co.tz" class="flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-200 hover:border-yellow-400 transition-colors">
          <div class="w-11 h-11 rounded-lg bg-yellow-400 text-black flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          </div>
          <div>
            <p class="font-bold text-gray-900">Email</p>
            <p class="text-sm text-gray-600">info@globalauthentic.co.tz</p>
          </div>
        </a>
        <div class="flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-200">
          <div class="w-11 h-11 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </div>
          <div>
            <p class="font-bold text-gray-900">Visit Us</p>
            <p class="text-sm text-gray-600">Kariakoo, Dar es Salaam, Tanzania</p>
          </div>
        </div>
      </div>

      <!-- Contact form -->
      <div class="lg:col-span-3">
        <form @submit.prevent="submitForm" class="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 space-y-5">
          <div v-if="sent" class="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            Thanks for reaching out! We'll get back to you shortly.
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">Name *</label>
              <input v-model="form.name" required type="text" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 outline-none transition-all text-sm" placeholder="Your name" />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">Phone *</label>
              <input v-model="form.phone" required type="tel" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 outline-none transition-all text-sm" placeholder="+255 XXX XXX XXX" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-900 mb-2">Email</label>
            <input v-model="form.email" type="email" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 outline-none transition-all text-sm" placeholder="you@example.com" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-900 mb-2">Message *</label>
            <textarea v-model="form.message" required rows="5" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 outline-none transition-all text-sm resize-none" placeholder="How can we help?"></textarea>
          </div>
          <button type="submit" class="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-lg transition-colors">
            Send Message
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
const form = reactive({ name: '', phone: '', email: '', message: '' })
const sent = ref(false)

const submitForm = () => {
  // Hand off to WhatsApp with a prefilled message
  const text = `Hello Global Authentic TZ,%0AName: ${form.name}%0APhone: ${form.phone}%0A${form.email ? 'Email: ' + form.email + '%0A' : ''}Message: ${form.message}`
  window.open(`https://wa.me/255789947608?text=${text}`, '_blank')
  sent.value = true
}

useHead({ title: 'Contact Us - Global Authentic TZ' })
</script>
