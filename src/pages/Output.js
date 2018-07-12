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
  
  genLineData = () => {
    const Label = [], Data = [];
    for (var i = 0; i < this.props.calculation.length; i ++)
    {
      Label.push(i);
      // console.log(this.props.calculation[i].total_oop_contributions)
      Data.push(this.props.calculation[i].total_oop_contributions.substr(1))
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
            Header: "Therapy Week of Concept",
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
            Header: "Co-Pay Insurance",
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
            Header: "Weekly Total",
            id: "total_oop_contributions",
          accessor: d =>
            <div
              dangerouslySetInnerHTML={{
                __html: d.total_oop_contributions
              }}
            />
          },{
            Header: "Accumulated Balance",
            id: "accumulated_balance",
          accessor: d =>
            <div
              dangerouslySetInnerHTML={{
                __html: d.accumulated_balance
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
