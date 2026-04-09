import {
  PersonnelType,
  UserStatus,
  BasedInvoiceType,
  PublisherCommission,
} from '@/enum/user'

export const PersonnelOptions = [
  { label: 'Probationary Employee', value: PersonnelType.PROBATIONARY_EMPLOYEE },
  { label: 'Corporate Personnel', value: PersonnelType.CORPORATE_PERSONNEL },
  { label: 'Publisher', value: PersonnelType.PUBLISHER },
]

export const PubCommission = [
  { label: 'Yes', value: PublisherCommission.YES },
  { label: 'No', value: PublisherCommission.NO },
]

export const BasedInvoiceOptions = [
  { label: 'Profit', value: BasedInvoiceType.PROFIT },
  { label: 'Revenue', value: BasedInvoiceType.REVENUE },
]

export const StatusOptions = [
  { label: 'Approved', value: UserStatus.APPROVED },
  { label: 'Pending', value: UserStatus.PENDING },
  { label: 'Rejected', value: UserStatus.REJECTED },
]
