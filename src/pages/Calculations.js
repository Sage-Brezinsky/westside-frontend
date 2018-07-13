import React from 'react';

import { Card, CardHeader, CardBody, Row, Col } from 'reactstrap';

import Page from 'components/Page';
import ReactTable from "react-table";
import "react-table/react-table.css";

import { connect } from 'react-redux';

class CalculationsPage extends React.Component {

  constructor (props)
  {
    super(props);
    console.log(props.calculation)
  }
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
            Header: "# of Days Per Week",
            id: "days_per_week",
          accessor: d =>
            <div
              dangerouslySetInnerHTML={{
                __html: d.days_per_week
              }}
            />
          },{
            Header: "# of Visit Per Week",
            id: "visits_per_week",
          accessor: d =>
            <div
              dangerouslySetInnerHTML={{
                __html: d.visits_per_week
              }}
            />
          },{
            Header: "Visit Count",
            id: "visit_count",
          accessor: d =>
            <div
              dangerouslySetInnerHTML={{
                __html: d.visit_count
              }}
            />
          },{
            Header: "Therapy Costs Per Week",
            id: "therapy_costs_per_week",
          accessor: d =>
            <div
              dangerouslySetInnerHTML={{
                __html: d.therapy_costs_per_week
              }}
            />
          },{
            Header: "Deductible Payment",
            id: "deductible_payments",
          accessor: d =>
            <div
              dangerouslySetInnerHTML={{
                __html: d.deductible_payments
              }}
            />
          },
          {
            Header: "Either Dedudctible Met?",
            id: "either_deductible_met",
          accessor: d =>
            <div
              dangerouslySetInnerHTML={{
                __html: d.either_deductible_met
              }}
            />
          },
          {
            Header: "Family Deductible Remaining",
            id: "family_deductible_remaining",
          accessor: d =>
            <div
              dangerouslySetInnerHTML={{
                __html: d.family_deductible_remaining
              }}
            />
          },
          {
            Header: "Individual Deductible Remaining",
            id: "individual_deductible_remaining",
          accessor: d =>
            <div
              dangerouslySetInnerHTML={{
                __html: d.individual_deductible_remaining
              }}
            />
          },
          {
            Header: "Co-Pay Payments",
            id: "co_pay_payments",
          accessor: d =>
            <div
              dangerouslySetInnerHTML={{
                __html: d.co_pay_payments
              }}
            />
          },
          {
            Header: "Co-Insurnace Payments",
            id: "co_insurance_payments",
          accessor: d =>
            <div
              dangerouslySetInnerHTML={{
                __html: d.co_insurance_payments
              }}
            />
          },
          {
            Header: "OOP Contributions - Copays",
            id: "oop_contributions_copays",
          accessor: d =>
            <div
              dangerouslySetInnerHTML={{
                __html: d.oop_contributions_copays
              }}
            />
          },
          {
            Header: "OOP Contributions - Deductible",
            id: "oop_contributions_deductible",
          accessor: d =>
            <div
              dangerouslySetInnerHTML={{
                __html: d.oop_contributions_deductible
              }}
            />
          },
          {
            Header: "OOP Contributions - Coinsurance",
            id: "oop_contributions_coinsurance",
          accessor: d =>
            <div
              dangerouslySetInnerHTML={{
                __html: d.oop_contributions_coinsurance
              }}
            />
          },
          {
            Header: "Total OOP Contributions",
            id: "total_oop_contributions",
          accessor: d =>
            <div
              dangerouslySetInnerHTML={{
                __html: d.total_oop_contributions
              }}
            />
          },
          {
            Header: "OOP Family Remaining",
            id: "oop_family_remaining",
          accessor: d =>
            <div
              dangerouslySetInnerHTML={{
                __html: d.oop_family_remaining
              }}
            />
          },
          {
            Header: "OOP Individual Remaining",
            id: "oop_individual_remaining",
          accessor: d =>
            <div
              dangerouslySetInnerHTML={{
                __html: d.oop_individual_remaining
              }}
            />
          },
          {
            Header: "Weekly Balance For Patient",
            id: "weekly_balance_for_patient",
          accessor: d =>
            <div
              dangerouslySetInnerHTML={{
                __html: d.weekly_balance_for_patient
              }}
            />
          },
          {
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
        className="-striped -highlight"
        showPageSizeOptions= {true}
        pageSizeOptions= {[this.props.calculation.length]}
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

export default connect(mapStateToProps)(CalculationsPage);
