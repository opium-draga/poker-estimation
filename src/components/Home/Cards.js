import React, {Component} from 'react';
import '../../css/cards.css';
import { Row, Col } from 'antd';

class Cards extends Component {
  render() {
    const cards = [1,2,3,4,5,6,7,8,9,10,'?','Eat'].map(card => {
      return <Col className="cardWrapper" span={4} key={card} onClick={e => this.props.onSelect(card)}>
        <span className={this.props.selectedCard === card ? 'card selected' : 'card'}>{card}</span>
      </Col>
    });

    return (
      <div className="cards">
        Selected card: {this.props.selectedCard}
        <Row gutter={12}>
          {cards}
        </Row>
      </div>
    );
  }
}

export default Cards;
