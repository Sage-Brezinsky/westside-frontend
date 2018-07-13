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
} from 'reactstrap';

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

class DashboardPage extends React.Component {

  constructor (props)
  {
    super(props);
    this.state = {
      input: _.clone(props.input),
      data: [],
      add_service: this.props.service.length > 0 ? Object.keys(this.props.service[0])[1] : null,
      add_select_visit_limit_applies: true,
      add_session_per_week: 1,
      add_length_of_session: 1
    }
    this.state.input.insurance_provider = this.props.service.length > 0 ? this.props.service[0].provider : null;
    this.handleInputChange = this.handleInputChange.bind(this)
    this.calculate = this.calculate.bind(this)
    this.renderEditable = this.renderEditable.bind(this);
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

  toggle = modalType => () => {
    if ( this.props.service.length > 0)
    {
      if (!modalType) {
        return this.setState({
          add_service: Object.keys(this.props.service[0])[1],
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
    return (
    <Page title="Forms" breadcrumbs={[{ name: 'Forms', active: true }]}>
      <Row>
        <Col xl={6} lg={12} md={12}>
          <Card>
            <CardBody>
                <FormGroup>
                  <Label for="family_deductible">Family Deductible</Label>
                  <InputGroup>
                    <Input
                      type="number"
                      name="number"
                      id="family_deductible"
                      placeholder="Family Deductible"
                      min="0"
                      step="0.01"
                      value={parseFloat(this.state.input.family_deductible).toFixed(2)}
                      onKeyPress={(event) => event.key === '-' ? event.preventDefault(): ''}
                      onChange={this.handleInputChange}
                    />
                    <InputGroupAddon addonType="append">$</InputGroupAddon>
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <Label for="amount_fam_met">Amount Fam Met</Label>
                  <InputGroup>
                    <Input
                      type="number"
                      name="number"
                      id="amount_fam_met"
                      placeholder="Amount Fam Met"
                      min="0"
                      step="0.01"
                      value={parseFloat(this.state.input.amount_fam_met).toFixed(2)}
                      onKeyPress={(event) => event.key === '-' ? event.preventDefault(): ''}
                      onChange={this.handleInputChange}
                    />
                    <InputGroupAddon addonType="append">$</InputGroupAddon>
                  </InputGroup>
                </FormGroup>
            </CardBody>
          </Card>
        </Col>
        <Col xl={6} lg={12} md={12}>
          <Card>
            <CardBody>
                <FormGroup>
                  <Label for="individual_deductible">Individual Deductible</Label>
                  <InputGroup>
                    <Input
                      type="number"
                      name="number"
                      id="individual_deductible"
                      placeholder="Individual Deductible"
                      min="0"
                      step="0.01"
                      value={parseFloat(this.state.input.individual_deductible).toFixed(2)}
                      onKeyPress={(event) => event.key === '-' ? event.preventDefault(): ''}
                      onChange={this.handleInputChange}
                    />
                    <InputGroupAddon addonType="append">$</InputGroupAddon>
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <Label for="amount_ind_met">Amount Ind Met</Label>
                  <InputGroup>
                    <Input
                      type="number"
                      name="number"
                      id="amount_ind_met"
                      placeholder="Amount Ind Met"
                      min="0"
                      step="0.01"
                      value={parseFloat(this.state.input.amount_ind_met).toFixed(2)}
                      onKeyPress={(event) => event.key === '-' ? event.preventDefault(): ''}
                      onChange={this.handleInputChange}
                    />
                    <InputGroupAddon addonType="append">$</InputGroupAddon>
                  </InputGroup>
                </FormGroup>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xl={6} lg={12} md={12}>
          <Card>
            <CardBody>
                <FormGroup>
                  <Label for="oop_max_family">OOP Max Family</Label>
                  <InputGroup>
                    <Input
                      type="number"
                      name="number"
                      id="oop_max_family"
                      placeholder="OOP Max Family"
                      min="0"
                      step="0.01"
                      value={parseFloat(this.state.input.oop_max_family).toFixed(2)}
                      onKeyPress={(event) => event.key === '-' ? event.preventDefault(): ''}
                      onChange={this.handleInputChange}
                    />
                    <InputGroupAddon addonType="append">$</InputGroupAddon>
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <Label for="amount_fam_opm_met">Amount Fam OPM Met</Label>
                  <InputGroup>
                    <Input
                      type="number"
                      name="number"
                      id="amount_fam_opm_met"
                      placeholder="Amount Fam OPM Met"
                      min="0"
                      step="0.01"
                      value={parseFloat(this.state.input.amount_fam_opm_met).toFixed(2)}
                      onKeyPress={(event) => event.key === '-' ? event.preventDefault(): ''}
                      onChange={this.handleInputChange}
                    />
                    <InputGroupAddon addonType="append">$</InputGroupAddon>
                  </InputGroup>
                </FormGroup>
            </CardBody>
          </Card>
        </Col>
        <Col xl={6} lg={12} md={12}>
          <Card>
            <CardBody>
                <FormGroup>
                  <Label for="oop_max_individual">OOP Max Individual</Label>
                  <InputGroup>
                    <Input
                      type="number"
                      name="number"
                      id="oop_max_individual"
                      placeholder="OOP Max Individual"
                      min="0"
                      step="0.01"
                      value={parseFloat(this.state.input.oop_max_individual).toFixed(2)}
                      onKeyPress={(event) => event.key === '-' ? event.preventDefault(): ''}
                      onChange={this.handleInputChange}
                    />
                    <InputGroupAddon addonType="append">$</InputGroupAddon>
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <Label for="amount_ind_opm_met">Amount Ind OPM Met</Label>
                  <InputGroup>
                    <Input
                      type="number"
                      name="number"
                      id="amount_ind_opm_met"
                      placeholder="Amount Ind OPM Met"
                      min="0"
                      step="0.01"
                      value={parseFloat(this.state.input.amount_ind_opm_met).toFixed(2)}
                      onKeyPress={(event) => event.key === '-' ? event.preventDefault(): ''}
                      onChange={this.handleInputChange}
                    />
                    <InputGroupAddon addonType="append">$</InputGroupAddon>
                  </InputGroup>
                </FormGroup>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xl={6} lg={12} md={12}>
          <Card>
            <CardBody>
                <FormGroup>
                  <Label for="deductible_apply_option">Does Deductible Apply to OOP?</Label>
                  <Input type="select" name="deductible_apply_option" 
                    onChange={(event) => this.setState({does_deductible_aply_to_oop : (event.target.value === 'Yes' ? true : false)})}>
                    <option>Yes</option>
                    <option>No</option>
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label for="does_copay_apply_to_oop">Does Copay Apply to OOP?</Label>
                  <Input type="select" name="does_copay_apply_to_oop"
                  onChange={(event) => this.setState({does_copay_apply_to_oop : (event.target.value === 'Yes' ? true : false)})}>
                    <option>Yes</option>
                    <option>No</option>
                  </Input>
                </FormGroup>      
            </CardBody>
          </Card>
        </Col>
        <Col xl={6} lg={12} md={12}>
         <Card>
            <CardBody>
                <FormGroup>
                  <Label for="coverage">Coverage %</Label>
                  <InputGroup>
                    <Input
                      type="number"
                      name="number"
                      id="coverage"
                      placeholder="Coverage Percentage"
                      min="0"
                      value={parseFloat(this.state.input.coverage)}
                      onKeyPress={(event) => event.key === '-' ? event.preventDefault(): ''}
                      onChange={this.handleInputChange}
                    />
                    <InputGroupAddon addonType="append">%</InputGroupAddon>
                  </InputGroup>
                </FormGroup>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
       <Col xl={6} lg={12} md={12}>
         <Card>
            <CardBody>
                <FormGroup>
                  <Label for="co_pay_amount">Co-Pay Amount</Label>
                  <InputGroup>
                    <Input
                      type="number"
                      name="number"
                      id="co_pay_amount"
                      placeholder="Co-Pay Amount"
                      min="0"
                      step="0.01"
                      value={parseFloat(this.state.input.co_pay_amount).toFixed(2)}
                      onKeyPress={(event) => event.key === '-' ? event.preventDefault(): ''}
                      onChange={this.handleInputChange}
                    />
                    <InputGroupAddon addonType="append">$</InputGroupAddon>
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <Label for="co_pay_option">Co-Pay Per Day or Session</Label>
                  <Input type="select" name="co_pay_option" 
                  value={this.state.input.co_pay_per_day_or_session }
                  onChange={(event) => {this.state.input.co_pay_per_day_or_session = event.target.value; this.forceUpdate()}}>
                    <option value="0">Per Session</option>
                    <option value="1">Per Day</option>
                  </Input>
                </FormGroup>
            </CardBody>
          </Card>
        </Col>
        <Col xl={6} lg={12} md={12}>
         <Card>
            <CardBody>
                <FormGroup>
                  <Label for="max_visit">Max # of Visits</Label>
                  <InputGroup>
                    <Input
                      type="number"
                      name="number"
                      id="max_visit"
                      placeholder="Max # of Visits"
                      min="0"
                      value={parseFloat(this.state.input.max_visits)}
                      onKeyPress={(event) => event.key === '-' ? event.preventDefault(): ''}
                      onChange={this.handleInputChange}
                    />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <Label for="type_of_max">Type of Max</Label>
                  <Input type="select" name="type_of_max"
                    value={this.state.input.type_of_max}
                    onChange={(event) => {this.state.input.type_of_max = event.target.value; this.forceUpdate()}}>
                    <option>Hard</option>
                    <option>Soft</option>
                    <option>None</option>
                  </Input>
                </FormGroup>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
       <Col xl={6} lg={12} md={12}>
         <Card>
            <CardBody>
                <FormGroup>
                  <Label for="insurance_provider">Insurance Provider</Label>
                  <InputGroup>
                    <Input type="select" name="insurance_provider"
                      value={this.state.input.insurance_provider}
                      onChange={(event) => {this.state.input.insurance_provider = event.target.value; this.forceUpdate()}}>
                      {this.props.service.map(e =>
                        <option>{e.provider}</option>
                      )}
                    </Input>
                  </InputGroup>
                </FormGroup>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xl={10} lg={10} md={10}>
          <Card>
            <CardBody>
              <ReactTable
                data={this.state.data}
                columns={[{
                  Header: "Services",
                  id: "full",
                accessor: d =>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: d.service
                    }}
                  />
                }, {
                  Header: "Requesting?",
                accessor: "requesting",
                Cell: this.renderEditable
                }, {
                  Header: "Visit Limit Applies?",
                accessor: "visit_limit_applies",
                Cell: this.renderEditable
                }, {
                  Header: "Session Per week",
                accessor: "session_per_week",
                Cell: this.renderEditable
                }, {
                  Header: "Length of Session(Hrs)",
                accessor: "length_of_session",
                Cell: this.renderEditable
                },{
                  Header: "Therapy Cost",
                  id: 'therapy_cost',
                  accessor: d =>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: d.therapy_cost
                    }}
                  />
                }]}
              defaultPageSize={5}
              className="-striped -highlight"
          />
            </CardBody>
          </Card>
        </Col>
        <Col xl={2} lg={2} md={2} style={{display: 'grid'}}>
        <Button color="primary" onClick={this.toggle()}>Add Service</Button>
          <Modal
            isOpen={this.state.modal}
            toggle={this.toggle()}
            className={this.props.className}>
            <ModalHeader toggle={this.toggle()}>Add Service</ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label for="add_select_service">Select Service</Label>
                <Input type="select" name="add_select_service"
                  value={this.state.add_service}
                  onChange={(event) => {this.state.add_service = event.target.value; this.forceUpdate()}}>
                  {
                    this.props.service.length > 0 ? Object.keys(this.props.service[0]).map(key => {
                    if (key !== 'provider')
                      return <option>{key}</option>
                    }) : null
                  }
                </Input>
              </FormGroup>
              <FormGroup>
                <Label for="add_select_limit_applies">Select Limit applies</Label>
                <Input type="select" name="add_select_limit_applies"
                  value={this.state.add_select_limit_applies}
                    onChange={(event) => {this.state.add_select_limit_applies = event.target.value; this.forceUpdate()}}>
                  <option>Yes</option>
                  <option>No</option>
                </Input>
              </FormGroup>
              <FormGroup>
                <Label for="add_session_per_week">Session Per Week</Label>
                <Input
                  type="number"
                  name="add_session_per_week"
                  id="max_visit"
                  placeholder="Session Per week"
                  min="0"
                  value={this.state.add_session_per_week}
                  onKeyPress={(event) => event.key === '-' ? event.preventDefault(): ''}
                  onChange={(event) => {this.state.add_session_per_week = event.target.value; this.forceUpdate()}}
                />
              </FormGroup>
              <FormGroup>
                <Label for="add_length_of_session">Length of Session(Hrs)</Label>
                <Input
                  type="number"
                  name="add_length_of_session"
                  id="max_visit"
                  placeholder="Length of Session"
                  min="0"
                  value={this.state.add_length_of_session}
                  onKeyPress={(event) => event.key === '-' ? event.preventDefault(): ''}
                  onChange={(event) => {this.state.add_length_of_session = event.target.value; this.forceUpdate()}}
                />
              </FormGroup>

            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.addService()}>
                Add
              </Button>{' '}
              <Button color="secondary" onClick={this.toggle()}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        </Col>
      </Row>
      <Row>
        <Col xl={6} lg={12} md={12}>
          <Card>
            <CardBody>
              <FormGroup>
                  <Label for="max_visit"># of Days of Therapy Per Week</Label>
                    <Input
                      type="number"
                      name="number"
                      id="days_per_week"
                      placeholder="# of Days of Therapy Per Week"
                      min="0"
                      value={this.state.input.days_per_week}
                      onKeyPress={(event) => event.key === '-' ? event.preventDefault(): ''}
                      onChange={this.handleInputChange}
                    />
                </FormGroup>
                <FormGroup>
                  <Label for="anticipated_first_date_of_therapy">Anticipated First Date of Therapy</Label>
                  <DatePicker
                      selected={this.state.input.anticipated_first_date_of_therapy}
                      selectsStart
                      startDate={this.state.input.anticipated_first_date_of_therapy}
                      endDate={this.state.input.last_day_of_calendar_year}
                      onChange={(date) => {this.state.input.anticipated_first_date_of_therapy = date; this.forceUpdate()}}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="last_day_of_calendar_year">Last Day of Calendar Year</Label>
                  <DatePicker
                      selected={this.state.input.last_day_of_calendar_year}
                      selectsEnd
                      startDate={this.state.input.anticipated_first_date_of_therapy}
                      endDate={this.state.input.last_day_of_calendar_year}
                      onChange={(date) => {this.state.input.last_day_of_calendar_year = date; this.forceUpdate()}}
                  />
                </FormGroup>
            </CardBody>
          </Card>
        </Col>
        <Col xl={6} lg={12} md={12}>
          <Card>
            <CardBody>
              <FormGroup>
                  <Label for="max_visit">Assumed Cancel Rate</Label>
                  <InputGroup>
                    <Input
                      type="number"
                      name="number"
                      id="assumed_cancel_rate"
                      placeholder="Assumed Cancel Rate"
                      min="0"
                      step="0.01"
                      value={parseFloat(this.state.input.assumed_cancel_rate)}
                      onKeyPress={(event) => event.key === '-' ? event.preventDefault(): ''}
                      onChange={this.handleInputChange}
                    />
                    <InputGroupAddon addonType="append">%</InputGroupAddon>
                  </InputGroup>
                </FormGroup>
            </CardBody>
          </Card>
        </Col>
      </Row>
        <Col sm={{ size: 12, offset: 5 }}>
          <Button color="primary" onClick={() => this.calculate()}>Calculate</Button>
        </Col>
    </Page>
    );
  }
}

const mapStateToProps = state => {
  const { input, service } = state

  return {
    input,
    service
  }
}

export default connect(mapStateToProps)(DashboardPage)
