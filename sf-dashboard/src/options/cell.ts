export const options = [
  { label: 'Account IDs', key: 'account_id' },
  { label: 'Names', key: 'name' },
  { label: 'Date redeemed', key: 'redemption' },
  { label: 'Qualification (Expiration dates)', key: 'criteria' },
  { label: 'Spend (Expiration dates)', key: 'consumption' },
  { label: 'Spend Percent', key: 'spent_percent' },
  { label: 'Spend Amount', key: 'spent_amount' },
]
export const statusOptions = [
  {
    label: 'Approved',
    value: 'on',
    style: {
      color: 'green',
    },
  },
  {
    label: 'Rejected',
    value: 'off',
    style: {
      color: 'red',
    },
  },
  {
    label: 'Pending',
    value: 'pending',
  },
]
