function LoadingSpinner({ size = "md" }) {
  const sizeClass = size === "lg" ? "spinner-lg" : "spinner"

  return (
    <div className="flex-center">
      <div className={sizeClass}></div>
    </div>
  )
}

export default LoadingSpinner
