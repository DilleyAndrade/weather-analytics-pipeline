function StatusMessage({ children, type = 'default' }) {
  return (
    <div className={`status-message status-message-${type}`}>
      {children}
    </div>
  )
}

export default StatusMessage