import { defineNuxtModule, addImports } from '@nuxt/kit'
import * as lodash from "lodash-es"
const excludeDefaults = [
    'wrapperValue',
    'wrapperToIterator',
    'wrapperReverse',
    'wrapperPlant',
    'wrapperNext',
    'wrapperLodash',
    'wrapperCommit',
    'wrapperChain',
    'wrapperAt',
    'templateSettings',
    'toIterator',
    'VERSION',
    'lodash',
    'value',
    'valueOf',
    'toJSON',
    'thru',
    'plant',
    'next',
    'default',
    'commit',
    'head',
]
export default defineNuxtModule({
    meta: {
        name: 'nuxt4-lodash',
        configKey: 'lodash4',
        compatibility: {
            nuxt: '^4.0.0',
        },
    },
    // Default configuration options of the Nuxt module
    defaults: {
        prefix: '_',
        // prefixSkip: '',
        upperAfterPrefix: false,
        exclude: [],
    },
    setup(options, nuxt) {
        const excludes = [...options.exclude, ...excludeDefaults]
        for (const name of Object.keys(lodash)) {
            if (excludes.includes(name)) continue
            const prefix = '_'
            const as = prefix ? prefix + (options.upperAfterPrefix ? lodash.upperFirst(name) : name) : name
            addImports({ name, as, from: 'lodash-es' })
        }
    },
})