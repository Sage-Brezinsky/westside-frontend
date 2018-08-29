import React from 'react';

import * as math from 'mathjs';
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Button,
  FormGroup,
  Label,
  Input,
  InputGroupAddon,
  InputGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Nav, NavItem, NavLink
} from 'reactstrap';
import classnames from 'classnames';

import _ from 'underscore';
import * as moment from 'moment';
// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

import { connect } from 'react-redux';

import Page from 'components/Page';
import {setCalculationResult} from '../actions';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import {Tabs, TabList, Tab, PanelList, Panel, ExtraButton} from 'react-tabtab';
import Plus from 'react-icons/lib/fa/plus';
import * as customStyle from 'react-tabtab/lib/themes/material-design';
import TabComponent from '../components/TabComponent';
import {setTabIndex} from '../actions';

class DashboardPage extends React.Component {

  constructor (props)
  {
    super(props);
    this.state = {
      input: _.clone(props.input),
      data: [],
      add_select_visit_limit_applies: true,
      add_session_per_week: 1,
      add_length_of_session: 1,
      activeTab: 0,
      tabLength: this.props.tab,
      tabs: [{title: 'Primary', content: 'New Content'}, {title: 'Secondary', content: ''}]
    }
    this.state.input.insurance_provider = this.props.service.length > 0 ? this.props.service[0].provider : null;
    this.toggle = this.toggle.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleExtraButton = this.handleExtraButton.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
  }

  componentDidMount() {

    // this is needed, because InfiniteCalendar forces window scroll
    window.scrollTo(0, 0);
    this.forceUpdate();
    this.props.dispatch(setTabIndex(1));
    // console.log(this.state.input.co_pay_per_day_or_session)
  }


  toggleTab(tab)
  {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }
  handleExtraButton() {
    this.setState({tabLength: 2});
    this.props.dispatch(setTabIndex(2));
  }

  handleTabChange(index) {
    this.setState({activeIndex: index});
  }

  handleEdit({type, index}) {
    this.setState({tabLength: 1});
    this.props.dispatch(setTabIndex(1));
  }

  toggle = modalType => () => {
    if ( this.props.service.length > 0)
    {
      if (!modalType) {
        return this.setState({
          add_service: Object.keys(this.props.service[0])[0] != 'provider' ? Object.keys(this.props.service[0])[0] : 
          Object.keys(this.props.service[0]).length > 1 ? Object.keys(this.props.service[0])[1] : null,
          add_select_visit_limit_applies: true,
          add_session_per_week: 1,
          add_length_of_session: 1,
          modal: !this.state.modal,
        });
      }
  
      this.setState({
        [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
      });
    }
  };

  render() {
    const {tabs, activeIndex} = this.state;
    const tabTemplate = [];
    const panelTemplate = [];
    tabs.forEach((tab, i) => {
      if (i < this.state.tabLength)
      {
        const closable = tabs.length > 1;
        tabTemplate.push(<Tab key={i} closable={closable}>{tab.title}</Tab>);
        panelTemplate.push(<Panel key={i}>{tab.content}</Panel>);
      }
    })
    return (
     <Page title="Forms" breadcrumbs={[{ name: 'Forms', active: true }]}>
      <Tabs onTabEdit={this.handleEdit}
            onTabChange={this.handleTabChange}
            activeIndex={activeIndex}
            customStyle={customStyle}
            ExtraButton={
              <ExtraButton onClick={this.handleExtraButton}>
                <Plus/>
              </ExtraButton>
      }>
        <TabList>
          {tabTemplate}
        </TabList>
        <PanelList>
          <Panel key={1}>
            <TabComponent {...this.props}></TabComponent>
          </Panel>
          <Panel key={2}>
            <TabComponent {...this.props} secondary></TabComponent>
          </Panel>
        </PanelList>
      </Tabs>

    </Page>
    );
  }
}

const mapStateToProps = state => {
  const { input, service, tab } = state
  return {
    input,
    service: service.service,
    tab
  }
}

export default connect(mapStateToProps)(DashboardPage)
