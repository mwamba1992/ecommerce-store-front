<template>
  <div class="divide-y divide-gray-100">
    <fieldset v-for="facet in facets" :key="facet.key" class="py-5 first:pt-0">
      <legend class="text-sm font-semibold text-gray-900 mb-3">{{ facet.title }}</legend>
      <ul class="space-y-2.5" :class="{ 'max-h-60 overflow-y-auto pr-1': facet.options.length > 8 }">
        <li v-for="option in facet.options" :key="option.value">
          <label class="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              :checked="modelValue[facet.key].includes(option.value)"
              @change="toggle(facet.key, option.value)"
              class="w-[18px] h-[18px] rounded border-gray-300 text-gray-900 focus:ring-gray-900"
            />
            <span class="flex-1">{{ option.label }}</span>
            <span class="text-xs text-gray-400">{{ option.count }}</span>
          </label>
        </li>
      </ul>
    </fieldset>

    <fieldset class="py-5">
      <legend class="text-sm font-semibold text-gray-900 mb-3">Price (TZS)</legend>
      <div class="flex items-center gap-2">
        <input :value="modelValue.minPrice" @input="set('minPrice', $event.target.value)" type="number" min="0" inputmode="numeric" placeholder="Min" aria-label="Minimum price" class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent" />
        <span class="text-gray-400">–</span>
        <input :value="modelValue.maxPrice" @input="set('maxPrice', $event.target.value)" type="number" min="0" inputmode="numeric" placeholder="Max" aria-label="Maximum price" class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent" />
      </div>
    </fieldset>

    <div class="py-5 last:pb-0">
      <label class="flex items-center justify-between gap-3 text-sm font-semibold text-gray-900 cursor-pointer">
        In stock only
        <input type="checkbox" :checked="modelValue.inStockOnly" @change="set('inStockOnly', $event.target.checked)" class="w-[18px] h-[18px] rounded border-gray-300 text-gray-900 focus:ring-gray-900" />
      </label>
    </div>
  </div>
</template>

<script setup>
// The filter controls, shared by the desktop sidebar and the phone sheet.
const props = defineProps({
  modelValue: { type: Object, required: true },
  facets: { type: Array, required: true }
})
const emit = defineEmits(['update:modelValue'])

const set = (key, value) => emit('update:modelValue', { ...props.modelValue, [key]: value })

const toggle = (key, value) => {
  const current = props.modelValue[key]
  set(key, current.includes(value) ? current.filter(v => v !== value) : [...current, value])
}
</script>
