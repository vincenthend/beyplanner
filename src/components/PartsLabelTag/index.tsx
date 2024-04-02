import { createLabelTag } from 'src/components/LabelTag'

const PartsLabelTag = createLabelTag<string>({
  stamina: {
    label: 'Stamina',
    color: 'orange',
  },
  attack: {
    label: 'Attack',
    color: 'red',
  },
  defense: {
    label: 'Defense',
    color: 'blue',
  },
  balance: {
    label: 'Balance',
    color: 'green',
  },
})
export default PartsLabelTag
