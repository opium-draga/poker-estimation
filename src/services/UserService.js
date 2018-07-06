import Cookies from 'universal-cookie';
import io from 'socket.io-client';
import Guid from "../utils/guid";
import ReactObserver from 'react-event-observer';

class UserService {
  constructor() {
    this.cookies = new Cookies();
    this.observer = ReactObserver();

    this._initModel();
    this.socket = io('http://localhost:3333', {query: `user=${JSON.stringify(this.getUser())}`});

    this.socket.on('stateUpdate', res => {
      console.log("stateUpdate: ", res);

      if (!res) {
        console.warn("stateUpdate response is empty!");
        return;
      }

      if (!res.tables) {
        this.setProps({tableId: null});
      }

      if (res.reEstimation) {
        this.observer.publish('reEstimation');
      }

      this.observer.publish('stateUpdate', res.tables);
    });

    this.socket.on('tableInited', res => {
      debugger;
      this.setProps({tableId: res.tableId});
      this.observer.publish('tableInit', res.tableId);
    });

    this.socket.on('estimationReady', res => {
      this.observer.publish('estimationReady', res);
    })
  }

  getUser() {
    return {
      uid: this.user.uid || null,
      name: this.user.name || null,
      tableId: this.user.tableId || null,
      selectedCard: this.user.tableId ? this.user.selectedCard : null,
      master: this.user.master || false
    };
  }

  cleanUp() {
    this.setProps({
      selectedCard: null
    })
  }

  setProps(user) {
    this.user = Object.assign(this.user, user);
    this._setUserCookie();
  }

  createTable() {
    this.setProps({master: true});
    this.socket.emit('createTable', this.user);
  }

  joinTable(tableId) {
    this.socket.emit('joinTable', {
      tableId: tableId,
      user: this.user
    });
  }

  updateUser() {
    this.socket.emit('updateUser', this.user);
  }

  estimate() {
    this.socket.emit('estimate');
  }

  reEstimate() {
    this.setProps({selectedCard: null});
    this.socket.emit('reEstimate');
  }

  _setUserCookie() {
    this.cookies.set('user', this.user);
    console.log("Set cookie", this.user);
  }

  _initModel() {
    let user = this.cookies.get('user') || {};
    if (!user.uid) {
      user.uid = Guid();
    }

    this.user = user;
    this._setUserCookie();
  }
}

export default UserService;