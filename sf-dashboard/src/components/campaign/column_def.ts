export const columnAiLog = [
  {
    headerName: 'ID',
    field: 'id',
    type: 'numericColumn',
    flex: 0.05,
  },
  {
    headerName: 'Campaign ID',
    field: 'campaign_id',
    flex: 0.1,
  },
  {
    headerName: 'Decision Time',
    field: 'decision_timestamp',
    valueFormatter: (params: any) => helper.convertTimeV3(params.value),
    flex: 0.1,
  },
  {
    headerName: 'Action Type',
    field: 'action_type',
    cellClass: 'text-blue-600 font-semibold  underline',
    flex: 0.1,
  },
  {
    headerName: 'Old Value',
    field: 'old_value',
    type: 'numericColumn',
    valueFormatter: (params: any) => {
      const action = params.data?.action_type
      const value = params.value
      if (action === 'TOGGLE_CAMPAIGN') {
        return value === '1' || value === 1 ? 'On' : 'Off'
      }
      if (action === 'CHANGE_BUDGET' || action === 'CHANGE_BID') {
        return `$${parseFloat(value).toFixed(2)}`
      }
      return value
    },
    flex: 0.1,
  },
  {
    headerName: 'New Value',
    field: 'new_value',
    type: 'numericColumn',
    valueFormatter: (params: any) => {
      const action = params.data?.action_type
      const value = params.value
      if (action === 'TOGGLE_CAMPAIGN') {
        return value === '1' || value === 1 ? 'On' : 'Off'
      }
      if (action === 'CHANGE_BUDGET' || action === 'CHANGE_BID') {
        return `$${parseFloat(value).toFixed(2)}`
      }
      return value
    },
    flex: 0.1,
  },
  {
    headerName: 'Reasoning',
    field: 'reasoning',
    tooltipField: 'reasoning',
    cellClass: 'line-clamp-2 max-w-[350px]',
    flex: 0.2,
  },
  {
    headerName: 'Confidence',
    field: 'confidence_score',
    type: 'numericColumn',
    valueFormatter: (params: any) => `${(params.value * 100).toFixed(1)}%`,
    flex: 0.05,
  },
  {
    headerName: 'Executed',
    field: 'executed',
    cellRenderer: (params: any) => (params.value ? '✅ Yes' : '❌ No'),
    flex: 0.05,
  },
  {
    headerName: 'Execution Time',
    field: 'execution_timestamp',
    valueFormatter: (params: any) => helper.convertTimeV3(params.value),
    flex: 0.1,
  },
]
