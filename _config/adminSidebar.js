import pages from 'src/setup/pages'
export default [
  {
    title: 'isetup.cms.sidebar.setupInfo',
    icon: 'fal fa-landmark',
    children: [
      pages.qsetupagione.areas,
      pages.qramp.attributes,
      pages.qsetupagione.buildings,
      pages.qsetupagione.companies,
      pages.qsetupagione.contracts,
      pages.qsetupagione.costCenters,
      pages.qsetupagione.customers,
      pages.qsetupagione.gates,
      pages.qsetupagione.passengerCarrierStations,
      pages.qsetupagione.passengerContractRulesServices,
      pages.qsetupagione.passengerContractRules,
      pages.qsetupagione.contractRules,
      pages.qramp.categories,
      pages.qramp.services,
      pages.qsetupagione.stations,
      pages.qramp.workOrderStatuses,
    ]
  },
]
