import React, {Component} from 'react';
import '../../css/table.css';

class Table extends Component {
  render() {
    const users = this.props.tableUsers.map(user => {
      return <div key={user.uid}>
        {user.name}: <span className={user.selectedCard ? 'status selected' : 'status'}>
        {this.props.estimation ? user.selectedCard : ''}
      </span>
      </div>;
    });

    return (
      <div className="table">
        {users}

        <div className="estimation">
          <span>{this.props.estimation}</span>
        </div>
      </div>
    );
  }
}

export default Table;
