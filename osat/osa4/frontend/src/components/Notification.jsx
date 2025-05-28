const Notification = ({ message, type = 'error' }) => {
    if (message === null) {
        return null
    }

    const className = type === 'error' ? 'error' : 'message'

    return (
      <div className={className}>
        {message}
      </div>
    )
}

export default Notification