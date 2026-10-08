<template>
  <div class="max-w-[1184px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-2">SEO report</h1>
    <p class="text-gray-600 mb-6 max-w-3xl">
      Renders every product page and checks what a search engine receives: status, indexability, canonical, title,
      description, H1, structured data, image, Open Graph, sitemap entry and internal links.
    </p>

    <form @submit.prevent="run" class="flex flex-wrap items-end gap-3 mb-8">
      <div>
        <label for="token" class="block text-sm font-semibold text-gray-700 mb-1">Audit token</label>
        <input id="token" v-model="token" type="password" autocomplete="off" class="w-72 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent" />
      </div>
      <button type="submit" :disabled="running" class="px-6 py-2 bg-gray-900 text-white font-semibold rounded-lg hover:bg-yellow-400 hover:text-black transition-colors disabled:opacity-50">
        {{ running ? 'Checking every product…' : 'Run report' }}
      </button>
    </form>

    <p v-if="failure" class="p-4 mb-6 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{{ failure }}</p>

    <template v-if="report">
      <p class="text-sm text-gray-500 mb-4">{{ report.siteUrl }} · {{ new Date(report.generatedAt).toLocaleString() }}</p>

      <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div v-for="stat in stats" :key="stat.label" class="bg-white rounded-lg border border-gray-200 p-4">
          <p class="text-2xl font-bold" :class="stat.class">{{ stat.value }}</p>
          <p class="text-sm text-gray-600">{{ stat.label }}</p>
        </div>
      </div>

      <section v-if="report.site.length > 0" class="mb-8">
        <h2 class="text-lg font-bold text-gray-900 mb-3">Site-wide issues</h2>
        <ul class="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200 text-sm">
          <li v-for="(issue, index) in report.site" :key="index" class="px-4 py-3">
            <span class="font-semibold" :class="issue.severity === 'error' ? 'text-red-700' : 'text-yellow-700'">{{ issue.check }}</span>
            — {{ issue.message }}
          </li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-lg font-bold text-gray-900 mb-3">Issues by check</h2>
        <div class="flex flex-wrap gap-2">
          <button type="button" @click="check = ''" class="px-3 py-1.5 rounded-full border text-sm font-semibold" :class="check === '' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-300'">
            All
          </button>
          <button
            v-for="[name, counts] in checks"
            :key="name"
            type="button"
            @click="check = name"
            class="px-3 py-1.5 rounded-full border text-sm font-semibold"
            :class="check === name ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-300'"
          >
            {{ name }}
            <span v-if="counts.errors" class="ml-1 text-red-500">{{ counts.errors }}</span>
            <span v-if="counts.warnings" class="ml-1 text-yellow-500">{{ counts.warnings }}</span>
          </button>
        </div>
      </section>

      <section>
        <div class="flex flex-wrap items-center justify-between gap-3 mb-3">
          <h2 class="text-lg font-bold text-gray-900">Products ({{ rows.length }})</h2>
          <label class="flex items-center text-sm text-gray-700">
            <input v-model="errorsOnly" type="checkbox" class="w-4 h-4 mr-2 rounded text-yellow-400 focus:ring-yellow-400" />
            Errors only
          </label>
        </div>

        <div class="overflow-x-auto bg-white rounded-lg border border-gray-200">
          <table class="min-w-full text-sm">
            <thead class="bg-gray-50 text-left text-gray-600">
              <tr>
                <th class="px-4 py-3 font-semibold">Product</th>
                <th class="px-4 py-3 font-semibold">Issues</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="product in rows" :key="product.id" class="align-top">
                <td class="px-4 py-3 w-1/3">
                  <NuxtLink :to="product.path" target="_blank" class="font-semibold text-gray-900 hover:text-yellow-600">{{ product.name }}</NuxtLink>
                  <p class="text-xs text-gray-500">{{ product.path }} · linked from {{ product.linkedFrom }} page{{ product.linkedFrom === 1 ? '' : 's' }}</p>
                </td>
                <td class="px-4 py-3">
                  <ul class="space-y-1">
                    <li v-for="(issue, index) in visibleIssues(product)" :key="index">
                      <span class="font-semibold" :class="issue.severity === 'error' ? 'text-red-700' : 'text-yellow-700'">{{ issue.check }}</span>
                      — {{ issue.message }}
                    </li>
                  </ul>
                </td>
              </tr>
              <tr v-if="rows.length === 0">
                <td colspan="2" class="px-4 py-8 text-center text-gray-500">No products match this filter.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup>
// Internal tool. Rendered client-side only (see routeRules), excluded from
// robots.txt and the sitemap, and useless without the audit token.
const token = ref('')
const report = ref(null)
const running = ref(false)
const failure = ref('')
const check = ref('')
const errorsOnly = ref(false)

onMounted(() => {
  token.value = sessionStorage.getItem('seo-audit-token') || ''
})

const run = async () => {
  running.value = true
  failure.value = ''
  try {
    report.value = await $fetch('/api/seo/audit', { headers: { 'x-seo-audit-token': token.value } })
    sessionStorage.setItem('seo-audit-token', token.value)
  } catch (error) {
    report.value = null
    failure.value = error?.statusMessage || error?.data?.statusMessage || 'The report could not be generated.'
  } finally {
    running.value = false
  }
}

const stats = computed(() => {
  const s = report.value.summary
  return [
    { label: 'Products checked', value: s.products, class: 'text-gray-900' },
    { label: 'Passing every check', value: s.passing, class: 'text-green-600' },
    { label: 'With errors', value: s.withErrors, class: s.withErrors ? 'text-red-600' : 'text-gray-900' },
    { label: 'With content warnings', value: s.withWarnings, class: s.withWarnings ? 'text-yellow-600' : 'text-gray-900' },
    { label: 'URLs in sitemap', value: s.sitemapUrls, class: 'text-gray-900' }
  ]
})

const checks = computed(() =>
  Object.entries(report.value.summary.byCheck).sort(([, a], [, b]) => (b.errors + b.warnings) - (a.errors + a.warnings)))

const visibleIssues = (product) =>
  product.issues.filter(issue =>
    (!check.value || issue.check === check.value) && (!errorsOnly.value || issue.severity === 'error'))

// Products with something to fix under the current filter, worst first.
const rows = computed(() =>
  report.value.products
    .filter(product => visibleIssues(product).length > 0)
    .sort((a, b) => visibleIssues(b).length - visibleIssues(a).length))

useHead({ title: 'SEO report', meta: [{ name: 'robots', content: 'noindex, nofollow' }] })
</script>
