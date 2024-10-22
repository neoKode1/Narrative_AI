import * as React from "react"

const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => {
  return (
    <button
      className={className}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }