import { useState } from 'react'

const useInputField = (type, name = '', placeholder = '', testId = '') => {
  const [value, setValue] = useState('')
  const onChange = (event) => setValue(event.target.value)
  const props = { value, onChange, type }
  if (name) props.name = name
  if (placeholder) props.placeholder = placeholder
  if (testId) props['data-testid'] = testId
  const clean = () => setValue('')
  return [value, props, { clean }]
}

export default useInputField
