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
      tabLength: 1,
      tabs: [{title: 'Primary', content: 'New Content'}, {title: 'Secondary', content: ''}]
    }
    this.state.input.insurance_provider = this.props.service.length > 0 ? this.props.service[0].provider : null;
    this.handleInputChange = this.handleInputChange.bind(this)
    this.calculate = this.calculate.bind(this)
    this.renderEditable = this.renderEditable.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleExtraButton = this.handleExtraButton.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
  }

  componentDidMount() {
    this.state.input.anticipated_first_date_of_therapy = moment();
    this.state.input.last_day_of_calendar_year = moment().endOf('year');

    // this is needed, because InfiniteCalendar forces window scroll
    window.scrollTo(0, 0);
    this.forceUpdate();
    // console.log(this.state.input.co_pay_per_day_or_session)
  }
  calculate() {
    var date1 = moment(this.state.input.anticipated_first_date_of_therapy);
    var date2 = moment(this.state.input.last_day_of_calendar_year);
    const weeks_remaining = Math.floor(moment.duration(date2 - date1).asWeeks());
    console.log(weeks_remaining)
    // const weeks_remaining = 52;
    var days_per_week, visits_per_week = [], visit_count = [], therapy_costs_per_week = [],
    deductible_payments = [], family_deductible_remaining = [], individual_deductible_remaining = [], either_deductible_met = [],
    co_pay_payments = [], co_insurance_payments = [], oop_contributions_copays = [], oop_contributions_deductible = [],
    oop_contributions_coinsurance = [], total_oop_contributions = [], oop_family_remaining = [], oop_individual_remaining = [],
    weekly_balance_for_patient = [], accumulated_balance = [];
        
    days_per_week = this.state.input.days_per_week;
    visits_per_week = 0;
    this.state.data.forEach((item) => {
      visits_per_week += item.session_per_week;
    });
    visit_count[0] = this.state.input.max_visits;
    therapy_costs_per_week[0] = 0;
    deductible_payments[0] = 0;
    family_deductible_remaining[0] = this.state.input.family_deductible - this.state.input.amount_fam_met;
    individual_deductible_remaining[0] = this.state.input.individual_deductible - this.state.input.amount_ind_met;
    either_deductible_met[0] = ((family_deductible_remaining[0] - therapy_costs_per_week[0] < 0) || (individual_deductible_remaining[0] - therapy_costs_per_week[0] < 0)) ? 'Yes': 'No';
    co_pay_payments[0] = 0;
    co_insurance_payments[0] = 0;
    oop_contributions_coinsurance[0] = oop_contributions_copays[0] = oop_contributions_deductible[0] = 0;
    total_oop_contributions[0] = 0;
    oop_family_remaining[0] = this.state.input.oop_max_family - this.state.input.amount_fam_opm_met;
    oop_individual_remaining[0] = this.state.input.oop_max_individual - this.state.input.amount_ind_opm_met;
    weekly_balance_for_patient[0] = 0;
    accumulated_balance[0] = 0;
    for ( var therapy_week = 1; therapy_week <= Math.min(this.state.input.max_visits, weeks_remaining); therapy_week ++)
    {
      therapy_costs_per_week[therapy_week] = 0;
      this.state.data.forEach((item) => {
        therapy_costs_per_week[therapy_week] += parseInt(item.therapy_cost);
      });
      either_deductible_met[therapy_week] = ((family_deductible_remaining[therapy_week - 1] - therapy_costs_per_week[therapy_week] <= 0) || (individual_deductible_remaining[therapy_week - 1] - therapy_costs_per_week[therapy_week] <= 0)) ? 'Yes': 'No';
      deductible_payments[therapy_week] = either_deductible_met[therapy_week] === 'Yes' ? Math.min(family_deductible_remaining[therapy_week - 1], individual_deductible_remaining[therapy_week - 1]) : therapy_costs_per_week[therapy_week];
      family_deductible_remaining[therapy_week] = Math.max(family_deductible_remaining[therapy_week - 1] - deductible_payments[therapy_week], 0);
      individual_deductible_remaining[therapy_week] = Math.max(individual_deductible_remaining[therapy_week - 1] - deductible_payments[therapy_week], 0);
      co_pay_payments[therapy_week] = this.state.input.co_pay_per_day_or_session == 1 ? visits_per_week * this.state.input.co_pay_amount : days_per_week * this.state.input.co_pay_amount;
      co_insurance_payments[therapy_week] = either_deductible_met[therapy_week] === 'No' ? 0 : therapy_costs_per_week[therapy_week] * (100 - this.state.input.coverage) / 100;
      oop_contributions_copays[therapy_week] = this.state.input.does_copay_apply_to_oop == true ? co_pay_payments[therapy_week] : 0;
      oop_contributions_deductible[therapy_week] = this.state.input.does_deductible_aply_to_oop == true ? deductible_payments[therapy_week] : 0;
      oop_contributions_coinsurance[therapy_week] = co_insurance_payments[therapy_week];
      total_oop_contributions[therapy_week] =  oop_contributions_copays[therapy_week] + oop_contributions_deductible[therapy_week] + oop_contributions_coinsurance[therapy_week];
      oop_family_remaining[therapy_week] = Math.max(0, oop_family_remaining[therapy_week - 1] - total_oop_contributions[therapy_week]);
      oop_individual_remaining[therapy_week] = Math.max(0, oop_individual_remaining[therapy_week - 1] - total_oop_contributions[therapy_week]);
      weekly_balance_for_patient[therapy_week] = deductible_payments[therapy_week] + co_insurance_payments[therapy_week] + co_pay_payments[therapy_week];
      accumulated_balance[therapy_week] = accumulated_balance[therapy_week - 1] + weekly_balance_for_patient[therapy_week];
    }
    console.log(co_insurance_payments)
    var calculation_result = [];

    for (var i = 0; i <= Math.min(this.state.input.max_visits, weeks_remaining); i ++ )
    {
      // calculation_result[i].therapy_week = i;
      // calculation_result[i].co_pay_payments = co_pay_payments[i];
      // calculation_result[i].co_insurance_payments = co_insurance_payments[i];
      // calculation_result[i].deductible_payments = deductible_payments[i];
      // calculation_result[i].total_oop_contributions = total_oop_contributions[i];
      // calculation_result[i].accumulated_balance = accumulated_balance[i];
      calculation_result[i] = {
        therapy_week: i,
        days_per_week: i == 0 ? 0 : days_per_week,
        visits_per_week: i == 0 ? 0 :visits_per_week,
        visit_count: Math.min(this.state.input.max_visits, weeks_remaining) - i,
        therapy_costs_per_week: '$' + therapy_costs_per_week[i].toFixed(2),
        either_deductible_met: either_deductible_met[i],
        family_deductible_remaining: '$' + family_deductible_remaining[i].toFixed(2),
        individual_deductible_remaining: '$' + individual_deductible_remaining[i].toFixed(2),
        co_pay_payments: '$' + co_pay_payments[i].toFixed(2),
        co_insurance_payments: '$' + co_insurance_payments[i].toFixed(2),
        oop_contributions_copays: '$' + oop_contributions_copays[i].toFixed(2),
        oop_contributions_deductible: '$' +oop_contributions_deductible[i].toFixed(2),
        oop_contributions_coinsurance: '$' + oop_contributions_coinsurance[i].toFixed(2),
        deductible_payments: '$' + deductible_payments[i].toFixed(2),
        total_oop_contributions: '$' + total_oop_contributions[i].toFixed(2),
        oop_family_remaining: '$' + oop_family_remaining[i].toFixed(2),
        oop_individual_remaining: '$' + oop_individual_remaining[i].toFixed(2),
        weekly_balance_for_patient: '$' + weekly_balance_for_patient[i].toFixed(2),
        accumulated_balance: '$' + accumulated_balance[i].toFixed(2)
      }
    }
    this.props.dispatch(setCalculationResult(calculation_result))
    this.props.history.push('/output')
  }

  handleInputChange(event) {
    this.state.input[event.target.id] = event.target.value;
    this.forceUpdate();  
  }
  calculateTherapyCost() {
    this.state.data.map((service, index) => {
      let original_cost = 0;
      this.props.service.map((service1) => {
        if (service1.provider === this.state.input.insurance_provider)
        {
            original_cost = service1[service['service']];
        }
      })
      this.state.data[index]['therapy_cost'] = 
      service['session_per_week'] 
      * service['length_of_session'] 
      * original_cost ;
      console.log(this.state.data[index]['therapy_cost'])
      this.forceUpdate();
    })
  }
  renderEditable(cellInfo) {
    if (cellInfo.column.id === 'requesting' || cellInfo.column.id === 'visit_limit_applies')
    {
      return (
        <select value={this.state.data[cellInfo.index][cellInfo.column.id]} 
          onChange={(event) => {this.state.data[cellInfo.index][cellInfo.column.id] = event.target.value; this.forceUpdate(); }}>
          <option>Yes</option>
          <option>No</option>
        </select>
      )
    }
    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          const data = [...this.state.data];
          data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
          this.setState({ data });
          this.calculateTherapyCost();
        }}
        dangerouslySetInnerHTML={{
          __html: this.state.data[cellInfo.index][cellInfo.column.id]
        }}
      />
    );
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
  }

  handleTabChange(index) {
    this.setState({activeIndex: index});
  }

  handleEdit({type, index}) {
    this.setState({tabLength: 1});
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

  addService = modalType => () => {
    let cost = 0;
    this.props.service.map((service) => {
      if (service.provider === this.state.input.insurance_provider)
      {
          cost = service[this.state.add_service] * this.state.add_session_per_week * this.state.add_length_of_session ;
      }
    })
    console.log('addservice', this.state.add_service)
    this.state.data.push({
      service: this.state.add_service,
      requesting: true,
      visit_limit_applies: this.state.add_select_limit_applies == 'Yes' ? true: false,
      session_per_week: this.state.add_session_per_week,
      length_of_session: this.state.add_length_of_session,
      therapy_cost: cost
    })

    this.forceUpdate();
    if (!modalType) {
      return this.setState({
        modal: !this.state.modal,
      });
    }

    this.setState({
      [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
    });

  }

  render() {
    const {tabs, activeIndex} = this.state;
    const tabTemplate = [];
    const panelTemplate = [];
    console.log(tabs)
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
  const { input, service } = state
  return {
    input,
    service: service.service
  }
}

export default connect(mapStateToProps)(DashboardPage)
