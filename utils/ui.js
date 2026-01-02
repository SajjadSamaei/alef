export const projectStatusOptions = [
      { label: 'Concept', value: 'concept' },
      { label: 'In Progress', value: 'in_progress' },
      { label: 'Completed', value: 'completed' },
]

export const statusMap = Object.fromEntries(
  projectStatusOptions.map(option => [option.value, option.label])
);


