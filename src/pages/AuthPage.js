import AuthForm, { STATE_LOGIN } from 'components/AuthForm';
import React from 'react';
import { Card, Col, Row } from 'reactstrap';
import {connect} from 'react-redux';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import {
  MdImportantDevices,
  // MdCardGiftcard,
  MdLoyalty,
} from 'react-icons/lib/md';
class AuthPage extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      authState: ''
    }
  }
  handleAuthState = authState => {
    if (authState === STATE_LOGIN) {
      this.setState({authState: 'Login'})
      this.props.history.push('/login');
    } else {
      this.setState({authState: 'SignUp'})
      this.props.history.push('/signup');
    }
  };

  handleLogoClick = () => {
    this.props.history.push('/');
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth && nextProps.auth.inProgress === false)
    {
      if (nextProps.auth.errors === null)
      {
        setTimeout(() => {
          if (!this.notificationSystem) {
            return;
          }
      
          this.notificationSystem.addNotification({
            title: <MdImportantDevices />,
            message: `${this.state.authState} Success!`,
            level: 'success',
          });
        }, 1500);
      }
      else
      {
        setTimeout(() => {
          if (!this.notificationSystem) {
            return;
          }
      
          this.notificationSystem.addNotification({
            title: <MdImportantDevices />,
            message: `${this.state.authState} Failed!`,
            level: 'error',
          });
        }, 1500);
      }
    }

  }

  render() {
    return (
      <Row
        style={{
          height: '100vh',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Col md={6} lg={4}>
          <Card body>
            <AuthForm
              authState={this.props.authState}
              onChangeAuthState={this.handleAuthState}
              onLogoClick={this.handleLogoClick}
            />
          </Card>
        </Col>
        <NotificationSystem
            dismissible={false}
            ref={notificationSystem =>
              (this.notificationSystem = notificationSystem)
            }
            style={NOTIFICATION_SYSTEM_STYLE}
          />
      </Row>
    );
  }
}
const mapStateToProps = state => {
  const {auth} = state;
  return {
    auth
  }};
export default  connect(mapStateToProps)(AuthPage);
