import React from 'react';

import { Card, CardHeader, CardBody, Row, Col } from 'reactstrap';
import { randomNum } from 'utils/demos';
import { Bar } from 'react-chartjs-2';
import { getColor } from 'utils/colors';

import Page from 'components/Page';
import ReactTable from "react-table";
import "react-table/react-table.css";

import { connect } from 'react-redux';


class OutputPage extends React.Component {

  constructor (props)
  {
    super(props);
  }
  
  componentWillMount() {
  }
  genLineData = () => {
    const Label = [], Data = [];
    for (var i = 0; i < this.props.calculation.length; i ++)
    {
      Label.push(i);
      // console.log(this.props.calculation[i].total_oop_contributions)
      Data.push(this.props.calculation[i].weekly_balance_for_patient.substr(1))
    }
    return {
      labels: Label,
      datasets: [
        {
          label: 'Weekly Total',
          backgroundColor: getColor('primary'),
          borderColor: getColor('primary'),
          borderWidth: 1,
          data: Data,
        }
      ],
    };
  };
  render() {
    if (this.props.calculation == 'reactjs')
    {
      return (
        <div style={{width: '100%', height: '100%', lineHeight: '100%', textAlign: 'center'}}>No Calculation Result!!!</div>
      )
    }
    return (
      <Page
        title="Typography"
        breadcrumbs={[{ name: 'typography', active: true }]}
      >
        <Col xl={12} lg={12} md={12}>
          <Card>
            <CardHeader>Weekly Payments</CardHeader>
            <CardBody>
              <Bar data={this.genLineData()} />
            </CardBody>
          </Card>
        </Col>
        <ReactTable
          data={this.props.calculation}
          columns={[{
            Header: "Week of Therapy",
            id: "therapy_week",
          accessor: d =>
            <div
              dangerouslySetInnerHTML={{
                __html: d.therapy_week
              }}
            />
          },{
            Header: "Co-Pay Payments",
            id: "co_pay_payments",
          accessor: d =>
            <div
              dangerouslySetInnerHTML={{
                __html: d.co_pay_payments
              }}
            />
          },{
            Header: "Co-Insurance",
            id: "co_insurance_payments",
          accessor: d =>
            <div
              dangerouslySetInnerHTML={{
                __html: d.co_insurance_payments
              }}
            />
          },{
            Header: "Dedeductible Payment",
            id: "deductible_payments",
          accessor: d =>
            <div
              dangerouslySetInnerHTML={{
                __html: d.deductible_payments
              }}
            />
          },{
            Header: "Amount Billed To Secondary",
            id: "weekly_balance_for_patient",
          accessor: d =>
            <div
              dangerouslySetInnerHTML={{
                __html: d.weekly_balance_for_patient
              }}
            />
          },{
            Header: "Secondary Deductible Payments",
            id: "secondary_deductible_payments",
          accessor: d =>
            <div
              dangerouslySetInnerHTML={{
                __html: d.secondary_deductible_payments
              }}
            />
          },{
            Header: "Seconary Co-Insurance Payments",
            id: "secondary_co_insurance_payments",
          accessor: d =>
            <div
              dangerouslySetInnerHTML={{
                __html: d.secondary_co_insurance_payments
              }}
            />
          },{
            Header: "Secondary Co-Pay Payments",
            id: "secondary_co_pay_payments",
          accessor: d =>
            <div
              dangerouslySetInnerHTML={{
                __html: d.secondary_co_pay_payments
              }}
            />
          },{
            Header: "Weekly Balance For Patient",
            id: "secondary_weekly_balance_for_patient",
          accessor: d =>
            <div
              dangerouslySetInnerHTML={{
                __html: d.secondary_weekly_balance_for_patient
              }}
            />
          },{
            Header: "Weekly Accumulated Balance",
            id: "secondary_accumulated_balance",
          accessor: d =>
            <div
              dangerouslySetInnerHTML={{
                __html: d.secondary_accumulated_balance
              }}
            />
          } ]}
          defaultPageSize={this.props.calculation.length}
          showPageSizeOptions= {true}
          pageSizeOptions= {[this.props.calculation.length]}   
          className="-striped -highlight"
        />
      </Page>
    );
  }
}

const mapStateToProps = state => {
  const { calculation } = state

  return {
    calculation
  }
}

export default connect(mapStateToProps)(OutputPage);
