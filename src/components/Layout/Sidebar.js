import React from 'react';
import {
  MdDashboard,
  MdSettings,
  MdMonetizationOn,
  MdImportantDevices
} from 'react-icons/lib/md';
import {connect} from 'react-redux';
import { NavLink } from 'react-router-dom';
import {
  // UncontrolledTooltip,
  Nav,
  NavItem,
  NavLink as BSNavLink,
} from 'reactstrap';
import bn from 'utils/bemnames';

const sidebarBackground = {
  backgroundColor: '#FE9130'
};


const navItems = [
  { to: '/', name: 'input', exact: true, Icon: MdDashboard },
  { to: '/output', name: 'output', exact: false, Icon: MdMonetizationOn},
  { to: '/calculations', name: 'calculation', exact: false, Icon: MdImportantDevices}
];

const bem = bn.create('sidebar');

class Sidebar extends React.Component {
  state = {
    isOpenComponents: true,
    isOpenContents: true,
    isOpenPages: true,
  };

  componentWillMount()
  {
    console.log(this.props.auth.token)
    if (this.props.auth.token)
      navItems.push(  { to: '/settings', name: 'Settings', exact: true, Icon: MdSettings })
  }
  handleClick = name => () => {
    this.setState(prevState => {
      const isOpen = prevState[`isOpen${name}`];

      return {
        [`isOpen${name}`]: !isOpen,
      };
    });
  };

  render() {
    return (
      <aside className={bem.b()}>
        <div className={bem.e('background')} style={sidebarBackground} />
        <div className={bem.e('content')}>
          <Nav vertical>
            {navItems.map(({ to, name, exact, Icon }, index) => (
              <NavItem key={index} className={bem.e('nav-item')}>
                <BSNavLink
                  id={`navItem-${name}-${index}`}
                  className="text-uppercase"
                  tag={NavLink}
                  to={to}
                  activeClassName="active"
                  exact={exact}>
                  <Icon className={bem.e('nav-item-icon')} />
                  <span className="">{name}</span>
                </BSNavLink>
              </NavItem>
            ))}
          </Nav>
        </div>
      </aside>
    );
  }
}
const mapStateToProps = state => {
  const { auth } = state

  return {
    auth
  }
}

export default connect(mapStateToProps)(Sidebar);
