<template></template>

<script>
import { COMPANY_PASSENGER } from 'src/modules/qramp/_components/model/constants.js'
import workOrderList from 'src/modules/qramp/_store/actions/workOrderList.ts'
import qRampStore from 'src/modules/qramp/_store/qRampStore.js'
export default {
  async beforeCreate() {
   await qRampStore().setIsPassenger(true)
   await workOrderList().getCustomerWithContract()
  },
  data() {
    return {
      crudId: this.$uid(),
    }
  },
  computed: {
    companies() {
      const passengerCompanies = this.$getSetting('ramp::passengerCompanies') || []
      return passengerCompanies.length > 0 ? passengerCompanies : COMPANY_PASSENGER;
    },
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {}
    },
    crudData() {
      return {
        crudId: this.crudId,
        apiRoute: "apiRoutes.qsetupagione.passengerCarrierStations",
        permission: 'setup.passenger-carrier-stations',
        read: {
          columns: [
            {
              name: "id",
              label: this.$tr("isite.cms.form.id"),
              field: "id",
              style: "width: 50px",
            },
            {
              name: "StationName",
              label: "Station Name",
              field: "station",
              format: val => val ? val.stationName : '' ,
              align: "left",
            },
            {
              name: "airlineName",
              label: "Airline Name",
              field: "airline",
              format: val => val ? val.airlineName : '' ,
              align: "left",
            },
            {
              name: "codeShares",
              label: "Code Shares",
              field: "airline",
              formatAsync: async item => {
                const response = await workOrderList().getAirlinesList().find(airline => airline.id == item.codeShares);
                return response ? response.airlineName : '-'
              },
              align: "left",
            },
            {
              name: 'Customers',
              label:'Customers',
              field: "customer",
              format: val => val ? val.customerName : '-',
              align: 'left'
            },
            {
              name: 'Contract',
              label:'Contracts',
              field: 'contract',
              format: val => val ? val.contractName : '-',
              align: 'left'
            },
            {
              name: "status",
              label: this.$tr('isite.cms.form.status'),
              field: "status",
              align: "left",
            },
            {
              name: "actions",
              label: this.$tr("isite.cms.form.actions"),
              align: "left",
            },
          ],
          requestParams: {
            include: 'station,airline,contract,customer',
            filter: {
              type: 'passenger',
            }
          },
          filters: {
            status: {
              value: null,
              type: 'select',
              props: {
                label: `${this.$tr('isite.cms.form.status')}:`,
                clearable: true,
                options: [
                  {label: this.$tr('isite.cms.label.enabled'), value: true},
                  {label: this.$tr('isite.cms.label.disabled'), value: false},
                ]
              }
            },
            stationId: {
              value: null,
              type: 'select',
              props: {
                label: `Station Name`,
                clearable: true,
                color:"primary"
              },
              loadOptions: {
                apiRoute: 'apiRoutes.qramp.setupStations',
                select: {label: 'fullName', id: 'id'},
                requestParams: {filter: {companyId: this.companies}}
              },
            }
          }
        },
        create: {
          title: 'Create Passenger Carrier Station'
        },
        update: {
          title: 'Update Passenger Carrier Station',
          mapData: (data) => {
            data.customerContract = this.findCustomerContracts(data)
            return data
          }
        },
        delete: true,
        formLeft: {
          id: {
            value: null,
          },
          customerId: {
            value: null,
          },
          contractId: {
            value: null,
          },
          customerContract: {
              value: null,
              type: 'select',
              props: {
                label: 'Customer/Contract',
                clearable: true,
                options: workOrderList().getCustomerWithContractLists(),
                emitValue: false,
              },
          },
          stationId: {
            value: null,
            type: 'select',
            props: {
              label: 'Station Name'
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qsetupagione.setupStations',
              select: { label: 'fullName', id: 'id' },
              requestParams: {filter: {companyId: this.companies }}
            }
          },
          airlineId: {
            value: null,
            type: 'select',
            props: {
              label: 'Airline',
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qfly.airlines',
              select: { label: 'airlineName', id: 'id' }
            }
          },
          codeShares: {
            value: null,
            type: 'select',
            props: {
              label: 'Code Shares',
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qfly.airlines',
              select: { label: 'airlineName', id: 'id' }
            }
          },
          mainCodeshare: {
            value: false,
            type: 'select',
            props: {
              label: 'Codeshare as main airline',
              options: [
                {
                  label: this.$tr('isite.cms.label.yes'),
                  value: true
                },
                {
                  label: this.$tr('isite.cms.label.no'),
                  value: false
                },
              ]
            },
            help: {
              description: `
                Adding Codeshare as Main Airline in True means the system is going to prioritize
                the Codeshare Airline Code(IATA) in the Flight numbers, If you change this is going
                to affect only future flights.
              `
            },
          },
          separationHours: {
            value: null,
            type: 'input',
            props: {
              label: `Flight Schedule Inbound/Outbound separation by Hours`,
              type: "number",
              step: "0.1",
            },
          },
          status: {
            value: true,
            type: 'select',
            props: {
              label: `${this.$tr('isite.cms.form.status')}:`,
              options: [
                {label: this.$tr('isite.cms.label.enabled'), value: true},
                {label: this.$tr('isite.cms.label.disabled'), value: false},
              ]
            }
          },
          closeByDefault: {
            value: false,
            type: 'select',
            props: {
              label: 'Close by default',
              options: [
                {
                  label: this.$tr('isite.cms.label.yes'),
                  value: true
                },
                {
                  label: this.$tr('isite.cms.label.no'),
                  value: false
                },
              ]
            }
          },
          type: {
            value: 'passenger'
          }
        },
        getDataForm: (formData, type) => {
          return new Promise(resolve => {
            const customerContract = workOrderList().getCustomerWithContractLists().find(item => {
              if(formData.customerContract) {
                return item.value === formData.customerContract.value
              }
            })
            if(customerContract) {
              formData.contractId = customerContract.contractId;
              formData.customerId = customerContract.id;
              delete formData.customerContract;
            }
            resolve(formData);
          })
        }
      };
    },
  },
  methods:{
    findCustomerContracts(formData) {
      const customerContract = workOrderList().getCustomerWithContractLists().find(item => {
            if(formData.customerId && formData.contractId) {
              return item.id == formData.customerId && item.contractId == formData.contractId
            }
            if(formData.customerId && !formData.contractId) {
              return item.id == formData.customerId && item.contractId == null;
            }
      });
      return customerContract || null
    }
  }
};
</script>
