<template>
  <div id="includedRuleComponent">
    <q-form ref="includedRuleForm" id="includedRuleForm" class="row">
    <dynamic-field
        v-for="(field,index) in formFields"
        :key="'includedContractRuleField'+index+field.name"
        :id="'includedContractRuleField'+index+field.name"
        :field="field"
        class="col-12"
        v-model="form[field.name]"
    />
    </q-form>
  </div>
</template>
<script>
import { eventBus } from 'src/plugins/utils'
export default {
  beforeUnmount() {
    eventBus.off('page.data.refresh')
  },
  props: {
    form: {default: {
        type: null,
        status: true,
        productOriginId: null,
        contractLineId: null,
        contractId: null,
        quantityRule: null,
        options: null
      }},
    contractId: {default: null},
  },
  emits: ['update:modelValue'],
  components: {},
  watch: {},
  mounted() {
    this.$nextTick(function () {
      this.init()
    })
  },
  data() {
    return {
      loading: false,
      data: {
        type: null,
        productOriginId: null,
        contractLineId: null,
        contractId: null,
        quantityRule: null,
        options: null
      },

    }
  },
  computed: {
    formFields(){
      return [
        {
          name: 'quantityRule',
          value: null,
          type: 'input',
          props: {
            rules: [
              val => !!val || this.$tr('isite.cms.message.fieldRequired')
            ],
            label: "Quantity",
            clearable: true,
            color: "primary",
            type: "number"
          }
        },
        {
          name: 'productOriginId',
          value: null,
          type: 'select',
          props: {
            rules: [
              val => !!val || this.$tr('isite.cms.message.fieldRequired')
            ],
            label: 'Service Origin',
            clearable: true,
            color: "primary"
          },
          loadOptions: {
            apiRoute: 'apiRoutes.qramp.products',
            select: {label: 'fullName', id: 'id'},
            requestParams: {filter: {status: true}}
          }
        },
        {
          name: 'contractLineId',
          value: null,
          type: 'select',
          props: {
            rules: [
              val => !!val || this.$tr('isite.cms.message.fieldRequired')
            ],
            label: 'Contract Line',
            clearable: true,
            color: "primary"
          },
          loadOptions: {
            apiRoute: 'apiRoutes.qsetupagione.contractLines',
            select: {label: 'fullName', id: 'id'},
            requestParams: {filter: {contractId: this.contractId}}
          }
        },

      ]
    }
  },
  methods: {
    init() {

    },

    validateForm(){
      return new Promise((resolve, reject) => {
        this.$refs.includedRuleForm.validate().then(success => {
          if (success) {
            // yay, models are correct
            this.data = this.$clone(this.form)
            this.$emit('update:modelValue', this.data )
            resolve(success)
          }
          else {
            // at least one invalid value
            this.$alert.error({message: this.$tr('isite.cms.message.formInvalid')})
            resolve(success)
          }
        })
      })

    }
    //Get data

  }
}
</script>
<style lang="scss">
</style>
