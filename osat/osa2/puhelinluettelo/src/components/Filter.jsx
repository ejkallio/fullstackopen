const Filter = (props) => (
    <form>
      <div>
        filter shown with: <input
          value={props.filter}
          onChange={props.handleFilterChange}
        />
      </div>
    </form>
  )

export default Filter