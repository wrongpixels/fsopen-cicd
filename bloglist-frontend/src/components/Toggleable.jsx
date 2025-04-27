import { useState, forwardRef, useImperativeHandle } from 'react'
import { Button } from 'react-bootstrap'
const Toggleable = forwardRef((props, refs) => {
  const {
    labelOnVisible = 'Hide',
    labelOnInvisible = 'Show',
    initialVisibility = false,
    addSpace = true,
    showOver = false,
    children,
  } = props
  Toggleable.displayName = 'Toggleable'

  const [visibility, setVisibility] = useState(initialVisibility)
  const toggleVisibility = () => setVisibility(!visibility)

  const buttonStyle = !visibility ? 'success' : 'outline-secondary'

  const drawButton = () => (
    <Button
      className="py-1 shadow-sm mb-3"
      variant={buttonStyle}
      onClick={toggleVisibility}
    >
      {visibility ? labelOnVisible : labelOnInvisible}
    </Button>
  )

  const visibilityStyle = () => ({ display: visibility ? '' : 'none' })
  const addBreak = (
    <>
      <br />
      <br />
    </>
  )

  useImperativeHandle(refs, () => ({ toggleVisibility }))

  return (
    <>
      {showOver && drawButton()}
      <div style={visibilityStyle()} className="toggleable-content">
        {children}
      </div>
      {!showOver && drawButton()}
      {addSpace ? addBreak : <></>}
    </>
  )
})

export default Toggleable
